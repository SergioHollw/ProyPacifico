from abc import ABC, abstractmethod


class EstrategiaAsignacion(ABC):
    @abstractmethod
    def asignar(self, ticket, tecnicos):
        pass


class AsignacionPorEspecialidad(EstrategiaAsignacion):
    def asignar(self, ticket, tecnicos):
        return tecnicos.filter(
            especialidad__iexact=ticket.categoria.nombre,
            disponibilidad=True
        ).first()


