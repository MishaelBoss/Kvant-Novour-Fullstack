from django.urls import path
from .views import CreateAttendanceView, AttendanceListView, AttendanceDetailView

urlpatterns = [
    path('create-attendance', CreateAttendanceView.as_view(), name="create-attendance"),
    path('attendance-list/', AttendanceListView.as_view(), name="attendance-list"),
    path('attendance/<int:pk>/', AttendanceDetailView.as_view(), name="attendance-detail"),
]
