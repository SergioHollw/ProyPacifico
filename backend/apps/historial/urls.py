from django.urls import path
from .views import HistorialViewSet

urlpatterns = [
    path('historial/', HistorialViewSet.as_view({'get': 'list'}), name='historial-list'),
    path('historial/<int:pk>/', HistorialViewSet.as_view({'get': 'retrieve'}), name='historial-detail'),
]
