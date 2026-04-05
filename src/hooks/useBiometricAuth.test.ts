import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { useBiometricAuth } from './useBiometricAuth';

// Mock expo-local-authentication
const mockHasHardwareAsync = jest.fn();
const mockIsEnrolledAsync = jest.fn();
const mockSupportedAuthenticationTypesAsync = jest.fn();
const mockAuthenticateAsync = jest.fn();

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: (...args: any[]) => mockHasHardwareAsync(...args),
  isEnrolledAsync: (...args: any[]) => mockIsEnrolledAsync(...args),
  supportedAuthenticationTypesAsync: (...args: any[]) => mockSupportedAuthenticationTypesAsync(...args),
  authenticateAsync: (...args: any[]) => mockAuthenticateAsync(...args),
  AuthenticationType: {
    FACIAL_RECOGNITION: 1,
    FINGERPRINT: 2,
    IRIS: 3,
  },
}));

// Mock expo-secure-store
const mockGetItemAsync = jest.fn();
const mockSetItemAsync = jest.fn();
const mockDeleteItemAsync = jest.fn();

jest.mock('expo-secure-store', () => ({
  getItemAsync: (...args: any[]) => mockGetItemAsync(...args),
  setItemAsync: (...args: any[]) => mockSetItemAsync(...args),
  deleteItemAsync: (...args: any[]) => mockDeleteItemAsync(...args),
}));

// Mock expo-application
const mockGetIosIdForVendorAsync = jest.fn();

jest.mock('expo-application', () => ({
  getIosIdForVendorAsync: (...args: any[]) => mockGetIosIdForVendorAsync(...args),
  getAndroidId: jest.fn(() => 'android-device-id-mock'),
}));

// Mock api
const mockApiPost = jest.fn();
const mockApiPatch = jest.fn();

jest.mock('src/services/api', () => ({
  api: {
    post: (...args: any[]) => mockApiPost(...args),
    patch: (...args: any[]) => mockApiPatch(...args),
  },
}));

