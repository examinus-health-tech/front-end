import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignUp } from './signUp';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Divider: mockComponent('Divider'),
    Stack: mockComponent('Stack'),
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Flex: mockComponent('Flex'),
    Checkbox: ({ children, onChange, isChecked, ...props }: any) => (
      <RN.TouchableOpacity testID="checkbox-rules" onPress={() => onChange(!isChecked)}>
        {children}
      </RN.TouchableOpacity>
    ),
    Icon: mockComponent('Icon'),
    HStack: mockComponent('HStack'),
    Box: mockComponent('Box'),
    FormControl: Object.assign(
      ({ children, ...props }: any) => <RN.View {...props}>{children}</RN.View>,
      {
        ErrorMessage: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
      }
    ),
    WarningOutlineIcon: mockComponent('WarningOutlineIcon'),
    ScrollView: ({ children, ...props }: any) => <RN.ScrollView {...props}>{children}</RN.ScrollView>,
    KeyboardAvoidingView: ({ children, ...props }: any) => <RN.View {...props}>{children}</RN.View>,
    Spinner: mockComponent('Spinner'),
    Center: mockComponent('Center'),
    VStack: mockComponent('VStack'),
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
const mockSignUp = jest.fn();
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
  }),
}));

const mockSignUpWithGoogle = jest.fn();
jest.mock('src/hooks/useGoogleAuth', () => ({
  useGoogleAuth: () => ({
    signUpWithGoogle: mockSignUpWithGoogle,
    isLoading: false,
    isConfigured: true,
  }),
}));

const mockSignUpWithApple = jest.fn();
jest.mock('src/hooks/useAppleAuth', () => ({
  useAppleAuth: () => ({
    signUpWithApple: mockSignUpWithApple,
    isLoading: false,
    isAvailable: true,
  }),
}));

const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showWarning: jest.fn(),
  }),
}));

jest.mock('@services/campaignService', () => ({
  checkCampaignVoucher: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-apple-authentication', () => ({}));

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
    EyeIcon: icon('Eye'),
    FacebookIcon: icon('Facebook'),
    GmailIcon: icon('Gmail'),
    InstagramIcon: icon('Instagram'),
    KeyIcon: icon('Key'),
    MailIcon: icon('Mail'),
    AppleFilledIcon: icon('AppleFilled'),
  };
});

