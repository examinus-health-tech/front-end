import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock useAuth
const mockSignInWithGoogle = jest.fn();
const mockSignUpWithGoogle = jest.fn();

jest.mock('./useAuth', () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    signUpWithGoogle: mockSignUpWithGoogle,
  }),
}));

// Mock Google Auth config
const mockIsGoogleAuthConfigured = jest.fn();
const mockGetGoogleClientId = jest.fn();
const mockGetGoogleIOSClientId = jest.fn();

jest.mock('../config/googleAuth', () => ({
  isGoogleAuthConfigured: () => mockIsGoogleAuthConfigured(),
  getGoogleClientId: () => mockGetGoogleClientId(),
  getGoogleIOSClientId: () => mockGetGoogleIOSClientId(),
}));

// Mock Google Signin
const mockHasPlayServices = jest.fn();
const mockSignIn = jest.fn();
const mockConfigure = jest.fn();

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: (...args: any[]) => mockConfigure(...args),
    hasPlayServices: (...args: any[]) => mockHasPlayServices(...args),
    signIn: (...args: any[]) => mockSignIn(...args),
  },
}));

// Mock campaign service
const mockCheckCampaignVoucher = jest.fn();

jest.mock('@services/campaignService', () => ({
  checkCampaignVoucher: (...args: any[]) => mockCheckCampaignVoucher(...args),
}));

// Spy on Alert
jest.spyOn(Alert, 'alert');

import { useGoogleAuth } from './useGoogleAuth';

