from abc import ABC, abstractmethod


class EstrategiaPrioridad(ABC):
    @abstractmethod
    def calcular(self, ticket):
        pass


class PrioridadPorUrgencia(EstrategiaPrioridad):
    URGENCIA_MAP = {
        'baja': 4,
        'media': 3,
        'alta': 2,
        'critica': 1,
    }

    def calcular(self, urgencia):
        from .models import Prioridad
        nivel = self.URGENCIA_MAP.get(urgencia.lower(), 3)
        return Prioridad.objects.get(nivel=nivel)


