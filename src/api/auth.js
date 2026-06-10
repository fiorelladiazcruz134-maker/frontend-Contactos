import { USE_LOCAL_DATA } from './config';
import { apiClient } from './apiClient';
import { authService as mockAuthService } from '../services/authService';

export const apiAuth = {
  login: (email, password) => {
    if (USE_LOCAL_DATA) {
      return mockAuthService.login(email, password);
    }
    return apiClient.post('/auth/login', { email, password });
  }
};
