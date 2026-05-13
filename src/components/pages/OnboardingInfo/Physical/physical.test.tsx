import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Physical, enumPhysicalLabel } from './physical';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Divider: (p: any) => <RN.View {...p} />,
    ZStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── navigation mock ─────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));
jest.mock('@assets/png/vector-8.png', () => 'Vector');

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

jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderProgress: (props: any) => <RN.View testID="header-progress" />,
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

describe('Physical', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnboardingData = {};
  });

  it('renders the title text', () => {
    const { getByText } = render(<Physical />);
    expect(getByText('Qual é o seu nível de atividade física atual?')).toBeTruthy();
  });

  it('renders four level buttons (1-4)', () => {
    const { getByText } = render(<Physical />);
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<Physical />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('selects level 1 when pressed', () => {
    const { getByText } = render(<Physical />);
    fireEvent.press(getByText('1'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ workoutLevel: 1, physicalLevel: 1 })
    );
  });

  it('selects level 2 when pressed', () => {
    const { getByText } = render(<Physical />);
    fireEvent.press(getByText('2'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ workoutLevel: 2, physicalLevel: 2 })
    );
  });

  it('selects level 3 when pressed', () => {
    const { getByText } = render(<Physical />);
    fireEvent.press(getByText('3'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ workoutLevel: 3, physicalLevel: 3 })
    );
  });

  it('selects level 4 when pressed', () => {
    const { getByText } = render(<Physical />);
    fireEvent.press(getByText('4'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ workoutLevel: 4, physicalLevel: 4 })
    );
  });

  it('displays label text when a level is selected', () => {
    const { getByText } = render(<Physical />);
    fireEvent.press(getByText('3'));
    expect(getByText('3 (moderado)')).toBeTruthy();
  });

  it('does not display label when no level is selected', () => {
    const { queryByText } = render(<Physical />);
    expect(queryByText('(ruim)')).toBeNull();
    expect(queryByText('(regular)')).toBeNull();
    expect(queryByText('(moderado)')).toBeNull();
    expect(queryByText('(bom)')).toBeNull();
  });

  it('calls handleNextStep on continue press', () => {
    const { getByTestId, getByText } = render(<Physical />);
    fireEvent.press(getByText('2'));
    fireEvent.press(getByTestId('btn-onboarding-continue'));
    expect(mockSetOnboardingData).toHaveBeenCalled();
    expect(mockHandleNextStep).toHaveBeenCalled();
  });

  it('loads existing workoutLevel from onboarding data', () => {
    mockOnboardingData = { workoutLevel: 3 };
    const { getByText } = render(<Physical />);
    expect(getByText('3 (moderado)')).toBeTruthy();
  });

  it('loads existing physicalLevel from onboarding data', () => {
    mockOnboardingData = { physicalLevel: 2 };
    const { getByText } = render(<Physical />);
    expect(getByText('2 (regular)')).toBeTruthy();
  });

  it('exports enumPhysicalLabel correctly', () => {
    expect(enumPhysicalLabel[1]).toBe('ruim');
    expect(enumPhysicalLabel[2]).toBe('regular');
    expect(enumPhysicalLabel[3]).toBe('moderado');
    expect(enumPhysicalLabel[4]).toBe('bom');
  });

  it('renders the vector image', () => {
    const { getByLabelText } = render(<Physical />);
    expect(getByLabelText('Vetor')).toBeTruthy();
  });
});
