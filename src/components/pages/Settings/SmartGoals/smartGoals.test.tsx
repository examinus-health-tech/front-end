import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { SmartGoals } from './smartGoals';

const mockGoBack = jest.fn();
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
const mockSetHydrationGoal = jest.fn();
const mockGetHydrationGoal = jest.fn();
const mockSetCaloriesGoal = jest.fn();
const mockGetCaloriesGoal = jest.fn();
const mockAsyncStorageGetItem = jest.fn();
const mockAsyncStorageSetItem = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    IScrollViewProps: {},
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    StatusBar: (props: any) => <RN.View {...props} />,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Pressable: ({ children, onPress, ...rest }: any) => {
      const RN = require('react-native');
      return (
        <RN.TouchableOpacity onPress={onPress} {...rest}>{children}</RN.TouchableOpacity>
      );
    },
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (...args: any[]) => mockAsyncStorageGetItem(...args),
  setItem: (...args: any[]) => mockAsyncStorageSetItem(...args),
}));

jest.mock('../components/header/header', () => ({
  Header: ({ title, handleBackTo }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="header-back" onPress={handleBackTo}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
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

jest.mock('@services/fitnessService', () => ({
  setHydrationGoal: (...args: any[]) => mockSetHydrationGoal(...args),
  getHydrationGoal: (...args: any[]) => mockGetHydrationGoal(...args),
  setCaloriesGoal: (...args: any[]) => mockSetCaloriesGoal(...args),
  getCaloriesGoal: (...args: any[]) => mockGetCaloriesGoal(...args),
}));

jest.mock('@services/goalCalculatorService', () => ({
  calculateHydrationGoal: jest.fn().mockReturnValue(2450),
  calculateTMB: jest.fn().mockReturnValue(1700),
  calculateCaloriesGoal: jest.fn().mockReturnValue(2200),
  calculateStepsGoal: jest.fn().mockReturnValue(8000),
  getActivityLevelText: jest.fn().mockReturnValue('Moderado'),
  WeightGoalType: {},
}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    WaterDropFilledIcon: (props: any) => <RN.View testID="water-icon" {...props} />,
    FireIcon: (props: any) => <RN.View testID="fire-icon" {...props} />,
    StepsIcon: (props: any) => <RN.View testID="steps-icon" {...props} />,
    CheckIcon: (props: any) => <RN.View testID="check-icon" {...props} />,
  };
});

describe('SmartGoals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetHydrationGoal.mockResolvedValue(2000);
    mockGetCaloriesGoal.mockResolvedValue(2000);
    mockAsyncStorageGetItem.mockResolvedValue(null);
    mockSetHydrationGoal.mockResolvedValue(undefined);
    mockSetCaloriesGoal.mockResolvedValue(undefined);
    mockAsyncStorageSetItem.mockResolvedValue(undefined);
  });

  it('renders the header with "Metas Inteligentes" title', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Metas Inteligentes')).toBeTruthy();
    });
  });

  it('renders "Seu Objetivo" section', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Seu Objetivo')).toBeTruthy();
      expect(getByText('Escolha seu objetivo de peso')).toBeTruthy();
    });
  });

  it('renders all three objective options', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Perder peso')).toBeTruthy();
      expect(getByText('Manter peso')).toBeTruthy();
      expect(getByText('Ganhar peso')).toBeTruthy();
    });
  });

  it('renders objective descriptions', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Déficit de 500 kcal/dia')).toBeTruthy();
      expect(getByText('Calorias de manutenção')).toBeTruthy();
      expect(getByText('Superávit de 300 kcal/dia')).toBeTruthy();
    });
  });

  it('renders "Metas Sugeridas" section', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Metas Sugeridas')).toBeTruthy();
      expect(getByText('Baseadas no seu perfil')).toBeTruthy();
    });
  });

  it('renders hydration goal card', async () => {
    const { getByText, getAllByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Hidratação')).toBeTruthy();
      expect(getAllByText('/dia').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders calories goal card', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Calorias')).toBeTruthy();
    });
  });

  it('renders steps goal card', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Passos')).toBeTruthy();
    });
  });

  it('renders "Aplicar Todas" button', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Aplicar Todas')).toBeTruthy();
    });
  });

  it('renders profile info section', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Cálculos baseados em:')).toBeTruthy();
    });
  });

  it('loads data on mount', async () => {
    render(<SmartGoals />);
    await waitFor(() => {
      expect(mockGetHydrationGoal).toHaveBeenCalled();
      expect(mockGetCaloriesGoal).toHaveBeenCalled();
    });
  });

  it('selects objective when pressed', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Perder peso')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Perder peso'));
    });

    await waitFor(() => {
      expect(mockAsyncStorageSetItem).toHaveBeenCalledWith(
        '@examinus:weight_goal_type',
        'lose'
      );
    });
  });

  it('applies all goals when "Aplicar Todas" is pressed', async () => {
    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Aplicar Todas')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Aplicar Todas'));
    });

    await waitFor(() => {
      expect(mockSetHydrationGoal).toHaveBeenCalled();
      expect(mockSetCaloriesGoal).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Todas as metas aplicadas' })
      );
    });
  });

  it('shows error toast when applying all goals fails', async () => {
    mockSetHydrationGoal.mockRejectedValue(new Error('Fail'));

    const { getByText } = render(<SmartGoals />);
    await waitFor(() => {
      expect(getByText('Aplicar Todas')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Aplicar Todas'));
    });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Erro' })
      );
    });
  });

  it('navigates back when header back is pressed', () => {
    const { getByTestId } = render(<SmartGoals />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
