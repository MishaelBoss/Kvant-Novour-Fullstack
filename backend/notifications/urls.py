from django.urls import path
from .views import *

urlpatterns = [
    path('notifications-list/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<int:id>/read/', ReadNotificationView.as_view(), name='read-notification'),
    path('notifications/read-all/', ReadAllNotification.as_view(), name='read-all-notification'),
    path('notifications/count/', CountNotificationView.as_view(), name='notification-count'),
]