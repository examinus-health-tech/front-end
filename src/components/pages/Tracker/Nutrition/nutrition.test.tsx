import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Nutrition } from './nutrition';

const mockNavigate = jest.fn();
const mockHideTabBar = jest.fn();
const mockShowTabBar = jest.fn();
const mockRefreshFitnessData = jest.fn().mockResolvedValue(undefined);
const mockSaveDailyLog = jest.fn();
const mockSetCaloriesGoal = jest.fn();
const mockGetCaloriesGoal = jest.fn();
const mockGetDailyLogsHistory = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Input: (props: any) => {
      const RN = require('react-native');
      return <RN.TextInput testID="goal-input" {...props} />;
    },
    Pressable: ({ children, onPress, ...rest }: any) => {
      const RN = require('react-native');
      const rendered = typeof children === 'function' ? children({ isPressed: false }) : children;
      return <RN.TouchableOpacity onPress={onPress} {...rest}>{rendered}</RN.TouchableOpacity>;
    },
    Skeleton: (props: any) => {
      const RN = require('react-native');
      return <RN.View testID="skeleton" {...props} />;
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: ({ children, style, ...rest }: any) => <RN.View style={style} {...rest}>{children}</RN.View>,
      ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
        <RN.ScrollView ref={ref} {...rest}>{children}</RN.ScrollView>
      )),
    },
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedScrollHandler: () => jest.fn(),
    useAnimatedStyle: () => ({}),
    interpolate: jest.fn(),
    Extrapolation: { CLAMP: 'clamp' },
    FadeIn: { duration: () => undefined },
  };
});

jest.mock('expo-status-bar', () => ({
  StatusBar: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="status-bar" {...props} />;
  },
  setStatusBarStyle: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const RN = require('react-native');
  const ReactMod = require('react');
  return {
    __esModule: true,
    default: ReactMod.forwardRef(({ children, ...rest }: any, ref: any) => {
      ReactMod.useImperativeHandle(ref, () => ({
        expand: jest.fn(),
        forceClose: jest.fn(),
        close: jest.fn(),
      }));
      return <RN.View testID="bottom-sheet" {...rest}>{children}</RN.View>;
    }),
    BottomSheetView: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    BottomSheetBackdrop: (props: any) => <RN.View {...props} />,
    BottomSheetTextInput: (props: any) => <RN.TextInput testID={`bs-input-${props.placeholder}`} {...props} />,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: (cb: any) => {
    const React = require('react');
    React.useEffect(() => {
      const cleanup = cb();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }, []);
  },
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@components/molecules', () => ({
  HeaderTitle: ({ title, withBackButton }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="header-back" onPress={withBackButton}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
  TimeRangePicker: ({ selected, onSelect }: any) => {
    const RN = require('react-native');
    return <RN.View testID="time-range-picker"><RN.Text>{selected}</RN.Text></RN.View>;
  },
  GoalCard: ({ value, unit, label }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID="goal-card">
        <RN.Text>{value}</RN.Text>
        <RN.Text>{label}</RN.Text>
      </RN.View>
    );
  },
  WeightStepChart: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="weight-step-chart" />;
  },
}));

jest.mock('@components/atoms', () => ({
  Button: ({ title, onPress, isDisabled, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID={`button-${title}`} onPress={onPress} disabled={isDisabled}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    CoffeeIcon: (props: any) => <RN.View testID="coffee-icon" {...props} />,
    DinnerIcon: (props: any) => <RN.View testID="dinner-icon" {...props} />,
    SunIcon: (props: any) => <RN.View testID="sun-icon" {...props} />,
    AppleIcon: (props: any) => <RN.View testID="apple-icon" {...props} />,
  };
});

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: {
      nutrition: [{ nutrition_completed: 1200 }],
    },
    refreshFitnessData: mockRefreshFitnessData,
  }),
}));

jest.mock('src/hooks/useTabBar', () => ({
  useTabBar: () => ({
    hideTabBar: mockHideTabBar,
    showTabBar: mockShowTabBar,
  }),
}));

