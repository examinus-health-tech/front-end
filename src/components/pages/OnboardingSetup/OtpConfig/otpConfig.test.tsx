import React from 'react';
import { render } from '@testing-library/react-native';
import { OtpConfig } from './otpConfig';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Flex: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Icon: ({ as: AsComponent, ...p }: any) => <RN.View {...p} />,
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
  TelephoneIcon: () => null,
}));
jest.mock('@assets/png/vector-15.png', () => 'Vector');

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
    Input: ({ label, ...p }: any) => {
      const RN2 = require('react-native');
      return <RN2.TextInput testID="phone-input" {...p} />;
    },
  };
});

describe('OtpConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header title', () => {
    const { getByText } = render(<OtpConfig />);
    expect(getByText('OTP Configuração')).toBeTruthy();
  });

  it('renders the SMS message text', () => {
    const { getByText } = render(<OtpConfig />);
    expect(getByText(/Enviaremos uma mensagem SMS única/)).toBeTruthy();
  });

  it('renders the phone input', () => {
    const { getByTestId } = render(<OtpConfig />);
    expect(getByTestId('phone-input')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<OtpConfig />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('renders the vector image', () => {
    const { getByLabelText } = render(<OtpConfig />);
    expect(getByLabelText('X examinus Logo')).toBeTruthy();
  });

  it('renders without crash', () => {
    const { toJSON } = render(<OtpConfig />);
    expect(toJSON()).toBeTruthy();
  });
});
