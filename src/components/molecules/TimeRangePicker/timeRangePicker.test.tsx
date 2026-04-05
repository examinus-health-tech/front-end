import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TimeRangePicker, TimeRange } from './timeRangePicker';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    VStack: RN.View,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    RangeTab: ({ label, isSelected, onPress }: any) => (
      <RN.TouchableOpacity onPress={onPress} testID={`tab-${label}`}>
        <RN.Text>{label}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

describe('TimeRangePicker', () => {
  const defaultProps = {
    selected: '1d' as TimeRange,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<TimeRangePicker {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders all five range tabs', () => {
    const { getByText } = render(<TimeRangePicker {...defaultProps} />);
    expect(getByText('1 Dia')).toBeTruthy();
    expect(getByText('1 Semana')).toBeTruthy();
    expect(getByText('1 Mês')).toBeTruthy();
    expect(getByText('1 Ano')).toBeTruthy();
    expect(getByText('Tudo')).toBeTruthy();
  });

  it('calls onSelect with "1d" when 1 Dia is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <TimeRangePicker selected="1w" onSelect={onSelect} />
    );
    fireEvent.press(getByTestId('tab-1 Dia'));
    expect(onSelect).toHaveBeenCalledWith('1d');
  });

  it('calls onSelect with "1w" when 1 Semana is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <TimeRangePicker selected="1d" onSelect={onSelect} />
    );
    fireEvent.press(getByTestId('tab-1 Semana'));
    expect(onSelect).toHaveBeenCalledWith('1w');
  });

  it('calls onSelect with "1m" when 1 Mes is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <TimeRangePicker selected="1d" onSelect={onSelect} />
    );
    fireEvent.press(getByTestId('tab-1 Mês'));
    expect(onSelect).toHaveBeenCalledWith('1m');
  });

  it('calls onSelect with "1y" when 1 Ano is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <TimeRangePicker selected="1d" onSelect={onSelect} />
    );
    fireEvent.press(getByTestId('tab-1 Ano'));
    expect(onSelect).toHaveBeenCalledWith('1y');
  });

  it('calls onSelect with "all" when Tudo is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <TimeRangePicker selected="1d" onSelect={onSelect} />
    );
    fireEvent.press(getByTestId('tab-Tudo'));
    expect(onSelect).toHaveBeenCalledWith('all');
  });

  it('renders with each possible selected value', () => {
    const ranges: TimeRange[] = ['1d', '1w', '1m', '1y', 'all'];
    ranges.forEach((range) => {
      const { toJSON } = render(
        <TimeRangePicker selected={range} onSelect={jest.fn()} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  it('calls onSelect only once per press', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <TimeRangePicker selected="1d" onSelect={onSelect} />
    );
    fireEvent.press(getByTestId('tab-1 Semana'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
