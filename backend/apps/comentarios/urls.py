from django.urls import path
from .views import ComentarioViewSet

urlpatterns = [
    path('comentarios/', ComentarioViewSet.as_view({'get': 'list', 'post': 'create'}), name='comentarios-list'),
    path('comentarios/<int:pk>/', ComentarioViewSet.as_view({'get': 'retrieve'}), name='comentarios-detail'),
]
