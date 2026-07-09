from django.urls import path
from .views import NotificacionViewSet

urlpatterns = [
    path('notificaciones/', NotificacionViewSet.as_view({'get': 'list'}), name='notificaciones-list'),
    path('notificaciones/no-leidas/', NotificacionViewSet.as_view({'get': 'no_leidas'}), name='notificaciones-no-leidas'),
    path('notificaciones/contar-no-leidas/', NotificacionViewSet.as_view({'get': 'contar_no_leidas'}), name='notificaciones-contar'),
    path('notificaciones/marcar-todas-leidas/', NotificacionViewSet.as_view({'patch': 'marcar_todas_leidas'}), name='notificaciones-marcar-todas'),
    path('notificaciones/<int:pk>/', NotificacionViewSet.as_view({'get': 'retrieve'}), name='notificaciones-detail'),
    path('notificaciones/<int:pk>/leer/', NotificacionViewSet.as_view({'patch': 'leer'}), name='notificaciones-leer'),
]
