from django.urls import path
from .views import *

urlpatterns = [
    path('run-create-form/', CreateFormView.as_view(), name='create-form'),
    path('form/<int:pk>/update/', UpdateFormView.as_view(), name='update-form'),
    path('my-forms-list/', MyFormsListView.as_view(), name='my-forms-list'),
    path('all-forms-list/', AllFormsList.as_view(), name='all-forms-list'),
    path('form/<slug:slug>/', FormDetailView.as_view(), name='form-detail'),
    path('form/<slug:slug>/submit/', SubmitResponseView.as_view(), name='submit-response'),
    path('form/<int:pk>/delete/', FormDeleteView.as_view(), name='form-delete')
]