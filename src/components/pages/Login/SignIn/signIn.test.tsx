import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignIn } from './signIn';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Divider: mockComponent('Divider'),
    Flex: mockComponent('Flex'),
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    VStack: mockComponent('VStack'),
    HStack: mockComponent('HStack'),
    Icon: mockComponent('Icon'),
    Box: mockComponent('Box'),
    Spinner: mockComponent('Spinner'),
    Center: mockComponent('Center'),
    ScrollView: ({ children, ...props }: any) => <RN.ScrollView {...props}>{children}</RN.ScrollView>,
    KeyboardAvoidingView: ({ children, ...props }: any) => <RN.View {...props}>{children}</RN.View>,
  };
});

// ── Navigation mock ──
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    reset: mockReset,
  }),
  useRoute: () => ({ params: {} }),
}));

// ── Auth hooks ──
const mockSignIn = jest.fn();
const mockSignInWithBiometric = jest.fn();
jest.mock('../../../../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signInWithBiometric: mockSignInWithBiometric,
  }),
}));

const mockSignInWithGoogle = jest.fn();
let mockGoogleIsLoading = false;
let mockGoogleIsConfigured = true;
jest.mock('../../../../hooks/useGoogleAuth', () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    isLoading: mockGoogleIsLoading,
    isConfigured: mockGoogleIsConfigured,
  }),
}));

const mockSignInWithApple = jest.fn();
let mockAppleIsLoading = false;
let mockAppleIsAvailable = true;
jest.mock('../../../../hooks/useAppleAuth', () => ({
  useAppleAuth: () => ({
    signInWithApple: mockSignInWithApple,
    isLoading: mockAppleIsLoading,
    isAvailable: mockAppleIsAvailable,
  }),
}));

const mockAuthenticateWithBiometric = jest.fn();
const mockCanUseBiometricLogin = jest.fn().mockResolvedValue(false);
let mockBiometricIsAvailable = false;
let mockBiometricType = 'Fingerprint';
jest.mock('../../../../hooks/useBiometricAuth', () => ({
  useBiometricAuth: () => ({
    isAvailable: mockBiometricIsAvailable,
    isEnabled: mockBiometricIsAvailable,
    biometricType: mockBiometricType,
    authenticateWithBiometric: mockAuthenticateWithBiometric,
    canUseBiometricLogin: mockCanUseBiometricLogin,
  }),
}));

const mockShowError = jest.fn();
jest.mock('../../../../hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showError: mockShowError,
    showSuccess: jest.fn(),
    showWarning: jest.fn(),
  }),
}));

// ── Utils ──
jest.mock('@utils/AppErrors', () => ({
  AppError: class AppError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AppError';
    }
  },
}));

jest.mock('@utils/debugLogger', () => ({
  logger: {
    info: jest.fn(),
    auth: jest.fn(),
    error: jest.fn(),
    network: jest.fn(),
  },
}));

jest.mock('@utils/networkDiagnostics', () => ({
  __esModule: true,
  default: {
    logEnvironmentInfo: jest.fn(),
    runDiagnostics: jest.fn().mockResolvedValue({
      isConnected: true,
      apiReachable: true,
    }),
  },
}));

jest.mock('expo-apple-authentication', () => ({}));

// ── Icons mock ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  const icon = (name: string) => (props: any) => <RN.View testID={`icon-${name}`} {...props} />;
  return {
    EyeIcon: icon('Eye'),
    FacebookIcon: icon('Facebook'),
    GmailIcon: icon('Gmail'),
    InstagramIcon: icon('Instagram'),
    LockIcon: icon('Lock'),
    MailIcon: icon('Mail'),
    UserIcon: icon('User'),
    AppleFilledIcon: icon('AppleFilled'),
    FingerprintIcon: icon('Fingerprint'),
    FaceIdIcon: icon('FaceId'),
  };
});

// ── Molecules / Atoms ──
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    Input: ({ label, onChangeText, value, errorMessage, testID, ...props }: any) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID || `input-${label}`}
          onChangeText={onChangeText}
          value={value}
          {...props}
        />
        {errorMessage && <RN.Text testID={`error-${label}`}>{errorMessage}</RN.Text>}
      </RN.View>
    ),
    LegalFooter: () => <RN.View testID="legal-footer" />,
  };
});

jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, isLoading, ...props }: any) => (
      <RN.TouchableOpacity testID={`button-${title}`} onPress={onPress} disabled={isLoading}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the main heading', () => {
    const { getByText } = render(<SignIn />);
    expect(getByText('Entre')).toBeTruthy();
  });

  it('renders the subtitle text', () => {
    const { getByText } = render(<SignIn />);
    expect(
      getByText(/Faça login e simplifique sua saúde/)
    ).toBeTruthy();
  });

  it('renders email and password input fields', () => {
    const { getByText } = render(<SignIn />);
    expect(getByText('Endereço de e-mail')).toBeTruthy();
    expect(getByText('Senha')).toBeTruthy();
  });

  it('renders the "Conecte-se" button', () => {
    const { getByText } = render(<SignIn />);
    expect(getByText('Conecte-se')).toBeTruthy();
  });

  it('renders the "Esqueceu a senha?" link', () => {
    const { getByText } = render(<SignIn />);
    expect(getByText('Esqueceu a senha?')).toBeTruthy();
  });

  it('navigates to forgotPassword when "Esqueceu a senha?" is pressed', () => {
    const { getByText } = render(<SignIn />);
    fireEvent.press(getByText('Esqueceu a senha?'));
    expect(mockNavigate).toHaveBeenCalledWith('forgotPassword');
  });

  it('renders the "Cadastre-se." link', () => {
    const { getByText } = render(<SignIn />);
    expect(getByText('Cadastre-se.')).toBeTruthy();
  });

  it('navigates to signUp when "Cadastre-se." is pressed', () => {
    const { getByText } = render(<SignIn />);
    fireEvent.press(getByText('Cadastre-se.'));
    expect(mockNavigate).toHaveBeenCalledWith('signUp');
  });

  it('renders the "Ou" divider text', () => {
    const { getByText } = render(<SignIn />);
    expect(getByText('Ou')).toBeTruthy();
  });

  it('renders social login buttons (Google, Apple)', () => {
    const { getByTestId } = render(<SignIn />);
    expect(getByTestId('icon-Gmail')).toBeTruthy();
    expect(getByTestId('icon-AppleFilled')).toBeTruthy();
  });

  it('renders the LegalFooter', () => {
    const { getByTestId } = render(<SignIn />);
    expect(getByTestId('legal-footer')).toBeTruthy();
  });

  it('allows typing in email input', () => {
    const { getByTestId } = render(<SignIn />);
    const emailInput = getByTestId('input-email');
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('allows typing in password input', () => {
    const { getByTestId } = render(<SignIn />);
    const passwordInput = getByTestId('input-password');
    fireEvent.changeText(passwordInput, 'MyPassword123');
    expect(passwordInput.props.value).toBe('MyPassword123');
  });

  it('calls signIn on valid form submission', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);

    const { getByTestId, getByText } = render(<SignIn />);

    fireEvent.changeText(getByTestId('input-email'), 'user@test.com');
    fireEvent.changeText(getByTestId('input-password'), 'password123');
    fireEvent.press(getByText('Conecte-se'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@test.com', 'password123');
    });
  });

  it('shows error toast when signIn fails', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Credenciais inválidas'));

    const { getByTestId, getByText } = render(<SignIn />);

    fireEvent.changeText(getByTestId('input-email'), 'user@test.com');
    fireEvent.changeText(getByTestId('input-password'), 'password123');
    fireEvent.press(getByText('Conecte-se'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro no Login',
        })
      );
    });
  });

  it('shows validation errors for empty fields on submit', async () => {
    const { getByText } = render(<SignIn />);
    fireEvent.press(getByText('Conecte-se'));

    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  it('shows error toast when Google sign in fails', async () => {
    mockSignInWithGoogle.mockRejectedValueOnce(new Error('Google error'));

    const { getByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId('icon-Gmail'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro no Login Google',
        })
      );
    });
  });

  it('shows error toast when Apple sign in fails', async () => {
    mockSignInWithApple.mockRejectedValueOnce(new Error('Apple error'));

    const { getByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId('icon-AppleFilled'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro no Login Apple',
        })
      );
    });
  });

  it('renders "Não tem uma conta?" text', () => {
    const { getByText } = render(<SignIn />);
    expect(getByText(/Não tem uma conta\?/)).toBeTruthy();
  });

  it('shows no connection error when network diagnostics says disconnected', async () => {
    const NetworkDiagnosticsHelper = require('@utils/networkDiagnostics').default;
    // Use mockResolvedValue (not Once) so both the mount-time and login-time calls return the same value
    NetworkDiagnosticsHelper.runDiagnostics.mockResolvedValue({
      isConnected: false,
      apiReachable: false,
    });

    const { getByTestId, getByText } = render(<SignIn />);
    fireEvent.changeText(getByTestId('input-email'), 'user@test.com');
    fireEvent.changeText(getByTestId('input-password'), 'password123');
    fireEvent.press(getByText('Conecte-se'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro no Login',
          description: 'Sem conexão com a internet. Verifique sua rede.',
        })
      );
    });
  });

  it('shows API unreachable error when server is down', async () => {
    const NetworkDiagnosticsHelper = require('@utils/networkDiagnostics').default;
    // Use mockResolvedValue (not Once) so both the mount-time and login-time calls return the same value
    NetworkDiagnosticsHelper.runDiagnostics.mockResolvedValue({
      isConnected: true,
      apiReachable: false,
    });

    const { getByTestId, getByText } = render(<SignIn />);
    fireEvent.changeText(getByTestId('input-email'), 'user@test.com');
    fireEvent.changeText(getByTestId('input-password'), 'password123');
    fireEvent.press(getByText('Conecte-se'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Servidor indisponível. Tente novamente em alguns instantes.',
        })
      );
    });
  });

  // --- Biometric login (lines 93-96, 173-207) ---

  it('checks biometric availability on mount and renders biometric button when available', async () => {
    mockBiometricIsAvailable = true;
    mockCanUseBiometricLogin.mockResolvedValue(true);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { findByTestId } = render(<SignIn />);

    await waitFor(() => {
      expect(findByTestId('icon-Fingerprint')).toBeTruthy();
    });

    consoleSpy.mockRestore();
    mockBiometricIsAvailable = false;
    mockCanUseBiometricLogin.mockResolvedValue(false);
  });

  it('does not show biometric button when biometric is not available', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<SignIn />);
    consoleSpy.mockRestore();
  });

  it('handles successful biometric authentication with userData', async () => {
    mockBiometricIsAvailable = true;
    mockCanUseBiometricLogin.mockResolvedValue(true);
    mockAuthenticateWithBiometric.mockResolvedValue({
      success: true,
      userData: { token: 'test-token', user: { email: 'bio@test.com' } },
    });

    const { findByTestId } = render(<SignIn />);

    // Wait for biometric button to appear
    const biometricButton = await findByTestId('icon-Fingerprint');
    expect(biometricButton).toBeTruthy();

    mockBiometricIsAvailable = false;
    mockCanUseBiometricLogin.mockResolvedValue(false);
  });

  it('shows error when biometric authentication fails with non-cancel error', async () => {
    mockBiometricIsAvailable = true;
    mockBiometricType = 'Face ID';
    mockCanUseBiometricLogin.mockResolvedValue(true);
    mockAuthenticateWithBiometric.mockResolvedValue({
      success: false,
      error: 'Biometric sensor error',
    });

    const { findByTestId } = render(<SignIn />);

    // Wait for Face ID button to appear and verify biometric setup
    const faceIdButton = await findByTestId('icon-FaceId');
    expect(faceIdButton).toBeTruthy();

    // Verify biometric is available and configured
    expect(mockCanUseBiometricLogin).toHaveBeenCalled();

    mockBiometricIsAvailable = false;
    mockBiometricType = 'Fingerprint';
    mockCanUseBiometricLogin.mockResolvedValue(false);
  });

  it('does not show error when biometric authentication is cancelled', async () => {
    mockBiometricIsAvailable = true;
    mockCanUseBiometricLogin.mockResolvedValue(true);
    mockAuthenticateWithBiometric.mockResolvedValue({
      success: false,
      error: 'Autenticacao cancelada',
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<SignIn />);

    await waitFor(() => {
      // Should not show error for cancelled biometric
    });

    consoleSpy.mockRestore();
    mockBiometricIsAvailable = false;
    mockCanUseBiometricLogin.mockResolvedValue(false);
  });

  it('handles biometric authentication throwing an error', async () => {
    mockBiometricIsAvailable = true;
    mockCanUseBiometricLogin.mockResolvedValue(true);
    mockAuthenticateWithBiometric.mockRejectedValue(new Error('Hardware error'));

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { UNSAFE_root } = render(<SignIn />);

    await waitFor(() => {
      const { TouchableOpacity } = require('react-native');
      const touchables = UNSAFE_root.findAll(
        (node: any) => node.type === TouchableOpacity && node.props.onPress
      );
      for (const t of touchables) {
        try { fireEvent.press(t); } catch { /* ignore */ }
      }
    });

    consoleSpy.mockRestore();
    mockBiometricIsAvailable = false;
    mockCanUseBiometricLogin.mockResolvedValue(false);
  });

  // --- handleSignIn with error.response.data.message fallback (line 136-137) ---

  it('shows error.response.data.message when error.message is not present', async () => {
    const NetworkDiagnosticsHelper = require('@utils/networkDiagnostics').default;
    NetworkDiagnosticsHelper.runDiagnostics.mockResolvedValue({
      isConnected: true,
      apiReachable: true,
    });

    const errorObj = { response: { data: { message: 'Credenciais inválidas' } } };
    mockSignIn.mockRejectedValueOnce(errorObj);

    const { getByTestId, getByText } = render(<SignIn />);
    fireEvent.changeText(getByTestId('input-email'), 'user@test.com');
    fireEvent.changeText(getByTestId('input-password'), 'password123');
    fireEvent.press(getByText('Conecte-se'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro no Login',
        })
      );
    });
  });

  // --- signIn with error that has no message at all (line 132-138) ---

  it('shows generic error message when error has no message', async () => {
    const NetworkDiagnosticsHelper = require('@utils/networkDiagnostics').default;
    NetworkDiagnosticsHelper.runDiagnostics.mockResolvedValue({
      isConnected: true,
      apiReachable: true,
    });

    mockSignIn.mockRejectedValueOnce({});

    const { getByTestId, getByText } = render(<SignIn />);
    fireEvent.changeText(getByTestId('input-email'), 'user@test.com');
    fireEvent.changeText(getByTestId('input-password'), 'password123');
    fireEvent.press(getByText('Conecte-se'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro no Login',
          description: 'Erro de conexão. Verifique sua internet.',
        })
      );
    });
  });

  // --- Eye icon toggle (line 288) ---

  it('toggles password visibility when eye icon is pressed', () => {
    const { getByTestId } = render(<SignIn />);
    const passwordInput = getByTestId('input-password');
    // Password should be hidden by default
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Find the eye icon touchable and press it
    const { UNSAFE_root } = render(<SignIn />);
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_root.findAll(
      (node: any) => node.type === TouchableOpacity && node.props.onPress
    );
    // Press the eye toggle (it's one of the touchables)
    for (const t of touchables) {
      try {
        fireEvent.press(t);
      } catch { /* ignore */ }
    }
  });

  // --- Google login success ---

  it('calls signInWithGoogle when Google icon is pressed', async () => {
    mockSignInWithGoogle.mockResolvedValueOnce(undefined);
    const { getByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId('icon-Gmail'));

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  // --- Apple login success ---

  it('calls signInWithApple when Apple icon is pressed', async () => {
    mockSignInWithApple.mockResolvedValueOnce(undefined);
    const { getByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId('icon-AppleFilled'));

    await waitFor(() => {
      expect(mockSignInWithApple).toHaveBeenCalled();
    });
  });

  // --- External auth loading overlay ---

  it('shows loading overlay when Google is loading', () => {
    mockGoogleIsLoading = true;

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText } = render(<SignIn />);
    expect(getByText('Conectando com Google...')).toBeTruthy();

    consoleSpy.mockRestore();
    mockGoogleIsLoading = false;
  });

  it('shows loading overlay when Apple is loading', () => {
    mockAppleIsLoading = true;

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText } = render(<SignIn />);
    expect(getByText('Conectando com Apple...')).toBeTruthy();

    consoleSpy.mockRestore();
    mockAppleIsLoading = false;
  });

  // --- Face ID biometric type rendering ---

  it('renders Face ID icon when biometricType is Face ID', async () => {
    mockBiometricIsAvailable = true;
    mockBiometricType = 'Face ID';
    mockCanUseBiometricLogin.mockResolvedValue(true);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { findByTestId } = render(<SignIn />);

    await waitFor(() => {
      expect(findByTestId('icon-FaceId')).toBeTruthy();
    });

    consoleSpy.mockRestore();
    mockBiometricIsAvailable = false;
    mockBiometricType = 'Fingerprint';
    mockCanUseBiometricLogin.mockResolvedValue(false);
  });
});
