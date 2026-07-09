import { API_URL } from '../config';

const STORAGE_KEY_TOKEN = 'auth_token';
const STORAGE_KEY_REFRESH = 'auth_refresh';

function getToken() {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
}

function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEY_REFRESH);
}

function setTokens(access, refresh) {
  localStorage.setItem(STORAGE_KEY_TOKEN, access);
  if (refresh) localStorage.setItem(STORAGE_KEY_REFRESH, refresh);
}

function clearTokens() {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_REFRESH);
}

async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token available');

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await response.json();
  setTokens(data.access, null);
  return data.access;
}

async function request(endpoint, options = {}) {
  const { method = 'GET', body = null, isFormData = false, skipAuth = false } = options;

  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = { method, headers };
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  let response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401 && !skipAuth) {
    try {
      const newToken = await refreshToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      config.headers = headers;
      response = await fetch(`${API_URL}${endpoint}`, config);
    } catch {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Sesion expirada');
    }
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!response.ok) {
    let errorMsg = 'Error en la solicitud';
    if (isJson) {
      const errData = await response.json();
      if (errData.detail) errorMsg = errData.detail;
      else if (errData.error) errorMsg = errData.error;
      else if (typeof errData === 'object') {
        const firstKey = Object.keys(errData)[0];
        const val = errData[firstKey];
        errorMsg = Array.isArray(val) ? val[0] : val;
      }
    }
    throw new Error(errorMsg);
  }

  if (isJson) {
    return response.json();
  }

  return response;
}

const api = {
  get: (endpoint, skipAuth = false) => request(endpoint, { method: 'GET', skipAuth }),
  post: (endpoint, body, skipAuth = false) => request(endpoint, { method: 'POST', body, skipAuth }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  upload: (endpoint, formData) => request(endpoint, { method: 'POST', body: formData, isFormData: true }),
  setTokens,
  clearTokens,
  getToken,
};

export default api;
