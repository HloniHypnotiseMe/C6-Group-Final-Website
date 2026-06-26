// ============================================
// C6GROUP API Service Layer
// Centralized HTTP client with auth interceptors
// ============================================

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('c6group_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add request ID for tracing
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

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('c6group_refresh_token');
        if (!refreshToken) {
          // No refresh token, logout user
          localStorage.removeItem('c6group_token');
          localStorage.removeItem('c6group_refresh_token');
          localStorage.removeItem('c6group_user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens
        localStorage.setItem('c6group_token', token);
        localStorage.setItem('c6group_refresh_token', newRefreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('c6group_token');
        localStorage.removeItem('c6group_refresh_token');
        localStorage.removeItem('c6group_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 429 Rate Limit
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded:', error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - API server may be unavailable');
    }

    return Promise.reject(error);
  }
);

// ============================================
// Auth API
// ============================================
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    companyName?: string;
    industry?: string;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

// ============================================
// AI API
// ============================================
export const aiApi = {
  executeAgent: async (data: {
    agentType: string;
    parameters: Record<string, unknown>;
    context?: Record<string, unknown>;
  }) => {
    const response = await apiClient.post('/ai/execute', data);
    return response.data;
  },

  runAudit: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/ai/audit', data);
    return response.data;
  },

  generateContent: async (data: {
    contentType: string;
    topic: string;
    targetAudience: string;
    [key: string]: unknown;
  }) => {
    const response = await apiClient.post('/ai/content', data);
    return response.data;
  },

  analyzeSEO: async (data: {
    websiteUrl: string;
    businessType: string;
    location?: string;
    targetKeywords?: string[];
    competitors?: string[];
  }) => {
    const response = await apiClient.post('/ai/seo', data);
    return response.data;
  },

  generateEmail: async (data: {
    emailType: string;
    recipient: Record<string, unknown>;
    purpose: string;
    keyMessage: string;
    offer?: Record<string, unknown>;
    tone?: string;
  }) => {
    const response = await apiClient.post('/ai/email', data);
    return response.data;
  },

  chat: async (data: {
    businessContext: Record<string, unknown>;
    conversationHistory: Array<{ role: string; content: string }>;
    userMessage: string;
    userInfo?: Record<string, unknown>;
  }) => {
    const response = await apiClient.post('/ai/chat', data);
    return response.data;
  },

  getAgents: async () => {
    const response = await apiClient.get('/ai/agents');
    return response.data;
  },

  getAgentDetails: async (agentType: string) => {
    const response = await apiClient.get(`/ai/agents/${agentType}`);
    return response.data;
  },

  getUsage: async () => {
    const response = await apiClient.get('/ai/usage');
    return response.data;
  },
};

// ============================================
// Subscription API
// ============================================
export const subscriptionApi = {
  getCurrent: async () => {
    const response = await apiClient.get('/subscriptions/current');
    return response.data;
  },

  create: async (data: {
    packageId: string;
    billingCycle: string;
    paymentMethod: string;
  }) => {
    const response = await apiClient.post('/subscriptions', data);
    return response.data;
  },

  upgrade: async (data: { packageId: string; billingCycle: string }) => {
    const response = await apiClient.post('/subscriptions/upgrade', data);
    return response.data;
  },

  cancel: async () => {
    const response = await apiClient.post('/subscriptions/cancel');
    return response.data;
  },

  getPackages: async () => {
    const response = await apiClient.get('/subscriptions/packages');
    return response.data;
  },
};

// ============================================
// Payment API (RemotePay)
// ============================================
export const paymentApi = {
  createPayment: async (data: {
    amount: number;
    currency?: string;
    paymentMethod: string;
    description: string;
    metadata?: Record<string, unknown>;
  }) => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },

  getPaymentStatus: async (paymentId: string) => {
    const response = await apiClient.get(`/payments/${paymentId}/status`);
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await apiClient.get('/payments/methods');
    return response.data;
  },

  getHistory: async () => {
    const response = await apiClient.get('/payments/history');
    return response.data;
  },
};

// ============================================
// User API
// ============================================
export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: Record<string, unknown>) => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.post('/users/change-password', data);
    return response.data;
  },
};

// ============================================
// Analytics API
// ============================================
export const analyticsApi = {
  getDashboard: async () => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  getRevenue: async (period?: string) => {
    const response = await apiClient.get('/analytics/revenue', { params: { period } });
    return response.data;
  },

  getCustomers: async () => {
    const response = await apiClient.get('/analytics/customers');
    return response.data;
  },

  getAIUsage: async () => {
    const response = await apiClient.get('/analytics/ai-usage');
    return response.data;
  },
};

// ============================================
// AI Tools API
// ============================================
export const aiToolsApi = {
  getAll: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/ai-tools', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/ai-tools/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/ai-tools/categories');
    return response.data;
  },

  getFeatured: async () => {
    const response = await apiClient.get('/ai-tools/featured');
    return response.data;
  },

  getPopular: async () => {
    const response = await apiClient.get('/ai-tools/popular');
    return response.data;
  },
};

// ============================================
// WhatsApp API
// ============================================
export const whatsappApi = {
  sendMessage: async (data: {
    message: string;
    phoneNumber?: string;
    type?: 'text' | 'template';
  }) => {
    const response = await apiClient.post('/whatsapp/send', data);
    return response.data;
  },

  getConversations: async () => {
    const response = await apiClient.get('/whatsapp/conversations');
    return response.data;
  },

  getTemplates: async () => {
    const response = await apiClient.get('/whatsapp/templates');
    return response.data;
  },
};

// Export the configured client for custom requests
export { apiClient };

// Health check
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`);
    return response.data;
  } catch {
    return { status: 'unavailable' };
  }
};
