import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Gender } from './gender';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Flex: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Checkbox: ({ 'aria-label': ariaLabel, isChecked, ...p }: any) => (
      <RN.View {...p} testID={`checkbox-${ariaLabel}`} accessibilityState={{ checked: isChecked }} />
    ),
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: ({ color }: any) => null,
  FemaleIcon: () => null,
  MaleIcon: () => null,
}));
jest.mock('@assets/png/vector-5.png', () => 'Vector1');
jest.mock('@assets/png/vector-6.png', () => 'Vector2');

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms/Button/button', () => {
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

describe('Gender', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnboardingData = {};
  });

  it('renders the title text', () => {
    const { getByText } = render(<Gender />);
    expect(getByText('Qual seu Gênero?')).toBeTruthy();
  });

  it('renders the description text', () => {
    const { getByText } = render(<Gender />);
    expect(getByText(/Selecione seu gênero para uma melhor/)).toBeTruthy();
  });

  it('renders female and male labels', () => {
    const { getByText } = render(<Gender />);
    expect(getByText('Eu sou Mulher')).toBeTruthy();
    expect(getByText('Eu sou Homem')).toBeTruthy();
  });

  it('renders Continuar and Prefiro pular isto buttons', () => {
    const { getByText } = render(<Gender />);
    expect(getByText('Continuar')).toBeTruthy();
    expect(getByText('Prefiro pular isto')).toBeTruthy();
  });

  it('selects female when female card is pressed', () => {
    const { getByText } = render(<Gender />);
    fireEvent.press(getByText('Eu sou Mulher'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ gender: 'F' })
    );
  });

  it('selects male when male card is pressed', () => {
    const { getByText } = render(<Gender />);
    fireEvent.press(getByText('Eu sou Homem'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ gender: 'M' })
    );
  });

  it('calls handleNextStep when Continuar is pressed', () => {
    const { getByText } = render(<Gender />);
    fireEvent.press(getByText('Continuar'));
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  it('calls handleNextStep when skip button is pressed', () => {
    const { getByText } = render(<Gender />);
    fireEvent.press(getByText('Prefiro pular isto'));
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  it('loads existing gender from onboarding data (F)', () => {
    mockOnboardingData = { gender: 'F' };
    render(<Gender />);
    // The useEffect loads the gender and auto-saves it via the second useEffect
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ gender: 'F' })
    );
  });

  it('loads existing gender from onboarding data (M) and scrolls', () => {
    mockOnboardingData = { gender: 'M' };
    render(<Gender />);
    // Should attempt to scroll to end
    // No crash
  });

  it('auto-saves onboardingData when gender changes', () => {
    const { getByText } = render(<Gender />);
    fireEvent.press(getByText('Eu sou Mulher'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ gender: 'F' })
    );

    fireEvent.press(getByText('Eu sou Homem'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ gender: 'M' })
    );
  });
});
