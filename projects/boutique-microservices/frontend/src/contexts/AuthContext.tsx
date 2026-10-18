import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired' });
        }
      } else {
        dispatch({ type: 'LOGIN_SUCCESS', payload: null as any });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login({ email, password });
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message || 'Login failed' });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};