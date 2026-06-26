// ============================================
// C6GROUP Authentication Context
// Provides auth state, login, register, logout
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/services/api';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  industry?: string;
  role: string;
  packageType: string;
  isEmailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  industry?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage helpers
const storage = {
  getToken: () => localStorage.getItem('c6group_token'),
  getRefreshToken: () => localStorage.getItem('c6group_refresh_token'),
  getUser: (): User | null => {
    const user = localStorage.getItem('c6group_user');
    return user ? JSON.parse(user) : null;
  },
  setToken: (token: string) => localStorage.setItem('c6group_token', token),
  setRefreshToken: (token: string) => localStorage.setItem('c6group_refresh_token', token),
  setUser: (user: User) => localStorage.setItem('c6group_user', JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem('c6group_token');
    localStorage.removeItem('c6group_refresh_token');
    localStorage.removeItem('c6group_user');
  },
};

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: storage.getUser(),
    isAuthenticated: !!storage.getToken(),
    isLoading: false,
    isInitialized: false,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken();
      if (token) {
        try {
          const response = await authApi.me();
          if (response.success && response.data) {
            const user = response.data as User;
            storage.setUser(user);
            setState((prev) => ({
              ...prev,
              user,
              isAuthenticated: true,
              isInitialized: true,
            }));
          } else {
            storage.clear();
            setState((prev) => ({
              ...prev,
              user: null,
              isAuthenticated: false,
              isInitialized: true,
            }));
          }
        } catch {
          storage.clear();
          setState((prev) => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isInitialized: true,
          }));
        }
      } else {
        setState((prev) => ({ ...prev, isInitialized: true }));
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authApi.login({ email, password });
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data as {
          user: User;
          token: string;
          refreshToken: string;
        };
        storage.setToken(token);
        storage.setRefreshToken(refreshToken);
        storage.setUser(user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        toast.success('Welcome back!', { description: `Logged in as ${user.firstName}` });
      }
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const message = error.response?.data?.error?.message || 'Login failed. Please try again.';
      toast.error('Login failed', { description: message });
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authApi.register(data);
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data as {
          user: User;
          token: string;
          refreshToken: string;
        };
        storage.setToken(token);
        storage.setRefreshToken(refreshToken);
        storage.setUser(user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        toast.success('Account created!', { description: 'Welcome to C6GROUP' });
      }
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      const message = error.response?.data?.error?.message || 'Registration failed. Please try again.';
      toast.error('Registration failed', { description: message });
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      storage.clear();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        const user = response.data as User;
        storage.setUser(user);
        setState((prev) => ({ ...prev, user }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  // Update user directly
  const updateUser = useCallback((user: User) => {
    storage.setUser(user);
    setState((prev) => ({ ...prev, user }));
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route helper
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isInitialized, isAuthenticated, redirectTo]);

  return { isAuthenticated, isInitialized };
}
