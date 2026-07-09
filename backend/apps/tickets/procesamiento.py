from abc import ABC, abstractmethod
from rest_framework.response import Response

from .observer import GestorNotificaciones, Notificable


class ProcesoTicket(ABC):
    def __init__(self):
        self._gestor = GestorNotificaciones()

    def attach(self, observer: Notificable):
        self._gestor.attach(observer)

    def detach(self, observer: Notificable):
        self._gestor.detach(observer)

    def procesar(self, ticket, request, **kwargs):
        error = self.validar_permisos(ticket, request)
        if error:
            return error
        datos = self.preparar_datos(ticket, request, **kwargs)
        resultado = self.ejecutar(ticket, datos, request)
        if isinstance(resultado, Response):
            return resultado
        self.notificar(ticket, resultado, request)
        self.registrar_historial(ticket, resultado, request)
        return self.respuesta_final(ticket, resultado)

    @abstractmethod
    def validar_permisos(self, ticket, request):
        pass

    def preparar_datos(self, ticket, request, **kwargs):
        return {}

    @abstractmethod
    def ejecutar(self, ticket, datos, request):
        pass

    def notificar(self, ticket, resultado, request):
        pass

    def registrar_historial(self, ticket, resultado, request):
        pass

    def respuesta_final(self, ticket, resultado):
        from .serializers import TicketListSerializer
        return Response(TicketListSerializer(ticket).data)
