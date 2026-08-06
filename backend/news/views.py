from rest_framework.views import APIView
from .serializers import NewsSerializer, CategorySerializer
from rest_framework.response import Response
from rest_framework import status
from users.permissions import IsAdminRole
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import F
from .models import Category, News, NewsView


class CreateCategoriesView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Категория успешно создана", "data": serializer.data}, 
                status=status.HTTP_201_CREATED
            )
        print(f"Ошибки валидации: {serializer.errors}") 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CreateNewsCommandView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = NewsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Новость успешно создана", "data": serializer.data}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewNewsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, slug, *args, **kwargs):
        news_instance = get_object_or_404(News, slug=slug)
        user = request.user if getattr(request.user, 'is_authenticated', False) else None

        is_viewed = False
        first_view = False

        if user is not None:
            _, created = NewsView.objects.get_or_create(news=news_instance, user=user)
            is_viewed = not created
            first_view = created
        else:
            first_view = True

        if first_view:
            News.objects.filter(pk=news_instance.pk).update(views=F('views') + 1)
            news_instance.refresh_from_db()

        return Response(
            {
                "message": "Пользователь успешно посмотрел новость",
                "views": news_instance.views,
                "is_viewed": is_viewed,
                "first_view": first_view,
            },
            status=status.HTTP_200_OK
        )

    
class CategoriesListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        categories = Category.objects.all()
        data = []

        for c in categories:
            data.append({
                'value': c.id,
                'label': c.name,
                'slug': c.slug,
            })

        return Response({
            'results': data
        })
    

class NewsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        news = News.objects.all().prefetch_related('categories').order_by('-created_at')

        serializer = NewsSerializer(news, many=True, context={'request': request})

        return Response({
            'count': news.count(),
            'results': serializer.data
        })
    

class DeleteNews(APIView):
    permission_classes = [IsAdminRole]
    def delete(self, request, id):
        try:
            get_object_or_404(News, id=id).delete()
            return Response(
                {'message': 'Пост успешно удален'}, 
                status=status.HTTP_200_OK
            )
        except News.DoesNotExist: 
            return Response({'Ошибка': 'Пост не найден'}, status=status.HTTP_404_NOT_FOUND)