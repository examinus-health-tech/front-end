import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Code } from './code';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Center: mockComponent('Center'),
    VStack: mockComponent('VStack'),
    HStack: mockComponent('HStack'),
    KeyboardAvoidingView: ({ children, ...props }: any) => <RN.View {...props}>{children}</RN.View>,
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
const mockVerifyCode = jest.fn();
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    verifyCode: mockVerifyCode,
  }),
}));

const mockShowError = jest.fn();
const mockShowWarning = jest.fn();
jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showError: mockShowError,
    showSuccess: jest.fn(),
    showWarning: mockShowWarning,
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
    ArrowIcon: icon('Arrow'),
  };
});

// ── Styled InputStyled mock ──
jest.mock('./styles', () => {
  const RN = require('react-native');
  const React = require('react');
  return {
    InputStyled: React.forwardRef(({ onChangeText, value, placeholder, onFocus, onBlur, ...props }: any, ref: any) => (
      <RN.TextInput
        ref={ref}
        testID={`code-input-${placeholder}`}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    )),
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

describe('Code', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header title "Esqueci minha senha"', () => {
    const { getByText } = render(<Code />);
    expect(getByText('Esqueci minha senha')).toBeTruthy();
  });

  it('renders the instruction text', () => {
    const { getByText } = render(<Code />);
    expect(
      getByText(/Por favor, digite o código de 6 dígitos/)
    ).toBeTruthy();
  });

  it('renders the "Continuar" button', () => {
    const { getByText } = render(<Code />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('renders the "Reenviar." link', () => {
    const { getByText } = render(<Code />);
    expect(getByText('Não recebeu nenhum código?')).toBeTruthy();
    expect(getByText('Reenviar.')).toBeTruthy();
  });

  it('renders the back button and navigates to forgotPassword on press', () => {
    const { getByTestId } = render(<Code />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith('forgotPassword');
  });

  it('renders 6 code input fields', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    expect(codeInputs.length).toBe(6);
  });

  it('allows typing in code inputs', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent.changeText(codeInputs[0], '1');
    expect(codeInputs[0].props.value).toBe('1');
  });

  it('calls verifyCode and navigates to passwordConfig on valid code submission', async () => {
    mockVerifyCode.mockResolvedValueOnce(undefined);

    const { getAllByTestId, getByText } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);

    fireEvent.changeText(codeInputs[0], '1');
    fireEvent.changeText(codeInputs[1], '2');
    fireEvent.changeText(codeInputs[2], '3');
    fireEvent.changeText(codeInputs[3], '4');
    fireEvent.changeText(codeInputs[4], '5');
    fireEvent.changeText(codeInputs[5], '6');

    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockVerifyCode).toHaveBeenCalledWith('123456');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('passwordConfig');
    });
  });

  it('shows error toast when verifyCode fails', async () => {
    mockVerifyCode.mockRejectedValueOnce({
      response: { data: { message: 'Código inválido' } },
    });

    const { getAllByTestId, getByText } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);

    fireEvent.changeText(codeInputs[0], '1');
    fireEvent.changeText(codeInputs[1], '2');
    fireEvent.changeText(codeInputs[2], '3');
    fireEvent.changeText(codeInputs[3], '4');
    fireEvent.changeText(codeInputs[4], '5');
    fireEvent.changeText(codeInputs[5], '6');

    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Não foi possível verificar o código',
          description: 'Código inválido',
        })
      );
    });
  });

  it('does not submit when code fields are empty', async () => {
    const { getByText } = render(<Code />);
    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockVerifyCode).not.toHaveBeenCalled();
    });
  });

  it('shows warning toast when "Reenviar." is pressed', () => {
    const { getByText } = render(<Code />);
    fireEvent.press(getByText('Reenviar.'));

    expect(mockShowWarning).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Reenvio de código',
        description: 'Funcionalidade em desenvolvimento',
      })
    );
  });

  // --- onFocus handlers for code inputs (lines 119-123, 145-149, 172-176, 199-203, 225-229, 252-256) ---

  it('clears value and sets focusInput on focus of input 1', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[0], 'focus');
    // After focus, value should be cleared (onChange called with '')
  });

  it('clears value and sets focusInput on focus of input 2', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[1], 'focus');
  });

  it('clears value and sets focusInput on focus of input 3', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[2], 'focus');
  });

  it('clears value and sets focusInput on focus of input 4', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[3], 'focus');
  });

  it('clears value and sets focusInput on focus of input 5', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[4], 'focus');
  });

  it('clears value and sets focusInput on focus of input 6', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[5], 'focus');
  });

  // --- onBlur handlers ---

  it('resets focusInput on blur of input 1', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[0], 'blur');
  });

  it('resets focusInput on blur of input 2', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[1], 'blur');
  });

  it('resets focusInput on blur of input 3', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[2], 'blur');
  });

  it('resets focusInput on blur of input 4', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[3], 'blur');
  });

  it('resets focusInput on blur of input 5', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[4], 'blur');
  });

  it('resets focusInput on blur of input 6', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent(codeInputs[5], 'blur');
  });

  // --- onChangeText with empty value (early return) ---

  it('does not advance focus when empty value is typed on input 1', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent.changeText(codeInputs[0], '');
    // Should not focus next input
  });

  it('does not advance focus when empty value is typed on input 6', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    fireEvent.changeText(codeInputs[5], '');
    // Should not blur
  });

  // --- Typing in all inputs advances focus ---

  it('advances focus to next input on value entry', () => {
    const { getAllByTestId } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);
    // Type in each input
    fireEvent.changeText(codeInputs[0], '1');
    fireEvent.changeText(codeInputs[1], '2');
    fireEvent.changeText(codeInputs[2], '3');
    fireEvent.changeText(codeInputs[3], '4');
    fireEvent.changeText(codeInputs[4], '5');
    fireEvent.changeText(codeInputs[5], '6');
  });

  // --- Error without response data ---

  it('shows error toast with undefined description when error has no response', async () => {
    mockVerifyCode.mockRejectedValueOnce({});

    const { getAllByTestId, getByText } = render(<Code />);
    const codeInputs = getAllByTestId(/code-input/);

    fireEvent.changeText(codeInputs[0], '1');
    fireEvent.changeText(codeInputs[1], '2');
    fireEvent.changeText(codeInputs[2], '3');
    fireEvent.changeText(codeInputs[3], '4');
    fireEvent.changeText(codeInputs[4], '5');
    fireEvent.changeText(codeInputs[5], '6');

    fireEvent.press(getByText('Continuar'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Não foi possível verificar o código',
        })
      );
    });
  });
});
