from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('is_authenticated/', UserStatusView.as_view(), name='is_authenticated'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('edit-profile/', EditProfileView.as_view(), name='edit-profile'),
    path('profile/<int:profile_id>/', ProfileViewView.as_view(), name='profile'),
    path('users-list/', ListUsersView.as_view(), name='users-list'),
    path('user-delete/<int:id>/', UserDeleteView.as_view(), name='user-delete'),
    path('run-create-user/', CreateUserView.as_view(), name='run-create-user'),
    path('auth/sessions/', ActiveSessionsView.as_view(), name='active_sessions'),
    path('auth/sessions/<int:pk>/', ActiveSessionsView.as_view(), name='delete_session'),
]