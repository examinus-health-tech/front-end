import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock useAuth
const mockSignInWithApple = jest.fn();
const mockSignUpWithApple = jest.fn();

jest.mock('./useAuth', () => ({
  useAuth: () => ({
    signInWithApple: mockSignInWithApple,
    signUpWithApple: mockSignUpWithApple,
  }),
}));

// Mock Apple Auth config
const mockIsAppleAuthAvailable = jest.fn();
const mockGetAppleConfig = jest.fn();

jest.mock('../config/appleAuth', () => ({
  isAppleAuthAvailable: () => mockIsAppleAuthAvailable(),
  getAppleConfig: () => mockGetAppleConfig(),
}));

// Mock expo-apple-authentication
const mockIsAvailableAsync = jest.fn();
const mockSignInAsync = jest.fn();

jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: (...args: any[]) => mockIsAvailableAsync(...args),
  signInAsync: (...args: any[]) => mockSignInAsync(...args),
  AppleAuthenticationScope: {
    FULL_NAME: 0,
    EMAIL: 1,
  },
}));

// Mock campaign service
const mockCheckCampaignVoucher = jest.fn();

jest.mock('@services/campaignService', () => ({
  checkCampaignVoucher: (...args: any[]) => mockCheckCampaignVoucher(...args),
}));

// Spy on Alert
jest.spyOn(Alert, 'alert');

import { useAppleAuth } from './useAppleAuth';

