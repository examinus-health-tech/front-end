import React from 'react';
import { render } from '@testing-library/react-native';
import { OtpSecurity } from './otpSecurity';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms/Button/button', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID="continue-button" onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderTitle: ({ title, ...p }: any) => (
      <RN.View testID="header-title"><RN.Text>{title}</RN.Text></RN.View>
    ),
    Input: require("react").forwardRef(({ placeholder, ...p }: any, ref: any) => {
      const RN2 = require('react-native');
      return <RN2.TextInput ref={ref} testID={`otp-input-${placeholder || 'field'}`} placeholder={placeholder} {...p} />;
    }),
  };
});

describe('OtpSecurity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header title', () => {
    const { getByText } = render(<OtpSecurity />);
    expect(getByText('OTP Segurança')).toBeTruthy();
  });

  it('renders the instruction text', () => {
    const { getByText } = render(<OtpSecurity />);
    expect(getByText(/Por favor, digite o código de 4 dígitos/)).toBeTruthy();
  });

  it('renders four OTP input fields', () => {
    const { getAllByTestId } = render(<OtpSecurity />);
    const fields = getAllByTestId(/otp-input/);
    expect(fields.length).toBe(4);
  });

  it('renders the continue button', () => {
    const { getByText } = render(<OtpSecurity />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('renders the resend text', () => {
    const { getByText } = render(<OtpSecurity />);
    expect(getByText(/Não recebeu nenhum código?/)).toBeTruthy();
    expect(getByText('Reenviar.')).toBeTruthy();
  });

  it('renders without crash', () => {
    const { toJSON } = render(<OtpSecurity />);
    expect(toJSON()).toBeTruthy();
  });
});
