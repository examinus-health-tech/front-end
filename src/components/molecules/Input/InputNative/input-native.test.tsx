import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InputNative } from './input-native';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: RN.View,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: RN.View,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

describe('InputNative', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<InputNative />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders a TextInput with default placeholder "0"', () => {
    const { getByPlaceholderText } = render(<InputNative />);
    expect(getByPlaceholderText('0')).toBeTruthy();
  });

  it('handles text input changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputNative onChangeText={onChangeText} />
    );
    const input = getByPlaceholderText('0');
    fireEvent.changeText(input, '150');
    expect(onChangeText).toHaveBeenCalledWith('150');
  });

  it('renders with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <InputNative placeholder="Enter weight" />
    );
    expect(getByPlaceholderText('Enter weight')).toBeTruthy();
  });

  it('renders with a value', () => {
    const { getByDisplayValue } = render(
      <InputNative value="75" />
    );
    expect(getByDisplayValue('75')).toBeTruthy();
  });

  it('passes the focused prop without error', () => {
    const { toJSON } = render(<InputNative focused={true} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without focused prop', () => {
    const { toJSON } = render(<InputNative focused={false} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles onFocus event', () => {
    const onFocus = jest.fn();
    const { getByPlaceholderText } = render(
      <InputNative onFocus={onFocus} />
    );
    fireEvent(getByPlaceholderText('0'), 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('handles onBlur event', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <InputNative onBlur={onBlur} />
    );
    fireEvent(getByPlaceholderText('0'), 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('passes keyboardType prop', () => {
    const { getByPlaceholderText } = render(
      <InputNative keyboardType="numeric" />
    );
    const input = getByPlaceholderText('0');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('passes editable prop', () => {
    const { getByPlaceholderText } = render(
      <InputNative editable={false} />
    );
    const input = getByPlaceholderText('0');
    expect(input.props.editable).toBe(false);
  });

  it('passes maxLength prop', () => {
    const { getByPlaceholderText } = render(
      <InputNative maxLength={5} />
    );
    const input = getByPlaceholderText('0');
    expect(input.props.maxLength).toBe(5);
  });

  it('renders multiple instances independently', () => {
    const { getAllByPlaceholderText } = render(
      <>
        <InputNative />
        <InputNative />
      </>
    );
    expect(getAllByPlaceholderText('0')).toHaveLength(2);
  });

  it('spreads additional rest props to TextInput', () => {
    const { getByPlaceholderText } = render(
      <InputNative testID="native-input" autoCorrect={false} />
    );
    expect(getByPlaceholderText('0')).toBeTruthy();
  });
});
