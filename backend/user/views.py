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
        bot = Bot.objects.create(
            user=user,
            website_url=data.get("websiteUrl", ""),
            business_name=data.get("businessName", ""),
            business_type=data.get("businessType", ""),
            chatbot_name=data.get("chatbotName", ""),
            tone=data.get("tone", ""),
            support_goals=data.get("supportGoals", ""),
            languages=data.get("languages", ["English"]),
            status="crawling",  # Set initial status
        )
        # Set the collection name and save the bot object
        bot.collection_name = f"bot_{bot.id}_collection"
        bot.save()
        
        # Trigger async crawling and embedding
        crawl_and_embed.delay(bot.id, bot.website_url)
        return JsonResponse({"success": True, "bot_id": bot.id})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    bots = Bot.objects.filter(user=user)
    bots_data = []
    for bot in bots:
        conversations = bot.conversations.order_by('-created_at')[:5]
        conversations_data = [
            {
                "id": convo.id,
                "customer_name": convo.customer_name,
                "created_at": convo.created_at.strftime("%Y-%m-%d %H:%M"),
                "resolved": getattr(convo, "resolved", False),
                "bot": bot.chatbot_name,
                "messages": [
                    {
                        "id": msg.id,
                        "sender": msg.sender,
                        "text": msg.text,
                        "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M"),
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
    return JsonResponse({"bots": bots_data})

@api_view(["POST"])
@permission_classes([AllowAny])  # <-- Add this line
@csrf_exempt  # Allow anonymous POSTs
def chat_with_bot(request, bot_id):
    # try:
    # No user authentication
    bot = Bot.objects.get(id=bot_id)
    user_message = request.data.get("message")
    conversation_id = request.data.get("conversation_id")
    customer_name = request.data.get("customer_name", "Anonymous")  # Allow passing customer_name

    if not user_message:
        return JsonResponse({"error": "Message is required"}, status=400)

    # Get or create conversation
    if conversation_id:
        conversation = Conversation.objects.get(id=conversation_id, bot=bot)
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

    # Enhanced prompt with all available context in a single string
    prompt = f"""
You are a helpful AI chatbot named "{bot.chatbot_name}" for the business "{bot.business_name}".
Business type: {bot.business_type}
Tone: {bot.tone}
Support goals: {bot.support_goals}
Languages supported: {', '.join(bot.languages) if bot.languages else 'English'}
Customer name: {customer_name}
Conversation started at: {conversation.created_at.strftime('%Y-%m-%d %H:%M')}

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
    bot_reply = response.text

    # Save bot message
    Message.objects.create(
        conversation=conversation,
        sender="bot",
        text=bot_reply
    )

    return JsonResponse({
        "bot_reply": bot_reply,
        "conversation_id": conversation.id,
        "created_at": conversation.created_at.strftime("%Y-%m-%d %H:%M"),
    })
    # except Bot.DoesNotExist:
    #     return JsonResponse({"error": "Bot not found"}, status=404)
    # except Conversation.DoesNotExist:
    #     return JsonResponse({"error": "Conversation not found"}, status=404)
    # except Exception as e:
    #     return JsonResponse({"error": str(e)}, status=500)

# Create your views here.
