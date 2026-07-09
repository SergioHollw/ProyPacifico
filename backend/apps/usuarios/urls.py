from django.urls import path
from .views import RegistroView, UsuarioActualView, UsuarioAdminView

urlpatterns = [
    path('auth/register/', RegistroView.as_view({'post': 'create'}), name='registro'),
    path('auth/me/', UsuarioActualView.as_view({'get': 'list'}), name='usuario-actual'),
    path('auth/me/cambiar-password/', UsuarioActualView.as_view({'patch': 'cambiar_password'}), name='cambiar-password'),
    path('auth/me/actualizar-perfil/', UsuarioActualView.as_view({'patch': 'actualizar_perfil'}), name='actualizar-perfil'),
    path('usuarios/', UsuarioAdminView.as_view({'get': 'list', 'post': 'create'}), name='lista-usuarios'),
    path('usuarios/<int:pk>/', UsuarioAdminView.as_view({'patch': 'partial_update'}), name='detalle-usuario'),
    path('usuarios/<int:pk>/cambiar-estado/', UsuarioAdminView.as_view({'patch': 'cambiar_estado'}), name='cambiar-estado-usuario'),
]
