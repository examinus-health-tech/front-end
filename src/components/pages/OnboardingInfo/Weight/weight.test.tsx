import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Weight } from './weight';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, testID, ...p }: any) => (
      <RN.TouchableOpacity testID={testID || 'continue-button'} onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

// ── RulerPicker mock ────────────────────────────────────────────────
let capturedOnValueChange: ((value: string) => void) | null = null;
let capturedOnValueChangeEnd: ((value: string) => void) | null = null;

jest.mock('react-native-ruler-picker', () => {
  const RN = require('react-native');
  return {
    RulerPicker: ({ onValueChange, onValueChangeEnd, ...p }: any) => {
      capturedOnValueChange = onValueChange;
      capturedOnValueChangeEnd = onValueChangeEnd;
      return <RN.View testID="ruler-picker" />;
    },
  };
});

// ── hook mocks ──────────────────────────────────────────────────────
const mockHandleNextStep = jest.fn();
const mockSetOnboardingData = jest.fn();
let mockOnboardingData: any = { weight: 0 };

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    onboardingData: mockOnboardingData,
    setOnboardingData: mockSetOnboardingData,
    handleNextStep: mockHandleNextStep,
  }),
}));

describe('Weight', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnboardingData = { weight: 0 };
    capturedOnValueChange = null;
    capturedOnValueChangeEnd = null;
  });

  it('renders the title text', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Qual é o seu peso?')).toBeTruthy();
  });

  it('renders the RulerPicker', () => {
    const { getByTestId } = render(<Weight />);
    expect(getByTestId('ruler-picker')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('calls setOnboardingData and handleNextStep on continue press', () => {
    const { getByTestId } = render(<Weight />);
    // First set a value via ruler
    capturedOnValueChange!('75');
    fireEvent.press(getByTestId('btn-onboarding-continue'));
    expect(mockSetOnboardingData).toHaveBeenCalled();
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  it('handles onValueChange from RulerPicker', async () => {
    render(<Weight />);
    expect(capturedOnValueChange).toBeTruthy();
    await act(async () => {
      capturedOnValueChange!('80');
    });
    // auto-save triggered
    await waitFor(() => {
      expect(mockSetOnboardingData).toHaveBeenCalledWith(
        expect.objectContaining({ weight: 80 })
      );
    });
  });

  it('handles onValueChangeEnd from RulerPicker', async () => {
    render(<Weight />);
    expect(capturedOnValueChangeEnd).toBeTruthy();
    await act(async () => {
      capturedOnValueChangeEnd!('85');
    });
    await waitFor(() => {
      expect(mockSetOnboardingData).toHaveBeenCalledWith(
        expect.objectContaining({ weight: 85 })
      );
    });
  });

  it('loads existing weight from onboarding data', () => {
    mockOnboardingData = { weight: 70 };
    const { getByTestId } = render(<Weight />);
    fireEvent.press(getByTestId('btn-onboarding-continue'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ weight: 70 })
    );
  });

  it('does not auto-save when weight is 0', () => {
    mockOnboardingData = { weight: 0 };
    render(<Weight />);
    // The useEffect should not call setOnboardingData because weight is 0
    expect(mockSetOnboardingData).not.toHaveBeenCalled();
  });

  it('auto-saves when weight changes to positive value', async () => {
    render(<Weight />);
    await act(async () => {
      capturedOnValueChange!('60');
    });
    await waitFor(() => {
      expect(mockSetOnboardingData).toHaveBeenCalledWith(
        expect.objectContaining({ weight: 60 })
      );
    });
  });
});
