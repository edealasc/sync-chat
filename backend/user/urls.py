from django.urls import path
from . import views
from .views import dashboard, chat_with_bot, toggle_message_satisfaction, add_bot, bot_info  # Add bot_info import

urlpatterns = [
    path('register/', views.register, name='register'),
    path('token/', views.token_obtain_pair, name='token_obtain_pair'),
    path('token/refresh/', views.token_refresh, name='token_refresh'),
    path('onboarding/', views.onboarding, name='onboarding'),
    path("dashboard/", dashboard, name="dashboard"),
    path("bot/<str:embed_code>/chat/", chat_with_bot, name="chat_with_bot"),
    path("message/<int:message_id>/toggle_satisfaction/", toggle_message_satisfaction, name="toggle_message_satisfaction"),
    path("add_bot/", add_bot, name="add_bot"),  # New URL pattern for add_bot
    path('bot/<str:embed_code>/info/', bot_info, name="bot_info"),  # New URL pattern for bot_info
]