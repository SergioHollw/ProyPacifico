from rest_framework.permissions import BasePermission


class EsColaborador(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'COLABORADOR'


class EsTecnico(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'TECNICO'


class EsAdministrador(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'ADMINISTRADOR'


class EsAdminOTecnico(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.rol in ('ADMINISTRADOR', 'TECNICO')
