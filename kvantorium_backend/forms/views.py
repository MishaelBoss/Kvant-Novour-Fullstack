from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import *
from news.models import *
import json
from django.db import transaction
from pytils.translit import slugify
from users.permissions import *


class CreateFormView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            questions_data = json.loads(request.data.get('questions', '[]'))
            settings_data = json.loads(request.data.get('settings', '{}'))
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        status_val = request.data.get('status', 'draft')

        try:
            with transaction.atomic():
                form = Form.objects.create(
                    owner=request.user,
                    title=request.data.get('title', 'Без названия'),
                    description=request.data.get('description', ''),
                    deadline=request.data.get('deadline') or None,
                    status=status_val,
                    **settings_data
                )

                for index, q_item in enumerate(questions_data):
                    question = Question.objects.create(
                        form=form,
                        text=q_item.get('text', ''),
                        type=q_item.get('type', 'short_text'),
                        is_required=q_item.get('is_required', False),
                        points=q_item.get('points', 0),
                        order=index
                    )

                    media_file = request.FILES.get(f'question_media_{index}')
                    if media_file:
                        pass

                    for c_item in q_item.get('choices', []):
                        Choice.objects.create(
                            question=question,
                            text=c_item.get('text', ''),
                            is_correct=c_item.get('is_correct', False),
                            order=c_item.get('order', 0)
                        )

                if status_val == 'active':
                    new_post = News.objects.create(
                        title=f"Новый опрос: {form.title}",
                        content=form.description or "Пройдите наш новый опрос!",
                        form_id=form.id,
                        form_slug=slugify(form.title)
                    )
                    category, _ = Category.objects.get_or_create(name="Опросы")
                    new_post.categories.add(category)

                return Response({"id": form.id}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
        

class MyFormsListView(APIView):
    permission_classes = [IsAdminRole | IsTeacherRole]

    def get(self, request):
        forms = Form.objects.filter(owner=request.user).order_by('-created_at')
        
        data = []
        for f in forms:
            data.append({
                'id': f.id,
                'title': f.title,
                'description': f.description,
                'status': f.status,
                'created_at': f.created_at,
            })
            
        return Response({
            'count': forms.count(),
            'results': data
        })
    

class AllFormsList(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        forms = Form.objects.all().order_by('-created_at')

        data = []
        for f in forms:
            data.append({
                'id': f.id,
                'title': f.title,
                'description': f.description,
                'status': f.status,
                'created_at': f.created_at,
            })

        return Response({
            'count': forms.count(),
            'results': data
        })