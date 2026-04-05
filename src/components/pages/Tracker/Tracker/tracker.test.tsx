import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Tracker } from './tracker';

const mockNavigate = jest.fn();
const mockRefreshFitnessData = jest.fn().mockResolvedValue(undefined);
const mockGetHydrationGoal = jest.fn().mockResolvedValue(2000);
const mockGetCaloriesGoal = jest.fn().mockResolvedValue(2000);
const mockGetStepsGoal = jest.fn().mockResolvedValue(10000);

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    IScrollViewProps: {},
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Flex: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Image: (props: any) => <RN.View testID="vector-image" {...props} />,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@components/molecules/FitnessCard', () => ({
  FitnessCard: ({ title, value, unit, goTo, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID={`fitness-card-${title}`} onPress={goTo}>
        <RN.Text>{title}</RN.Text>
        <RN.Text>{value}</RN.Text>
        <RN.Text>{unit}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('@components/molecules/Progress/progress', () => ({
  Progress: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="progress-bar" />;
  },
}));

jest.mock('@components/molecules', () => ({
  HeaderTitle: ({ title, withBackButton }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID="header-title">
        <RN.TouchableOpacity testID="header-back" onPress={withBackButton}>
          <RN.Text>{title}</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  },
  SmartSuggestionCard: ({ suggestions, onApply, onConfigure }: any) => {
    const RN = require('react-native');
    return <RN.View testID="suggestion-card" />;
  },
  DailyAnalysisCard: ({ fitnessData, onRefresh }: any) => {
    const RN = require('react-native');
    return <RN.View testID="daily-analysis-card" />;
  },
}));

jest.mock('@assets/png/vector-12.png', () => 'mock-vector');

jest.mock('@assets/icons', () => ({
  HeartIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="heart-icon" {...props} />;
  },
}));

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: {
      step: [{ step_completed: 5000, step_goal: 10000 }],
      weight: [{ weight_completed: 75 }],
      kcal: [{ kcal_completed: 300 }],
      sleep: [{ sleep_completed: 7 }],
      hydration: [{ hydration_completed: 4 }],
      nutrition: [{ nutrition_completed: 1500 }],
    },
    refreshFitnessData: mockRefreshFitnessData,
  }),
}));

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    personalData: {
      weight: 70,
      height: 1.75,
      age: 30,
      gender: 'M',
      workoutLevel: 3,
    },
  }),
}));

jest.mock('src/services/goalCalculatorService', () => ({
  generateSuggestions: jest.fn().mockReturnValue([]),
}));

jest.mock('src/services/fitnessService', () => ({
  setHydrationGoal: jest.fn().mockResolvedValue(undefined),
  getHydrationGoal: (...args: any[]) => mockGetHydrationGoal(...args),
  setCaloriesGoal: jest.fn().mockResolvedValue(undefined),
  getCaloriesGoal: (...args: any[]) => mockGetCaloriesGoal(...args),
  setStepsGoal: jest.fn().mockResolvedValue(undefined),
  getStepsGoal: (...args: any[]) => mockGetStepsGoal(...args),
}));

jest.mock('src/services/dailyAnalysisService', () => ({}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('Tracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with "Rastreador Fitness" title', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Rastreador Fitness')).toBeTruthy();
  });

  it('renders steps count', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Passos')).toBeTruthy();
  });

  it('renders step count as formatted number', () => {
    const { getByText } = render(<Tracker />);
    // 5000 formatted as pt-BR
    expect(getByText('5.000')).toBeTruthy();
  });

  it('renders progress bar', () => {
    const { getByTestId } = render(<Tracker />);
    expect(getByTestId('progress-bar')).toBeTruthy();
  });

  it('renders motivational message for steps in progress', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Você está dando mais passos do que o normal. Isso aí!')).toBeTruthy();
  });

  it('renders fitness cards for Weight and Nutrition', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Peso')).toBeTruthy();
    expect(getByText('Nutrição')).toBeTruthy();
  });

  it('renders fitness cards for Calorias Gastas and Sono', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Calorias Gastas')).toBeTruthy();
    expect(getByText('Sono')).toBeTruthy();
  });

  it('renders Hidratação card', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Hidratação')).toBeTruthy();
  });

  it('renders health source indicator', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText(/Dados sincronizados com/)).toBeTruthy();
  });

  it('renders "Como está seu dia" section', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Como está seu dia')).toBeTruthy();
  });

  it('renders DailyAnalysisCard', () => {
    const { getByTestId } = render(<Tracker />);
    expect(getByTestId('daily-analysis-card')).toBeTruthy();
  });

  it('renders suggestion section when personalData has weight', () => {
    const { getByText } = render(<Tracker />);
    expect(getByText('Sugestões para Você')).toBeTruthy();
  });

  it('navigates to steps when steps card is pressed', () => {
    const { getByText } = render(<Tracker />);
    fireEvent.press(getByText('Passos'));
    expect(mockNavigate).toHaveBeenCalledWith('steps');
  });

  it('navigates to weight when Peso card is pressed', () => {
    const { getByTestId } = render(<Tracker />);
    fireEvent.press(getByTestId('fitness-card-Peso'));
    expect(mockNavigate).toHaveBeenCalledWith('weight');
  });

  it('navigates to nutrition when Nutrição card is pressed', () => {
    const { getByTestId } = render(<Tracker />);
    fireEvent.press(getByTestId('fitness-card-Nutrição'));
    expect(mockNavigate).toHaveBeenCalledWith('nutrition');
  });

  it('navigates to calories when Calorias Gastas card is pressed', () => {
    const { getByTestId } = render(<Tracker />);
    fireEvent.press(getByTestId('fitness-card-Calorias Gastas'));
    expect(mockNavigate).toHaveBeenCalledWith('calories');
  });

  it('navigates to sleep when Sono card is pressed', () => {
    const { getByTestId } = render(<Tracker />);
    fireEvent.press(getByTestId('fitness-card-Sono'));
    expect(mockNavigate).toHaveBeenCalledWith('sleep');
  });

  it('navigates to hydration when Hidratação card is pressed', () => {
    const { getByTestId } = render(<Tracker />);
    fireEvent.press(getByTestId('fitness-card-Hidratação'));
    expect(mockNavigate).toHaveBeenCalledWith('hydration');
  });

  it('navigates to homepage when header back is pressed', () => {
    const { getByTestId } = render(<Tracker />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('homepage');
  });

  it('loads goals on mount', async () => {
    render(<Tracker />);
    await waitFor(() => {
      expect(mockGetHydrationGoal).toHaveBeenCalled();
      expect(mockGetCaloriesGoal).toHaveBeenCalled();
      expect(mockGetStepsGoal).toHaveBeenCalled();
    });
  });
});
