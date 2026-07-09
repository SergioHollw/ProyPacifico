import api from './http.service';

export async function getSoluciones(ticketId) {
  const endpoint = ticketId ? `/soluciones/?ticket=${ticketId}` : '/soluciones/';
  const data = await api.get(endpoint);
  return data.results || data;
}

export async function crearSolucion(ticketId, descripcion) {
  return api.post('/soluciones/', { ticket: ticketId, descripcion });
}
