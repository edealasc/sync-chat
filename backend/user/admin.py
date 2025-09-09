from django.contrib import admin
from .models import CustomUser,Conversation,Bot, Message

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Bot)
admin.site.register(Conversation)
admin.site.register(Message)