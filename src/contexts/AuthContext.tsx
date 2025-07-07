import { createContext, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/services/api';

interface User {
  userId?: string;
  name?: string;
  token?: string;
}

interface AuthContextData {
  user?: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, confirmationPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  resetPassword: (newPassword: string, confirmationPassword: string) => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem('@app:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(userName: string, password: string) {
    try {
      setIsLoading(true);

      const response = await api.post('authentication', {
        userName,
        password,
      });

      const { data } = response;
      const userData = data.data;

      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(fullname: string, email: string, password: string, confirmationPassword: string) {
    try {
      setIsLoading(true);

      const response = await api.post('users', {
        fullname,
        email,
        password,
        confirmationPassword,
      });

      const { data } = response;

      if (!response) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      const userData = data.data;

      console.log('!@# 🚀 ~ signUp ~ data:', data);

      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('@app:user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async function forgotPassword(email: string) {
    try {
      setIsLoading(true);

      await api.post('password-reset/request', {
        email,
      });

      const userData = { name: email };

      setUser(userData);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode(code: string) {
    try {
      setIsLoading(true);

      await api.post('password-reset/verify', {
        email: user?.name,
        code,
      });

      setResetCode(code);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(newPassword: string, confirmationPassword: string) {
    try {
      setIsLoading(true);

      await api.post('password-reset/password-confirm-reset', {
        email: user?.name,
        code: resetCode,
        newPassword,
        confirmationPassword,
      });
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        clearError,
        isLoading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        verifyCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
