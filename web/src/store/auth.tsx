import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Usuario, LoginResponse } from '@/types';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = sessionStorage.getItem('des_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    sessionStorage.setItem('des_token', data.token);
    sessionStorage.setItem('des_user', JSON.stringify(data.usuario));
    setUser(data.usuario);
    return data.usuario;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
