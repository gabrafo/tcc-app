export const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api'
).replace(/\/$/, '');

export const API_ORIGIN = BASE_URL.replace(/\/api$/, '');

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function post(path, body, isFormData = false) {
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: isFormData ? body : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function put(path, body, isFormData = false) {
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers,
    body: isFormData ? body : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function patch(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
}

export const api = {
  // Entidades simples
  getUnidades: () => get('/unidades-academicas/'),
  getDepartamentos: () => get('/departamentos/'),
  getCursos: () => get('/cursos/'),
  getAlunos: () => get('/alunos/'),
  getProfessores: () => get('/professores/'),

  // TCCs
  getTccs: () => get('/tccs/'),
  getTcc: (id) => get(`/tccs/${id}/`),
  criarTcc: (formData) => post('/tccs/', formData, true),
  atualizarTcc: (id, formData) => put(`/tccs/${id}/`, formData, true),
  atualizarStatus: (id, status) => patch(`/tccs/${id}/`, { status }),
  deletarTcc: (id) => del(`/tccs/${id}/`),

  // Dashboard
  getEstatisticas: () => get('/tccs/estatisticas/'),
};
