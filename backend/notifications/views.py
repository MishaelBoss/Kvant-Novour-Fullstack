from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notification = Notification.objects.filter(user=request.user).select_related('news')

        last_dates = notification.values('type').annotate(lastest=Max('created_at'))

        latest_dates_dict = {}
        for i in last_dates:
            if i['lastest']:
                latest_dates_dict[i['type']] = i['lastest'].strftime('%d.%m.%Y')

        serializer = NotificationSerializer(notification, many=True, context={'request': request})
        return Response({
            'results': serializer.data,
            'latest_dates': {
                'system': latest_dates_dict.get('system', ''),
                'chat': latest_dates_dict.get('chat', ''),
                'news': latest_dates_dict.get('news', ''),
            }
        })
    

class ReadNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            notification = Notification.objects.get(id=id, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({
                'status:' 'success'
            }, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({
                'status:' 'Not found'
            }, status=status.HTTP_404_NOT_FOUND)


class ReadAllNotification(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            Notification.objects.filter(user=request.user).update(is_read=True)
            return Response({
                'status:' 'success'
            }, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({
                'status:', 'Not found'
            }, status=status.HTTP_404_NOT_FOUND)
        

class CountNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notification_count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'count': notification_count})