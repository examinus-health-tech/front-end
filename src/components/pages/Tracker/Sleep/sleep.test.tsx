import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Sleep } from './sleep';

const mockNavigate = jest.fn();
const mockHideTabBar = jest.fn();
const mockShowTabBar = jest.fn();
const mockGetSleepHistory = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Skeleton: (props: any) => <RN.View testID="skeleton" {...props} />,
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
    return (
      <RN.View testID="time-range-picker">
        <RN.Text>{selected}</RN.Text>
        <RN.TouchableOpacity testID="select-1m" onPress={() => onSelect('1m')}>
          <RN.Text>1m</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  },
  GoalCard: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="goal-card" />;
  },
  WeightStepChart: ({ data, unit, goalValue }: any) => {
    const RN = require('react-native');
    return <RN.View testID="weight-step-chart" />;
  },
}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    MoonIcon: (props: any) => <RN.View testID="moon-icon" {...props} />,
    BedIcon: (props: any) => <RN.View testID="bed-icon" {...props} />,
    SleepZzzIcon: (props: any) => <RN.View testID="sleep-icon" {...props} />,
  };
});

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: {
      sleep: [{ sleep_completed: 7, sleep_goal: 8 }],
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
  getSleepHistory: (...args: any[]) => mockGetSleepHistory(...args),
}));

describe('Sleep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSleepHistory.mockResolvedValue([]);
  });

  it('renders the header with "Sono" title', () => {
    const { getByText } = render(<Sleep />);
    expect(getByText('Sono')).toBeTruthy();
  });

  it('renders sleep time in expanded header', () => {
    const { getAllByText } = render(<Sleep />);
    expect(getAllByText('7h').length).toBeGreaterThan(0);
  });

  it('renders "Última Noite" label', () => {
    const { getByText } = render(<Sleep />);
    expect(getByText('Última Noite')).toBeTruthy();
  });

  it('renders sleep quality label', () => {
    const { getAllByText } = render(<Sleep />);
    // 7/8 = 87.5%, which is >= 75, so "Bom"
    expect(getAllByText('Bom').length).toBeGreaterThan(0);
  });

  it('renders "Histórico de Sono" section', () => {
    const { getByText } = render(<Sleep />);
    expect(getByText('Histórico de Sono')).toBeTruthy();
  });

  it('renders time range picker', () => {
    const { getByTestId } = render(<Sleep />);
    expect(getByTestId('time-range-picker')).toBeTruthy();
  });

  it('renders chart legend', () => {
    const { getByText } = render(<Sleep />);
    expect(getByText('Horas Dormidas')).toBeTruthy();
    expect(getByText('Meta (8h)')).toBeTruthy();
  });

  it('renders detail cards', () => {
    const { getByText } = render(<Sleep />);
    expect(getByText('Dormido')).toBeTruthy();
    expect(getByText('Qualidade')).toBeTruthy();
    expect(getByText('Meta Diária')).toBeTruthy();
    expect(getByText('Média do Período')).toBeTruthy();
  });

  it('renders sleep tips section', () => {
    const { getByText } = render(<Sleep />);
    expect(getByText('Dicas para Melhorar o Sono')).toBeTruthy();
  });

  it('renders sleep tips content', () => {
    const { getByText } = render(<Sleep />);
    expect(getByText(/Mantenha um horário regular/)).toBeTruthy();
    expect(getByText(/Evite telas 1 hora/)).toBeTruthy();
  });

  it('hides tab bar on mount and shows on unmount', () => {
    const { unmount } = render(<Sleep />);
    expect(mockHideTabBar).toHaveBeenCalled();
    unmount();
    expect(mockShowTabBar).toHaveBeenCalled();
  });

  it('navigates to tracker when header back is pressed', () => {
    const { getByTestId } = render(<Sleep />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('tracker');
  });

  it('fetches sleep history on mount', async () => {
    render(<Sleep />);
    await waitFor(() => {
      expect(mockGetSleepHistory).toHaveBeenCalledWith(7); // default 1w
    });
  });

  it('changes time range when picker is used', async () => {
    const { getByTestId } = render(<Sleep />);
    fireEvent.press(getByTestId('select-1m'));
    await waitFor(() => {
      expect(mockGetSleepHistory).toHaveBeenCalledWith(30);
    });
  });

  it('renders chart when data is available', async () => {
    mockGetSleepHistory.mockResolvedValue([
      { durationMinutes: 420 },
      { durationMinutes: 360 },
    ]);

    const { getByTestId } = render(<Sleep />);

    await waitFor(() => {
      expect(getByTestId('weight-step-chart')).toBeTruthy();
    });
  });
});
