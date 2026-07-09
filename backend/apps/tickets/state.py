from abc import ABC, abstractmethod

ESTADO_ABIERTO = 'ABIERTO'
ESTADO_EN_PROCESO = 'EN_PROCESO'
ESTADO_PENDIENTE = 'PENDIENTE'
ESTADO_CERRADO = 'CERRADO'


class EstadoMixin(ABC):
    @abstractmethod
    def get_codigo(self):
        pass

    @abstractmethod
    def abrir(self, ticket):
        pass

    @abstractmethod
    def procesar(self, ticket):
        pass

    @abstractmethod
    def pausar(self, ticket):
        pass

    @abstractmethod
    def cerrar(self, ticket):
        pass


class Abierto(EstadoMixin):
    def get_codigo(self):
        return ESTADO_ABIERTO

    def abrir(self, ticket):
        raise ValueError('El ticket ya está abierto')

    def procesar(self, ticket):
        from .models import EstadoTicket
        return EstadoTicket.objects.get(codigo=ESTADO_EN_PROCESO)

    def pausar(self, ticket):
        raise ValueError('No se puede pausar un ticket que no está en proceso')

    def cerrar(self, ticket):
        raise ValueError('No se puede cerrar un ticket sin procesarlo')


class EnProceso(EstadoMixin):
    def get_codigo(self):
        return ESTADO_EN_PROCESO

    def abrir(self, ticket):
        raise ValueError('El ticket ya está en proceso, no se puede reabrir')

    def procesar(self, ticket):
        raise ValueError('El ticket ya está en proceso')

    def pausar(self, ticket):
        from .models import EstadoTicket
        return EstadoTicket.objects.get(codigo=ESTADO_PENDIENTE)

    def cerrar(self, ticket):
        from .models import EstadoTicket
        return EstadoTicket.objects.get(codigo=ESTADO_CERRADO)


class Pendiente(EstadoMixin):
    def get_codigo(self):
        return ESTADO_PENDIENTE

    def abrir(self, ticket):
        raise ValueError('No se puede reabrir un ticket pendiente, debe volver a proceso')

    def procesar(self, ticket):
        from .models import EstadoTicket
        return EstadoTicket.objects.get(codigo=ESTADO_EN_PROCESO)

    def pausar(self, ticket):
        raise ValueError('El ticket ya está pendiente')

    def cerrar(self, ticket):
        raise ValueError('No se puede cerrar un ticket pendiente, debe procesarlo primero')


class Cerrado(EstadoMixin):
    def get_codigo(self):
        return ESTADO_CERRADO

    def abrir(self, ticket):
        from .models import EstadoTicket
        return EstadoTicket.objects.get(codigo=ESTADO_ABIERTO)

    def procesar(self, ticket):
        raise ValueError('No se puede procesar un ticket cerrado')

    def pausar(self, ticket):
        raise ValueError('No se puede pausar un ticket cerrado')

    def cerrar(self, ticket):
        raise ValueError('El ticket ya está cerrado')


class EstadoFactory:
    _instancias = {}

    @classmethod
    def obtener_estado(cls, codigo):
        if codigo not in cls._instancias:
            mapa = {
                ESTADO_ABIERTO: Abierto,
                ESTADO_EN_PROCESO: EnProceso,
                ESTADO_PENDIENTE: Pendiente,
                ESTADO_CERRADO: Cerrado,
            }
            if codigo not in mapa:
                raise ValueError(f'Estado desconocido: {codigo}')
            cls._instancias[codigo] = mapa[codigo]()
        return cls._instancias[codigo]
