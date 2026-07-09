from django.urls import path
from .views import SolucionViewSet

urlpatterns = [
    path('soluciones/', SolucionViewSet.as_view({'get': 'list', 'post': 'create'}), name='soluciones-list'),
    path('soluciones/<int:pk>/', SolucionViewSet.as_view({'get': 'retrieve'}), name='soluciones-detail'),
]
