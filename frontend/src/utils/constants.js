export const PRIORITY_COLORS = {
  Crítica: 'var(--color-danger)',
  crítica: 'var(--color-danger)',
  critica: 'var(--color-danger)',
  Alta: 'var(--color-warning)',
  alta: 'var(--color-warning)',
  Media: 'var(--color-primary)',
  media: 'var(--color-primary)',
  Baja: 'var(--color-text-secondary)',
  baja: 'var(--color-text-secondary)',
};

export const PRIORITY_COLORS_HEX = {
  crítica: '#dc2626',
  critica: '#dc2626',
  alta: '#f59e0b',
  media: '#2563eb',
  baja: '#6b7280',
};

export const CATEGORY_COLORS = {
  Hardware: { bg: '#fef3c7', text: '#92400e' },
  Software: { bg: '#dbeafe', text: '#1e40af' },
  Redes: { bg: '#d1fae5', text: '#065f46' },
};

export const ESTADO_META = {
  abierto: { badge: 'bg-success', dot: '#16a34a' },
  en_proceso: { badge: 'bg-primary', dot: '#2563eb' },
  pendiente: { badge: 'bg-warning text-dark', dot: '#f59e0b' },
  cerrado: { badge: 'bg-danger', dot: '#dc2626' },
};

export const STATUS_BADGE_MAP = {
  Abierto: 'badge-open',
  'En proceso': 'badge-in-progress',
  Pendiente: 'badge-pending',
  Cerrado: 'badge-closed',
};

export const PRIORIDAD_ORDER = { Crítica: 0, Alta: 1, Media: 2, Baja: 3 };

export const PRIORIDAD_CLASS = {
  Crítica: 'priority-crítica',
  Alta: 'priority-alta',
  Media: 'priority-media',
  Baja: 'priority-baja',
};

export function getPriorityColor(p) {
  return PRIORITY_COLORS[p] || 'var(--color-text-secondary)';
}

export function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || { bg: '#f3f4f6', text: '#374151' };
}

export function getEstadoMeta(estado) {
  return ESTADO_META[estado?.toLowerCase()] || { badge: 'bg-secondary', dot: '#6b7280' };
}
