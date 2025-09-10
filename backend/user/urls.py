from django.urls import path
from . import views
from .views import dashboard, chat_with_bot, toggle_message_satisfaction  # Add toggle_message_satisfaction import

urlpatterns = [
    path('register/', views.register, name='register'),
    path('token/', views.token_obtain_pair, name='token_obtain_pair'),
    path('token/refresh/', views.token_refresh, name='token_refresh'),
    path('onboarding/', views.onboarding, name='onboarding'),
    path("dashboard/", dashboard, name="dashboard"),
    path("bot/<str:embed_code>/chat/", chat_with_bot, name="chat_with_bot"),
    path("message/<int:message_id>/toggle_satisfaction/", toggle_message_satisfaction, name="toggle_message_satisfaction"),
]