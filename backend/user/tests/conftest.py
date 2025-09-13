import pytest
from datetime import date
from user.models import CustomUser, Bot, Conversation, Message
@pytest.fixture
def user() -> CustomUser:
    return CustomUser.objects.create_user(
        username="testuser123@gmail.com",
        email="testuser123@gmail.com",
        first_name="test",
        last_name="user",
        password="testpassword123"
    )

@pytest.fixture
def bot(user) -> Bot:
    return Bot.objects.create(
        user=user,
        website_url="https://example.com",
        business_name="Test Business",
        chatbot_name="TestBot",
        collection_name="unique_collection"
    )

@pytest.fixture
def conversation(bot):
    return Conversation.objects.create(
        bot = bot
    )

@pytest.fixture
def message(conversation):
    return Message.objects.create(
        conversation=conversation,
        text= "test message",
        sender = "bot",
    )