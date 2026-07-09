from django.urls import path
from .views import (
    TicketViewSet, PrioridadListView, CategoriaListView,
    TecnicoDisponibleView, TicketAdjuntoUploadView,
)

urlpatterns = [
    path('tickets/adjunto/', TicketAdjuntoUploadView.as_view({'post': 'create'}), name='tickets-adjunto-upload'),
    path('tickets/', TicketViewSet.as_view({'get': 'list', 'post': 'create'}), name='tickets-list'),
    path('tickets/<int:pk>/', TicketViewSet.as_view({'get': 'retrieve'}), name='tickets-detail'),
    path('tickets/<int:pk>/estado/', TicketViewSet.as_view({'patch': 'estado'}), name='tickets-estado'),
    path('tickets/<int:pk>/asignar/', TicketViewSet.as_view({'patch': 'asignar'}), name='tickets-asignar'),
    path('tickets/<int:pk>/historial/', TicketViewSet.as_view({'get': 'historial'}), name='tickets-historial'),
    path('tickets/sla-vencidos/', TicketViewSet.as_view({'get': 'sla_vencidos'}), name='tickets-sla-vencidos'),
    path('prioridades/', PrioridadListView.as_view({'get': 'list'}), name='prioridades-list'),
    path('categorias/', CategoriaListView.as_view({'get': 'list'}), name='categorias-list'),
    path('tecnicos-disponibles/', TecnicoDisponibleView.as_view({'get': 'list'}), name='tecnicos-disponibles'),
]
