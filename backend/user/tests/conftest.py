import pytest
from user.factories import UserFactory, BotFactory, ConversationFactory, MessageFactory

@pytest.fixture
def user():
    return UserFactory()

@pytest.fixture
def bot():
    return BotFactory()

@pytest.fixture
def conversation():
    return ConversationFactory()

@pytest.fixture
def message():
    return MessageFactory()
