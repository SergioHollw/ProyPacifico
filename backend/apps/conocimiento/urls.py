from django.urls import path
from .views import ArticuloViewSet

urlpatterns = [
    path('conocimiento/', ArticuloViewSet.as_view({'get': 'list', 'post': 'create'}), name='conocimiento-list'),
    path('conocimiento/categorias/', ArticuloViewSet.as_view({'get': 'categorias'}), name='conocimiento-categorias'),
    path('conocimiento/<int:pk>/', ArticuloViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='conocimiento-detail'),
]
