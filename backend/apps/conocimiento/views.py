from django.db import models as db_models
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Articulo
from .serializers import ArticuloSerializer, ArticuloListSerializer
from apps.usuarios.permissions import EsAdminOTecnico


class ArticuloViewSet(ModelViewSet):
    queryset = Articulo.objects.filter(activo=True)
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticuloListSerializer
        return ArticuloSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), EsAdminOTecnico()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list' and not self.request.user.rol in ('ADMINISTRADOR', 'TECNICO'):
            qs = qs.filter(activo=True)
        categoria = self.request.query_params.get('categoria')
        busqueda = self.request.query_params.get('q')
        if categoria:
            qs = qs.filter(categoria__iexact=categoria)
        if busqueda:
            qs = qs.filter(
                db_models.Q(titulo__icontains=busqueda) |
                db_models.Q(descripcion__icontains=busqueda) |
                db_models.Q(contenido__icontains=busqueda) |
                db_models.Q(categoria__icontains=busqueda)
            )
        return qs

    @action(detail=False, methods=['get'])
    def categorias(self, request):
        cats = Articulo.objects.filter(activo=True
            ).values_list('categoria', flat=True).distinct().order_by('categoria')
        return Response(list(cats))
