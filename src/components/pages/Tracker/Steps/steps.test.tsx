import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Steps } from './steps';

const mockNavigate = jest.fn();
const mockHideTabBar = jest.fn();
const mockShowTabBar = jest.fn();
const mockGetDailyLogsHistory = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    IScrollViewProps: {},
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Pressable: ({ children, onPress, ...rest }: any) => {
      const RN = require('react-native');
      return <RN.TouchableOpacity onPress={onPress} {...rest}>{children}</RN.TouchableOpacity>;
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
      View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    },
    FadeIn: { duration: () => undefined },
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
  StepsProgress: ({ steps, goal }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID="steps-progress">
        <RN.Text>{steps}</RN.Text>
      </RN.View>
    );
  },
  StepStatCard: ({ value, unit, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID="step-stat-card">
        <RN.Text>{value}</RN.Text>
        <RN.Text>{unit}</RN.Text>
      </RN.View>
    );
  },
  WeeklyStepsChart: ({ data, goal }: any) => {
    const RN = require('react-native');
    return <RN.View testID="weekly-chart" />;
  },
}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    EnergyBoltIcon: (props: any) => <RN.View {...props} />,
    CompassTargetIcon: (props: any) => <RN.View {...props} />,
    ChevronDownSmIcon: (props: any) => <RN.View {...props} />,
    CalendarIcon: (props: any) => <RN.View {...props} />,
    StepsIcon: (props: any) => <RN.View testID="steps-icon" {...props} />,
  };
});

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: {
      step: [{ step_completed: 5000, step_goal: 10000, distance_completed: 3.5, distance_goal: 8 }],
      kcal: [{ kcal_completed: 250, kcal_goal: 500 }],
    },
  }),
}));

jest.mock('src/hooks/useTabBar', () => ({
  useTabBar: () => ({
    hideTabBar: mockHideTabBar,
    showTabBar: mockShowTabBar,
  }),
}));

jest.mock('src/services/fitnessService', () => ({
  getDailyLogsHistory: (...args: any[]) => mockGetDailyLogsHistory(...args),
}));

describe('Steps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDailyLogsHistory.mockResolvedValue([]);
  });

  it('renders the header with "Passos" title', () => {
    const { getByText } = render(<Steps />);
    expect(getByText('Passos')).toBeTruthy();
  });

  it('renders "Hoje, você caminhou" text', () => {
    const { getByText } = render(<Steps />);
    expect(getByText('Hoje, você caminhou')).toBeTruthy();
  });

  it('renders StepsProgress component', () => {
    const { getByTestId } = render(<Steps />);
    expect(getByTestId('steps-progress')).toBeTruthy();
  });

  it('renders motivational message', () => {
    const { getByText } = render(<Steps />);
    expect(getByText('Ótimo progresso! Você está na metade!')).toBeTruthy();
  });

  it('renders stat cards', () => {
    const { getAllByTestId } = render(<Steps />);
    expect(getAllByTestId('step-stat-card')).toHaveLength(2);
  });

  it('renders "Progresso Atual" section', () => {
    const { getByText } = render(<Steps />);
    expect(getByText('Progresso Atual')).toBeTruthy();
  });

  it('renders period selector with "Semanal" default', () => {
    const { getByText } = render(<Steps />);
    expect(getByText('Semanal')).toBeTruthy();
  });

  it('renders "Sincronização Automática" info box', () => {
    const { getByText } = render(<Steps />);
    expect(getByText('Sincronização Automática')).toBeTruthy();
  });

  it('hides tab bar on mount and shows on unmount', () => {
    const { unmount } = render(<Steps />);
    expect(mockHideTabBar).toHaveBeenCalled();
    unmount();
    expect(mockShowTabBar).toHaveBeenCalled();
  });

  it('navigates to tracker when header back is pressed', () => {
    const { getByTestId } = render(<Steps />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('tracker');
  });

  it('cycles period when period button is pressed', () => {
    const { getByText } = render(<Steps />);
    fireEvent.press(getByText('Semanal'));
    expect(getByText('Mensal')).toBeTruthy();
  });

  it('fetches chart data on mount', async () => {
    render(<Steps />);
    await waitFor(() => {
      expect(mockGetDailyLogsHistory).toHaveBeenCalledWith(7);
    });
  });

  it('renders chart data when available', async () => {
    mockGetDailyLogsHistory.mockResolvedValue([
      { steps: 3000, date: '2026-03-19' },
      { steps: 5000, date: '2026-03-20' },
    ]);

    const { getByTestId } = render(<Steps />);

    await waitFor(() => {
      expect(getByTestId('weekly-chart')).toBeTruthy();
    });
  });

  it('handles chart data fetch error gracefully', async () => {
    mockGetDailyLogsHistory.mockRejectedValue(new Error('API Error'));

    const { getByTestId } = render(<Steps />);

    await waitFor(() => {
      expect(getByTestId('weekly-chart')).toBeTruthy();
    });
  });
});