describe('useBiometricAuth', () => {
  const futureDate = new Date(Date.now() + 86400000).toISOString(); // +1 dia
  const pastDate = new Date(Date.now() - 86400000).toISOString(); // -1 dia

  const validTokenData = JSON.stringify({
    biometricToken: 'valid-token-123',
    userId: 'user-123',
    expiresAt: futureDate,
  });

  const expiredTokenData = JSON.stringify({
    biometricToken: 'expired-token',
    userId: 'user-123',
    expiresAt: pastDate,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Defaults para inicializacao bem sucedida
    mockHasHardwareAsync.mockResolvedValue(true);
    mockIsEnrolledAsync.mockResolvedValue(true);
    mockSupportedAuthenticationTypesAsync.mockResolvedValue([1]); // FACIAL_RECOGNITION
    mockGetItemAsync.mockResolvedValue(null);
    mockSetItemAsync.mockResolvedValue(undefined);
    mockDeleteItemAsync.mockResolvedValue(undefined);
  });

  describe('inicializacao', () => {
    it('deve verificar disponibilidade biometrica na montagem', async () => {
      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockHasHardwareAsync).toHaveBeenCalled();
      expect(mockIsEnrolledAsync).toHaveBeenCalled();
      expect(result.current.isAvailable).toBe(true);
    });

    it('deve definir isLoading como false apos inicializacao', async () => {
      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('deve identificar Face ID no iOS', async () => {
      (Platform as any).OS = 'ios';
      mockSupportedAuthenticationTypesAsync.mockResolvedValue([1]); // FACIAL_RECOGNITION

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('Face ID');
    });

    it('deve identificar Reconhecimento Facial no Android', async () => {
      (Platform as any).OS = 'android';
      mockSupportedAuthenticationTypesAsync.mockResolvedValue([1]); // FACIAL_RECOGNITION

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('Reconhecimento Facial');
    });

    it('deve identificar Touch ID no iOS', async () => {
      (Platform as any).OS = 'ios';
      mockSupportedAuthenticationTypesAsync.mockResolvedValue([2]); // FINGERPRINT

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('Touch ID');
    });

    it('deve identificar Impressao Digital no Android', async () => {
      (Platform as any).OS = 'android';
      mockSupportedAuthenticationTypesAsync.mockResolvedValue([2]); // FINGERPRINT

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('Impressao Digital');
    });

    it('deve identificar Iris como tipo biometrico', async () => {
      mockSupportedAuthenticationTypesAsync.mockResolvedValue([3]); // IRIS

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('Iris');
    });

    it('deve usar tipo generico Biometria quando tipo nao e reconhecido', async () => {
      mockSupportedAuthenticationTypesAsync.mockResolvedValue([99]);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('Biometria');
    });
  });

  describe('checkBiometricAvailability', () => {
    it('deve retornar false quando dispositivo nao possui hardware biometrico', async () => {
      mockHasHardwareAsync.mockResolvedValue(false);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAvailable).toBe(false);
    });

    it('deve retornar false quando nenhuma biometria esta cadastrada', async () => {
      mockHasHardwareAsync.mockResolvedValue(true);
      mockIsEnrolledAsync.mockResolvedValue(false);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAvailable).toBe(false);
    });

    it('deve retornar false e tratar erro na verificacao de disponibilidade', async () => {
      mockHasHardwareAsync.mockRejectedValue(new Error('Hardware error'));

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAvailable).toBe(false);
    });
  });

  describe('checkBiometricEnabled', () => {
    it('deve retornar false quando nao existe token armazenado', async () => {
      mockGetItemAsync.mockResolvedValue(null);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);
    });

    it('deve retornar true quando existe token valido', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(true);
    });

    it('deve retornar false e remover token expirado', async () => {
      mockGetItemAsync.mockResolvedValue(expiredTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);
      expect(mockDeleteItemAsync).toHaveBeenCalledWith('examinus_biometric_token');
    });

    it('deve retornar false quando token pertence a outro usuario', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let checkResult: boolean = false;
      await act(async () => {
        checkResult = await result.current.checkBiometricEnabled('outro-user-id');
      });

      expect(checkResult).toBe(false);
    });

    it('deve retornar true quando token pertence ao usuario atual', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let checkResult: boolean = false;
      await act(async () => {
        checkResult = await result.current.checkBiometricEnabled('user-123');
      });

      expect(checkResult).toBe(true);
    });

    it('deve retornar false e tratar erro na verificacao de status', async () => {
      mockGetItemAsync.mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);
    });
  });

  describe('enableBiometric', () => {
    beforeEach(() => {
      mockAuthenticateAsync.mockResolvedValue({ success: true });
      mockGetIosIdForVendorAsync.mockResolvedValue('ios-device-id');
      mockApiPost.mockResolvedValue({
        data: {
          data: {
            biometricToken: 'new-bio-token',
            userId: 'user-123',
            expiresAt: futureDate,
          },
        },
      });
    });

    it('deve habilitar biometria com sucesso', async () => {
      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(true);
      expect(result.current.isEnabled).toBe(true);
      expect(mockSetItemAsync).toHaveBeenCalledWith(
        'examinus_biometric_token',
        expect.any(String)
      );
    });

    it('deve retornar erro quando biometria nao esta disponivel', async () => {
      mockHasHardwareAsync.mockResolvedValue(false);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(false);
      expect(enableResult.error).toContain('disponível');
    });

    it('deve retornar erro quando autenticacao local falha', async () => {
      mockAuthenticateAsync.mockResolvedValue({ success: false });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(false);
      expect(enableResult.error).toContain('cancelada');
    });

    it('deve retornar erro de sessao expirada quando API retorna 401', async () => {
      mockApiPost.mockRejectedValue({
        response: { status: 401, data: {} },
        message: 'Unauthorized',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(false);
      expect(enableResult.error).toContain('Sessão expirada');
    });

    it('deve retornar mensagem de erro da API quando disponivel', async () => {
      mockApiPost.mockRejectedValue({
        response: { status: 500, data: { message: 'Erro interno do servidor' } },
        message: 'Server error',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(false);
      expect(enableResult.error).toBe('Erro interno do servidor');
    });

    it('deve retornar mensagem de erro de errors array da API', async () => {
      mockApiPost.mockRejectedValue({
        response: { status: 422, data: { errors: [{ message: 'Campo invalido' }] } },
        message: 'Validation error',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(false);
      expect(enableResult.error).toBe('Campo invalido');
    });

    it('deve retornar mensagem de erro title da API', async () => {
      mockApiPost.mockRejectedValue({
        response: { status: 500, data: { title: 'Titulo do erro' } },
        message: 'Server error',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(false);
      expect(enableResult.error).toBe('Titulo do erro');
    });

    it('deve retornar mensagem de erro generica quando nenhuma mensagem da API', async () => {
      mockApiPost.mockRejectedValue({
        response: { status: 500, data: {} },
        message: 'Network Error',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let enableResult: any;
      await act(async () => {
        enableResult = await result.current.enableBiometric('user@test.com');
      });

      expect(enableResult.success).toBe(false);
      expect(enableResult.error).toBe('Network Error');
    });
  });

  describe('disableBiometric', () => {
    it('deve desabilitar biometria com sucesso via API', async () => {
      mockApiPatch.mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let disableResult: boolean = false;
      await act(async () => {
        disableResult = await result.current.disableBiometric('user-123');
      });

      expect(disableResult).toBe(true);
      expect(mockApiPatch).toHaveBeenCalledWith('authentication/biometric/disable/user-123');
      expect(mockDeleteItemAsync).toHaveBeenCalledWith('examinus_biometric_token');
      expect(result.current.isEnabled).toBe(false);
    });

    it('deve remover token local mesmo quando API falha', async () => {
      mockApiPatch.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let disableResult: boolean = false;
      await act(async () => {
        disableResult = await result.current.disableBiometric('user-123');
      });

      expect(disableResult).toBe(true);
      expect(mockDeleteItemAsync).toHaveBeenCalledWith('examinus_biometric_token');
      expect(result.current.isEnabled).toBe(false);
    });
  });

  describe('authenticateWithBiometric', () => {
    it('deve retornar erro quando nao existe token armazenado', async () => {
      mockGetItemAsync.mockResolvedValue(null);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(false);
      expect(authResult.error).toContain('habilitada');
    });

    it('deve retornar erro e limpar token quando expirado', async () => {
      mockGetItemAsync.mockResolvedValue(expiredTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(false);
      expect(authResult.error).toContain('expirado');
      expect(mockDeleteItemAsync).toHaveBeenCalled();
    });

    it('deve retornar erro quando autenticacao local falha por cancelamento', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);
      mockAuthenticateAsync.mockResolvedValue({ success: false, error: 'user_cancel' });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(false);
      expect(authResult.error).toContain('cancelada');
    });

    it('deve retornar erro quando autenticacao local falha por outro motivo', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);
      mockAuthenticateAsync.mockResolvedValue({ success: false, error: 'lockout' });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(false);
      expect(authResult.error).toContain('Falha na autenticacao');
    });

    it('deve autenticar com sucesso e retornar dados do usuario', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);
      mockAuthenticateAsync.mockResolvedValue({ success: true });
      mockApiPost.mockResolvedValue({
        data: {
          data: {
            userId: 'user-123',
            name: 'Joao',
            fullName: 'Joao Silva',
            email: 'joao@test.com',
            token: 'jwt-token-123',
          },
        },
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(true);
      expect(authResult.userData).toEqual({
        userId: 'user-123',
        name: 'Joao',
        fullName: 'Joao Silva',
        email: 'joao@test.com',
        token: 'jwt-token-123',
      });
    });

    it('deve limpar token quando API retorna 400', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);
      mockAuthenticateAsync.mockResolvedValue({ success: true });
      mockApiPost.mockRejectedValue({
        response: { status: 400, data: {} },
        message: 'Bad request',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(false);
      expect(authResult.error).toContain('invalido');
      expect(mockDeleteItemAsync).toHaveBeenCalled();
    });

    it('deve limpar token quando API retorna 401', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);
      mockAuthenticateAsync.mockResolvedValue({ success: true });
      mockApiPost.mockRejectedValue({
        response: { status: 401, data: {} },
        message: 'Unauthorized',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(false);
      expect(authResult.error).toContain('invalido');
    });

    it('deve retornar erro generico quando API falha com outro status', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);
      mockAuthenticateAsync.mockResolvedValue({ success: true });
      mockApiPost.mockRejectedValue({
        response: { status: 500, data: {} },
        message: 'Server error',
      });

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: any;
      await act(async () => {
        authResult = await result.current.authenticateWithBiometric();
      });

      expect(authResult.success).toBe(false);
      expect(authResult.error).toContain('Tente novamente');
    });
  });

  describe('canUseBiometricLogin', () => {
    it('deve retornar false quando nao existe token armazenado', async () => {
      mockGetItemAsync.mockResolvedValue(null);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let canUse: boolean = false;
      await act(async () => {
        canUse = await result.current.canUseBiometricLogin();
      });

      expect(canUse).toBe(false);
    });

    it('deve retornar true quando token valido existe', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let canUse: boolean = false;
      await act(async () => {
        canUse = await result.current.canUseBiometricLogin();
      });

      expect(canUse).toBe(true);
    });

    it('deve retornar false quando token esta expirado', async () => {
      mockGetItemAsync.mockResolvedValue(expiredTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let canUse: boolean = false;
      await act(async () => {
        canUse = await result.current.canUseBiometricLogin();
      });

      expect(canUse).toBe(false);
    });

    it('deve retornar false quando ocorre erro ao ler o storage', async () => {
      mockGetItemAsync.mockRejectedValue(new Error('Read error'));

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Reset para simular erro no canUseBiometricLogin
      mockGetItemAsync.mockRejectedValue(new Error('Read error'));

      let canUse: boolean = true;
      await act(async () => {
        canUse = await result.current.canUseBiometricLogin();
      });

      expect(canUse).toBe(false);
    });
  });

  describe('clearBiometricData', () => {
    it('deve limpar dados biometricos com sucesso', async () => {
      mockGetItemAsync.mockResolvedValue(validTokenData);

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.clearBiometricData();
      });

      expect(mockDeleteItemAsync).toHaveBeenCalledWith('examinus_biometric_token');
      expect(result.current.isEnabled).toBe(false);
    });

    it('deve tratar erro ao limpar dados sem lancar excecao', async () => {
      mockDeleteItemAsync.mockRejectedValue(new Error('Delete error'));

      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Nao deve lancar excecao
      await act(async () => {
        await result.current.clearBiometricData();
      });

      expect(mockDeleteItemAsync).toHaveBeenCalled();
    });
  });

  describe('retorno do hook', () => {
    it('deve retornar todas as propriedades e funcoes esperadas', async () => {
      const { result } = renderHook(() => useBiometricAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Estado
      expect(result.current).toHaveProperty('isAvailable');
      expect(result.current).toHaveProperty('isEnabled');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('biometricType');

      // Acoes
      expect(typeof result.current.enableBiometric).toBe('function');
      expect(typeof result.current.disableBiometric).toBe('function');
      expect(typeof result.current.authenticateWithBiometric).toBe('function');
      expect(typeof result.current.canUseBiometricLogin).toBe('function');
      expect(typeof result.current.clearBiometricData).toBe('function');

      // Utilitarios
      expect(typeof result.current.checkBiometricAvailability).toBe('function');
      expect(typeof result.current.checkBiometricEnabled).toBe('function');
    });
  });
});
