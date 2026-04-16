from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import *
from news.models import *
import json
from django.db import transaction
from pytils.translit import slugify
from users.permissions import *
from django.shortcuts import get_object_or_404


class CreateFormView(APIView):
    permission_classes = [IsAdminRole | IsTeacherRole]

    def post(self, request):

        try:
            questions_data = json.loads(request.data.get('questions', '[]'))
            settings_data = json.loads(request.data.get('settings', '{}'))
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        status_val = request.data.get('status', 'draft')

        try:
            with transaction.atomic():
                title_val = request.data.get('title', 'Без названия')
                generated_slug = slugify(title_val)
            
                form = Form.objects.create(
                    owner=request.user,
                    title=title_val,
                    slug=generated_slug,
                    description=request.data.get('description', ''),
                    deadline=request.data.get('deadline') or None,
                    status=status_val,
                    **settings_data
                )

                for index, q_item in enumerate(questions_data):

                    media_file = request.FILES.get(f'question_media_{index}')
                    if media_file:
                        pass

                    question = Question.objects.create(
                        form=form,
                        text=q_item.get('text', ''),
                        type=q_item.get('type', 'short_text'),
                        is_required=q_item.get('is_required', False),
                        points=q_item.get('points', 0),
                        order=index,
                        media=media_file
                    )

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
                        form_slug=generated_slug
                    )
                    category, _ = Category.objects.get_or_create(name="Опросы")
                    new_post.categories.add(category)

                return Response({"id": form.id, "slug": form.slug}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
        

class UpdateFormView(APIView):
    permission_classes = [IsAdminRole | IsTeacherRole]

    def put(self, request, pk):
        form = get_object_or_404(Form, id=pk, owner=request.user)

        try:
            questions_data = json.loads(request.data.get('questions', '[]'))
            settings_data = json.loads(request.data.get('settings', '{}'))
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=400)

        try:
            with transaction.atomic():
                title_val = request.data.get('title', 'Без названия')
                generated_slug = slugify(title_val)

                new_status = request.data.get('status')
                form.title = request.data.get('title', form.title)
                form.status = new_status
                form.description = request.data.get('description', form.description)
                form.deadline = request.data.get('deadline') or None
                form.slug = slugify(form.title)

                for key, value in settings_data.items():
                    setattr(form, key, value)

                form.save()

                if new_status == 'active':
                    news_exists = News.objects.filter(form_id=form.id).exists()

                    if not news_exists:
                        new_post = News.objects.create(
                            title=f"Новый опрос: {form.title}",
                            content=form.description or "Пройдите наш новый опрос!",
                            form_id=form.id,
                            form_slug=generated_slug
                        )
                        category, _ = Category.objects.get_or_create(name="Опросы")
                        new_post.categories.add(category)

                if new_status == 'draft':
                    News.objects.filter(form_id=form.id).delete()

                incoming_question_ids = [q.get('id') for q in questions_data if str(q.get('id')).isdigit()]
                
                form.questions.exclude(id__in=incoming_question_ids).delete()

                for index, q_item in enumerate(questions_data):
                    q_id = q_item.get('id')
                    media_file = request.FILES.get(f'question_media_{index}')
                    
                    question = form.questions.filter(id=q_id).first() if str(q_id).isdigit() else None

                    if not question:
                        question = Question.objects.create(form=form)
                    
                    question.text = q_item.get('text', '')
                    question.type = q_item.get('type', 'short_text')
                    question.is_required = q_item.get('is_required', False)
                    question.points = q_item.get('points', 0)
                    question.order = index

                    if media_file:
                        question.media = media_file
                    elif not q_item.get('has_media'):
                        question.media = None

                    question.save()

                    question.choices.all().delete()
                    for c_item in q_item.get('choices', []):
                        Choice.objects.create(
                            question=question,
                            text=c_item.get('text', ''),
                            is_correct=c_item.get('is_correct', False),
                            order=c_item.get('order', 0)
                        )

                return Response({"status": "success"})

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
    

class FormDetailView(APIView):
    def get(self, request, slug):
        if slug.isdigit():
            form = get_object_or_404(Form, id=slug)
        else:
            form = get_object_or_404(Form, slug=slug)
        
        questions = []
        for q in form.questions.all():
            choices = [{
                'id': c.id,
                'text': c.text,
                'order': c.order
            } for c in q.choices.all()]

            media_data = None
            if q.media:
                media_url = q.media.url.lower()
                media_type = 'image'
                if media_url.endswith(('.mp3', '.wav', '.ogg')):
                    media_type = 'audio'
                elif media_url.endswith(('.mp4', '.webm', '.mov')):
                    media_type = 'video'

                media_data = {
                    'type': media_type,
                    'preview_url': request.build_absolute_uri(q.media.url)
                }

            questions.append({
                'id': q.id,
                'text': q.text,
                'type': q.type,
                'is_required': q.is_required,
                'points': q.points,
                'media': media_data,
                'choices': choices
            })

        return Response({
            'id': str(form.id),
            'title': form.title,
            'status': form.status,
            'description': form.description,
            'settings': {
                'timer_enabled': form.timer_enabled,
                'timer_seconds': form.timer_seconds,
                'one_question_per_page': form.one_question_per_page,
                'show_results_after': form.show_results_after,
                'require_profile': form.require_profile,
            },
            'questions': questions
        })
    

class SubmitQuizView(APIView):
    def post(self, request, slug):
        form = get_object_or_404(Form, id=slug)
        profile = request.data.get('profile')
        answers = request.data.get('answers')

        with transaction.atomic():
            # 1. Создаем запись о прохождении (Submission/Session)
            submission = Submission.objects.create(
                form=form,
                full_name=profile.get('full_name'),
                school=profile.get('school'),
                # ... другие поля профиля
            )

            for ans in answers:
                Answer.objects.create(
                    submission=submission,
                    question_id=ans.get('question_id'),
                    text_value=ans.get('text_value'),
                )

        return Response({"status": "ok", "message": "Результаты приняты"}, status=201)