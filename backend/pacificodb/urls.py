from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from apps.usuarios.token_serializer import PersonaTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.usuarios.urls')),
    path('api/', include('apps.tickets.urls')),
    path('api/', include('apps.historial.urls')),
    path('api/', include('apps.soluciones.urls')),
    path('api/', include('apps.comentarios.urls')),
    path('api/', include('apps.notificaciones.urls')),
    path('api/', include('apps.conocimiento.urls')),
    path('api/dashboard/', include('apps.tickets.dashboard_urls')),
    path('api/token/', PersonaTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
