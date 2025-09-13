import pytest
from datetime import date
from user.models import CustomUser

@pytest.fixture
def user() -> CustomUser:
    return CustomUser.objects.create_user(
        username="testuser123@gmail.com",
        email="testuser123@gmail.com",
        first_name="test",
        last_name="user",
        password="testpassword123"
    )