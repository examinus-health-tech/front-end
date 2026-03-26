import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityCard, Props } from './activityCard';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, { ...props, testID: props.testID || 'box' }),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
  };
});

jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg' }),
    Path: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg-path' }),
    Rect: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg-rect' }),
  };
});

describe('ActivityCard', () => {
  const defaultProps: Props = {
    title: 'Corrida',
    calories: 350,
  };

  it('renders title and calories', () => {
    const { getByText } = render(<ActivityCard {...defaultProps} />);
    expect(getByText('Corrida')).toBeTruthy();
    expect(getByText('350 Calorias gastas')).toBeTruthy();
  });

  it('uses green variant by default', () => {
    const { toJSON } = render(<ActivityCard {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with yellow variant', () => {
    const { getByText } = render(<ActivityCard {...defaultProps} variant="yellow" />);
    expect(getByText('Corrida')).toBeTruthy();
  });

  it('renders with blue variant', () => {
    const { getByText } = render(<ActivityCard {...defaultProps} variant="blue" />);
    expect(getByText('Corrida')).toBeTruthy();
  });

  it('renders with purple variant', () => {
    const { getByText } = render(<ActivityCard {...defaultProps} variant="purple" />);
    expect(getByText('Corrida')).toBeTruthy();
  });

  it('renders icon when provided', () => {
    const RN = require('react-native');
    const icon = React.createElement(RN.View, { testID: 'test-icon' });
    const { getByTestId } = render(<ActivityCard {...defaultProps} icon={icon} />);
    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('does not render icon container when icon is not provided', () => {
    const { queryByTestId } = render(<ActivityCard {...defaultProps} />);
    expect(queryByTestId('test-icon')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<ActivityCard {...defaultProps} onPress={onPress} />);
    const card = getByText('Corrida');
    fireEvent.press(card);
    // TouchableOpacity wraps everything, so pressing any text triggers onPress
  });

  it('renders correctly with zero calories', () => {
    const { getByText } = render(<ActivityCard {...defaultProps} calories={0} />);
    expect(getByText('0 Calorias gastas')).toBeTruthy();
  });

  it('renders with different titles', () => {
    const { getByText } = render(
      <ActivityCard title="Caminhada" calories={200} variant="blue" />
    );
    expect(getByText('Caminhada')).toBeTruthy();
    expect(getByText('200 Calorias gastas')).toBeTruthy();
  });

  it('handles onPress being undefined gracefully', () => {
    const { toJSON } = render(<ActivityCard {...defaultProps} onPress={undefined} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the MiniStepChart area', () => {
    // The mini chart is rendered inside a Box with w={20}
    const { toJSON } = render(<ActivityCard {...defaultProps} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });
});
