// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminSession } from '@/types/AdminSession';
import { verifySession, logout } from '@/lib/auth';

interface AuthContextType {
  session: AdminSession | null;
  isLoading: boolean;
  login: (session: AdminSession) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      const sessionId = localStorage.getItem('admin_session_id');
      
      if (sessionId) {
        try {
          const validSession = await verifySession(sessionId);
          if (validSession) {
            setSession(validSession);
          } else {
            localStorage.removeItem('admin_session_id');
          }
        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('admin_session_id');
        }
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // Auto-refresh session every 5 minutes to keep it active
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(async () => {
      const sessionId = localStorage.getItem('admin_session_id');
      if (sessionId) {
        try {
          const validSession = await verifySession(sessionId);
          if (validSession) {
            setSession(validSession);
          } else {
            setSession(null);
            localStorage.removeItem('admin_session_id');
          }
        } catch (error) {
          console.error('Session refresh error:', error);
          setSession(null);
          localStorage.removeItem('admin_session_id');
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [session]);

  const login = (newSession: AdminSession) => {
    setSession(newSession);
    localStorage.setItem('admin_session_id', newSession.id);
  };

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('admin_session_id');
    if (sessionId) {
      await logout(sessionId);
      localStorage.removeItem('admin_session_id');
    }
    setSession(null);
  };

  const value: AuthContextType = {
    session,
    isLoading,
    login,
    logout: handleLogout,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};