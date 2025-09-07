from django.contrib.auth import get_user_model, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
import json
from django.shortcuts import render
from .models import Bot
from .tasks import crawl_and_embed

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
                "message": convo.message,
                "created_at": convo.created_at.strftime("%Y-%m-%d %H:%M"),
                "resolved": convo.resolved,
                "bot": bot.chatbot_name,
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
            "recent_conversations": conversations_data,  # <-- Add this
        })
    return JsonResponse({"bots": bots_data})

# Create your views here.
