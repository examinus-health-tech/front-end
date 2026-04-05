import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StatusCards } from './statusCard';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    Pressable: (props: any) => require("react").createElement(RN.TouchableOpacity, props),
  };
});

jest.mock('@assets/icons', () => ({
  BarbellIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'barbell-icon' }),
  BedIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'bed-icon' }),
  CheckIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'check-icon' }),
  WalkingIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'walking-icon' }),
  WaterIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'water-icon' }),
  AppleIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'apple-icon' }),
  HeartIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'heart-icon' }),
}));

jest.mock('@components/molecules/Progress/progress', () => ({
  Progress: (props: any) =>
    require('react').createElement(require('react-native').View, { testID: `progress-${props.filledColor}` }),
}));

jest.mock('react-native-circular-progress', () => ({
  AnimatedCircularProgress: (props: any) => {
    const RN = require('react-native');
    return require('react').createElement(
      RN.View,
      { testID: 'circular-progress' },
      typeof props.children === 'function' ? props.children() : props.children
    );
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useFocusEffect: (cb: any) => {
    // Run the callback immediately for testing
    const React = require('react');
    React.useEffect(() => {
      cb();
    }, []);
  },
}));

const mockTrackerData = {
  kcal: [{ kcal_completed: 1500 }],
  step: [{ step_completed: 7500 }],
  sleep: [{ sleep_completed: 6.5, sleep_goal: 8 }],
  hydration: [{ hydration_completed: 5 }],
  nutrition: [{ nutrition_completed: 1200 }],
};

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    trackerData: mockTrackerData,
  }),
}));

jest.mock('src/services/fitnessService', () => ({
  getCaloriesGoal: jest.fn().mockResolvedValue(2000),
  getHydrationGoal: jest.fn().mockResolvedValue(2000), // 2000ml -> 8 cups
  getStepsGoal: jest.fn().mockResolvedValue(10000),
}));

jest.mock('@routes/app.routes', () => ({}));

describe('StatusCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all status cards', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    expect(getByText('Calorias Queimadas')).toBeTruthy();
    expect(getByText('Nutrição')).toBeTruthy();
    expect(getByText('Passos')).toBeTruthy();
    expect(getByText('Sono')).toBeTruthy();
    expect(getByText('Hidratação')).toBeTruthy();
  });

  it('displays tracker data when userTrackerData is false', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    // Calories: 1500 kcal
    expect(getByText(/1\.500 kcal/)).toBeTruthy();
    // Steps: 7500
    expect(getByText(/7\.500 passos/)).toBeTruthy();
  });

  it('displays zeroed values when userTrackerData is true', () => {
    const { getAllByText } = render(<StatusCards userTrackerData={true} />);
    // When userTrackerData is true, values should show 0
    expect(getAllByText(/0 kcal/).length).toBeGreaterThan(0);
    expect(getAllByText(/0 passos/).length).toBeGreaterThan(0);
    expect(getAllByText(/0 copos/).length).toBeGreaterThan(0);
  });

  it('navigates to calories screen on press', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    fireEvent.press(getByText('Calorias Queimadas'));
    expect(mockNavigate).toHaveBeenCalledWith('calories');
  });

  it('navigates to nutrition screen on press', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    fireEvent.press(getByText('Nutrição'));
    expect(mockNavigate).toHaveBeenCalledWith('nutrition');
  });

  it('navigates to steps screen on press', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    fireEvent.press(getByText('Passos'));
    expect(mockNavigate).toHaveBeenCalledWith('steps');
  });

  it('navigates to sleep screen on press', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    fireEvent.press(getByText('Sono'));
    expect(mockNavigate).toHaveBeenCalledWith('sleep');
  });

  it('navigates to hydration screen on press', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    fireEvent.press(getByText('Hidratação'));
    expect(mockNavigate).toHaveBeenCalledWith('hydration');
  });

  it('renders sleep info text when data is available', () => {
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    expect(getByText(/6\.5h de 8h/)).toBeTruthy();
  });

  it('renders "Sem registro" for sleep when userTrackerData is true', () => {
    const { getByText } = render(<StatusCards userTrackerData={true} />);
    expect(getByText('Sem registro do seu ciclo')).toBeTruthy();
  });

  it('renders circular progress for sleep', () => {
    const { getByTestId } = render(<StatusCards userTrackerData={false} />);
    expect(getByTestId('circular-progress')).toBeTruthy();
  });

  it('renders hydration bars', () => {
    const { getAllByText } = render(<StatusCards userTrackerData={false} />);
    expect(getAllByText(/copos/).length).toBeGreaterThan(0);
  });

  it('renders progress bars for calories, nutrition, steps', () => {
    const { getByTestId } = render(<StatusCards userTrackerData={false} />);
    expect(getByTestId('progress-red.400')).toBeTruthy();
    expect(getByTestId('progress-orange.400')).toBeTruthy();
    expect(getByTestId('progress-ciano.400')).toBeTruthy();
  });

  it('renders all icons', () => {
    const { getByTestId } = render(<StatusCards userTrackerData={false} />);
    expect(getByTestId('barbell-icon')).toBeTruthy();
    expect(getByTestId('apple-icon')).toBeTruthy();
    expect(getByTestId('walking-icon')).toBeTruthy();
    expect(getByTestId('bed-icon')).toBeTruthy();
    expect(getByTestId('water-icon')).toBeTruthy();
  });
});

describe('StatusCards with missing data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles undefined tracker data gracefully', () => {
    // Override useHome for this test to return undefined trackerData
    jest.spyOn(require('src/hooks/useHome'), 'useHome').mockReturnValue({
      trackerData: undefined,
    });
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    expect(getByText('Calorias Queimadas')).toBeTruthy();
  });

  it('handles nutrition data as array', () => {
    jest.spyOn(require('src/hooks/useHome'), 'useHome').mockReturnValue({
      trackerData: {
        ...mockTrackerData,
        nutrition: [{ nutrition_completed: [{ kcal: 300 }, { kcal: 400 }] }],
      },
    });
    const { getByText } = render(<StatusCards userTrackerData={false} />);
    expect(getByText('Nutrição')).toBeTruthy();
  });
});
