import apiClient from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};