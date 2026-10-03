export const TOKEN_KEY = 'mithaas_token';
export const API_BASE = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export async function api(path, { method = 'GET', body, headers = {}, idempotencyKey } = {}) {
  const requestHeaders = { ...headers };
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  if (idempotencyKey) requestHeaders['Idempotency-Key'] = idempotencyKey;

  let payload = body;
  if (body && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { method, headers: requestHeaders, body: payload });
  } catch {
    throw new ApiError('We could not reach the café server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && !path.endsWith('/auth/login')) {
      sessionStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('mithaas:unauthorized'));
    }
    throw new ApiError(data.message || 'Something went wrong. Please try again.', response.status, data.errors || {});
  }
  return data;
}

export const fetchMenu = () => api('/api/menu').then((data) => data.items);
export const fetchManagedMenu = () => api('/api/menu/manage').then((data) => data.items);
export const fetchGallery = () => api('/api/gallery').then((data) => data.items);
export const fetchManagedGallery = () => api('/api/gallery/manage').then((data) => data.items);
export const fetchTestimonials = () => api('/api/testimonials').then((data) => data.items);
export const fetchStats = () => api('/api/admin/stats').then((data) => data.stats);
export const fetchReservations = () => api('/api/reservations').then((data) => data.reservations);
export const fetchReservation = (id) => api(`/api/reservations/${encodeURIComponent(id)}`).then((data) => data.reservation);

export function createReservation(body, idempotencyKey) {
  return api('/api/reservations', { method: 'POST', body, idempotencyKey }).then((data) => data.reservation);
}

export function updateReservation(id, status) {
  return api(`/api/reservations/${id}`, { method: 'PATCH', body: { status } }).then((data) => data.reservation);
}

export function deleteReservation(id) {
  return api(`/api/reservations/${id}`, { method: 'DELETE' });
}
