 // context/SessionContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
    try {
      // First check if we have user data in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      }

      // If no stored user, try to get session from backend
      const response = await axios.get('http://localhost:9001/admin/users/session', {
        withCredentials: true,
      });
      
      if (response.data) {
        // Normalize the user data structure
        const userData = response.data;
        const normalizedUser = {
          id: userData.id || userData.adminId || '',
          email: userData.email || userData.Email || '',
          role: userData.role || '',
          fullName: userData.fullName || ''
        };
        
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }
    } catch (error: any) {
      console.error('Session check failed:', error);
      
      // Handle specific error cases
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        console.error('Backend server is not reachable. Make sure it\'s running on port 9001.');
      } else if (error.response?.status === 401) {
        console.log('No active session found');
      }
      
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:9001/admin/users/login', {
        email,
        password
      }, {
        withCredentials: true,
      });

      if (response.data) {
        // The backend returns { role: string, user: any }
        const { role, user: userData } = response.data;
        
        // Normalize the user object
        const normalizedUser = {
          id: userData.id || userData.adminId || '',
          email: userData.email || userData.Email || '',
          role: role,
          fullName: userData.fullName || ''
        };
        
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        // Redirect based on role
        switch (role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'employee':
            router.push('/employee/dashboard');
            break;
          case 'hr':
            router.push('/hr/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 9001.');
      }
      
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:9001/admin/users/logout', {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      router.push('/signin');
    }
  };

  useEffect(() => {
    // Check session on component mount
    checkSession();
  }, []);

  return (
    <SessionContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </SessionContext.Provider>
  );
};