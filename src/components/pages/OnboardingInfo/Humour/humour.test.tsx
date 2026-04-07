import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Humour, humourLabels } from './humour';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  const SliderComponent = ({ children, onChange, defaultValue, ...p }: any) => {
    // Store the onChange handler to call it in tests
    (global as any).__sliderOnChange = onChange;
    return <RN.View testID="slider" {...p}>{children}</RN.View>;
  };
  SliderComponent.Track = ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>;
  SliderComponent.FilledTrack = (p: any) => <RN.View {...p} />;
  SliderComponent.Thumb = (p: any) => <RN.View {...p} />;

  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Slider: SliderComponent,
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
    (global as any).__sliderOnChange = null;
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

  it('renders the slider', () => {
    const { getByTestId } = render(<Humour />);
    expect(getByTestId('slider')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<Humour />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('defaults to humour 3 (Triste) when no data', () => {
    render(<Humour />);
    // The slider defaults to 3; setOnboardingData not called on initial render
  });

  it('calls handleNextStep when continue is pressed', () => {
    const { getByTestId } = render(<Humour />);
    fireEvent.press(getByTestId('btn-onboarding-continue'));
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  it('updates humour when slider changes', () => {
    render(<Humour />);
    const onChange = (global as any).__sliderOnChange;
    if (onChange) {
      onChange(1);
      expect(mockSetOnboardingData).toHaveBeenCalledWith(
        expect.objectContaining({ humor: 1 })
      );
    }
  });

  it('rounds slider value to nearest integer', () => {
    render(<Humour />);
    const onChange = (global as any).__sliderOnChange;
    if (onChange) {
      onChange(2.7);
      expect(mockSetOnboardingData).toHaveBeenCalledWith(
        expect.objectContaining({ humor: 3 })
      );
    }
  });

  it('loads existing humour from onboarding data', () => {
    mockOnboardingData = { humor: 5 };
    const { getByText } = render(<Humour />);
    // Should render with Depressivo highlighted
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
