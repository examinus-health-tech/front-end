import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Calories } from './calories';

const mockNavigate = jest.fn();
const mockHideTabBar = jest.fn();
const mockShowTabBar = jest.fn();
const mockGetActivities = jest.fn();

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
    Divider: (props: any) => <RN.View testID="divider" {...props} />,
    Skeleton: (props: any) => <RN.View testID="skeleton" {...props} />,
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
  CaloriesBar: ({ burned, target }: any) => {
    const RN = require('react-native');
    return <RN.View testID="calories-bar" />;
  },
  ActivityCard: ({ title, calories, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID={`activity-${title}`}>
        <RN.Text>{title}</RN.Text>
        <RN.Text>{calories} kcal</RN.Text>
      </RN.View>
    );
  },
}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  const makeIcon = (name: string) => (props: any) => <RN.View testID={`icon-${name}`} {...props} />;
  return {
    FireIcon: makeIcon('fire'),
    WalkingIcon: makeIcon('walking'),
    BarbellIcon: makeIcon('barbell'),
    BedIcon: makeIcon('bed'),
    BicycleIcon: makeIcon('bicycle'),
    HeartIcon: makeIcon('heart'),
  };
});

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: {
      kcal: [{ kcal_goal: 2000, kcal_completed: 1200 }],
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
  getActivities: (...args: any[]) => mockGetActivities(...args),
}));

describe('Calories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActivities.mockResolvedValue([]);
  });

  it('renders the header with "Calorias Gastas" title', () => {
    const { getByText } = render(<Calories />);
    expect(getByText('Calorias Gastas')).toBeTruthy();
  });

  it('renders "Hoje você queimou" text', () => {
    const { getByText } = render(<Calories />);
    expect(getByText('Hoje você queimou')).toBeTruthy();
  });

  it('renders calories burned value', () => {
    const { getByText } = render(<Calories />);
    expect(getByText('1.200')).toBeTruthy();
  });

  it('renders "No caminho certo" when on track', () => {
    const { getByText } = render(<Calories />);
    // 1200 >= 2000 * 0.5 = 1000, so on track
    expect(getByText('No caminho certo')).toBeTruthy();
  });

  it('renders CaloriesBar component', () => {
    const { getByTestId } = render(<Calories />);
    expect(getByTestId('calories-bar')).toBeTruthy();
  });

  it('renders legend items', () => {
    const { getByText } = render(<Calories />);
    expect(getByText('Gastas')).toBeTruthy();
    expect(getByText('Alvo')).toBeTruthy();
    expect(getByText('Faltam')).toBeTruthy();
  });

  it('renders "Atividades de Hoje" section', () => {
    const { getByText } = render(<Calories />);
    expect(getByText('Atividades de Hoje')).toBeTruthy();
  });

  it('renders empty activities state', async () => {
    const { getByText } = render(<Calories />);
    await waitFor(() => {
      expect(getByText('Nenhuma atividade registrada hoje')).toBeTruthy();
    });
  });

  it('renders activities when available', async () => {
    mockGetActivities.mockResolvedValue([
      { id: '1', activityType: 0, activityName: 'Caminhada', caloriesBurned: 150 },
      { id: '2', activityType: 3, activityName: 'Musculação', caloriesBurned: 300 },
    ]);

    const { getByText } = render(<Calories />);

    await waitFor(() => {
      expect(getByText('Caminhada')).toBeTruthy();
      expect(getByText('Musculação')).toBeTruthy();
    });
  });

  it('renders activity count when activities are present', async () => {
    mockGetActivities.mockResolvedValue([
      { id: '1', activityType: 0, caloriesBurned: 150 },
    ]);

    const { getByText } = render(<Calories />);

    await waitFor(() => {
      expect(getByText('1 atividade')).toBeTruthy();
    });
  });

  it('renders "Sobre as Atividades" info section', () => {
    const { getByText } = render(<Calories />);
    expect(getByText('Sobre as Atividades')).toBeTruthy();
  });

  it('hides tab bar on mount and shows on unmount', () => {
    const { unmount } = render(<Calories />);
    expect(mockHideTabBar).toHaveBeenCalled();
    unmount();
    expect(mockShowTabBar).toHaveBeenCalled();
  });

  it('navigates to tracker when header back is pressed', () => {
    const { getByTestId } = render(<Calories />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('tracker');
  });

  it('handles activities fetch error gracefully', async () => {
    mockGetActivities.mockRejectedValue(new Error('API Error'));

    const { getByText } = render(<Calories />);

    await waitFor(() => {
      expect(getByText('Nenhuma atividade registrada hoje')).toBeTruthy();
    });
  });
});
