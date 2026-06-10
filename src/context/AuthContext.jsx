import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiAuth } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Refresh token simulator
  useEffect(() => {
    if (!token) return;

    // Refrescamos el token cada 14 minutos (simulación)
    const interval = setInterval(() => {
      console.log('Simulando refresh del token...');
      const newToken = `fake-jwt-token-${user?.id}-${Date.now()}`;
      setToken(newToken);
      sessionStorage.setItem('token', newToken);
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, user]);

  // loguea y guarda todo
  const login = async (email, password) => {
    const data = await apiAuth.login(email, password);
    setUser(data.user);
    setToken(data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    sessionStorage.setItem('token', data.token);
  };

  // borra todo para salir
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login', { replace: true });
  }, [navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Cargando aplicación...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
