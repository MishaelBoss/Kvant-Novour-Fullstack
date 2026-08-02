from django.urls import path
from .views import CreateCategoriesView, CreateNewsCommandView, NewsListView, DeleteNews, CategoriesListView, ViewNewsView

urlpatterns = [
    path('create-category/', CreateCategoriesView.as_view(), name="create-category"),
    path('run-create-news/', CreateNewsCommandView.as_view(), name='run-create-news'),
    path('news-list/', NewsListView.as_view(), name='news-list'),
    path('news-delete/<int:id>/', DeleteNews.as_view(), name='news-delete'),
    path('categories-list/', CategoriesListView.as_view(), name='categories-list'),
    path('view-news/<slug:slug>/', ViewNewsView.as_view(), name='view-news')
]