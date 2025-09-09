from django.urls import path
from . import views
from .views import dashboard, chat_with_bot  # Add chat_with_bot import

urlpatterns = [
    path('register/', views.register, name='register'),
    path('token/', views.token_obtain_pair, name='token_obtain_pair'),
    path('token/refresh/', views.token_refresh, name='token_refresh'),
    path('onboarding/', views.onboarding, name='onboarding'),  # <-- Add this line
    path("dashboard/", dashboard, name="dashboard"),
    path("bot/<int:bot_id>/chat/", chat_with_bot, name="chat_with_bot"),  # <-- Add this line
]