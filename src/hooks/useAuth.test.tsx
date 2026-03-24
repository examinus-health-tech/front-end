import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useAuth } from './useAuth';
import { AuthContext } from '../contexts/AuthContext';

describe('useAuth', () => {
  const mockContextValue = {
    user: { userId: 'user-123', name: 'Test', email: 'test@test.com', token: 'jwt-token' },
    isLoading: false,
    isAuthReady: true,
    error: null,
    signIn: jest.fn(),
    signInWithBiometric: jest.fn(),
    signInWithGoogle: jest.fn(),
    signUpWithGoogle: jest.fn(),
    signInWithApple: jest.fn(),
    signUpWithApple: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    forgotPassword: jest.fn(),
    verifyCode: jest.fn(),
    resetPassword: jest.fn(),
    deleteAccount: jest.fn(),
    clearError: jest.fn(),
    getUserInfo: jest.fn(),
    updateUserPhoto: jest.fn(),
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={mockContextValue}>
      {children}
    </AuthContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quando usado dentro do AuthProvider', () => {
    it('deve retornar o contexto de autenticacao', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('deve retornar dados do usuario', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toEqual({
        userId: 'user-123',
        name: 'Test',
        email: 'test@test.com',
        token: 'jwt-token',
      });
    });

    it('deve retornar estado de carregamento', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve retornar estado de autenticacao pronta', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthReady).toBe(true);
    });

    it('deve retornar erro como null quando nao ha erro', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.error).toBeNull();
    });

    it('deve retornar funcao signIn', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signIn).toBe('function');
    });

    it('deve retornar funcao signOut', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signOut).toBe('function');
    });

    it('deve retornar funcao signUp', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signUp).toBe('function');
    });

    it('deve retornar funcao signInWithBiometric', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signInWithBiometric).toBe('function');
    });

    it('deve retornar funcao signInWithGoogle', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signInWithGoogle).toBe('function');
    });

    it('deve retornar funcao signUpWithGoogle', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signUpWithGoogle).toBe('function');
    });

    it('deve retornar funcao signInWithApple', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signInWithApple).toBe('function');
    });

    it('deve retornar funcao signUpWithApple', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.signUpWithApple).toBe('function');
    });

    it('deve retornar funcao forgotPassword', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.forgotPassword).toBe('function');
    });

    it('deve retornar funcao verifyCode', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.verifyCode).toBe('function');
    });

    it('deve retornar funcao resetPassword', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.resetPassword).toBe('function');
    });

    it('deve retornar funcao deleteAccount', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.deleteAccount).toBe('function');
    });

    it('deve retornar funcao clearError', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.clearError).toBe('function');
    });

    it('deve retornar funcao getUserInfo', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.getUserInfo).toBe('function');
    });

    it('deve retornar funcao updateUserPhoto', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.updateUserPhoto).toBe('function');
    });
  });

  describe('quando usado fora do AuthProvider', () => {
    it('deve retornar contexto padrao vazio quando usado fora do AuthProvider', () => {
      // O AuthContext e criado com {} como valor padrao, entao nao lanca erro
      // mas retorna um objeto vazio sem as funcoes esperadas
      const { result } = renderHook(() => useAuth());

      // Contexto padrao e um objeto vazio (sem user, sem funcoes)
      expect(result.current).toBeDefined();
      expect(result.current.user).toBeUndefined();
    });
  });

  describe('com diferentes estados de contexto', () => {
    it('deve retornar user null quando usuario nao esta logado', () => {
      const loggedOutContext = {
        ...mockContextValue,
        user: null,
        isAuthReady: true,
      };

      const loggedOutWrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthContext.Provider value={loggedOutContext}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper: loggedOutWrapper });

      expect(result.current.user).toBeNull();
    });

    it('deve retornar isLoading true durante carregamento', () => {
      const loadingContext = {
        ...mockContextValue,
        isLoading: true,
      };

      const loadingWrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthContext.Provider value={loadingContext}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper: loadingWrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('deve retornar erro quando presente', () => {
      const errorContext = {
        ...mockContextValue,
        error: 'Credenciais invalidas',
      };

      const errorWrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthContext.Provider value={errorContext}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper: errorWrapper });

      expect(result.current.error).toBe('Credenciais invalidas');
    });
  });
});
