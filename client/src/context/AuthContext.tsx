import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/index.js';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isContributor: boolean;
  login: (email: string, pass: string) => Promise<void>;
  superAdminLogin: (email: string, pass: string) => Promise<void>;
  studentLogin: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ devResetCode?: string; message: string }>;
  resetPassword: (email: string, resetCode: string, newPassword: string) => Promise<{ message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('borno_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('borno_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = Boolean(token && user);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'ADMIN' ||
    user?.role === 'DATA_EDITOR' ||
    user?.role === 'DATA_REVIEWER' ||
    user?.role === 'MODERATOR';
  const isContributor =
    user?.role === 'CONTRIBUTOR' ||
    user?.role === 'MODERATOR' ||
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN';

  const login = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('borno_token', data.token);
    localStorage.setItem('borno_user', JSON.stringify(data.user));
  };

  const superAdminLogin = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/super-admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Super Admin authentication failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('borno_token', data.token);
    localStorage.setItem('borno_user', JSON.stringify(data.user));
  };

  const studentLogin = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/student/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Student authentication failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('borno_token', data.token);
    localStorage.setItem('borno_user', JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('borno_token', data.token);
    localStorage.setItem('borno_user', JSON.stringify(data.user));
  };

  const requestPasswordReset = async (email: string) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to request password reset');
    return data;
  };

  const resetPassword = async (email: string, resetCode: string, newPassword: string) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetCode, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset password');
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('borno_token');
    localStorage.removeItem('borno_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isContributor,
        login,
        superAdminLogin,
        studentLogin,
        register,
        requestPasswordReset,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
