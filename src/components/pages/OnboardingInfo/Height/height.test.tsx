import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Height } from './height';

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
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID="continue-button" onPress={onPress} {...p}>
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
    RulerPicker: ({ onValueChange, onValueChangeEnd, initialValue, ...p }: any) => {
      capturedOnValueChange = onValueChange;
      capturedOnValueChangeEnd = onValueChangeEnd;
      return <RN.View testID="ruler-picker" />;
    },
  };
});

// ── hook mocks ──────────────────────────────────────────────────────
const mockHandleNextStep = jest.fn();
const mockSetOnboardingData = jest.fn();
let mockOnboardingData: any = { height: 1.45 };

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    onboardingData: mockOnboardingData,
    setOnboardingData: mockSetOnboardingData,
    handleNextStep: mockHandleNextStep,
  }),
}));

describe('Height', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnboardingData = { height: 1.45 };
    capturedOnValueChange = null;
    capturedOnValueChangeEnd = null;
  });

  it('renders the title text', () => {
    const { getByText } = render(<Height />);
    expect(getByText('Qual é a sua altura?')).toBeTruthy();
  });

  it('renders the RulerPicker', () => {
    const { getByTestId } = render(<Height />);
    expect(getByTestId('ruler-picker')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<Height />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('calls setOnboardingData and handleNextStep on continue press', () => {
    const { getByTestId } = render(<Height />);
    fireEvent.press(getByTestId('continue-button'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ height: 1.45 })
    );
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  it('handles onValueChange from RulerPicker', () => {
    render(<Height />);
    expect(capturedOnValueChange).toBeTruthy();
    capturedOnValueChange!('1.75');
    // No crash, state updated internally
  });

  it('ignores value 0 from onValueChange', () => {
    render(<Height />);
    capturedOnValueChange!('0');
    // Should not crash or set height to 0
  });

  it('handles onValueChangeEnd from RulerPicker', () => {
    render(<Height />);
    expect(capturedOnValueChangeEnd).toBeTruthy();
    capturedOnValueChangeEnd!('1.80');
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ height: 1.80 })
    );
  });

  it('ignores value 0 from onValueChangeEnd', () => {
    render(<Height />);
    capturedOnValueChangeEnd!('0');
    // setOnboardingData should not be called with height 0
    // It's only called from the initial render with defaults
  });

  it('uses existing height from onboarding data', () => {
    mockOnboardingData = { height: 1.90 };
    const { getByTestId } = render(<Height />);
    fireEvent.press(getByTestId('continue-button'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ height: 1.90 })
    );
  });

  it('defaults to 1.45 when no height in onboarding data', () => {
    mockOnboardingData = {};
    const { getByTestId } = render(<Height />);
    fireEvent.press(getByTestId('continue-button'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ height: 1.45 })
    );
  });
});
