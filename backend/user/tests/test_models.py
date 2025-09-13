import pytest
from django.db import IntegrityError
from django.contrib.auth import authenticate
from user.models import CustomUser

@pytest.mark.django_db
def test_user_creation(user):
    assert user.email == "testuser123@gmail.com"
    assert user.username == "testuser123@gmail.com"
    assert user.first_name == "test"
    assert user.last_name == "user"
    assert user.check_password("testpassword123")

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