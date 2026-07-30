from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Notification
from news.models import News


class NotificationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.other_user = User.objects.create_user(username='otheruser', password='testpass123')

        self.notification = Notification.objects.create(
            user=self.user,
            type='system',
            title='Test Notification',
            description='Test message',
        )
        self.news = News.objects.create(title='Test News', content='Content')
        self.news_notification = Notification.objects.create(
            user=self.user,
            type='news',
            title='News Notification',
            description='News message',
            news=self.news,
        )

    def authenticate(self):
        self.client.force_login(self.user)

    def test_list_notifications(self):
        self.authenticate()
        response = self.client.get('/api/notifications-list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('latest_dates', response.data)

    def test_list_notifications_unauthorized(self):
        response = self.client.get('/api/notifications-list/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_only_own_notifications(self):
        self.authenticate()
        response = self.client.get('/api/notifications-list/')
        self.assertEqual(len(response.data['results']), 2)

    def test_read_notification(self):
        self.authenticate()
        response = self.client.post(f'/api/notifications/{self.notification.id}/read/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.notification.refresh_from_db()
        self.assertTrue(self.notification.is_read)

    def test_read_others_notification(self):
        self.client.force_login(self.other_user)
        response = self.client.post(f'/api/notifications/{self.notification.id}/read/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_read_nonexistent_notification(self):
        self.authenticate()
        response = self.client.post('/api/notifications/9999/read/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_read_all_notifications(self):
        self.authenticate()
        response = self.client.post('/api/notifications/read-all/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        unread_count = Notification.objects.filter(user=self.user, is_read=False).count()
        self.assertEqual(unread_count, 0)

    def test_notification_count(self):
        self.authenticate()
        response = self.client.get('/api/notifications/count/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

    def test_notification_count_after_read(self):
        self.authenticate()
        self.notification.is_read = True
        self.notification.save()
        response = self.client.get('/api/notifications/count/')
        self.assertEqual(response.data['count'], 1)
