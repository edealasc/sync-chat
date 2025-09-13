from django.contrib.auth.models import AbstractUser
from django.db import models


from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        # Validate required fields
        if not email:
            raise ValueError("The Email must be set")
        if not extra_fields.get('username'):
            raise ValueError("The Username must be set")

        # Normalize email and create user
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


    objects = CustomUserManager() 
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
    embed_code = models.TextField(blank=True)  # New field for embed code
    allowed_domains = models.JSONField(default=list, blank=True)  # New field for allowed domains

    def __str__(self):
        return f"{self.chatbot_name} ({self.website_url})"

class Conversation(models.Model):
    bot = models.ForeignKey('Bot', on_delete=models.CASCADE, related_name='conversations')
    customer_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(null=True, blank=True) 

    def __str__(self):
        return f"Conversation with {self.customer_name} ({self.bot.chatbot_name})"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=50)  # 'user' or 'bot'
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    satisfied = models.BooleanField(null=True, blank=True)