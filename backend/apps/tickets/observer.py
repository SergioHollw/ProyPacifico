from abc import ABC, abstractmethod
from typing import List
from datetime import timedelta


class Notificable(ABC):
    @abstractmethod
    def enviar(self, ticket, mensaje, destinatario):
        pass


class NotificacionSistema(Notificable):
    def enviar(self, ticket, mensaje, destinatario):
        from apps.notificaciones.models import Notificacion
        Notificacion.objects.create(
            ticket=ticket,
            destinatario=destinatario,
            tipo='SISTEMA',
            mensaje=mensaje,
        )


class NotificacionEmail(Notificable):
    def enviar(self, ticket, mensaje, destinatario):
        import logging
        logger = logging.getLogger(__name__)
        logger.info(
            f'[EMAIL SIMULADO] Para: {destinatario.correo} | '
            f'Ticket #{ticket.id}: {mensaje}'
        )


class GestorNotificaciones:
    def __init__(self):
        self._observers: List[Notificable] = []

    def attach(self, observer: Notificable):
        self._observers.append(observer)

    def detach(self, observer: Notificable):
        self._observers.remove(observer)

    def notificar_todos(self, ticket, mensaje, destinatario):
        for observer in self._observers:
            observer.enviar(ticket, mensaje, destinatario)


def calcular_sla_limite(ticket):
    """
    Calcula la fecha límite de SLA según la prioridad del ticket.
    Crítica = 4h, Alta = 8h, Media = 24h, Baja = 48h
    """
    mapa_horas = {
        'critica': 4,
        'alta': 8,
        'media': 24,
        'baja': 48,
    }
    horas = mapa_horas.get(ticket.prioridad.nombre.lower(), 24)
    return ticket.fecha_registro + timedelta(hours=horas)


