// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn((cb) => cb({ setTag: jest.fn(), setExtra: jest.fn() })),
  startSpan: jest.fn(),
  wrap: (component: any) => component,
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    version: '1.0.0',
    ios: { buildNumber: '1' },
    android: { versionCode: 1 },
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(true),
  isLoaded: jest.fn().mockReturnValue(true),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

// Mock react-native-onesignal
jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    initialize: jest.fn(),
    Debug: { setLogLevel: jest.fn() },
    Notifications: {
      getPermissionAsync: jest.fn().mockResolvedValue(true),
      requestPermission: jest.fn().mockResolvedValue(true),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    User: {
      pushSubscription: {
        optIn: jest.fn(),
        getTokenAsync: jest.fn().mockResolvedValue('mock-token'),
        getOptedIn: jest.fn().mockReturnValue(true),
        getId: jest.fn().mockReturnValue('mock-id'),
      },
      getOnesignalId: jest.fn().mockResolvedValue('mock-player-id'),
    },
  },
  LogLevel: { Verbose: 0 },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Silence console warnings in tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('NativeBase') || args[0].includes('Animated'))
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};
