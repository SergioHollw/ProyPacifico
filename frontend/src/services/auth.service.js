import api from './http.service';

const STORAGE_KEY_USER = 'auth_user';

const ROL_NOMBRES = {
  COLABORADOR: 'Colaborador',
  TECNICO: 'Técnico TI',
  ADMINISTRADOR: 'Administrador',
};

export async function login(correo, password) {
  const data = await api.post('/token/', { correo, contrasena: password }, true);
  api.setTokens(data.access, data.refresh);
  const user = await me();
  return { token: data.access, user };
}

export async function me() {
  try {
    const data = await api.get('/auth/me/');
    const user = {
      id: data.id,
      nombre: data.nombre,
      email: data.correo,
      correo: data.correo,
      rol: data.rol,
      rol_nombre: ROL_NOMBRES[data.rol] || data.rol,
      activo: data.activo,
      area: data.area || '',
      especialidad: data.especialidad || '',
      disponibilidad: data.disponibilidad,
      nivel_acceso: data.nivel_acceso || '',
      fecha_creacion: data.fecha_creacion,
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}

export function logout() {
  api.clearTokens();
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem('logueado');
  sessionStorage.clear();
}

export function getToken() {
  return api.getToken();
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function register(userData) {
  await api.post('/auth/register/', {
    nombre: userData.nombre,
    correo: userData.email,
    password: userData.password,
    area: userData.area || '',
  }, true);
  return await login(userData.email, userData.password);
}

export function isAuthenticated() {
  return !!getToken();
}

export async function cambiarPassword(passwordActual, passwordNueva) {
  return api.patch('/auth/me/cambiar-password/', {
    password_actual: passwordActual,
    password_nueva: passwordNueva,
  });
}
