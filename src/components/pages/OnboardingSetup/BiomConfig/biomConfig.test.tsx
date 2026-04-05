import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BiomConfig } from './biomConfig';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    IScrollViewProps: {},
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Spinner: ({ ...p }: any) => <RN.View testID="spinner" {...p} />,
  };
});

// ── navigation mock ─────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
  FingerprintIcon: ({ size, color }: any) => null,
}));
jest.mock('@assets/png/vector-14.png', () => 'Vector');

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms/Button/button', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID={`btn-${title}`} onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderTitle: ({ title, withBackButton, ...p }: any) => (
      <RN.View testID="header-title">
        <RN.Text>{title}</RN.Text>
        {withBackButton && (
          <RN.TouchableOpacity testID="back-button" onPress={withBackButton} />
        )}
      </RN.View>
    ),
  };
});

// ── biometric hook mock ─────────────────────────────────────────────
let mockBiometricValues: any = {
  isAvailable: true,
  isLoading: false,
  biometricType: 'Face ID',
  isEnabled: false,
};

jest.mock('src/hooks/useBiometricAuth', () => ({
  useBiometricAuth: () => mockBiometricValues,
}));

describe('BiomConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBiometricValues = {
      isAvailable: true,
      isLoading: false,
      biometricType: 'Face ID',
      isEnabled: false,
    };
  });

  it('renders loading spinner when isLoading is true', () => {
    mockBiometricValues.isLoading = true;
    const { getByTestId, getByText } = render(<BiomConfig />);
    expect(getByTestId('spinner')).toBeTruthy();
    expect(getByText('Verificando biometria...')).toBeTruthy();
  });

  it('renders biometric available state', () => {
    const { getByText } = render(<BiomConfig />);
    expect(getByText(/Face ID disponível!/)).toBeTruthy();
    expect(getByText(/Seu dispositivo suporta face id/)).toBeTruthy();
  });

  it('renders biometric not available state', () => {
    mockBiometricValues.isAvailable = false;
    const { getByText } = render(<BiomConfig />);
    expect(getByText('Biometria não disponível')).toBeTruthy();
    expect(getByText(/Seu dispositivo não possui biometria/)).toBeTruthy();
  });

  it('renders fallback text when biometricType is null', () => {
    mockBiometricValues.biometricType = null;
    const { getByText } = render(<BiomConfig />);
    expect(getByText(/Biometria disponível!/)).toBeTruthy();
    expect(getByText(/autenticação biométrica/)).toBeTruthy();
  });

  it('renders Skip and Continuar buttons', () => {
    const { getByText } = render(<BiomConfig />);
    expect(getByText('Pular')).toBeTruthy();
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('navigates to otpConfig when Skip is pressed', () => {
    const { getByText } = render(<BiomConfig />);
    fireEvent.press(getByText('Pular'));
    expect(mockNavigate).toHaveBeenCalledWith('otpConfig');
  });

  it('navigates to otpConfig when Continuar is pressed', () => {
    const { getByText } = render(<BiomConfig />);
    fireEvent.press(getByText('Continuar'));
    expect(mockNavigate).toHaveBeenCalledWith('otpConfig');
  });

  it('renders back button and navigates back', () => {
    const { getByTestId } = render(<BiomConfig />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders the header title', () => {
    const { getByText } = render(<BiomConfig />);
    expect(getByText('Configuração de Biometria')).toBeTruthy();
  });

  it('shows the vector image when biometric is not available', () => {
    mockBiometricValues.isAvailable = false;
    const { getByLabelText } = render(<BiomConfig />);
    expect(getByLabelText('X examinus Logo')).toBeTruthy();
  });
});
