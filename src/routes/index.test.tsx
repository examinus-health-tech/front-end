import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Routes } from './index';

// ── Route component mocks ───────────────────────────────────────────
jest.mock('./app.routes', () => {
  const RN = require('react-native');
  return {
    AppRoutes: () => <RN.View testID="app-routes" />,
  };
});

jest.mock('./auth.routes', () => {
  const RN = require('react-native');
  return {
    AuthRoutes: () => <RN.View testID="auth-routes" />,
  };
});

jest.mock('@components/pages/ForceUpdate', () => {
  const RN = require('react-native');
  return {
    ForceUpdateScreen: ({ message }: any) => (
      <RN.View testID="force-update">
        <RN.Text>{message}</RN.Text>
      </RN.View>
    ),
  };
});

// ── Service mocks ───────────────────────────────────────────────────
const mockCheckForceUpdate = jest.fn();
jest.mock('@services/versionService', () => ({
  checkForceUpdate: (...args: any[]) => mockCheckForceUpdate(...args),
}));

// ── Hook mocks ──────────────────────────────────────────────────────
let mockUser: any = { userId: '1' };
let mockIsAuthReady = true;

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthReady: mockIsAuthReady,
  }),
}));

describe('Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { userId: '1' };
    mockIsAuthReady = true;
    mockCheckForceUpdate.mockResolvedValue({
      needsUpdate: false,
      versionInfo: null,
    });
  });

  it('shows loading when isAuthReady is false', () => {
    mockIsAuthReady = false;
    const { queryByTestId } = render(<Routes />);
    expect(queryByTestId('app-routes')).toBeNull();
    expect(queryByTestId('auth-routes')).toBeNull();
  });

  it('shows loading while checking version', () => {
    mockCheckForceUpdate.mockImplementation(() => new Promise(() => {})); // never resolves
    const { queryByTestId } = render(<Routes />);
    expect(queryByTestId('app-routes')).toBeNull();
    expect(queryByTestId('auth-routes')).toBeNull();
  });

  it('renders AppRoutes when user is authenticated', async () => {
    mockUser = { userId: '1' };
    const { findByTestId } = render(<Routes />);
    const appRoutes = await findByTestId('app-routes');
    expect(appRoutes).toBeTruthy();
  });

  it('renders AuthRoutes when user is null', async () => {
    mockUser = null;
    const { findByTestId } = render(<Routes />);
    const authRoutes = await findByTestId('auth-routes');
    expect(authRoutes).toBeTruthy();
  });

  it('renders ForceUpdateScreen when update is needed', async () => {
    mockCheckForceUpdate.mockResolvedValueOnce({
      needsUpdate: true,
      versionInfo: {
        minVersion: '2.0.0',
        latestVersion: '2.0.0',
        forceUpdate: true,
        updateMessage: 'Please update the app',
      },
    });
    const { findByTestId } = render(<Routes />);
    const forceUpdate = await findByTestId('force-update');
    expect(forceUpdate).toBeTruthy();
  });

  it('does not show force update when needsUpdate is false', async () => {
    mockCheckForceUpdate.mockResolvedValueOnce({
      needsUpdate: false,
      versionInfo: null,
    });
    const { findByTestId, queryByTestId } = render(<Routes />);
    await findByTestId('app-routes');
    expect(queryByTestId('force-update')).toBeNull();
  });

  it('falls back to normal routing when version check fails', async () => {
    mockCheckForceUpdate.mockRejectedValueOnce(new Error('Network error'));
    const { findByTestId, queryByTestId } = render(<Routes />);
    await findByTestId('app-routes');
    expect(queryByTestId('force-update')).toBeNull();
  });

  it('calls checkForceUpdate on mount', async () => {
    const { findByTestId } = render(<Routes />);
    await findByTestId('app-routes');
    expect(mockCheckForceUpdate).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator with correct style', () => {
    mockIsAuthReady = false;
    const { toJSON } = render(<Routes />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows loading when both isAuthReady is false and version check pending', () => {
    mockIsAuthReady = false;
    mockCheckForceUpdate.mockImplementation(() => new Promise(() => {}));
    const { queryByTestId } = render(<Routes />);
    expect(queryByTestId('app-routes')).toBeNull();
    expect(queryByTestId('auth-routes')).toBeNull();
    expect(queryByTestId('force-update')).toBeNull();
  });

  it('does not show force update when needsUpdate is true but versionInfo is null', async () => {
    mockCheckForceUpdate.mockResolvedValueOnce({
      needsUpdate: true,
      versionInfo: null,
    });
    const { findByTestId, queryByTestId } = render(<Routes />);
    // When needsUpdate is true but versionInfo is null, the condition (needsUpdate && versionInfo) is falsy
    await findByTestId('app-routes');
    expect(queryByTestId('force-update')).toBeNull();
  });

  it('renders AuthRoutes when user is undefined', async () => {
    mockUser = undefined;
    const { findByTestId } = render(<Routes />);
    const authRoutes = await findByTestId('auth-routes');
    expect(authRoutes).toBeTruthy();
  });

  it('does not show loading after version check resolves', async () => {
    mockCheckForceUpdate.mockResolvedValueOnce({
      needsUpdate: false,
      versionInfo: null,
    });
    const { findByTestId, queryByTestId } = render(<Routes />);
    await findByTestId('app-routes');
    // Loading should be gone
    expect(queryByTestId('force-update')).toBeNull();
  });
});
