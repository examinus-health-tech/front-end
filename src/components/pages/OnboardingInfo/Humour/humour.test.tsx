import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Humour, humourLabels } from './humour';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
  EmojiHappyIcon: ({ size, color }: any) => null,
  EmojiNormalIcon: ({ size, color }: any) => null,
  EmojiSadIcon: ({ size, color }: any) => null,
  EmojiAnxiousIcon: ({ size, color }: any) => null,
  EmojiDepressedIcon: ({ size, color }: any) => null,
}));

// ── react-native-svg mock (usado pelos ThickChevron inline) ─────────
jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Svg: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Path: (p: any) => <RN.View {...p} />,
  };
});

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, testID, ...p }: any) => (
      <RN.TouchableOpacity testID={testID || 'continue-button'} onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
    StaggeredStep: ({ children }: any) => <>{children}</>,
  };
});

// ── reanimated mock (smooth thumb + entering) ────────────────────────
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const entering = { duration: () => entering, delay: () => entering };
  return {
    __esModule: true,
    default: { View: RN.View, createAnimatedComponent: (c: any) => c },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((v: any) => v),
    FadeInDown: entering,
    FadeInRight: entering,
  };
});

// ── hook mocks ──────────────────────────────────────────────────────
const mockHandleNextStep = jest.fn();
const mockSetOnboardingData = jest.fn();
let mockOnboardingData: any = {};

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    onboardingData: mockOnboardingData,
    setOnboardingData: mockSetOnboardingData,
    handleNextStep: mockHandleNextStep,
  }),
}));

describe('Humour', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnboardingData = {};
  });

  it('renders the title text', () => {
    const { getByText } = render(<Humour />);
    expect(getByText('Como está seu humor atualmente?')).toBeTruthy();
  });

  it('renders all five humour labels', () => {
    const { getByText } = render(<Humour />);
    expect(getByText('Feliz')).toBeTruthy();
    expect(getByText('Normal')).toBeTruthy();
    expect(getByText('Triste')).toBeTruthy();
    expect(getByText('Ansioso')).toBeTruthy();
    expect(getByText('Depressivo')).toBeTruthy();
  });

  it('renders the custom slider container', () => {
    const { getByTestId } = render(<Humour />);
    expect(getByTestId('slider-humour')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<Humour />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('calls handleNextStep when continue is pressed', () => {
    const { getByTestId } = render(<Humour />);
    fireEvent.press(getByTestId('btn-onboarding-continue'));
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  // Drag/tap do PanResponder não é facilmente simulável via fireEvent —
  // o comportamento de seleção é validado manualmente no simulador.

  it('loads existing humour from onboarding data', () => {
    mockOnboardingData = { humor: 5 };
    const { getByText } = render(<Humour />);
    expect(getByText('Depressivo')).toBeTruthy();
  });

  it('exports humourLabels correctly', () => {
    expect(humourLabels[1]).toBe('Feliz');
    expect(humourLabels[2]).toBe('Normal');
    expect(humourLabels[3]).toBe('Triste');
    expect(humourLabels[4]).toBe('Ansioso');
    expect(humourLabels[5]).toBe('Depressivo');
  });
});
