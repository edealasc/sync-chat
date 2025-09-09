from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Bot(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="bots")
    website_url = models.URLField(blank=True)
    business_name = models.CharField(max_length=255, blank=True)
    business_type = models.CharField(max_length=50, blank=True)
    chatbot_name = models.CharField(max_length=100, blank=True)
    tone = models.CharField(max_length=50, blank=True)
    support_goals = models.TextField(blank=True)
    languages = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, default="active")  # e.g. active, crawling, paused
    collection_name = models.CharField(max_length=100, unique=True, blank=True)

    def __str__(self):
        return f"{self.chatbot_name} ({self.website_url})"

class Conversation(models.Model):
    bot = models.ForeignKey('Bot', on_delete=models.CASCADE, related_name='conversations')
    customer_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation with {self.customer_name} ({self.bot.chatbot_name})"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=50)  # 'user' or 'bot'
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
