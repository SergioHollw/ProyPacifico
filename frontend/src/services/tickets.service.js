import api from './http.service';

export async function getTickets(params = {}) {
  const query = new URLSearchParams();
  if (params.estado) query.set('estado', params.estado);
  if (params.categoria) query.set('categoria', params.categoria);
  const qs = query.toString();
  const endpoint = qs ? `/tickets/?${qs}` : '/tickets/';
  const data = await api.get(endpoint);
  return (data.results || data).map(mapTicketFromApi);
}

export async function getTicketById(id) {
  const data = await api.get(`/tickets/${id}/`);
  return mapTicketFromApi(data);
}

export async function crearTicket(data, archivo = null) {
  const payload = {
    titulo: data.detalle || data.asunto || '',
    descripcion: data.descripcion || '',
    categoria_nombre: data.especialidad || data.categoria || '',
    urgencia: mapearPrioridad(data.prioridad || 'Media'),
  };
  const result = await api.post('/tickets/', payload);
  const ticket = mapTicketFromApi(result);

  if (archivo) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id_ticket', ticket.id);
    await api.upload('/tickets/adjunto/', formData);
  }

  return ticket;
}

export async function cambiarEstadoTicket(id, nuevoEstado) {
  const result = await api.patch(`/tickets/${id}/estado/`, {
    nuevo_estado: mapearEstado(nuevoEstado),
  });
  return mapTicketFromApi(result);
}

export async function asignarTicket(id, idTecnico) {
  const result = await api.patch(`/tickets/${id}/asignar/`, {
    id_tecnico: idTecnico,
  });
  return mapTicketFromApi(result);
}

export async function getCategorias() {
  const data = await api.get('/categorias/');
  return data.results || data;
}

export async function getTecnicosDisponibles(especialidad) {
  const query = especialidad ? `?especialidad=${encodeURIComponent(especialidad)}` : '';
  const data = await api.get(`/tecnicos-disponibles/${query}`);
  return data.results || data;
}

export async function getHistorialTicket(id) {
  const data = await api.get(`/tickets/${id}/historial/`);
  return data || [];
}

export async function getTicketsSlaVencidos() {
  const data = await api.get('/tickets/sla-vencidos/');
  return (data || []).map(mapTicketFromApi);
}

function mapTicketFromApi(t) {
  return {
    id: t.id,
    idDisplay: t.id,
    tipo: t.categoria_nombre === 'Hardware' || t.categoria_nombre === 'Redes' ? 'Incidente' : 'Requerimiento',
    detalle: t.titulo,
    asunto: t.titulo,
    titulo: t.titulo,
    descripcion: t.descripcion || '',
    especialidad: t.categoria_nombre || '',
    categoria: t.categoria_nombre || '',
    categoria_nombre: t.categoria_nombre || '',
    prioridad: t.prioridad_nombre || 'Media',
    prioridad_nombre: t.prioridad_nombre || 'Media',
    estado: t.estado_nombre || 'Abierto',
    estado_nombre: t.estado_nombre || 'Abierto',
    estado_codigo: t.estado_codigo || '',
    fecha: t.fecha_registro ? t.fecha_registro.split('T')[0] : '',
    fecha_registro: t.fecha_registro,
    fecha_actualizacion: t.fecha_actualizacion,
    fecha_cierre: t.fecha_cierre,
    usuario: t.usuario,
    usuario_nombre: t.usuario_nombre,
    tecnico: t.tecnico,
    tecnico_nombre: t.tecnico_nombre,
    sla_limite: t.sla_limite,
    sla_vencido: t.sla_vencido,
  };
}

export function getEstadosTicket() {
  return [
    { codigo: 'ABIERTO', nombre: 'Abierto' },
    { codigo: 'EN_PROCESO', nombre: 'En Proceso' },
    { codigo: 'PENDIENTE', nombre: 'Pendiente' },
    { codigo: 'CERRADO', nombre: 'Cerrado' },
  ];
}

function mapearPrioridad(prioridad) {
  const mapa = { Baja: 'baja', Media: 'media', Alta: 'alta', Crítica: 'critica', Critica: 'critica' };
  return mapa[prioridad] || 'media';
}

function mapearEstado(estado) {
  const mapa = {
    'Abierto': 'ABIERTO',
    'En proceso': 'EN_PROCESO',
    'En Proceso': 'EN_PROCESO',
    'Pendiente': 'PENDIENTE',
    'Cerrado': 'CERRADO',
  };
  return mapa[estado] || 'ABIERTO';
}