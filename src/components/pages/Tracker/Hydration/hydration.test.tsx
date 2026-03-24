import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Hydration } from './hydration';

const mockNavigate = jest.fn();
const mockHideTabBar = jest.fn();
const mockShowTabBar = jest.fn();
const mockRefreshFitnessData = jest.fn().mockResolvedValue(undefined);
const mockSaveDailyLog = jest.fn();
const mockSetHydrationGoal = jest.fn();
const mockGetHydrationGoal = jest.fn();
const mockGetDailyLogsHistory = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Actionsheet: Object.assign(
      ({ children, isOpen, ...rest }: any) => {
        const RN = require('react-native');
        return isOpen ? <RN.View testID="actionsheet" {...rest}>{children}</RN.View> : null;
      },
      {
        Content: ({ children, ...rest }: any) => {
          const RN = require('react-native');
          return <RN.View {...rest}>{children}</RN.View>;
        },
      }
    ),
    useDisclose: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    }),
    Pressable: ({ children, onPress, ...rest }: any) => {
      const RN = require('react-native');
      const rendered = typeof children === 'function' ? children({ isPressed: false }) : children;
      return <RN.TouchableOpacity onPress={onPress} {...rest}>{rendered}</RN.TouchableOpacity>;
    },
    Input: (props: any) => {
      const RN = require('react-native');
      return <RN.TextInput testID="goal-input" {...props} />;
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
        <RN.Text>{unit}</RN.Text>
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
    WaterDropFilledIcon: (props: any) => <RN.View testID="water-drop-icon" {...props} />,
    WaterIcon: (props: any) => <RN.View testID="water-icon" {...props} />,
  };
});

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: {
      hydration: [{ hydration_completed: 4 }],
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

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    personalData: { weight: 70 },
  }),
}));

jest.mock('src/services/fitnessService', () => ({
  saveDailyLog: (...args: any[]) => mockSaveDailyLog(...args),
  setHydrationGoal: (...args: any[]) => mockSetHydrationGoal(...args),
  getHydrationGoal: (...args: any[]) => mockGetHydrationGoal(...args),
  getDailyLogsHistory: (...args: any[]) => mockGetDailyLogsHistory(...args),
}));

jest.mock('src/services/goalCalculatorService', () => ({
  calculateHydrationGoal: jest.fn().mockReturnValue(2450),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('Hydration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetHydrationGoal.mockResolvedValue(2000);
    mockGetDailyLogsHistory.mockResolvedValue([]);
    mockSaveDailyLog.mockResolvedValue(undefined);
    mockSetHydrationGoal.mockResolvedValue(undefined);
  });

  it('renders the header with "Hidratação" title', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Hidratação')).toBeTruthy();
  });

  it('renders "Você bebeu hoje" label', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Você bebeu hoje')).toBeTruthy();
  });

  it('renders current hydration value', () => {
    const { getByText } = render(<Hydration />);
    // 4 cups * 250ml = 1000ml, formatted as pt-BR
    expect(getByText('1.000')).toBeTruthy();
  });

  it('renders ml unit', () => {
    const { getAllByText } = render(<Hydration />);
    expect(getAllByText('ml').length).toBeGreaterThan(0);
  });

  it('renders hydration goal card', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Meta Diária')).toBeTruthy();
    expect(getByText('Editar')).toBeTruthy();
  });

  it('renders Média do Período card', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Média do Período')).toBeTruthy();
  });

  it('renders "Histórico" section', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Histórico')).toBeTruthy();
  });

  it('renders time range picker', () => {
    const { getByTestId } = render(<Hydration />);
    expect(getByTestId('time-range-picker')).toBeTruthy();
  });

  it('renders chart legend', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Consumo')).toBeTruthy();
  });

  it('renders "Registrar Água" button', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Registrar Água')).toBeTruthy();
  });

  it('renders hydration tip section', () => {
    const { getByText } = render(<Hydration />);
    expect(getByText('Dica de Hidratação')).toBeTruthy();
  });

  it('hides tab bar on mount and shows on unmount', () => {
    const { unmount } = render(<Hydration />);
    expect(mockHideTabBar).toHaveBeenCalled();
    unmount();
    expect(mockShowTabBar).toHaveBeenCalled();
  });

  it('navigates to tracker when header back is pressed', () => {
    const { getByTestId } = render(<Hydration />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('tracker');
  });

  it('loads hydration goal on mount', async () => {
    render(<Hydration />);
    await waitFor(() => {
      expect(mockGetHydrationGoal).toHaveBeenCalled();
    });
  });

  it('fetches chart history on mount', async () => {
    render(<Hydration />);
    await waitFor(() => {
      expect(mockGetDailyLogsHistory).toHaveBeenCalled();
    });
  });

  it('renders progress percentage', () => {
    const { getByText } = render(<Hydration />);
    // 1000/2000 = 50%
    expect(getByText('50% da meta')).toBeTruthy();
  });

  it('renders remaining hydration', () => {
    const { getByText } = render(<Hydration />);
    // 2000 - 1000 = 1000
    expect(getByText('Faltam 1.000ml')).toBeTruthy();
  });
});
