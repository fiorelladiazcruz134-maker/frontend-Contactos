import { API_BASE_URL } from './config';

class ApiClient {
  async request(endpoint, options = {}) {
    const token = sessionStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Auto logout on 401 Unauthorized
      if (response.status === 401) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada o no autorizada.');
      }

      const data = await response.json().catch(() => null);
      
      if (!response.ok) {
        throw data || new Error('Error en la petición al servidor.');
      }
      
      return data;
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }
  
  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