describe('useGoogleAuth', () => {
  const validUserInfo = {
    type: 'success',
    data: {
      idToken: 'mock-google-id-token',
      user: {
        email: 'test@gmail.com',
        name: 'Test User',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsGoogleAuthConfigured.mockReturnValue(true);
    mockGetGoogleClientId.mockReturnValue('mock-web-client-id');
    mockGetGoogleIOSClientId.mockReturnValue('mock-ios-client-id');
    mockHasPlayServices.mockResolvedValue(true);
    mockSignIn.mockResolvedValue(validUserInfo);
    mockSignInWithGoogle.mockResolvedValue(undefined);
    mockSignUpWithGoogle.mockResolvedValue(undefined);
    mockCheckCampaignVoucher.mockResolvedValue(undefined);
  });

  describe('inicializacao', () => {
    it('deve configurar GoogleSignin quando configurado e clientId disponivel', () => {
      renderHook(() => useGoogleAuth());

      expect(mockConfigure).toHaveBeenCalledWith({
        webClientId: 'mock-web-client-id',
        iosClientId: 'mock-ios-client-id',
        offlineAccess: false,
        hostedDomain: '',
        forceCodeForRefreshToken: false,
      });
    });

    it('nao deve configurar GoogleSignin quando nao esta configurado', () => {
      mockIsGoogleAuthConfigured.mockReturnValue(false);
      mockConfigure.mockClear();

      renderHook(() => useGoogleAuth());

      expect(mockConfigure).not.toHaveBeenCalled();
    });

    it('nao deve configurar GoogleSignin quando clientId e null', () => {
      mockGetGoogleClientId.mockReturnValue(null);
      mockConfigure.mockClear();

      renderHook(() => useGoogleAuth());

      expect(mockConfigure).not.toHaveBeenCalled();
    });

    it('deve retornar isConfigured corretamente', () => {
      mockIsGoogleAuthConfigured.mockReturnValue(true);

      const { result } = renderHook(() => useGoogleAuth());

      expect(result.current.isConfigured).toBe(true);
    });

    it('deve retornar isLoading como false inicialmente', () => {
      const { result } = renderHook(() => useGoogleAuth());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('signInWithGoogle', () => {
    it('deve fazer login com Google com sucesso', async () => {
      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(mockHasPlayServices).toHaveBeenCalled();
      expect(mockSignIn).toHaveBeenCalled();
      expect(mockSignInWithGoogle).toHaveBeenCalledWith('mock-google-id-token');
    });

    it('deve mostrar alerta quando Google Auth nao esta configurado', async () => {
      mockIsGoogleAuthConfigured.mockReturnValue(false);

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Google Login - Configuração Pendente',
        expect.any(String),
        expect.any(Array)
      );
      expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('deve tratar erro de Google Play Services indisponivel', async () => {
      mockHasPlayServices.mockRejectedValue({ code: 'PLAY_SERVICES_NOT_AVAILABLE' });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Google Services',
        expect.stringContaining('Google Play Services'),
        expect.any(Array)
      );
    });

    it('deve retornar silenciosamente quando idToken nao e recebido', async () => {
      mockSignIn.mockResolvedValue({ type: 'success', data: { idToken: null, user: {} } });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(mockSignInWithGoogle).not.toHaveBeenCalled();
    });

    it('deve ignorar erro quando usuario cancela login', async () => {
      mockSignIn.mockRejectedValue({ code: 'SIGN_IN_CANCELLED', message: 'User cancelled' });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      // Nao deve mostrar alerta para cancelamento
      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve ignorar erro quando usuario cancela com codigo -5', async () => {
      mockSignIn.mockRejectedValue({ code: '-5', message: 'User cancelled' });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve mostrar alerta de erro de rede com codigo NETWORK_ERROR', async () => {
      mockSignIn.mockRejectedValue({ code: 'NETWORK_ERROR', message: 'Network error' });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro de Rede',
        expect.stringContaining('Google'),
        expect.any(Array)
      );
    });

    it('deve mostrar alerta de erro de rede com codigo 7', async () => {
      mockSignIn.mockRejectedValue({ code: 7, message: 'Network error' });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro de Rede',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve ignorar erro de autenticacao tratado pelo AuthContext', async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error('Erro ao fazer login'));

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      // Nao deve mostrar alerta generico para erros tratados pelo AuthContext
      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve ignorar erro com mensagem contendo Token', async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error('Token expired'));

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Login',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve mostrar alerta generico para erros desconhecidos', async () => {
      mockSignIn.mockRejectedValue({ code: 'UNKNOWN', message: 'Algo deu errado' });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro no Login',
        expect.stringContaining('Google'),
        expect.any(Array)
      );
    });

    it('deve definir isLoading como false apos conclusao com sucesso', async () => {
      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve definir isLoading como false apos erro', async () => {
      mockSignIn.mockRejectedValue(new Error('Generic error'));

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve mostrar alerta quando signInWithGoogle lanca erro inesperado no try externo', async () => {
      // Simula erro no nivel mais externo (fora do handleGoogleAuth)
      mockHasPlayServices.mockImplementation(() => {
        throw new Error('Unexpected');
      });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      // O erro deve cair no catch externo do signInWithGoogle
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('signUpWithGoogle', () => {
    it('deve fazer cadastro com Google com sucesso', async () => {
      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signUpWithGoogle();
      });

      expect(mockSignUpWithGoogle).toHaveBeenCalledWith('mock-google-id-token');
    });

    it('deve verificar voucher de campanha apos cadastro', async () => {
      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signUpWithGoogle();
      });

      expect(mockCheckCampaignVoucher).toHaveBeenCalledWith('test@gmail.com', true);
    });

    it('deve mostrar alerta quando Google Auth nao esta configurado para signup', async () => {
      mockIsGoogleAuthConfigured.mockReturnValue(false);

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signUpWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Google Cadastro - Configuração Pendente',
        expect.any(String),
        expect.any(Array)
      );
    });

    it('deve mostrar alerta Erro no Cadastro para erros desconhecidos', async () => {
      mockSignIn.mockRejectedValue({ code: 'UNKNOWN', message: 'Erro desconhecido' });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signUpWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro no Cadastro',
        expect.stringContaining('cadastrar'),
        expect.any(Array)
      );
    });

    it('deve mostrar alerta quando signUpWithGoogle lanca erro inesperado no try externo', async () => {
      mockHasPlayServices.mockImplementation(() => {
        throw new Error('Unexpected');
      });

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signUpWithGoogle();
      });

      expect(Alert.alert).toHaveBeenCalled();
    });

    it('deve ignorar erro de Request failed tratado pelo AuthContext', async () => {
      mockSignUpWithGoogle.mockRejectedValue(new Error('Request failed with status 400'));

      const { result } = renderHook(() => useGoogleAuth());

      await act(async () => {
        await result.current.signUpWithGoogle();
      });

      expect(Alert.alert).not.toHaveBeenCalledWith(
        'Erro no Cadastro',
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe('retorno do hook', () => {
    it('deve retornar todas as propriedades esperadas', () => {
      const { result } = renderHook(() => useGoogleAuth());

      expect(typeof result.current.signInWithGoogle).toBe('function');
      expect(typeof result.current.signUpWithGoogle).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isConfigured).toBe('boolean');
    });
  });
});
