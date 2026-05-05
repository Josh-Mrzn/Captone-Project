import axios from 'axios';

/**
 * Auth API client.
 *
 * Notes:
 *  - baseURL points to the Express server. The .env on the backend sets PORT=8080
 *    so we mirror that here. If you change the backend port, update this too.
 *  - withCredentials is enabled so that http-only cookies (e.g. refresh tokens
 *    set by the logout/refresh routes) are forwarded.
 *  - We attach an Authorization header from sessionStorage on every request so
 *    protected admin routes work without re-implementing auth on each call.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'http://localhost:8080/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// ── Attach JWT to every request ─────────────────────────────
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Normalize errors so callers always see err.response.data.message ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / CORS / server-down failure → surface a friendly message
    if (!error.response) {
      error.response = {
        data: {
          message:
            error.code === 'ECONNABORTED'
              ? 'Request timed out. Please try again.'
              : 'Cannot reach server. Please check your connection.',
        },
      };
    }
    // Auto-logout on expired/invalid token
    if (error.response.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') || path.startsWith('/superadmin')) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth endpoints ──────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');

// ── Convenience helpers used across the app ─────────────────
export const getCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(sessionStorage.getItem('token'));

export const clearSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

export default API;
