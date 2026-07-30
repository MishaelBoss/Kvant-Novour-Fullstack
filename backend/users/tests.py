from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import UserProfile


class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/register/'
        self.valid_payload = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'middle_name': 'Middle',
        }

    def test_register_success(self):
        response = self.client.post(self.register_url, self.valid_payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        profile = User.objects.get(username='testuser').userprofile
        self.assertEqual(profile.role, 'user')
        self.assertEqual(profile.middle_name, 'Middle')

    def test_register_duplicate_username(self):
        User.objects.create_user(username='testuser', password='testpass123')
        response = self.client.post(self.register_url, self.valid_payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_short_password(self):
        payload = {**self.valid_payload, 'password': 'short'}
        response = self.client.post(self.register_url, payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_sets_auth_cookies(self):
        response = self.client.post(self.register_url, self.valid_payload, format='multipart')
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)


class UserLoginTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/login/'
        self.user = User.objects.create_user(
            username='testuser', password='testpass123',
            email='test@example.com', first_name='Test', last_name='User'
        )

    def test_login_success(self):
        response = self.client.post(self.login_url, {
            'username': 'testuser', 'password': 'testpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)

    def test_login_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            'username': 'testuser', 'password': 'wrongpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        response = self.client.post(self.login_url, {
            'username': 'nouser', 'password': 'testpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserStatusTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.status_url = '/api/is_authenticated/'
        self.user = User.objects.create_user(username='testuser', password='testpass123')

    def test_unauthenticated_returns_false(self):
        response = self.client.get(self.status_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_authenticated'])


class UserProfileTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='testpass123',
            first_name='Test', last_name='User'
        )
        self.profile = self.user.userprofile
        self.profile.middle_name = 'Middle'
        self.profile.phone = '+7-999-123-45-67'
        self.profile.save()

    def test_public_profile(self):
        response = self.client.get(f'/api/profile/{self.user.username}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_public_profile_not_found(self):
        response = self.client.get('/api/profile/nonexistent/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserRolePermissionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        self.admin.userprofile.role = 'admin'
        self.admin.userprofile.save()
        self.teacher = User.objects.create_user(username='teacher', password='teacherpass')
        self.teacher.userprofile.role = 'teacher'
        self.teacher.userprofile.save()
        self.regular_user = User.objects.create_user(username='user', password='userpass')

    def test_list_users_admin_only(self):
        self.client.force_login(self.regular_user)
        response = self.client.get('/api/users-list/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_is_admin_property(self):
        self.assertTrue(self.admin.userprofile.is_admin)

    def test_is_teacher_property(self):
        self.assertTrue(self.teacher.userprofile.is_teacher)

    def test_is_user_not_admin(self):
        self.assertFalse(self.regular_user.userprofile.is_admin)


class UserSessionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')

    def test_session_list_requires_auth(self):
        response = self.client.get('/api/sessions-list/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
