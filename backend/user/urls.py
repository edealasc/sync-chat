from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('token/', views.token_obtain_pair, name='token_obtain_pair'),
    path('token/refresh/', views.token_refresh, name='token_refresh'),
]