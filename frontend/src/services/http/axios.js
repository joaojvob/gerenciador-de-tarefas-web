import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE ?? 'token';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: AUTH_MODE === 'cookie',
  withXSRFToken: AUTH_MODE === 'cookie',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use((config) => {
  if (AUTH_MODE === 'token') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export async function prepareSanctum() {
  if (AUTH_MODE === 'cookie') {
    await api.get('/sanctum/csrf-cookie');
  }
}

export { AUTH_MODE };
export default api;