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

const BASE_URL = 'https://kanteen-queue-production.up.railway.app/api';

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
const usersApi = axios.create({ baseURL: `${BASE_URL}/v1/users` });

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
  return api.get('/v1/summary');
};

// Shops
export const getShops = async () => {
  if (isDemo()) { await delay(); return mockResponse(mockShops); }
  return api.get('/v1/shops');
};

export const getPendingShops = async () => {
  if (isDemo()) { await delay(); return mockResponse(mockPendingShops); }
  return api.get('/v1/shops/pending'); // Admin-only: returns is_verified=false shops
};

export const approveShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.patch(`/v1/shops/${id}/verify`); // Marks is_verified=true
};

export const rejectShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.delete(`/shops/${id}`);
};

export const deactivateShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.patch(`/v1/shops/${id}/status`, { isActive: false });
};

export const deleteShop = async (id) => {
  if (isDemo()) { await delay(300); return mockResponse({ success: true, id }); }
  return api.delete(`/v1/shops/${id}`);
};

// Users
export const getUsers = async () => {
  if (isDemo()) { await delay(); return mockResponse(mockUsers); }
  return usersApi.get('/'); // baseURL already points to /api/v1/users
};

// Orders
export const getOrders = async (params) => {
  if (isDemo()) { await delay(); return mockResponse(mockOrders); }
  return api.get('/v1/orders', { params });
};

export default api;
