import api, { AUTH_MODE, prepareSanctum } from './http/axios';

export async function register(payload) {
  if (AUTH_MODE === 'cookie') {
    await prepareSanctum();
  }

  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function login(payload) {
  if (AUTH_MODE === 'cookie') {
    await prepareSanctum();
  }

  const { data } = await api.post('/api/auth/login', payload);
  return data;
}

export async function me() {
  const { data } = await api.get('/api/auth/me');
  return data;
}

export async function logout() {
  const { data } = await api.post('/api/auth/logout');
  return data;
}