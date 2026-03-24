import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PasswordConfig } from './passwordConfig';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Flex: mockComponent('Flex'),
    Icon: mockComponent('Icon'),
    HStack: mockComponent('HStack'),
    VStack: mockComponent('VStack'),
    Box: mockComponent('Box'),
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
const mockResetPassword = jest.fn();
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    resetPassword: mockResetPassword,
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

// ── Icons mock ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  const icon = (name: string) => (props: any) => <RN.View testID={`icon-${name}`} {...props} />;
  return {
    ArrowIcon: icon('Arrow'),
    CheckIcon: icon('Check'),
    EyeIcon: icon('Eye'),
    CloseIcon: icon('Close'),
  };
});

// ── Molecules / Atoms ──
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderTitle: ({ title, withBackButton }: any) => (
      <RN.View testID="header-title">
        {title && <RN.Text>{title}</RN.Text>}
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

describe('PasswordConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title "Configuração de senha"', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText('Configuração de senha')).toBeTruthy();
  });

  it('renders password and confirm password input fields', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText('Nava Senha')).toBeTruthy();
    expect(getByText('Confirmar Senha')).toBeTruthy();
  });

  it('renders the "Continuar" button', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('renders the back button and navigates to code on press', () => {
    const { getByTestId } = render(<PasswordConfig />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith('code');
  });

  it('renders password strength indicator text starting at "Muito Fraca"', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText('Senha forte:')).toBeTruthy();
    expect(getByText('Muito Fraca!')).toBeTruthy();
  });

  it('renders password rule indicators', () => {
    const { getByText } = render(<PasswordConfig />);
    expect(getByText('Incluir letra maiúscula')).toBeTruthy();
    expect(getByText('Incluir letra minúscula')).toBeTruthy();
    expect(getByText('Incluir números')).toBeTruthy();
    expect(getByText('8 caracteres')).toBeTruthy();
    expect(getByText('Incluir Caracter Especial')).toBeTruthy();
  });

  it('allows typing in password input', () => {
    const { getByTestId } = render(<PasswordConfig />);
    const passwordInput = getByTestId('input-Nava Senha');
    fireEvent.changeText(passwordInput, 'Test1234!');
    expect(passwordInput.props.value).toBe('Test1234!');
  });

  it('allows typing in confirm password input', () => {
    const { getByTestId } = render(<PasswordConfig />);
    const confirmInput = getByTestId('input-Confirmar Senha');
    fireEvent.changeText(confirmInput, 'Test1234!');
    expect(confirmInput.props.value).toBe('Test1234!');
  });

  it('updates strength text to "Maravilhosa" when all rules are met', async () => {
    const { getByTestId, getByText } = render(<PasswordConfig />);
    const passwordInput = getByTestId('input-Nava Senha');

    fireEvent.changeText(passwordInput, 'Abc1234!@');

    await waitFor(() => {
      expect(getByText('Maravilhosa!')).toBeTruthy();
    });
  });

  it('updates strength text to "Fraca" with only 2 rules met', async () => {
    const { getByTestId, getByText } = render(<PasswordConfig />);
    const passwordInput = getByTestId('input-Nava Senha');

    // Only lowercase and numeric => 2 rules
    fireEvent.changeText(passwordInput, 'abc1');

    await waitFor(() => {
      expect(getByText('Fraca!')).toBeTruthy();
    });
  });

  it('updates strength text to "Da para melhorar" with 3 rules', async () => {
    const { getByTestId, getByText } = render(<PasswordConfig />);
    const passwordInput = getByTestId('input-Nava Senha');

    // lowercase, uppercase, numeric => 3 rules
    fireEvent.changeText(passwordInput, 'Abc1');

    await waitFor(() => {
      expect(getByText('Da para melhorar!')).toBeTruthy();
    });
  });

  it('updates strength text to "Quase Ok" with 4 rules', async () => {
    const { getByTestId, getByText } = render(<PasswordConfig />);
    const passwordInput = getByTestId('input-Nava Senha');

    // lowercase, uppercase, numeric, special => 4 rules (no length)
    fireEvent.changeText(passwordInput, 'Abc1!');

    await waitFor(() => {
      expect(getByText('Quase Ok!')).toBeTruthy();
    });
  });

  it('calls resetPassword and navigates to successPasswordChange on valid submission', async () => {
    mockResetPassword.mockResolvedValueOnce(undefined);

    const { getByTestId, getByText } = render(<PasswordConfig />);
    fireEvent.changeText(getByTestId('input-Nava Senha'), 'NewPass1!');
    fireEvent.changeText(getByTestId('input-Confirmar Senha'), 'NewPass1!');
    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('NewPass1!', 'NewPass1!');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('successPasswordChange');
    });
  });

  it('shows error toast when resetPassword fails', async () => {
    mockResetPassword.mockRejectedValueOnce({
      response: { data: { message: 'Token expirado' } },
    });

    const { getByTestId, getByText } = render(<PasswordConfig />);
    fireEvent.changeText(getByTestId('input-Nava Senha'), 'NewPass1!');
    fireEvent.changeText(getByTestId('input-Confirmar Senha'), 'NewPass1!');
    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Não foi possível salvar nova senha',
          description: 'Token expirado',
        })
      );
    });
  });

  it('does not submit when password fields are empty', async () => {
    const { getByText } = render(<PasswordConfig />);
    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockResetPassword).not.toHaveBeenCalled();
    });
  });

  it('does not submit when passwords do not match', async () => {
    const { getByTestId, getByText } = render(<PasswordConfig />);
    fireEvent.changeText(getByTestId('input-Nava Senha'), 'NewPass1!');
    fireEvent.changeText(getByTestId('input-Confirmar Senha'), 'DiffPass1!');
    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockResetPassword).not.toHaveBeenCalled();
    });
  });
});
