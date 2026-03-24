import { renderHook } from '@testing-library/react-native';

// Mock navigation
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock expo-linking
const mockAddEventListener = jest.fn();
const mockGetInitialURL = jest.fn();
const mockParse = jest.fn();

jest.mock('expo-linking', () => ({
  addEventListener: (...args: any[]) => mockAddEventListener(...args),
  getInitialURL: (...args: any[]) => mockGetInitialURL(...args),
  parse: (...args: any[]) => mockParse(...args),
}));

import { useDeepLinking } from './useDeepLinking';

describe('useDeepLinking', () => {
  let subscriptionRemove: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    subscriptionRemove = jest.fn();
    mockAddEventListener.mockReturnValue({ remove: subscriptionRemove });
    mockGetInitialURL.mockResolvedValue(null);
    mockParse.mockReturnValue({ hostname: null, path: null, queryParams: {} });
  });

  describe('inicializacao', () => {
    it('deve registrar listener de deep link na montagem', () => {
      renderHook(() => useDeepLinking());

      expect(mockAddEventListener).toHaveBeenCalledWith('url', expect.any(Function));
    });

    it('deve verificar URL inicial na montagem', async () => {
      mockGetInitialURL.mockResolvedValue(null);

      renderHook(() => useDeepLinking());

      expect(mockGetInitialURL).toHaveBeenCalled();
    });

    it('deve processar URL inicial quando disponivel', async () => {
      mockGetInitialURL.mockResolvedValue('examinus://upload');
      mockParse.mockReturnValue({ hostname: 'upload', path: null, queryParams: {} });

      renderHook(() => useDeepLinking());

      // Aguarda processamento assincrono da URL inicial
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockParse).toHaveBeenCalledWith('examinus://upload');
      expect(mockNavigate).toHaveBeenCalledWith('upload');
    });

    it('deve remover listener ao desmontar', () => {
      const { unmount } = renderHook(() => useDeepLinking());

      unmount();

      expect(subscriptionRemove).toHaveBeenCalled();
    });
  });

  describe('handleDeepLink - navegacao por hostname', () => {
    it('deve navegar para upload quando hostname e upload', () => {
      mockParse.mockReturnValue({ hostname: 'upload', path: null, queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'examinus://upload' });

      expect(mockNavigate).toHaveBeenCalledWith('upload');
    });

    it('deve navegar para exam quando hostname e exam', () => {
      mockParse.mockReturnValue({ hostname: 'exam', path: null, queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'examinus://exam' });

      expect(mockNavigate).toHaveBeenCalledWith('exam');
    });

    it('deve navegar para homepage quando hostname e homepage', () => {
      mockParse.mockReturnValue({ hostname: 'homepage', path: null, queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'examinus://homepage' });

      expect(mockNavigate).toHaveBeenCalledWith('homepage');
    });

    it('deve navegar para examList quando hostname e examList', () => {
      mockParse.mockReturnValue({ hostname: 'examList', path: null, queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'examinus://examList' });

      expect(mockNavigate).toHaveBeenCalledWith('examList');
    });

    it('deve navegar para healthWallet quando hostname e healthWallet', () => {
      mockParse.mockReturnValue({ hostname: 'healthWallet', path: null, queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'examinus://healthWallet' });

      expect(mockNavigate).toHaveBeenCalledWith('healthWallet');
    });

    it('deve navegar para myAccount quando hostname e myAccount', () => {
      mockParse.mockReturnValue({ hostname: 'myAccount', path: null, queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'examinus://myAccount' });

      expect(mockNavigate).toHaveBeenCalledWith('myAccount');
    });
  });

  describe('handleDeepLink - navegacao por path', () => {
    it('deve navegar para upload quando path e upload', () => {
      mockParse.mockReturnValue({ hostname: null, path: 'upload', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/app/upload' });

      expect(mockNavigate).toHaveBeenCalledWith('upload');
    });

    it('deve navegar para exam quando path e exam', () => {
      mockParse.mockReturnValue({ hostname: null, path: 'exam', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/app/exam' });

      expect(mockNavigate).toHaveBeenCalledWith('exam');
    });

    it('deve navegar para homepage quando path e vazio', () => {
      mockParse.mockReturnValue({ hostname: null, path: '', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/' });

      expect(mockNavigate).toHaveBeenCalledWith('homepage');
    });

    it('deve navegar para homepage quando path e homepage', () => {
      mockParse.mockReturnValue({ hostname: null, path: 'homepage', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/app/homepage' });

      expect(mockNavigate).toHaveBeenCalledWith('homepage');
    });

    it('deve navegar para examList quando path e exams', () => {
      mockParse.mockReturnValue({ hostname: null, path: 'exams', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/app/exams' });

      expect(mockNavigate).toHaveBeenCalledWith('examList');
    });

    it('deve navegar para examList quando path e examList', () => {
      mockParse.mockReturnValue({ hostname: null, path: 'examList', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/app/examList' });

      expect(mockNavigate).toHaveBeenCalledWith('examList');
    });

    it('deve navegar para healthWallet quando path e wallet', () => {
      mockParse.mockReturnValue({ hostname: null, path: 'wallet', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/app/wallet' });

      expect(mockNavigate).toHaveBeenCalledWith('healthWallet');
    });

    it('deve navegar para myAccount quando path e account', () => {
      mockParse.mockReturnValue({ hostname: null, path: 'account', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'https://examinus.app/app/account' });

      expect(mockNavigate).toHaveBeenCalledWith('myAccount');
    });
  });

  describe('handleDeepLink - rota nao reconhecida', () => {
    it('deve navegar para homepage quando rota nao e reconhecida', () => {
      mockParse.mockReturnValue({ hostname: 'unknown', path: 'unknown', queryParams: {} });

      const { result } = renderHook(() => useDeepLinking());

      result.current.handleDeepLink({ url: 'examinus://unknown' });

      expect(mockNavigate).toHaveBeenCalledWith('homepage');
    });
  });

  describe('listener de eventos', () => {
    it('deve processar deep link recebido enquanto app esta aberto', () => {
      mockParse.mockReturnValue({ hostname: 'upload', path: null, queryParams: {} });

      renderHook(() => useDeepLinking());

      // Simula recebimento de deep link
      const handler = mockAddEventListener.mock.calls[0][1];
      handler({ url: 'examinus://upload' });

      expect(mockNavigate).toHaveBeenCalledWith('upload');
    });
  });

  describe('retorno do hook', () => {
    it('deve retornar a funcao handleDeepLink', () => {
      const { result } = renderHook(() => useDeepLinking());

      expect(typeof result.current.handleDeepLink).toBe('function');
    });
  });
});