// ── Molecules / Atoms ──
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
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

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main heading', () => {
    const { getByText } = render(<SignUp />);
    expect(getByText('Cadastre-se')).toBeTruthy();
  });

  it('renders all form input fields', () => {
    const { getByText } = render(<SignUp />);
    expect(getByText('Nome')).toBeTruthy();
    expect(getByText('Endereço de e-mail')).toBeTruthy();
    expect(getByText('Senha')).toBeTruthy();
    expect(getByText('Confirme sua senha')).toBeTruthy();
  });

  it('renders the terms checkbox', () => {
    const { getByText } = render(<SignUp />);
    expect(getByText(/Ao continuar você concorda com os Termos de Uso/)).toBeTruthy();
  });

  it('renders the "Cadastrar" button', () => {
    const { getByText } = render(<SignUp />);
    expect(getByText('Cadastrar')).toBeTruthy();
  });

  it('renders "Ou" divider text', () => {
    const { getByText } = render(<SignUp />);
    expect(getByText('Ou')).toBeTruthy();
  });

  it('renders social buttons (Google and Apple)', () => {
    const { getByTestId } = render(<SignUp />);
    expect(getByTestId('icon-Gmail')).toBeTruthy();
    expect(getByTestId('icon-AppleFilled')).toBeTruthy();
  });

  it('renders the "Já tem uma conta?" and "Conecte-se." links', () => {
    const { getByText } = render(<SignUp />);
    expect(getByText('Já tem uma conta?')).toBeTruthy();
    expect(getByText(/Conecte-se\./)).toBeTruthy();
  });

  it('navigates to signIn when "Conecte-se." is pressed', () => {
    const { getByText } = render(<SignUp />);
    fireEvent.press(getByText(/Conecte-se\./));
    expect(mockNavigate).toHaveBeenCalledWith('signIn');
  });

  it('renders the LegalFooter', () => {
    const { getByTestId } = render(<SignUp />);
    expect(getByTestId('legal-footer')).toBeTruthy();
  });

  it('allows typing in name input', () => {
    const { getByTestId } = render(<SignUp />);
    const nameInput = getByTestId('input-Nome');
    fireEvent.changeText(nameInput, 'John Doe');
    expect(nameInput.props.value).toBe('John Doe');
  });

  it('allows typing in email input', () => {
    const { getByTestId } = render(<SignUp />);
    const emailInput = getByTestId('input-Endereço de e-mail');
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('allows typing in password input', () => {
    const { getByTestId } = render(<SignUp />);
    const passwordInput = getByTestId('input-Senha');
    fireEvent.changeText(passwordInput, 'MyPass123!');
    expect(passwordInput.props.value).toBe('MyPass123!');
  });

  it('allows typing in confirm password input', () => {
    const { getByTestId } = render(<SignUp />);
    const confirmInput = getByTestId('input-Confirme sua senha');
    fireEvent.changeText(confirmInput, 'MyPass123!');
    expect(confirmInput.props.value).toBe('MyPass123!');
  });

  it('calls signUp on valid form submission and navigates to signIn', async () => {
    mockSignUp.mockResolvedValueOnce(undefined);

    const { getByTestId, getByText } = render(<SignUp />);

    fireEvent.changeText(getByTestId('input-Nome'), 'John Doe');
    fireEvent.changeText(getByTestId('input-Endereço de e-mail'), 'john@test.com');
    fireEvent.changeText(getByTestId('input-Senha'), 'Password1!');
    fireEvent.changeText(getByTestId('input-Confirme sua senha'), 'Password1!');
    fireEvent.press(getByTestId('checkbox-rules'));
    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('John Doe', 'john@test.com', 'Password1!', 'Password1!');
    });

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Conta criada com sucesso' })
      );
      expect(mockNavigate).toHaveBeenCalledWith('signIn');
    });
  });

  it('shows error toast when signUp fails', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Erro ao criar conta'));

    const { getByTestId, getByText } = render(<SignUp />);

    fireEvent.changeText(getByTestId('input-Nome'), 'John Doe');
    fireEvent.changeText(getByTestId('input-Endereço de e-mail'), 'john@test.com');
    fireEvent.changeText(getByTestId('input-Senha'), 'Password1!');
    fireEvent.changeText(getByTestId('input-Confirme sua senha'), 'Password1!');
    fireEvent.press(getByTestId('checkbox-rules'));
    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Não foi possível criar sua conta' })
      );
    });
  });

  it('shows error when signUp fails with email already in use', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Este email já está sendo utilizado'));

    const { getByTestId, getByText } = render(<SignUp />);

    fireEvent.changeText(getByTestId('input-Nome'), 'John Doe');
    fireEvent.changeText(getByTestId('input-Endereço de e-mail'), 'john@test.com');
    fireEvent.changeText(getByTestId('input-Senha'), 'Password1!');
    fireEvent.changeText(getByTestId('input-Confirme sua senha'), 'Password1!');
    fireEvent.press(getByTestId('checkbox-rules'));
    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalled();
    });
  });

  it('does not submit when required fields are empty', async () => {
    const { getByText } = render(<SignUp />);
    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  it('shows error toast when Google sign up fails', async () => {
    mockSignUpWithGoogle.mockRejectedValueOnce(new Error('Google error'));

    const { getByTestId } = render(<SignUp />);
    fireEvent.press(getByTestId('icon-Gmail'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Erro no Cadastro Google' })
      );
    });
  });

  it('shows error toast when Apple sign up fails', async () => {
    mockSignUpWithApple.mockRejectedValueOnce(new Error('Apple error'));

    const { getByTestId } = render(<SignUp />);
    fireEvent.press(getByTestId('icon-AppleFilled'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Erro no Cadastro Apple' })
      );
    });
  });
});
