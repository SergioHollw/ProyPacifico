from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.db.models import Count, Q
import csv

from .models import Ticket, Prioridad, EstadoTicket
from apps.usuarios.models import TecnicoTI
from apps.usuarios.permissions import EsAdminOTecnico


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, EsAdminOTecnico]

    def get(self, request):
        formato = request.query_params.get('formato')

        if formato == 'csv':
            return self._exportar_csv()

        tickets_por_estado_qs = Ticket.objects.values('estado__codigo').annotate(total=Count('id'))
        tickets_por_estado = {item['estado__codigo'].lower(): item['total'] for item in tickets_por_estado_qs}

        tickets_por_prioridad_qs = Ticket.objects.values('prioridad__nombre', 'prioridad__nivel').annotate(total=Count('id')).order_by('prioridad__nivel')
        tickets_por_prioridad = {item['prioridad__nombre'].lower(): item['total'] for item in tickets_por_prioridad_qs}

        total_tickets = Ticket.objects.count()
        tickets_abiertos = Ticket.objects.filter(estado__codigo__in=['ABIERTO', 'EN_PROCESO', 'PENDIENTE']).count()
        tickets_cerrados = Ticket.objects.filter(estado__codigo='CERRADO').count()

        tecnicos = TecnicoTI.objects.select_related('persona').annotate(
            total_asignados=Count('tickets_asignados'),
            total_resueltos=Count('tickets_asignados', filter=Q(tickets_asignados__estado__codigo='CERRADO')),
        )
        rendimiento_tecnicos = [{
            'id': t.persona_id,
            'nombre': t.persona.nombre,
            'especialidad': t.especialidad,
            'disponibilidad': t.disponibilidad,
            'tickets_asignados': t.total_asignados,
            'tickets_resueltos': t.total_resueltos,
        } for t in tecnicos]

        return Response({
            'total_tickets': total_tickets,
            'tickets_abiertos': tickets_abiertos,
            'tickets_cerrados': tickets_cerrados,
            'tickets_por_estado': tickets_por_estado,
            'tickets_por_prioridad': tickets_por_prioridad,
            'rendimiento_tecnicos': rendimiento_tecnicos,
        })

    def _exportar_csv(self):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="reporte_tickets.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Titulo', 'Categoria', 'Prioridad', 'Estado', 'Tecnico', 'Fecha Registro', 'Fecha Cierre'])
        tickets = Ticket.objects.select_related(
            'prioridad', 'categoria', 'estado', 'tecnico__persona'
        ).all()
        for t in tickets:
            writer.writerow([
                t.id, t.titulo, t.categoria.nombre, t.prioridad.nombre,
                t.estado.nombre, t.tecnico.persona.nombre if t.tecnico else '',
                t.fecha_registro, t.fecha_cierre or '',
            ])
        return response
