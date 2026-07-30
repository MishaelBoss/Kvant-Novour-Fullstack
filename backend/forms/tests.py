from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Form, Question, Choice, FormResponse, Answer


class BaseFormTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        self.admin.userprofile.role = 'admin'
        self.admin.userprofile.save()
        self.teacher = User.objects.create_user(username='teacher', password='teacherpass')
        self.teacher.userprofile.role = 'teacher'
        self.teacher.userprofile.save()
        self.user = User.objects.create_user(username='user', password='userpass')


class FormCRUDTest(BaseFormTest):
    def test_create_form_admin(self):
        self.client.force_login(self.admin)
        response = self.client.post('/api/run-create-form/', {
            'title': 'Test Form',
            'description': 'Test description',
            'status': 'draft',
            'settings': '{}',
            'questions': '[]',
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Form.objects.filter(title='Test Form').exists())

    def test_create_form_teacher(self):
        self.client.force_login(self.teacher)
        response = self.client.post('/api/run-create-form/', {
            'title': 'Teacher Form',
            'description': 'Test',
            'status': 'draft',
            'settings': '{}',
            'questions': '[]',
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_form_unauthorized(self):
        self.client.force_login(self.user)
        response = self.client.post('/api/run-create-form/', {
            'title': 'Test Form',
            'description': 'Test',
            'status': 'draft',
            'settings': '{}',
            'questions': '[]',
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_my_forms(self):
        Form.objects.create(owner=self.teacher, title='My Form', slug='my-form-1', status='draft')
        Form.objects.create(owner=self.admin, title='Admin Form', slug='admin-form-1', status='draft')
        self.client.force_login(self.teacher)
        response = self.client.get('/api/my-forms-list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [f['title'] for f in response.data.get('results', [])]
        self.assertIn('My Form', titles)
        self.assertNotIn('Admin Form', titles)

    def test_delete_form_owner(self):
        form = Form.objects.create(owner=self.teacher, title='To Delete', status='draft')
        self.client.force_login(self.teacher)
        response = self.client.delete(f'/api/form/{form.id}/delete/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])

    def test_delete_form_non_owner(self):
        form = Form.objects.create(owner=self.teacher, title='To Delete', status='draft')
        self.client.force_login(self.user)
        response = self.client.delete(f'/api/form/{form.id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class FormSubmissionTest(BaseFormTest):
    def setUp(self):
        super().setUp()
        self.form = Form.objects.create(
            owner=self.teacher, title='Quiz', status='active',
            slug='test-quiz', show_results_after=True
        )
        self.question = Question.objects.create(
            form=self.form, text='What is 2+2?', type='number',
            points=5, correct_answer='4', order=0
        )
        self.choice = Choice.objects.create(
            question=self.question, text='Option A', order=0, is_correct=True
        )

    def test_get_form_detail(self):
        response = self.client.get(f'/api/form/{self.form.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_submit_form(self):
        response = self.client.post(f'/api/form/{self.form.slug}/submit/', {
            'answers': [{
                'question_id': self.question.id,
                'text_value': '4',
            }],
            'respondent_name': 'Test',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_submit_form_not_found(self):
        response = self.client.post('/api/form/nonexistent-slug/submit/', {
            'answers': [],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_export_form_responses(self):
        self.client.force_login(self.teacher)
        response = self.client.get(f'/api/form/{self.form.slug}/export/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
