import api from './http.service';

export async function getNoLeidas() {
  const data = await api.get('/notificaciones/no-leidas/');
  return data.results || data;
}

export async function contarNoLeidas() {
  const data = await api.get('/notificaciones/contar-no-leidas/');
  return data.no_leidas || 0;
}

export async function marcarComoLeida(id) {
  return api.patch(`/notificaciones/${id}/leer/`);
}

export async function marcarTodasLeidas() {
  return api.patch('/notificaciones/marcar-todas-leidas/');
}