import { navigationRef, navigate, isNavigationReady } from './RootNavigation';

// ── Navigation mock ──────────────────────────────────────────────────
jest.mock('@react-navigation/native', () => {
  const isReadyMock = jest.fn().mockReturnValue(true);
  const navigateMock = jest.fn();

  return {
    createNavigationContainerRef: () => ({
      isReady: isReadyMock,
      navigate: navigateMock,
      __isReadyMock: isReadyMock,
      __navigateMock: navigateMock,
    }),
  };
});

jest.mock('./app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

describe('RootNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports navigationRef', () => {
    expect(navigationRef).toBeDefined();
    expect(navigationRef.isReady).toBeDefined();
    expect(navigationRef.navigate).toBeDefined();
  });

  describe('navigate', () => {
    it('calls navigationRef.navigate when ready', () => {
      const mockIsReady = (navigationRef as any).__isReadyMock;
      const mockNavigate = (navigationRef as any).__navigateMock;
      mockIsReady.mockReturnValue(true);

      navigate('homepage');

      expect(mockNavigate).toHaveBeenCalledWith('homepage', undefined);
    });

    it('passes params to navigationRef.navigate', () => {
      const mockIsReady = (navigationRef as any).__isReadyMock;
      const mockNavigate = (navigationRef as any).__navigateMock;
      mockIsReady.mockReturnValue(true);

      navigate('exam', { examId: '123' });

      expect(mockNavigate).toHaveBeenCalledWith('exam', { examId: '123' });
    });

    it('does not navigate when not ready', () => {
      const mockIsReady = (navigationRef as any).__isReadyMock;
      const mockNavigate = (navigationRef as any).__navigateMock;
      mockIsReady.mockReturnValue(false);

      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      navigate('homepage');

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Navigation não está pronto ainda'),
        'homepage'
      );

      warnSpy.mockRestore();
    });
  });

  describe('isNavigationReady', () => {
    it('returns true when navigation is ready', () => {
      const mockIsReady = (navigationRef as any).__isReadyMock;
      mockIsReady.mockReturnValue(true);

      expect(isNavigationReady()).toBe(true);
    });

    it('returns false when navigation is not ready', () => {
      const mockIsReady = (navigationRef as any).__isReadyMock;
      mockIsReady.mockReturnValue(false);

      expect(isNavigationReady()).toBe(false);
    });
  });
});
