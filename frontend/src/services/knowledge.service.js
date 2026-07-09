import api from './http.service';

export async function getArticulos() {
  const data = await api.get('/conocimiento/');
  return (data.results || data).map(mapArticuloFromApi);
}

export async function getArticuloById(id) {
  try {
    const data = await api.get(`/conocimiento/${id}/`);
    return mapArticuloFromApi(data);
  } catch {
    return null;
  }
}

export async function buscarArticulos(termino) {
  const data = await api.get(`/conocimiento/?q=${encodeURIComponent(termino)}`);
  return (data.results || data).map(mapArticuloFromApi);
}

export async function getCategorias() {
  const data = await api.get('/conocimiento/categorias/');
  return data || [];
}

function mapArticuloFromApi(a) {
  return {
    id: a.id,
    titulo: a.titulo,
    categoria: a.categoria,
    descripcion: a.descripcion,
    contenido: a.contenido,
    icono: a.icono || '\uD83D\uDCC4',
    autor: a.autor || 'Soporte T\u00E9cnico',
    fecha: a.fecha_publicacion ? a.fecha_publicacion.split('T')[0] : '',
    fecha_publicacion: a.fecha_publicacion,
  };
}