jest.mock('src/services/fitnessService', () => ({
  saveDailyLog: (...args: any[]) => mockSaveDailyLog(...args),
  setCaloriesGoal: (...args: any[]) => mockSetCaloriesGoal(...args),
  getCaloriesGoal: (...args: any[]) => mockGetCaloriesGoal(...args),
  getDailyLogsHistory: (...args: any[]) => mockGetDailyLogsHistory(...args),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('Nutrition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCaloriesGoal.mockResolvedValue(2000);
    mockGetDailyLogsHistory.mockResolvedValue([]);
    mockSaveDailyLog.mockResolvedValue(undefined);
    mockSetCaloriesGoal.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the header with "Nutrição" title', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Nutrição')).toBeTruthy();
  });

  it('renders "Calorias Ingeridas Hoje" label', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Calorias Ingeridas Hoje')).toBeTruthy();
  });

  it('renders today calories value', () => {
    const { getAllByText } = render(<Nutrition />);
    // 1200 formatted as pt-BR
    expect(getAllByText('1.200').length).toBeGreaterThan(0);
  });

  it('renders kcal unit', () => {
    const { getAllByText } = render(<Nutrition />);
    expect(getAllByText('kcal').length).toBeGreaterThan(0);
  });

  it('renders percentage of daily goal', () => {
    const { getByText } = render(<Nutrition />);
    // 1200/2000 = 60%
    expect(getByText('60% da meta diária')).toBeTruthy();
  });

  it('renders Meta Diária card', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Meta Diária')).toBeTruthy();
    expect(getByText('Editar')).toBeTruthy();
  });

  it('renders Consumo Hoje card', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Consumo Hoje')).toBeTruthy();
  });

  it('renders "Histórico" section', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Histórico')).toBeTruthy();
  });

  it('renders time range picker', () => {
    const { getByTestId } = render(<Nutrition />);
    expect(getByTestId('time-range-picker')).toBeTruthy();
  });

  it('renders chart legend', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Consumo')).toBeTruthy();
  });

  it('renders "Adicionar Refeição" button', () => {
    const { getAllByText } = render(<Nutrition />);
    expect(getAllByText('Adicionar Refeição').length).toBeGreaterThan(0);
  });

  it('renders meal options in bottom sheet', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Café da Manhã')).toBeTruthy();
    expect(getByText('Almoço')).toBeTruthy();
    expect(getByText('Jantar')).toBeTruthy();
    expect(getByText('Lanche')).toBeTruthy();
  });

  it('renders "Adicionar Refeição" bottom sheet title', () => {
    const { getAllByText } = render(<Nutrition />);
    expect(getAllByText('Adicionar Refeição').length).toBeGreaterThan(0);
  });

  it('renders "Calorias consumidas" label in bottom sheet', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Calorias consumidas')).toBeTruthy();
  });

  it('renders goal bottom sheet with title', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('Definir Meta Diária')).toBeTruthy();
  });

  it('renders calorie goal preset buttons', () => {
    const { getByText } = render(<Nutrition />);
    expect(getByText('1500')).toBeTruthy();
    expect(getByText('2000')).toBeTruthy();
    expect(getByText('2500')).toBeTruthy();
    expect(getByText('3000')).toBeTruthy();
  });

  it('hides tab bar on mount and shows on unmount', () => {
    const { unmount } = render(<Nutrition />);
    expect(mockHideTabBar).toHaveBeenCalled();
    unmount();
    expect(mockShowTabBar).toHaveBeenCalled();
  });

  it('navigates to tracker when header back is pressed', () => {
    const { getByTestId } = render(<Nutrition />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('tracker');
  });

  it('loads calories goal on mount', async () => {
    render(<Nutrition />);
    await waitFor(() => {
      expect(mockGetCaloriesGoal).toHaveBeenCalled();
    });
  });

  it('fetches chart data on mount', async () => {
    render(<Nutrition />);
    await waitFor(() => {
      expect(mockGetDailyLogsHistory).toHaveBeenCalled();
    });
  });

  it('handles nutrition data as array', () => {
    // The original mock provides number data (nutrition_completed: 1200).
    // This test just verifies the component renders without crash with this data.
    const { getByText } = render(<Nutrition />);
    expect(getByText('Nutrição')).toBeTruthy();
  });

  it('renders chart component', async () => {
    mockGetDailyLogsHistory.mockResolvedValue([
      { caloriesConsumed: 1500 },
      { caloriesConsumed: 1800 },
    ]);

    const { getByTestId } = render(<Nutrition />);

    await waitFor(() => {
      expect(getByTestId('weight-step-chart')).toBeTruthy();
    });
  });

  it('renders Cancelar button in meal bottom sheet', () => {
    const { getAllByText } = render(<Nutrition />);
    expect(getAllByText('Cancelar').length).toBeGreaterThan(0);
  });

  it('renders Adicionar button in meal bottom sheet', () => {
    const { getAllByText } = render(<Nutrition />);
    expect(getAllByText('Adicionar').length).toBeGreaterThan(0);
  });

  it('renders Salvar button in goal bottom sheet', () => {
    const { getAllByText } = render(<Nutrition />);
    expect(getAllByText('Salvar').length).toBeGreaterThan(0);
  });
});
