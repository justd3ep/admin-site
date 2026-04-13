import axios from 'axios';
import {
  DEMO_TOKEN,
  mockAnalytics,
  mockShops,
  mockPendingShops,
  mockUsers,
  mockOrders,
  delay,
  mockResponse,
} from './mockData';

const BASE_URL = 'https://kanteen-queue-production.up.railway.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally – kick back to login (skip in demo mode)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('adminToken');
    if (error.response?.status === 401 && token !== DEMO_TOKEN) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth (no longer used since Supabase is direct, but kept for fallback)
const authApi = axios.create({ baseURL: `${BASE_URL}/auth` });

export const login = (email, password) =>
  authApi.post('/login', { email, password });

// Users API (for profile/role verification)
const usersApi = axios.create({ baseURL: `${BASE_URL}/users` });

usersApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserProfile = () => usersApi.get('/me');

// ─── Demo mode helper ─────────────────────────────────────────────────────────
const isDemo = () => localStorage.getItem('adminToken') === DEMO_TOKEN;

// Analytics
export const getAnalytics = async () => {
  if (isDemo()) { await delay(); return mockResponse(mockAnalytics); }
  return api.get('/summary'); // Mapped to /api/v1/summary
};

// Shops
export const getShops = async () => {
  if (isDemo()) { await delay(); return mockResponse(mockShops); }
  return api.get('/shops'); // /api/v1/shops
};

export const getPendingShops = async () => {
  if (isDemo()) { await delay(); return mockResponse(mockPendingShops); }
  // There is no explicit '/shops/pending' in swagger, so fetching all and filtering might be needed. 
  // If the backend doesn't support it directly, you'll need a backend update or param ?status=pending.
  return api.get('/shops', { params: { isVerified: false } }); 
};

export const approveShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.patch(`/shops/${id}/status`, { status: 'approved' }); // Spec matches /shops/{id}/status
};

export const rejectShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.delete(`/shops/${id}`);
};

export const deactivateShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.patch(`/shops/${id}/status`, { isActive: false }); // Using the status patch
};

export const deleteShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.delete(`/shops/${id}`);
};

// Users
export const getUsers = async () => {
  if (isDemo()) { await delay(); return mockResponse(mockUsers); }
  return usersApi.get('/'); // /api/v1/users
};

// Orders
export const getOrders = async (params) => {
  if (isDemo()) { await delay(); return mockResponse(mockOrders); }
  return api.get('/orders', { params }); // /api/v1/orders
};

export default api;
