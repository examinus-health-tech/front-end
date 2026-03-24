import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Security } from './security';

const mockNavigate = jest.fn();
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
const mockEnableBiometric = jest.fn();
const mockDisableBiometric = jest.fn();
const mockCheckBiometricEnabled = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    IScrollViewProps: {},
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    StatusBar: (props: any) => <RN.View {...props} />,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('../components/header/header', () => ({
  Header: ({ title, handleBackTo }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="header-back" onPress={handleBackTo}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('../components/card/card', () => ({
  Card: ({ title, subTitle, switchValue, onSwitchChange, disabled, comingSoon, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID={`card-${title}`}>
        <RN.Text>{title}</RN.Text>
        {subTitle && <RN.Text>{subTitle}</RN.Text>}
        {onSwitchChange && !comingSoon && (
          <RN.TouchableOpacity
            testID={`switch-${title}`}
            onPress={() => onSwitchChange(!switchValue)}
            disabled={disabled}
          >
            <RN.Text>{switchValue ? 'ON' : 'OFF'}</RN.Text>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  },
}));

jest.mock('src/hooks/useBiometricAuth', () => ({
  useBiometricAuth: () => ({
    isAvailable: true,
    isEnabled: false,
    biometricType: 'Face ID',
    enableBiometric: mockEnableBiometric,
    disableBiometric: mockDisableBiometric,
    checkBiometricEnabled: mockCheckBiometricEnabled,
    isLoading: false,
  }),
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      userId: 'user-123',
      email: 'test@example.com',
    },
  }),
}));

jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

describe('Security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnableBiometric.mockResolvedValue({ success: true });
    mockDisableBiometric.mockResolvedValue(true);
  });

  it('renders the header with "Segurança" title', () => {
    const { getByText } = render(<Security />);
    expect(getByText('Segurança')).toBeTruthy();
  });

  it('renders all security cards', () => {
    const { getByText } = render(<Security />);
    expect(getByText('Lembrar Senha')).toBeTruthy();
    expect(getByText(/Entrar com Face ID/)).toBeTruthy();
    expect(getByText('Google Authenticator')).toBeTruthy();
    expect(getByText('Meus Dispositivos')).toBeTruthy();
  });

  it('renders biometric card with correct subtitle when available and not enabled', () => {
    const { getByText } = render(<Security />);
    expect(getByText('Ative para entrar usando face id')).toBeTruthy();
  });

  it('checks biometric enabled on mount with userId', () => {
    render(<Security />);
    expect(mockCheckBiometricEnabled).toHaveBeenCalledWith('user-123');
  });

  it('enables biometric when switch is toggled on', async () => {
    const { getByTestId } = render(<Security />);

    await act(async () => {
      fireEvent.press(getByTestId('switch-Entrar com Face ID'));
    });

    await waitFor(() => {
      expect(mockEnableBiometric).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows success toast when biometric is enabled successfully', async () => {
    mockEnableBiometric.mockResolvedValue({ success: true });
    const { getByTestId } = render(<Security />);

    await act(async () => {
      fireEvent.press(getByTestId('switch-Entrar com Face ID'));
    });

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Biometria habilitada!' })
      );
    });
  });

  it('shows error toast when biometric enable fails', async () => {
    mockEnableBiometric.mockResolvedValue({ success: false, error: 'Sensor error' });
    const { getByTestId } = render(<Security />);

    await act(async () => {
      fireEvent.press(getByTestId('switch-Entrar com Face ID'));
    });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Erro' })
      );
    });
  });

  it('does not show toast when biometric enable is cancelled', async () => {
    mockEnableBiometric.mockResolvedValue({ success: false, error: 'Autenticação cancelada' });
    const { getByTestId } = render(<Security />);

    await act(async () => {
      fireEvent.press(getByTestId('switch-Entrar com Face ID'));
    });

    await waitFor(() => {
      expect(mockShowError).not.toHaveBeenCalled();
      expect(mockShowSuccess).not.toHaveBeenCalled();
    });
  });

  it('navigates to myAccount when header back is pressed', () => {
    const { getByTestId } = render(<Security />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('myAccount');
  });

  it('renders Lembrar Senha card subtitle', () => {
    const { getByText } = render(<Security />);
    expect(getByText('Salvar email para preenchimento automatico')).toBeTruthy();
  });

  it('renders Meus Dispositivos card with value', () => {
    const { getByText } = render(<Security />);
    expect(getByText('Gerencie seus dispositivos conectados')).toBeTruthy();
  });
});
