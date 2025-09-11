from django.contrib.auth import get_user_model, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
import json
from django.shortcuts import render
from .models import Bot, Conversation, Message
from .tasks import crawl_and_embed
from rag.retrieval import retrieve
import chromadb
from chromadb.utils import embedding_functions
from google.generativeai import GenerativeModel, configure
from django.conf import settings
import os
from dotenv import load_dotenv
from django.db.models import Count
from django.db.models.functions import TruncDate
from datetime import timedelta
import re
import uuid
from urllib.parse import urlparse

load_dotenv()

User = get_user_model()

@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        if not email or not password:
            return JsonResponse({"error": "Email and password required"}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            "id": user.id,
            "email": user.email,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def token_obtain_pair(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        user = authenticate(request, username=email, password=password)
        if user is None:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "name": user.first_name or user.email,
                "email": user.email,
            }
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def token_refresh(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        data = json.loads(request.body)
        refresh_token = data.get("refresh")
        if not refresh_token:
            return JsonResponse({"error": "Refresh token required"}, status=400)
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return JsonResponse({"access": access_token})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def onboarding(request):
    try:
        user = request.user
        data = request.data

        allowed_domains = data.get("allowedDomains", [])

        embed_code = str(uuid.uuid4())  # Generate a unique embed code

        bot = Bot.objects.create(
            user=user,
            website_url=data.get("websiteUrl", ""),
            business_name=data.get("businessName", ""),
            business_type=data.get("businessType", ""),
            chatbot_name=data.get("chatbotName", ""),
            tone=data.get("tone", ""),
            support_goals=data.get("supportGoals", ""),
            languages=data.get("languages", ["English"]),
            allowed_domains=allowed_domains,
            status="crawling",
            embed_code=embed_code,  # <-- Set embed code here
        )
        bot.collection_name = f"bot_{bot.id}_collection"
        bot.save()
        crawl_and_embed.delay(bot.id, bot.website_url)
        return JsonResponse({"success": True, "bot_id": bot.id, "embed_code": embed_code})  # <-- Return embed code
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    bots = Bot.objects.filter(user=user)
    bots_data = []
    all_conversation_ids = []
    for bot in bots:
        conversations = bot.conversations.order_by('-created_at')[:5]
        conversations_data = [
            {
                "id": convo.id,
                "customer_name": convo.customer_name,
                "created_at": convo.created_at.strftime("%Y-%m-%d %H:%M"),
                "is_resolved": (
                    1 if convo.is_resolved is True else
                    -1 if convo.is_resolved is False else
                    0
                ),  # <-- Return as 1, -1, or 0
                "bot": bot.chatbot_name,
                "messages": [
                    {
                        "id": msg.id,
                        "sender": msg.sender,
                        "text": msg.text,
                        "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M"),
                        "satisfaction": (
                            1 if msg.satisfied is True else
                            0 if msg.satisfied is False else
                            -1
                        ),
                    }
                    for msg in convo.messages.order_by("timestamp")
                ],
            }
            for convo in conversations
        ]
        bots_data.append({
            "id": bot.id,
            "chatbot_name": bot.chatbot_name,
            "website_url": bot.website_url,
            "business_name": bot.business_name,
            "business_type": bot.business_type,
            "tone": bot.tone,
            "support_goals": bot.support_goals,
            "languages": bot.languages,
            "status": bot.status,
            "conversation_count": bot.conversations.count(),
            "recent_conversations": conversations_data,
        })
        all_conversation_ids += list(bot.conversations.values_list("id", flat=True))

    # --- Conversation Volume (Trends) ---
    # Group by date, count conversations per day for all user's bots
    conversation_volume = (
        Conversation.objects
        .filter(bot__user=user)
        .annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )
    conversation_volume_data = [
        {"date": cv["date"].strftime("%Y-%m-%d"), "count": cv["count"]}
        for cv in conversation_volume
    ]

    # --- Response Times ---
    # For each bot, compute average response time (in seconds)
    response_times = {}
    for bot in bots:
        bot_convos = bot.conversations.all()
        total_diff = timedelta()
        count = 0
        for convo in bot_convos:
            msgs = list(convo.messages.order_by("timestamp"))
            for i, msg in enumerate(msgs):
                if msg.sender == "user":
                    # Find next bot reply
                    for j in range(i + 1, len(msgs)):
                        if msgs[j].sender == "bot":
                            diff = msgs[j].timestamp - msg.timestamp
                            if diff.total_seconds() > 0:
                                total_diff += diff
                                count += 1
                            break
        avg_seconds = (total_diff.total_seconds() / count) if count > 0 else None
        response_times[bot.id] = avg_seconds

    return JsonResponse({
        "bots": bots_data,
        "conversation_volume": conversation_volume_data,
        "response_times": response_times,
    })

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def chat_with_bot(request, embed_code):  # <-- changed from bot_id to embed_code
    try:
        bot = Bot.objects.get(embed_code=embed_code)  # <-- lookup by embed_code
    except Bot.DoesNotExist:
        return JsonResponse({"error": "Bot not found"}, status=404)

    # --- Domain restriction logic ---
    # Get the origin or referer from headers
    origin = request.META.get("HTTP_ORIGIN") or request.META.get("HTTP_REFERER")
    if not origin:
        return JsonResponse({"error": "Missing origin/referer header"}, status=403)

    # Extract domain from origin
    parsed = urlparse(origin)
    request_domain = parsed.hostname

    # Normalize allowed domains (strip protocol, www, trailing slashes)
    def normalize_domain(domain):
        parsed = urlparse(domain if domain.startswith("http") else "http://" + domain)
        host = parsed.hostname or domain
        if host.startswith("www."):
            host = host[4:]
        return host.lower()

    allowed_domains = [normalize_domain(d) for d in bot.allowed_domains]
    if request_domain and request_domain.startswith("www."):
        request_domain = request_domain[4:]
    request_domain = (request_domain or "").lower()

    if request_domain not in allowed_domains:
        return JsonResponse({"error": "Domain not allowed"}, status=403)
    # --- End domain restriction ---

    user_message = request.data.get("message")
    conversation_id = request.data.get("conversation_id")
    customer_name = request.data.get("customer_name", "Anonymous")

    if not user_message:
        return JsonResponse({"error": "Message is required"}, status=400)

    # Get or create conversation
    if conversation_id:
        conversation = Conversation.objects.get(id=conversation_id, bot=bot)
        # Option 1: If conversation is resolved and user sends a new message, mark as unresolved
        if conversation.is_resolved:
            conversation.is_resolved = False
            conversation.save()
    else:
        conversation = Conversation.objects.create(
            bot=bot,
            customer_name=customer_name
        )

    # Save user message
    Message.objects.create(
        conversation=conversation,
        sender="user",
        text=user_message
    )

    # Load ChromaDB collection for this bot
    chroma_client = chromadb.PersistentClient(path="chromadb_data")
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    collection = chroma_client.get_or_create_collection(
        name=bot.collection_name,
        embedding_function=sentence_transformer_ef
    )

    # Retrieve relevant docs
    docs = retrieve(collection, user_message)
    context = "\n".join(docs)

    # JSON structure for the AI to return
    json_instruction = """
After answering, return your response as a JSON object with the following structure:
{
  "message": "<your reply to the user>",
  "is_resolved": <true or false, depending on whether you believe the user's issue is fully resolved>
}
"""

    # Choose prompt based on bot.tone
    if bot.tone.lower() == "professional":
        prompt = f"""
You are a highly professional AI assistant named "{bot.chatbot_name}" for the business "{bot.business_name}" ({bot.business_type}).
Maintain a courteous, concise, and knowledgeable tone at all times.
Provide clear, accurate, and helpful answers to customer inquiries, focusing on efficiency and expertise.
Avoid slang or overly casual language.
Support goals: {bot.support_goals}
Languages supported: {', '.join(bot.languages) if bot.languages else 'English'}
Customer name: {customer_name}
Conversation started at: {conversation.created_at.strftime('%Y-%m-%d %H:%M')}

Your task is to answer the user's question and also determine if their issue is resolved. 
{json_instruction}

Context from the business website and previous knowledge:
{context}

User's question: {user_message}
Answer as {bot.chatbot_name}:
"""
    elif bot.tone.lower() == "friendly":
        prompt = f"""
You are a friendly and approachable AI assistant named "{bot.chatbot_name}" for the business "{bot.business_name}" ({bot.business_type}).
Respond to customers with warmth, positivity, and encouragement.
Use a conversational and welcoming tone, making users feel comfortable and valued.
Support goals: {bot.support_goals}
Languages supported: {', '.join(bot.languages) if bot.languages else 'English'}
Customer name: {customer_name}
Conversation started at: {conversation.created_at.strftime('%Y-%m-%d %H:%M')}

Your task is to answer the user's question and also determine if their issue is resolved. 
{json_instruction}

Context from the business website and previous knowledge:
{context}

User's question: {user_message}
Answer as {bot.chatbot_name}:
"""
    elif bot.tone.lower() == "casual":
        prompt = f"""
You are a casual, easygoing AI assistant named "{bot.chatbot_name}" for the business "{bot.business_name}" ({bot.business_type}).
Keep your responses relaxed, informal, and relatable, as if chatting with a friend.
Feel free to use light humor and everyday language, but always remain helpful and respectful.
Support goals: {bot.support_goals}
Languages supported: {', '.join(bot.languages) if bot.languages else 'English'}
Customer name: {customer_name}
Conversation started at: {conversation.created_at.strftime('%Y-%m-%d %H:%M')}

Your task is to answer the user's question and also determine if their issue is resolved. 
{json_instruction}

Context from the business website and previous knowledge:
{context}

User's question: {user_message}
Answer as {bot.chatbot_name}:
"""
    elif bot.tone.lower() == "formal":
        prompt = f"""
You are a formal and respectful AI assistant named "{bot.chatbot_name}" for the business "{bot.business_name}" ({bot.business_type}).
Use polite, precise, and grammatically correct language in all responses.
Maintain a respectful distance and avoid contractions or colloquialisms.
Support goals: {bot.support_goals}
Languages supported: {', '.join(bot.languages) if bot.languages else 'English'}
Customer name: {customer_name}
Conversation started at: {conversation.created_at.strftime('%Y-%m-%d %H:%M')}

Your task is to answer the user's question and also determine if their issue is resolved. 
{json_instruction}

Context from the business website and previous knowledge:
{context}

User's question: {user_message}
Answer as {bot.chatbot_name}:
"""
    else:
        # Default prompt
        prompt = f"""
You are a helpful AI chatbot named "{bot.chatbot_name}" for the business "{bot.business_name}".
Business type: {bot.business_type}
Tone: {bot.tone}
Support goals: {bot.support_goals}
Languages supported: {', '.join(bot.languages) if bot.languages else 'English'}
Customer name: {customer_name}
Conversation started at: {conversation.created_at.strftime('%Y-%m-%d %H:%M')}

Your task is to answer the user's question and also determine if their issue is resolved. 
{json_instruction}

Use the following context from the business website and previous knowledge to answer the user's question.

Context:
{context}

User's question: {user_message}
Answer as {bot.chatbot_name}:
"""

    # Generate answer using Gemini
    configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = GenerativeModel("gemini-2.0-flash")
    response = gemini_model.generate_content(prompt)
    raw_text = response.text.strip()

    # Extract JSON from code block if present
    def extract_json(text):
        # Remove code block markers and language hints
        code_block = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
        if code_block:
            json_str = code_block.group(1)
        else:
            json_str = text
        # Remove any leading/trailing whitespace
        return json_str.strip()

    try:
        json_str = extract_json(raw_text)
        ai_json = json.loads(json_str)
        bot_reply = ai_json.get("message", raw_text)
        is_resolved = ai_json.get("is_resolved", False)
    except Exception:
        bot_reply = raw_text
        is_resolved = False

    # Save bot message
    bot_msg = Message.objects.create(
        conversation=conversation,
        sender="bot",
        text=bot_reply
    )

    # Update conversation's is_resolved field based on AI response
    conversation.is_resolved = bool(is_resolved)
    conversation.save()

    return JsonResponse({
        "bot_reply": bot_reply,
        "is_resolved": is_resolved,
        "conversation_id": conversation.id,
        "created_at": conversation.created_at.strftime("%Y-%m-%d %H:%M"),
        "bot_message_id": bot_msg.id,
    })

from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

@api_view(["POST"])
@permission_classes([AllowAny])  # <-- Add this line
@csrf_exempt  # Allow anonymous POSTs
def toggle_message_satisfaction(request, message_id):
    """
    Toggle or set the satisfaction field for a message.
    Expects JSON: { "satisfied": true/false }
    """
    try:
        msg = Message.objects.get(id=message_id)
        satisfied = request.data.get("satisfied")
        if satisfied not in [True, False, None]:
            return JsonResponse({"error": "Invalid value for satisfied"}, status=400)
        msg.satisfied = satisfied
        msg.save()
        return JsonResponse({"success": True, "message_id": msg.id, "satisfied": msg.satisfied})
    except Message.DoesNotExist:
        return JsonResponse({"error": "Message not found"}, status=404)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_bot(request):
    try:
        user = request.user
        data = request.data

        allowed_domains = data.get("allowedDomains", [])
        embed_code = str(uuid.uuid4())

        bot = Bot.objects.create(
            user=user,
            website_url=data.get("websiteUrl", ""),
            business_name=data.get("businessName", ""),
            business_type=data.get("businessType", ""),
            chatbot_name=data.get("chatbotName", ""),
            tone=data.get("tone", ""),
            support_goals=data.get("supportGoals", ""),
            languages=data.get("languages", ["English"]),
            allowed_domains=allowed_domains,
            status="crawling",
            embed_code=embed_code,
        )
        bot.collection_name = f"bot_{bot.id}_collection"
        bot.save()
        crawl_and_embed.delay(bot.id, bot.website_url)
        return JsonResponse({"success": True, "bot_id": bot.id, "embed_code": embed_code})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(["GET"])
@permission_classes([AllowAny])
def bot_info(request, embed_code):
    """
    Returns public info about a bot given its embed code.
    Only if the request is from an allowed domain.
    """
    try:
        bot = Bot.objects.get(embed_code=embed_code)
    except Bot.DoesNotExist:
        return JsonResponse({"error": "Bot not found"}, status=404)

    # --- Domain restriction logic ---
    origin = request.META.get("HTTP_ORIGIN") or request.META.get("HTTP_REFERER")
    if not origin:
        return JsonResponse({"error": "Missing origin/referer header"}, status=403)

    from urllib.parse import urlparse
    def normalize_domain(domain):
        parsed = urlparse(domain if domain.startswith("http") else "http://" + domain)
        host = parsed.hostname or domain
        if host.startswith("www."):
            host = host[4:]
        return host.lower()

    allowed_domains = [normalize_domain(d) for d in bot.allowed_domains]
    parsed = urlparse(origin)
    request_domain = parsed.hostname
    if request_domain and request_domain.startswith("www."):
        request_domain = request_domain[4:]
    request_domain = (request_domain or "").lower()

    if request_domain not in allowed_domains:
        return JsonResponse({"error": "Domain not allowed"}, status=403)
    # --- End domain restriction ---

    return JsonResponse({
        "chatbot_name": bot.chatbot_name,
        "business_name": bot.business_name,
        "business_type": bot.business_type,
        "website_url": bot.website_url,
        "theme_color": getattr(bot, "theme_color", None),
        "status": bot.status,
    })