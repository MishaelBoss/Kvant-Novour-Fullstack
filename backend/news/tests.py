from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, News


class CategoryTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        self.admin.userprofile.role = 'admin'
        self.admin.userprofile.save()

    def test_create_category_admin_only(self):
        self.client.force_login(self.admin)
        response = self.client.post('/api/create-category/', {'label': 'Тестовая категория'}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Category.objects.filter(name='Тестовая категория').exists())

    def test_create_category_unauthorized(self):
        response = self.client.post('/api/create-category/', {'label': 'Тестовая категория'}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_categories(self):
        Category.objects.get_or_create(name='Спорт', defaults={'slug': 'sport'})
        Category.objects.get_or_create(name='Наука', defaults={'slug': 'nauka'})
        response = self.client.get('/api/categories-list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [c['label'] for c in response.data['results']]
        self.assertIn('Спорт', names)
        self.assertIn('Наука', names)


class NewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        self.admin.userprofile.role = 'admin'
        self.admin.userprofile.save()
        self.category, _ = Category.objects.get_or_create(name='Новости', defaults={'slug': 'novosti'})

    def test_create_news(self):
        self.client.force_login(self.admin)
        response = self.client.post('/api/run-create-news/', {
            'title': 'Test News',
            'content': 'Test content',
            'category_ids': [self.category.id],
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(News.objects.filter(title='Test News').exists())

    def test_create_news_requires_admin(self):
        response = self.client.post('/api/run-create-news/', {
            'title': 'Test News',
            'content': 'Test content',
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_news(self):
        News.objects.create(title='News 1', content='Content 1')
        News.objects.create(title='News 2', content='Content 2')
        response = self.client.get('/api/news-list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

    def test_delete_news(self):
        news = News.objects.create(title='To Delete', content='Content')
        self.client.force_login(self.admin)
        response = self.client.delete(f'/api/news-delete/{news.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(News.objects.filter(id=news.id).exists())

    def test_delete_nonexistent_news(self):
        self.client.force_login(self.admin)
        response = self.client.delete('/api/news-delete/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
