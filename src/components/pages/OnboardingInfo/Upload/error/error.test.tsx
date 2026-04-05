import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UploadError } from './error';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    useDisclose: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    }),
    View: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── navigation mock ─────────────────────────────────────────────────
const mockReset = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));
jest.mock('@assets/png/vector-18.png', () => 'Vector');

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID={`btn-${title}`} onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

// ── hook mocks ──────────────────────────────────────────────────────
const mockHandlePreviousStep = jest.fn();
const mockResetOnboardingState = jest.fn().mockResolvedValue(undefined);

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    handlePreviousStep: mockHandlePreviousStep,
    resetOnboardingState: mockResetOnboardingState,
  }),
}));

describe('UploadError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the error title', () => {
    const { getByText } = render(<UploadError />);
    expect(getByText('Não foi possível processar')).toBeTruthy();
  });

  it('renders the explanation text about unsupported exams', () => {
    const { getByText } = render(<UploadError />);
    expect(getByText(/Alguns tipos de exames ainda não são suportados/)).toBeTruthy();
  });

  it('renders the suggestion text', () => {
    const { getByText } = render(<UploadError />);
    expect(getByText(/Tente enviar exames laboratoriais/)).toBeTruthy();
  });

  it('renders the retry button', () => {
    const { getByText } = render(<UploadError />);
    expect(getByText('Tentar outro exame')).toBeTruthy();
  });

  it('renders the skip link', () => {
    const { getByText } = render(<UploadError />);
    expect(getByText('fazer isso mais tarde')).toBeTruthy();
  });

  it('calls handlePreviousStep when retry button is pressed', () => {
    const { getByText } = render(<UploadError />);
    fireEvent.press(getByText('Tentar outro exame'));
    expect(mockHandlePreviousStep).toHaveBeenCalled();
  });

  it('resets onboarding state and navigates to homepage when skip is pressed', async () => {
    const { getByText } = render(<UploadError />);
    fireEvent.press(getByText('fazer isso mais tarde'));
    await waitFor(() => {
      expect(mockResetOnboardingState).toHaveBeenCalled();
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'homepage' }],
      });
    });
  });

  it('renders the illustration image', () => {
    const { getByLabelText } = render(<UploadError />);
    expect(getByLabelText('Vetor')).toBeTruthy();
  });
});
