import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Weight } from './weight';

const mockNavigate = jest.fn();
const mockHideTabBar = jest.fn();
const mockShowTabBar = jest.fn();
const mockRefreshFitnessData = jest.fn().mockResolvedValue(undefined);
const mockCreateWeight = jest.fn();
const mockSetWeightGoal = jest.fn();
const mockGetWeightGoal = jest.fn();
const mockGetWeightHistory = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
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
        close: jest.fn(),
      }));
      return <RN.View testID="bottom-sheet" {...rest}>{children}</RN.View>;
    }),
    BottomSheetView: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    BottomSheetBackdrop: (props: any) => <RN.View {...props} />,
    BottomSheetTextInput: (props: any) => <RN.TextInput testID="weight-input" {...props} />,
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
    WeightScaleIcon: (props: any) => <RN.View testID="weight-scale-icon" {...props} />,
    WeightTargetIcon: (props: any) => <RN.View testID="weight-target-icon" {...props} />,
  };
});

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: {
      weight: [{ weight_completed: 75 }],
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
  createWeight: (...args: any[]) => mockCreateWeight(...args),
  setWeightGoal: (...args: any[]) => mockSetWeightGoal(...args),
  getWeightGoal: (...args: any[]) => mockGetWeightGoal(...args),
  getWeightHistory: (...args: any[]) => mockGetWeightHistory(...args),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('Weight', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetWeightGoal.mockResolvedValue(70);
    mockGetWeightHistory.mockResolvedValue([]);
    mockCreateWeight.mockResolvedValue(undefined);
    mockSetWeightGoal.mockResolvedValue(undefined);
  });

  it('renders the header with "Peso" title', () => {
    const { getAllByText } = render(<Weight />);
    expect(getAllByText('Peso').length).toBeGreaterThan(0);
  });

  it('renders "Peso Atual" label', () => {
    const { getAllByText } = render(<Weight />);
    expect(getAllByText('Peso Atual').length).toBeGreaterThan(0);
  });

  it('renders current weight value', () => {
    const { getAllByText } = render(<Weight />);
    // 75.0 should appear multiple times (expanded, collapsed, card)
    expect(getAllByText('75.0').length).toBeGreaterThan(0);
  });

  it('renders kg unit', () => {
    const { getAllByText } = render(<Weight />);
    expect(getAllByText('kg').length).toBeGreaterThan(0);
  });

  it('renders weight difference from goal', () => {
    const { getByText } = render(<Weight />);
    // 75 - 70 = 5, above goal
    expect(getByText('5.0kg acima da meta')).toBeTruthy();
  });

  it('renders "Evolução" section', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Evolução')).toBeTruthy();
  });

  it('renders time range picker', () => {
    const { getByTestId } = render(<Weight />);
    expect(getByTestId('time-range-picker')).toBeTruthy();
  });

  it('renders chart legend', () => {
    const { getAllByText } = render(<Weight />);
    expect(getAllByText('Peso').length).toBeGreaterThan(0);
  });

  it('renders "Peso Atual" card with edit', () => {
    const { getAllByText } = render(<Weight />);
    expect(getAllByText('Peso Atual').length).toBeGreaterThan(0);
  });

  it('renders "Peso Meta" card with edit', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Peso Meta')).toBeTruthy();
  });

  it('renders "Registrar Novo Peso" button', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Registrar Novo Peso')).toBeTruthy();
  });

  it('renders tip section', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Dica')).toBeTruthy();
    expect(getByText(/Pese-se sempre no mesmo horário/)).toBeTruthy();
  });

  it('hides tab bar on mount and shows on unmount', () => {
    const { unmount } = render(<Weight />);
    expect(mockHideTabBar).toHaveBeenCalled();
    unmount();
    expect(mockShowTabBar).toHaveBeenCalled();
  });

  it('navigates to tracker when header back is pressed', () => {
    const { getByTestId } = render(<Weight />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('tracker');
  });

  it('loads weight goal on mount', async () => {
    render(<Weight />);
    await waitFor(() => {
      expect(mockGetWeightGoal).toHaveBeenCalled();
    });
  });

  it('fetches weight history on mount', async () => {
    render(<Weight />);
    await waitFor(() => {
      expect(mockGetWeightHistory).toHaveBeenCalled();
    });
  });

  it('renders bottom sheet for editing', () => {
    const { getByTestId } = render(<Weight />);
    expect(getByTestId('bottom-sheet')).toBeTruthy();
  });

  it('renders Salvar button in bottom sheet', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Salvar')).toBeTruthy();
  });

  it('renders Cancelar button in bottom sheet', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('Cancelar')).toBeTruthy();
  });

  it('renders +/- adjustment buttons', () => {
    const { getByText } = render(<Weight />);
    expect(getByText('-')).toBeTruthy();
    expect(getByText('+')).toBeTruthy();
  });

  it('renders chart when history data is available', async () => {
    mockGetWeightHistory.mockResolvedValue([
      { weightKg: 75 },
      { weightKg: 74.5 },
    ]);

    const { getByTestId } = render(<Weight />);

    await waitFor(() => {
      expect(getByTestId('weight-step-chart')).toBeTruthy();
    });
  });

  it('renders empty state when no weight history and no current weight', async () => {
    // Override useHome to return 0 weight so chartData becomes []
    jest.spyOn(require('src/hooks/useHome'), 'useHome').mockReturnValue({
      trackerData: {
        weight: [{ weight_completed: 0 }],
      },
      refreshFitnessData: mockRefreshFitnessData,
    });
    mockGetWeightHistory.mockResolvedValue([]);

    const { getByText } = render(<Weight />);

    await waitFor(() => {
      expect(getByText(/Nenhum registro de peso ainda/)).toBeTruthy();
    });
  });
});
