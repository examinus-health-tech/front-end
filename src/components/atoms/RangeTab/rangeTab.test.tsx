import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RangeTab } from './rangeTab';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: RN.View,
    VStack: RN.View,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

describe('RangeTab', () => {
  const defaultProps = {
    label: '1 Dia',
    isSelected: false,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the label text', () => {
    const { getByText } = render(<RangeTab {...defaultProps} />);
    expect(getByText('1 Dia')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RangeTab {...defaultProps} onPress={onPress} />
    );
    fireEvent.press(getByText('1 Dia'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders in selected state', () => {
    const { getByText } = render(
      <RangeTab {...defaultProps} isSelected={true} />
    );
    expect(getByText('1 Dia')).toBeTruthy();
  });

  it('renders in unselected state', () => {
    const { getByText } = render(
      <RangeTab {...defaultProps} isSelected={false} />
    );
    expect(getByText('1 Dia')).toBeTruthy();
  });

  it('renders with different labels', () => {
    const labels = ['1 Dia', '1 Semana', '1 Mes', '1 Ano', 'Tudo'];
    labels.forEach((label) => {
      const { getByText } = render(
        <RangeTab label={label} isSelected={false} onPress={jest.fn()} />
      );
      expect(getByText(label)).toBeTruthy();
    });
  });

  it('handles multiple presses', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <RangeTab {...defaultProps} onPress={onPress} />
    );
    fireEvent.press(getByText('1 Dia'));
    fireEvent.press(getByText('1 Dia'));
    fireEvent.press(getByText('1 Dia'));
    expect(onPress).toHaveBeenCalledTimes(3);
  });
});
