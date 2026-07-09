import api from './http.service';

export async function getComentarios(ticketId) {
  const data = await api.get(`/comentarios/?ticket=${ticketId}`);
  return data.results || data;
}

export async function crearComentario(ticketId, mensaje) {
  return api.post('/comentarios/', { ticket: ticketId, mensaje });
}