describe('useAppleAuth', () => {
  const validCredential = {
    user: 'apple-user-123',
    identityToken: 'apple-identity-token',
    fullName: { givenName: 'Joao', familyName: 'Silva' },
    email: 'joao@icloud.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAppleAuthAvailable.mockReturnValue(true);
    mockGetAppleConfig.mockReturnValue({ requestedScopes: ['fullName', 'email'] });
    mockIsAvailableAsync.mockResolvedValue(true);
    mockSignInAsync.mockResolvedValue(validCredential);
    mockSignInWithApple.mockResolvedValue(undefined);
    mockSignUpWithApple.mockResolvedValue(undefined);
    mockCheckCampaignVoucher.mockResolvedValue(undefined);
  });

  describe('inicializacao', () => {
    it('deve retornar isAvailable baseado na configuracao da plataforma', () => {
      mockIsAppleAuthAvailable.mockReturnValue(true);

      const { result } = renderHook(() => useAppleAuth());

      expect(result.current.isAvailable).toBe(true);
    });

    it('deve retornar isAvailable false quando nao e iOS', () => {
      mockIsAppleAuthAvailable.mockReturnValue(false);

      const { result } = renderHook(() => useAppleAuth());

      expect(result.current.isAvailable).toBe(false);
    });

    it('deve retornar isLoading como false inicialmente', () => {
      const { result } = renderHook(() => useAppleAuth());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('signInWithApple', () => {
    it('deve fazer login com Apple com sucesso', async () => {
      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(mockSignInAsync).toHaveBeenCalled();
      expect(mockSignInWithApple).toHaveBeenCalledWith(
        'apple-identity-token',
        validCredential.fullName,
        'joao@icloud.com'
      );
    });

    it('deve mostrar alerta quando Apple Auth nao esta disponivel', async () => {
      mockIsAppleAuthAvailable.mockReturnValue(false);

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Apple Sign In',
        expect.stringContaining('iOS'),
        expect.any(Array)
      );
    });

    it('deve lancar erro quando Apple Auth nao esta configurado', async () => {
      mockGetAppleConfig.mockReturnValue(null);

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      // Erro deve ser capturado e alerta exibido
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro no Login',
        expect.stringContaining('Apple'),
        expect.any(Array)
      );
    });

    it('deve mostrar alerta quando dispositivo nao suporta Apple Sign In', async () => {
      mockIsAvailableAsync.mockResolvedValue(false);

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Apple Sign In',
        expect.stringContaining('não está disponível'),
        expect.any(Array)
      );
    });

    it('deve retornar silenciosamente quando identityToken nao e recebido', async () => {
      mockSignInAsync.mockResolvedValue({
        ...validCredential,
        identityToken: null,
      });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(mockSignInWithApple).not.toHaveBeenCalled();
    });

    it('deve ignorar erro quando usuario cancela login (ERR_CANCELED)', async () => {
      mockSignInAsync.mockRejectedValue({ code: 'ERR_CANCELED', message: 'User cancelled' });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve ignorar erro quando usuario cancela login (ERR_REQUEST_CANCELED)', async () => {
      mockSignInAsync.mockRejectedValue({ code: 'ERR_REQUEST_CANCELED', message: 'Cancelled' });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve ignorar erro de autenticacao tratado pelo AuthContext', async () => {
      mockSignInWithApple.mockRejectedValue(new Error('Erro ao fazer login'));

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve ignorar erro com mensagem contendo Token', async () => {
      mockSignInWithApple.mockRejectedValue(new Error('Token expired'));

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve mostrar alerta generico para erros desconhecidos no login', async () => {
      mockSignInAsync.mockRejectedValue({ code: 'UNKNOWN', message: 'Erro desconhecido' });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro no Login',
        expect.stringContaining('Apple'),
        expect.any(Array)
      );
    });

    it('deve definir isLoading como false apos conclusao', async () => {
      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve definir isLoading como false apos erro', async () => {
      mockSignInAsync.mockRejectedValue(new Error('Generic error'));

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve passar email null quando credential.email e undefined', async () => {
      mockSignInAsync.mockResolvedValue({
        ...validCredential,
        email: undefined,
      });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signInWithApple();
      });

      expect(mockSignInWithApple).toHaveBeenCalledWith(
        'apple-identity-token',
        validCredential.fullName,
        null
      );
    });
  });

  describe('signUpWithApple', () => {
    it('deve fazer cadastro com Apple com sucesso', async () => {
      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signUpWithApple();
      });

      expect(mockSignUpWithApple).toHaveBeenCalledWith(
        'apple-identity-token',
        validCredential.fullName,
        'joao@icloud.com'
      );
    });

    it('deve verificar voucher de campanha apos cadastro com email', async () => {
      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signUpWithApple();
      });

      expect(mockCheckCampaignVoucher).toHaveBeenCalledWith('joao@icloud.com', true);
    });

    it('nao deve verificar voucher quando email nao esta disponivel', async () => {
      mockSignInAsync.mockResolvedValue({
        ...validCredential,
        email: null,
      });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signUpWithApple();
      });

      expect(mockCheckCampaignVoucher).not.toHaveBeenCalled();
    });

    it('deve mostrar alerta Erro no Cadastro para erros desconhecidos', async () => {
      mockSignInAsync.mockRejectedValue({ code: 'UNKNOWN', message: 'Algo deu errado' });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signUpWithApple();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro no Cadastro',
        expect.stringContaining('cadastrar'),
        expect.any(Array)
      );
    });

    it('deve tratar erro no try externo de signUpWithApple sem lancar excecao', async () => {
      // Simula erro no handleAppleAuth que propaga para o catch externo do signUpWithApple
      mockIsAppleAuthAvailable.mockReturnValue(true);
      mockGetAppleConfig.mockReturnValue({ requestedScopes: ['fullName', 'email'] });
      mockIsAvailableAsync.mockImplementation(() => { throw new Error('Unexpected crash'); });

      const { result } = renderHook(() => useAppleAuth());

      // Nao deve lancar excecao
      await act(async () => {
        await result.current.signUpWithApple();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve mostrar alerta generico para erros sem mensagem', async () => {
      mockSignInAsync.mockRejectedValue({ code: 'UNKNOWN' });

      const { result } = renderHook(() => useAppleAuth());

      await act(async () => {
        await result.current.signUpWithApple();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro no Cadastro',
        expect.stringContaining('Tente novamente'),
        expect.any(Array)
      );
    });
  });

  describe('retorno do hook', () => {
    it('deve retornar todas as propriedades esperadas', () => {
      const { result } = renderHook(() => useAppleAuth());

      expect(typeof result.current.signInWithApple).toBe('function');
      expect(typeof result.current.signUpWithApple).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isAvailable).toBe('boolean');
    });
  });
});
