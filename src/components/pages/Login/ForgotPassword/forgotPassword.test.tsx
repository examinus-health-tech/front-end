import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ForgotPassword } from './forgotPassword';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Stack: mockComponent('Stack'),
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Flex: mockComponent('Flex'),
    Center: mockComponent('Center'),
    Icon: mockComponent('Icon'),
    HStack: mockComponent('HStack'),
    VStack: mockComponent('VStack'),
    Image: ({ alt, ...props }: any) => <RN.View testID="image-vector" {...props} />,
    ScrollView: ({ children, ...props }: any) => <RN.ScrollView {...props}>{children}</RN.ScrollView>,
    IScrollViewProps: undefined,
  };
});

// ── Navigation mock ──
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));

// ── Auth hooks ──
const mockForgotPassword = jest.fn();
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    forgotPassword: mockForgotPassword,
  }),
}));

const mockShowError = jest.fn();
jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showError: mockShowError,
    showSuccess: jest.fn(),
    showWarning: jest.fn(),
  }),
}));

jest.mock('@utils/AppErrors', () => ({
  AppError: class AppError extends Error {
    constructor(message: string) {
      super(message);
    }
  },
}));

// ── Icons mock ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  const icon = (name: string) => (props: any) => <RN.View testID={`icon-${name}`} {...props} />;
  return {
    MailIcon: icon('Mail'),
  };
});

// ── PNG mock ──
jest.mock('@assets/png/vector-42.png', () => 'mocked-vector');

// ── Molecules / Atoms ──
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderTitle: ({ title, withBackButton }: any) => (
      <RN.View testID="header-title">
        <RN.Text>{title}</RN.Text>
        {withBackButton && (
          <RN.TouchableOpacity testID="back-button" onPress={withBackButton}>
            <RN.Text>Back</RN.Text>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    ),
    Input: ({ label, onChangeText, value, errorMessage, ...props }: any) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={`input-${label}`}
          onChangeText={onChangeText}
          value={value}
          {...props}
        />
        {errorMessage && <RN.Text testID={`error-${label}`}>{errorMessage}</RN.Text>}
      </RN.View>
    ),
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

describe('ForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header title', () => {
    const { getByText } = render(<ForgotPassword />);
    expect(getByText('Esqueci minha senha')).toBeTruthy();
  });

  it('renders the email input field', () => {
    const { getByText } = render(<ForgotPassword />);
    expect(getByText('Confirme seu e-mail para continuar')).toBeTruthy();
  });

  it('renders the "Enviar" button', () => {
    const { getByText } = render(<ForgotPassword />);
    expect(getByText('Enviar')).toBeTruthy();
  });

  it('renders the "Já tem uma conta?" section', () => {
    const { getByText } = render(<ForgotPassword />);
    expect(getByText('Já tem uma conta?')).toBeTruthy();
    expect(getByText(/Conecte-se\./)).toBeTruthy();
  });

  it('renders the back button and navigates to signIn on press', () => {
    const { getByTestId } = render(<ForgotPassword />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith('signIn');
  });

  it('navigates to signIn when "Conecte-se." is pressed', () => {
    const { getByText } = render(<ForgotPassword />);
    fireEvent.press(getByText(/Conecte-se\./));
    expect(mockNavigate).toHaveBeenCalledWith('signIn');
  });

  it('allows typing in email input', () => {
    const { getByTestId } = render(<ForgotPassword />);
    const emailInput = getByTestId('input-Confirme seu e-mail para continuar');
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('calls forgotPassword and navigates to successLink on valid submission', async () => {
    mockForgotPassword.mockResolvedValueOnce(undefined);

    const { getByTestId, getByText } = render(<ForgotPassword />);
    fireEvent.changeText(
      getByTestId('input-Confirme seu e-mail para continuar'),
      'test@example.com'
    );
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('successLink');
    });
  });

  it('shows error toast when forgotPassword fails', async () => {
    mockForgotPassword.mockRejectedValueOnce({
      response: { data: { message: 'Email não encontrado' } },
    });

    const { getByTestId, getByText } = render(<ForgotPassword />);
    fireEvent.changeText(
      getByTestId('input-Confirme seu e-mail para continuar'),
      'wrong@test.com'
    );
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Não foi possível encontrar seu email',
          description: 'Email não encontrado',
        })
      );
    });
  });

  it('does not submit when email is empty', async () => {
    const { getByText } = render(<ForgotPassword />);
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(mockForgotPassword).not.toHaveBeenCalled();
    });
  });

  it('does not submit when email is invalid', async () => {
    const { getByTestId, getByText } = render(<ForgotPassword />);
    fireEvent.changeText(
      getByTestId('input-Confirme seu e-mail para continuar'),
      'invalid-email'
    );
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(mockForgotPassword).not.toHaveBeenCalled();
    });
  });

  it('renders the vector image', () => {
    const { getByTestId } = render(<ForgotPassword />);
    expect(getByTestId('image-vector')).toBeTruthy();
  });
});
