import pytest
from django.db import IntegrityError
from django.contrib.auth import authenticate
from django.utils import timezone
from user.models import CustomUser, Bot, Conversation, Message

# ------------------------
# USER TESTS
# ------------------------

@pytest.mark.django_db
def test_user_creation(user):
    assert isinstance(user, CustomUser)
    assert "@" in user.email
    assert user.username  # not empty
    assert user.first_name  # Faker gives something non-empty
    assert user.last_name
    assert user.check_password("testpassword123")  # from factory


@pytest.mark.django_db
def test_unique_email_constraint(user):
    with pytest.raises(IntegrityError):
        CustomUser.objects.create_user(
            username="anotheruser",
            email=user.email,  # reuse existing email
            password="anotherpassword"
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
        )
    with pytest.raises(ValueError):
        CustomUser.objects.create_user(
            email="no_username@example.com",
            password="password"
        )


@pytest.mark.django_db
def test_authentication(user):
    authenticated_user = authenticate(email=user.email, password="testpassword123")
    assert authenticated_user is not None
    assert authenticated_user == user


@pytest.mark.django_db
def test_default_django_user_fields(user):
    assert user.is_active is True
    assert user.is_staff is False
    assert user.is_superuser is False


@pytest.mark.django_db
def test_optional_fields_blank():
    u = CustomUser.objects.create_user(
        username="blankuser",
        email="blankuser@example.com",
        password="password"
    )
    assert u.first_name == ""
    assert u.last_name == ""


# ------------------------
# BOT TESTS
# ------------------------

@pytest.mark.django_db
def test_bot_creation(bot):
    assert isinstance(bot, Bot)
    assert bot.user is not None
    assert bot.status == "active"
    assert bot.collection_name.startswith("collection_")
    assert str(bot) == f"{bot.chatbot_name} ({bot.website_url})"


@pytest.mark.django_db
def test_unique_collection_name_constraint(bot):
    with pytest.raises(IntegrityError):
        Bot.objects.create(
            user=bot.user,
            website_url="https://example1.com",
            business_name="Test Business1",
            chatbot_name="TestBot1",
            collection_name=bot.collection_name,  # duplicate
        )


@pytest.mark.django_db
def test_bot_blank_fields(user):
    b = Bot.objects.create(user=user, collection_name="blank_fields_test")
    assert b.website_url == ""
    assert b.business_name == ""
    assert b.languages == []
    assert b.allowed_domains == []


# ------------------------
# CONVERSATION TESTS
# ------------------------

@pytest.mark.django_db
def test_conversation_creation(conversation):
    now = timezone.now()
    assert isinstance(conversation, Conversation)
    assert abs((conversation.created_at - now).total_seconds()) < 2


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


# ------------------------
# MESSAGE TESTS
# ------------------------

@pytest.mark.django_db
def test_message_creation(message):
    now = timezone.now()
    assert isinstance(message, Message)
    assert abs((message.timestamp - now).total_seconds()) < 2


@pytest.mark.django_db
def test_message_satisfied_field(conversation):
    message = Message.objects.create(
        conversation=conversation,
        sender="user",
        text="Hello",
        satisfied=None,
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
        text="Hello",
    )
    assert message.sender == "bot"
