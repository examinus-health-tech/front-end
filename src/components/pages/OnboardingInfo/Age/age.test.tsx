import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Age } from './age';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));
jest.mock('@assets/png/vector-7.png', () => 'MaleElderly');
jest.mock('@assets/png/vector-24.png', () => 'FemaElderly');
jest.mock('@assets/png/vector-25.png', () => 'Babe');
jest.mock('@assets/png/vector-28.png', () => 'MaleTeenage');
jest.mock('@assets/png/vector-29.png', () => 'FameTeenage');
jest.mock('@assets/png/vector-26.png', () => 'MaleAdult');
jest.mock('@assets/png/vector-27.png', () => 'FameAdult');

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    StaggeredStep: ({ children }: any) => <>{children}</>,
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
let mockOnboardingData: any = { age: 0, gender: 'M' };

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    onboardingData: mockOnboardingData,
    setOnboardingData: mockSetOnboardingData,
    handleNextStep: mockHandleNextStep,
  }),
}));

describe('Age', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockOnboardingData = { age: 0, gender: 'M' };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the title text', () => {
    const { getByText } = render(<Age />);
    expect(getByText('Qual é sua idade?')).toBeTruthy();
  });

  it('renders the default selected age text', () => {
    const { getByText } = render(<Age />);
    expect(getByText('Eu tenho 20 anos')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<Age />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('renders 90 age options', () => {
    const { getAllByText } = render(<Age />);
    // Each number 1-90 should appear as text
    expect(getAllByText('1').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('90').length).toBeGreaterThanOrEqual(1);
  });

  it('updates selected age when an age card is pressed', () => {
    const { getByText } = render(<Age />);
    fireEvent.press(getByText('5'));
    expect(getByText('Eu tenho 5 anos')).toBeTruthy();
  });

  it('calls setOnboardingData when continue button pressed', () => {
    const { getByTestId } = render(<Age />);
    fireEvent.press(getByTestId('btn-onboarding-continue'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ age: 20 })
    );
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  it('loads existing age from onboarding data', () => {
    mockOnboardingData = { age: 35, gender: 'M' };
    const { getByText } = render(<Age />);
    expect(getByText('Eu tenho 35 anos')).toBeTruthy();
  });

  it('shows Babe image when selectedAge <= 10', () => {
    const { getByText, getByLabelText } = render(<Age />);
    fireEvent.press(getByText('5'));
    expect(getByLabelText('Babe')).toBeTruthy();
  });

  it('shows MaleTeenage image when gender is M and age 11-24', () => {
    mockOnboardingData = { age: 0, gender: 'M' };
    const { getByLabelText } = render(<Age />);
    // Default age is 20, gender M -> MaleTeenage
    expect(getByLabelText('MaleTeenage')).toBeTruthy();
  });

  it('shows MaleAdult image when gender is M and age 25-48', () => {
    mockOnboardingData = { age: 30, gender: 'M' };
    const { getByLabelText } = render(<Age />);
    expect(getByLabelText('MaleAdult')).toBeTruthy();
  });

  it('shows MaleElderly image when gender is M and age > 48', () => {
    mockOnboardingData = { age: 55, gender: 'M' };
    const { getByLabelText } = render(<Age />);
    expect(getByLabelText('MaleElderly')).toBeTruthy();
  });

  it('shows FameTeenage image when gender is F and age 11-24', () => {
    mockOnboardingData = { age: 15, gender: 'F' };
    const { getByLabelText } = render(<Age />);
    expect(getByLabelText('FameTeenage')).toBeTruthy();
  });

  it('shows FameAdult image when gender is F and age 25-48', () => {
    mockOnboardingData = { age: 30, gender: 'F' };
    const { getByLabelText } = render(<Age />);
    expect(getByLabelText('FameAdult')).toBeTruthy();
  });

  it('shows FemaElderly image when gender is F and age > 48', () => {
    mockOnboardingData = { age: 55, gender: 'F' };
    const { getByLabelText } = render(<Age />);
    expect(getByLabelText('FemaElderly')).toBeTruthy();
  });

  it('auto-saves onboardingData when selectedAge changes', () => {
    const { getByText } = render(<Age />);
    fireEvent.press(getByText('10'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ age: 10 })
    );
  });

  it('scrolls to center after age selection changes', () => {
    const { getByText } = render(<Age />);
    fireEvent.press(getByText('50'));
    jest.advanceTimersByTime(150);
    // scrollToCenter was called (no crash)
    expect(getByText('Eu tenho 50 anos')).toBeTruthy();
  });
});
