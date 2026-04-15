from django.urls import path
from .views import *

urlpatterns = [
    path('run-create-form/', CreateFormView.as_view(), name='create-form'),
    path('my-forms-list/', MyFormsListView.as_view(), name='my-forms-list'),
    path('all-forms-list/', AllFormsList.as_view(), name='all-forms-list'),
]