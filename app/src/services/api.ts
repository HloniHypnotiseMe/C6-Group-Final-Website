// ============================================
// C6GROUP API Service Layer
// Centralized HTTP client with auth interceptors
// ============================================

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// API Configuration. Production deployments should provide VITE_API_URL.
// Relative fallback keeps the client same-origin when the edge layer proxies /api/v1.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('c6group_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors & token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('c6group_refresh_token');
        if (!refreshToken) {
          localStorage.removeItem('c6group_token');
          localStorage.removeItem('c6group_refresh_token');
          localStorage.removeItem('c6group_user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('c6group_token', token);
        localStorage.setItem('c6group_refresh_token', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('c6group_token');
        localStorage.removeItem('c6group_refresh_token');
        localStorage.removeItem('c6group_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status === 403) console.error('Access forbidden:', error.response.data);
    if (error.response?.status === 429) console.error('Rate limit exceeded:', error.response.data);
    if (!error.response) console.error('Network error - API server may be unavailable');
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string; companyName?: string; industry?: string }) => (await apiClient.post('/auth/register', data)).data,
  login: async (data: { email: string; password: string }) => (await apiClient.post('/auth/login', data)).data,
  logout: async () => (await apiClient.post('/auth/logout')).data,
  me: async () => (await apiClient.get('/auth/me')).data,
  refresh: async (refreshToken: string) => (await apiClient.post('/auth/refresh', { refreshToken })).data,
};

export const aiApi = {
  executeAgent: async (data: { agentType: string; parameters: Record<string, unknown>; context?: Record<string, unknown> }) => (await apiClient.post('/ai/execute', data)).data,
  runAudit: async (data: Record<string, unknown>) => (await apiClient.post('/ai/audit', data)).data,
  generateContent: async (data: { contentType: string; topic: string; targetAudience: string; [key: string]: unknown }) => (await apiClient.post('/ai/content', data)).data,
  analyzeSEO: async (data: { websiteUrl: string; businessType: string; location?: string; targetKeywords?: string[]; competitors?: string[] }) => (await apiClient.post('/ai/seo', data)).data,
  generateEmail: async (data: { emailType: string; recipient: Record<string, unknown>; purpose: string; keyMessage: string; offer?: Record<string, unknown>; tone?: string }) => (await apiClient.post('/ai/email', data)).data,
  chat: async (data: { businessContext: Record<string, unknown>; conversationHistory: Array<{ role: string; content: string }>; userMessage: string; userInfo?: Record<string, unknown> }) => (await apiClient.post('/ai/chat', data)).data,
  getAgents: async () => (await apiClient.get('/ai/agents')).data,
  getAgentDetails: async (agentType: string) => (await apiClient.get(`/ai/agents/${agentType}`)).data,
  getUsage: async () => (await apiClient.get('/ai/usage')).data,
};

export const subscriptionApi = {
  getCurrent: async () => (await apiClient.get('/subscriptions/current')).data,
  create: async (data: { packageId: string; billingCycle: string; paymentMethod: string }) => (await apiClient.post('/subscriptions', data)).data,
  upgrade: async (data: { packageId: string; billingCycle: string }) => (await apiClient.post('/subscriptions/upgrade', data)).data,
  cancel: async () => (await apiClient.post('/subscriptions/cancel')).data,
  getPackages: async () => (await apiClient.get('/subscriptions/packages')).data,
};

export const paymentApi = {
  createPayment: async (data: { amount: number; currency?: string; paymentMethod: string; description: string; metadata?: Record<string, unknown> }) => (await apiClient.post('/payments', data)).data,
  getPaymentStatus: async (paymentId: string) => (await apiClient.get(`/payments/${paymentId}/status`)).data,
  getPaymentMethods: async () => (await apiClient.get('/payments/methods')).data,
  getHistory: async () => (await apiClient.get('/payments/history')).data,
};

export const userApi = {
  getProfile: async () => (await apiClient.get('/users/profile')).data,
  updateProfile: async (data: Record<string, unknown>) => (await apiClient.put('/users/profile', data)).data,
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => (await apiClient.post('/users/change-password', data)).data,
};

export const analyticsApi = {
  getDashboard: async () => (await apiClient.get('/analytics/dashboard')).data,
  getRevenue: async (period?: string) => (await apiClient.get('/analytics/revenue', { params: { period } })).data,
  getCustomers: async () => (await apiClient.get('/analytics/customers')).data,
  getAIUsage: async () => (await apiClient.get('/analytics/ai-usage')).data,
};

export const aiToolsApi = {
  getAll: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => (await apiClient.get('/ai-tools', { params })).data,
  getById: async (id: string) => (await apiClient.get(`/ai-tools/${id}`)).data,
  getCategories: async () => (await apiClient.get('/ai-tools/categories')).data,
  getFeatured: async () => (await apiClient.get('/ai-tools/featured')).data,
  getPopular: async () => (await apiClient.get('/ai-tools/popular')).data,
};

export const whatsappApi = {
  sendMessage: async (data: { message: string; phoneNumber?: string; type?: 'text' | 'template' }) => (await apiClient.post('/whatsapp/send', data)).data,
  getConversations: async () => (await apiClient.get('/whatsapp/conversations')).data,
  getTemplates: async () => (await apiClient.get('/whatsapp/templates')).data,
};

export { apiClient };

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`);
    return response.data;
  } catch {
    return { status: 'unavailable' };
  }
};
