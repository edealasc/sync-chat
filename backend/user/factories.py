# user/factories.py
import factory
from django.utils import timezone
from user.models import CustomUser, Bot, Conversation, Message

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    email = factory.Faker("email")
    username = factory.Faker("user_name")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = factory.PostGenerationMethodCall("set_password", "testpassword123")


class BotFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Bot

    user = factory.SubFactory(UserFactory)
    website_url = factory.Faker("url")
    business_name = factory.Faker("company")
    chatbot_name = factory.Faker("word")
    collection_name = factory.Sequence(lambda n: f"collection_{n}")  # ensures uniqueness
    status = "active"


class ConversationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Conversation

    bot = factory.SubFactory(BotFactory)
    customer_name = factory.Faker("name")
    created_at = factory.LazyFunction(timezone.now)


class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Message

    conversation = factory.SubFactory(ConversationFactory)
    sender = factory.Iterator(["user", "bot"])
    text = factory.Faker("sentence")
    timestamp = factory.LazyFunction(timezone.now)
    satisfied = None
