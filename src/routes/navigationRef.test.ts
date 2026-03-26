import { navigationRef } from './navigationRef';

// ── Navigation mock ──────────────────────────────────────────────────
jest.mock('@react-navigation/native', () => {
  const isReadyMock = jest.fn().mockReturnValue(true);
  const navigateMock = jest.fn();
  const goBackMock = jest.fn();
  const resetMock = jest.fn();
  const getCurrentRouteMock = jest.fn().mockReturnValue({ name: 'homepage' });

  return {
    createNavigationContainerRef: () => ({
      isReady: isReadyMock,
      navigate: navigateMock,
      goBack: goBackMock,
      reset: resetMock,
      getCurrentRoute: getCurrentRouteMock,
      __isReadyMock: isReadyMock,
      __navigateMock: navigateMock,
      __goBackMock: goBackMock,
      __resetMock: resetMock,
      __getCurrentRouteMock: getCurrentRouteMock,
    }),
  };
});

jest.mock('./app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

describe('navigationRef', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports navigationRef as a defined object', () => {
    expect(navigationRef).toBeDefined();
  });

  it('has an isReady method', () => {
    expect(typeof navigationRef.isReady).toBe('function');
  });

  it('has a navigate method', () => {
    expect(typeof navigationRef.navigate).toBe('function');
  });

  it('isReady returns true when navigation is ready', () => {
    const mockIsReady = (navigationRef as any).__isReadyMock;
    mockIsReady.mockReturnValue(true);
    expect(navigationRef.isReady()).toBe(true);
  });

  it('isReady returns false when navigation is not ready', () => {
    const mockIsReady = (navigationRef as any).__isReadyMock;
    mockIsReady.mockReturnValue(false);
    expect(navigationRef.isReady()).toBe(false);
  });

  it('can call navigate on the ref', () => {
    const mockNavigate = (navigationRef as any).__navigateMock;
    (navigationRef.navigate as any)('homepage');
    expect(mockNavigate).toHaveBeenCalledWith('homepage');
  });

  it('can call goBack on the ref', () => {
    const mockGoBack = (navigationRef as any).__goBackMock;
    (navigationRef as any).goBack();
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('can call reset on the ref', () => {
    const mockReset = (navigationRef as any).__resetMock;
    (navigationRef as any).reset({ index: 0, routes: [{ name: 'homepage' }] });
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'homepage' }] });
  });

  it('can get current route', () => {
    const mockGetCurrentRoute = (navigationRef as any).__getCurrentRouteMock;
    const route = (navigationRef as any).getCurrentRoute();
    expect(route).toEqual({ name: 'homepage' });
    expect(mockGetCurrentRoute).toHaveBeenCalled();
  });
});
