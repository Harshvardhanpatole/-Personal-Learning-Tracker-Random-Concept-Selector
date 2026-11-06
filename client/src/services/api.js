async function request(path, options = {}) {
  const response = await fetch(path, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

export const api = {
  me: () => request('/api/auth/me'),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  projects: () => request('/api/projects'),
  project: (id) => request(`/api/projects/${id}`),
  createProject: (payload) => request('/api/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
  concepts: (projectId) => request(`/api/projects/${projectId}/concepts`),
  createConcept: (projectId, payload) => request(`/api/projects/${projectId}/concepts`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteConcept: (id) => request(`/api/concepts/${id}`, { method: 'DELETE' }),
  spin: (projectId) => request(`/api/projects/${projectId}/spin`, { method: 'POST' }),
  complete: (id) => request(`/api/concepts/${id}/complete`, { method: 'POST' }),
};
