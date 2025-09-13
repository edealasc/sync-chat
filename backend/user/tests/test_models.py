import pytest
from django.db import IntegrityError
from django.contrib.auth import authenticate
from user.models import CustomUser, Bot, Conversation, Message
import datetime
@pytest.mark.django_db
def test_user_creation(user):
    assert user.email == "testuser123@gmail.com"
    assert user.username == "testuser123@gmail.com"
    assert user.first_name == "test"
    assert user.last_name == "user"
    assert user.check_password("testpassword123")

@pytest.mark.django_db
def test_bot_creation(bot, user):
    assert bot.user == user
    assert bot.status == "active"
    assert bot.collection_name == "unique_collection"
    assert str(bot) == "TestBot (https://example.com)"


@pytest.mark.django_db
def test_conversation_creation(bot, conversation):
    now = datetime.datetime.now(datetime.timezone.utc)
    assert conversation.bot == bot
    # created_at should be very close to now
    assert abs((conversation.created_at - now).total_seconds()) < 2

@pytest.mark.django_db
def test_message_creation(conversation, message):
    now = datetime.datetime.now(datetime.timezone.utc)
    assert message.conversation == conversation
    assert abs((message.timestamp - now).total_seconds()) < 2




@pytest.mark.django_db
def test_optional_fields_blank():
    user = CustomUser.objects.create_user(
        username="blankuser",
        email="blankuser@example.com",
        password="password"
    )
    assert user.first_name == ""
    assert user.last_name == ""

@pytest.mark.django_db
def test_unique_email_constraint(user):
    with pytest.raises(IntegrityError):
        CustomUser.objects.create_user(
            username="anotheruser",
            email="testuser123@gmail.com",
            password="anotherpassword"
        )

@pytest.mark.django_db
def test_unique_collection_name_constraint(bot,user):
    with pytest.raises(IntegrityError):
        Bot.objects.create(
            user=user,
            website_url="https://example1.com",
            business_name="Test Business1",
            chatbot_name="TestBot1",
            collection_name="unique_collection"
        )

@pytest.mark.django_db
def test_str_returns_email(user):
    assert str(user) == user.email

@pytest.mark.django_db
def test_missing_required_fields():
    with pytest.raises(ValueError):
        CustomUser.objects.create_user(
            email=None,
            username="nouser"
            # missing password
        )
    with pytest.raises(ValueError):
        CustomUser.objects.create_user(
            email="no_username@example.com",
            password="password"
            # missing username
        )

@pytest.mark.django_db
def test_authentication(user):
    authenticated_user = authenticate(email="testuser123@gmail.com", password="testpassword123")
    assert authenticated_user is not None
    assert authenticated_user == user

@pytest.mark.django_db
def test_default_django_user_fields(user):
    assert user.is_active is True
    assert user.is_staff is False
    assert user.is_superuser is False

@pytest.mark.django_db
def test_bot_blank_fields(user):
    bot = Bot.objects.create(
        user=user,
        collection_name="blank_fields_test"
    )
    assert bot.website_url == ""
    assert bot.business_name == ""
    assert bot.languages == []
    assert bot.allowed_domains == []

@pytest.mark.django_db
def test_conversation_blank_customer_name(bot):
    conversation = Conversation.objects.create(bot=bot)
    assert conversation.customer_name == ""

@pytest.mark.django_db
def test_conversation_is_resolved_field(bot):
    conversation = Conversation.objects.create(bot=bot, is_resolved=None)
    assert conversation.is_resolved is None
    conversation.is_resolved = True
    conversation.save()
    assert conversation.is_resolved is True

@pytest.mark.django_db
def test_message_satisfied_field(conversation):
    message = Message.objects.create(
        conversation=conversation,
        sender="user",
        text="Hello",
        satisfied=None
    )
    assert message.satisfied is None
    message.satisfied = True
    message.save()
    assert message.satisfied is True

@pytest.mark.django_db
def test_message_sender_field(conversation):
    message = Message.objects.create(
        conversation=conversation,
        sender="bot",
        text="Hello"
    )
    assert message.sender == "bot"