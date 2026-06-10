import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// 1 min pa pruebas, en prod poner más
const TIMEOUT_MS = 60 * 1000; 

export function useIdleTimeout() {
  const { isAuthenticated, logout } = useAuth();
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        console.warn('Sesión expirada por inactividad.');
        logout();
      }, TIMEOUT_MS);
    }
  };

  useEffect(() => {
    // ni iniciar si no esta logeado
    if (!isAuthenticated) return;

    // reset si hace algo de esto
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    const handleEvent = () => resetTimeout();

    events.forEach(event => {
      window.addEventListener(event, handleEvent);
    });

    resetTimeout();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [isAuthenticated, logout]);
}
