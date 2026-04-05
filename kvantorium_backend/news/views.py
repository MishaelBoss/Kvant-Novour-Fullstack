from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from users.permissions import IsAdminRole
from django.shortcuts import get_object_or_404


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
        print(f"Ошибки валидации: {serializer.errors}") 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CategoriesListView(APIView):
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
    def get(self, request):
        news = News.objects.all().prefetch_related('categories').order_by('-created_at')
        data = []

        for n in news:
            image_url = ""
            if n.image:
                image_url = request.build_absolute_uri(n.image.url)

            data.append({
                'id': n.id,
                'title': n.title,
                'content': n.content,
                'categories': [{
                    'value': c.id, 
                    'label': c.name
                    } 
                    for c in n.categories.all()
                ],
                'image': image_url,
                'created_at': n.created_at
            })

        return Response({
            'count': news.count(),
            'results': data
        })
    

class DeleteNews(APIView):
    permission_classes = [IsAdminRole]
    def delete(self, request, id):
        try:
            news = get_object_or_404(News, id=id)
            news.delete()
            return Response(
                {'message': 'Пост успешно удален'}, 
                status=status.HTTP_200_OK
            )
        except News.DoesNotExist: 
            return Response({'Ошибка': 'Пост не найден'}, status=status.HTTP_404_NOT_FOUND)