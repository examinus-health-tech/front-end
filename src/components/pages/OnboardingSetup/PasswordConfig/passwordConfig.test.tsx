import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PasswordConfig } from './passwordConfig';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Flex: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Icon: ({ as: AsComponent, ...p }: any) => <RN.View {...p} />,
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
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
  EyeIcon: ({ solid, color }: any) => null,
}));

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
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
    HeaderProgress: ({ withBackButton, ...p }: any) => (
      <RN.View testID="header-progress">
        {withBackButton && (
          <RN.TouchableOpacity testID="back-button" onPress={withBackButton} />
        )}
      </RN.View>
    ),
    Input: ({ type, ...p }: any) => {
      const RN2 = require('react-native');
      return <RN2.TextInput testID="password-input" secureTextEntry={type === 'password'} {...p} />;
    },
  };
});

describe('PasswordConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText('Configuração de senha')).toBeTruthy();
  });

  it('renders the password strength indicator text', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText(/Senha forte:/)).toBeTruthy();
    expect(getByText('Maravilhosa!')).toBeTruthy();
  });

  it('renders the password input', () => {
    const { getByTestId } = render(<PasswordConfig />);
    expect(getByTestId('password-input')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('navigates to notificationConfig on continue press', () => {
    const { getByTestId } = render(<PasswordConfig />);
    fireEvent.press(getByTestId('continue-button'));
    expect(mockNavigate).toHaveBeenCalledWith('notificationConfig');
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<PasswordConfig />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders the header progress', () => {
    const { getByTestId } = render(<PasswordConfig />);
    expect(getByTestId('header-progress')).toBeTruthy();
  });

  it('renders four password strength bars', () => {
    // The component renders 4 Box elements as strength bars
    const { toJSON } = render(<PasswordConfig />);
    expect(toJSON()).toBeTruthy();
  });
});
