import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { OnboardingSteps } from './onboarding';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Container: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Flex: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    View: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── react-native-reanimated mock ─────────────────────────────────────
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const entering = { duration: () => entering, delay: () => entering };
  return {
    __esModule: true,
    default: { View: RN.View, createAnimatedComponent: (c: any) => c },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    FadeInRight: entering,
    FadeInDown: entering,
    FadeInUp: entering,
    FadeInLeft: entering,
    FadeIn: entering,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/png/x-examinus.png', () => 'x-examinus-mock');
jest.mock('@assets/png/logo-animado-2.gif', () => 'logo-animado-mock');

// ── sub-component mocks ──────────────────────────────────────────────
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderProgress: (props: any) => <RN.View testID="header-progress" />,
  };
});

jest.mock('@components/pages/OnboardingInfo', () => {
  const RN = require('react-native');
  return {
    Gender: () => <RN.View testID="gender-step" />,
    Weight: () => <RN.View testID="weight-step" />,
    Age: () => <RN.View testID="age-step" />,
    Physical: () => <RN.View testID="physical-step" />,
    Humour: () => <RN.View testID="humour-step" />,
    Habits: () => <RN.View testID="habits-step" />,
    Upload: () => <RN.View testID="upload-step" />,
    UploadError: () => <RN.View testID="upload-error-step" />,
    Height: () => <RN.View testID="height-step" />,
  };
});

jest.mock('./ScoreWarning/scoreWarning', () => {
  const RN = require('react-native');
  return { ScoreWarning: () => <RN.View testID="score-warning" /> };
});

// ── navigation mock ──────────────────────────────────────────────────
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ reset: mockReset, navigate: jest.fn() }),
}));

// ── hook mocks ───────────────────────────────────────────────────────
const mockGetPersonalData = jest.fn().mockResolvedValue(undefined);
const mockCheckOnboardingCompletion = jest.fn().mockResolvedValue(false);
const mockHandlePreviousStep = jest.fn();
const mockJumpToUpload = jest.fn();

const defaultStepsMap = [
  { currentStep: 'gender', progress: 10, previousStep: null, nextStep: 'weight' },
  { currentStep: 'weight', progress: 20, previousStep: 'gender', nextStep: 'height' },
  { currentStep: 'height', progress: 30, previousStep: 'weight', nextStep: 'age' },
  { currentStep: 'age', progress: 40, previousStep: 'height', nextStep: 'physical' },
  { currentStep: 'physical', progress: 50, previousStep: 'age', nextStep: 'humour' },
  { currentStep: 'humour', progress: 60, previousStep: 'physical', nextStep: 'habits' },
  { currentStep: 'habits', progress: 70, previousStep: 'humour', nextStep: 'upload' },
  { currentStep: 'upload', progress: 80, previousStep: 'habits', nextStep: null },
  { currentStep: 'error', progress: null, previousStep: 'upload', nextStep: null },
];

let mockOnboardingValues: any = {
  step: 0,
  handlePreviousStep: mockHandlePreviousStep,
  jumpToUpload: mockJumpToUpload,
  stepsMap: defaultStepsMap,
  getPersonalData: mockGetPersonalData,
  personalData: undefined,
  isLoadingOnboardingContext: false,
  isLoadingUpload: false,
  scoreWarning: false,
  checkOnboardingCompletion: mockCheckOnboardingCompletion,
};

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => mockOnboardingValues,
}));

jest.mock('src/hooks/useUpload', () => ({
  useUpload: () => ({}),
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { userId: '1' } }),
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

describe('OnboardingSteps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnboardingValues = {
      step: 0,
      handlePreviousStep: mockHandlePreviousStep,
      jumpToUpload: mockJumpToUpload,
      stepsMap: defaultStepsMap,
      getPersonalData: mockGetPersonalData,
      personalData: undefined,
      isLoadingOnboardingContext: false,
      isLoadingUpload: false,
      scoreWarning: false,
      checkOnboardingCompletion: mockCheckOnboardingCompletion,
    };
  });

  it('renders loading state when isLoadingOnboardingContext is true', () => {
    mockOnboardingValues.isLoadingOnboardingContext = true;
    const { getByLabelText } = render(<OnboardingSteps />);
    expect(getByLabelText('Vector')).toBeTruthy();
  });

  it('renders upload loading state when isLoadingUpload is true', () => {
    mockOnboardingValues.isLoadingUpload = true;
    const { getByText } = render(<OnboardingSteps />);
    expect(getByText(/Carregando os/)).toBeTruthy();
    expect(getByText(/resultados do seu exame/)).toBeTruthy();
  });

  it('renders ScoreWarning when scoreWarning is true', () => {
    mockOnboardingValues.scoreWarning = true;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('score-warning')).toBeTruthy();
  });

  it('renders Gender step by default (step 0)', () => {
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('gender-step')).toBeTruthy();
    expect(getByTestId('header-progress')).toBeTruthy();
  });

  it('renders Weight step when step is 1', () => {
    mockOnboardingValues.step = 1;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('weight-step')).toBeTruthy();
  });

  it('renders Height step when step is 2', () => {
    mockOnboardingValues.step = 2;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('height-step')).toBeTruthy();
  });

  it('renders Age step when step is 3', () => {
    mockOnboardingValues.step = 3;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('age-step')).toBeTruthy();
  });

  it('renders Physical step when step is 4', () => {
    mockOnboardingValues.step = 4;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('physical-step')).toBeTruthy();
  });

  it('renders Humour step when step is 5', () => {
    mockOnboardingValues.step = 5;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('humour-step')).toBeTruthy();
  });

  it('renders Habits step when step is 6', () => {
    mockOnboardingValues.step = 6;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('habits-step')).toBeTruthy();
  });

  it('renders Upload step when step is 7', () => {
    mockOnboardingValues.step = 7;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('upload-step')).toBeTruthy();
  });

  it('renders UploadError step when step is 8', () => {
    mockOnboardingValues.step = 8;
    const { getByTestId } = render(<OnboardingSteps />);
    expect(getByTestId('upload-error-step')).toBeTruthy();
  });

  it('calls getPersonalData on mount', async () => {
    render(<OnboardingSteps />);
    await waitFor(() => {
      expect(mockGetPersonalData).toHaveBeenCalled();
    });
  });

  it('calls checkOnboardingCompletion on mount', async () => {
    render(<OnboardingSteps />);
    await waitFor(() => {
      expect(mockCheckOnboardingCompletion).toHaveBeenCalled();
    });
  });

  it('navigates to homepage when onboarding is complete', async () => {
    mockCheckOnboardingCompletion.mockResolvedValueOnce(true);
    render(<OnboardingSteps />);
    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'homepage' }] });
    });
  });

  it('does not navigate when onboarding is not complete', async () => {
    mockCheckOnboardingCompletion.mockResolvedValueOnce(false);
    render(<OnboardingSteps />);
    await waitFor(() => {
      expect(mockCheckOnboardingCompletion).toHaveBeenCalled();
    });
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('does not crash when getPersonalData throws', async () => {
    mockGetPersonalData.mockRejectedValueOnce(new Error('fail'));
    const { getByTestId } = render(<OnboardingSteps />);
    await waitFor(() => {
      expect(getByTestId('gender-step')).toBeTruthy();
    });
  });

  it('does not crash when checkOnboardingCompletion throws', async () => {
    mockCheckOnboardingCompletion.mockRejectedValueOnce(new Error('fail'));
    const { getByTestId } = render(<OnboardingSteps />);
    await waitFor(() => {
      expect(getByTestId('gender-step')).toBeTruthy();
    });
  });
});
