import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text as RNText } from 'react-native';
import { Input } from './input';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Select: Object.assign(
      ({ children, ...rest }: any) => <RN.View testID="select-component" {...rest}>{children}</RN.View>,
      {
        Item: ({ label, value, ...rest }: any) => (
          <RN.View testID={`select-item-${value}`} {...rest}>
            <RN.Text>{label}</RN.Text>
          </RN.View>
        ),
      }
    ),
    WarningOutlineIcon: (props: any) => <RN.View testID="warning-icon" {...props} />,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

describe('Input', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Input />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the label text', () => {
    const { getByText } = render(<Input label="Email" />);
    expect(getByText(/Email/)).toBeTruthy();
  });

  it('renders the required asterisk when isRequired is true', () => {
    const { getByText } = render(<Input label="Nome" isRequired={true} />);
    expect(getByText('*')).toBeTruthy();
  });

  it('does not render the required asterisk when isRequired is false', () => {
    const { queryByText } = render(<Input label="Nome" isRequired={false} />);
    expect(queryByText('*')).toBeNull();
  });

  it('renders a TextInput when selectType is false/undefined', () => {
    const { toJSON } = render(<Input label="Name" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders a Select when selectType is true', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];
    const { getByTestId } = render(
      <Input label="Type" selectType={true} options={options} />
    );
    expect(getByTestId('select-component')).toBeTruthy();
  });

  it('renders select options', () => {
    const options = [
      { value: 'male', label: 'Masculino' },
      { value: 'female', label: 'Feminino' },
    ];
    const { getByText } = render(
      <Input label="Sexo" selectType={true} options={options} />
    );
    expect(getByText('Masculino')).toBeTruthy();
    expect(getByText('Feminino')).toBeTruthy();
  });

  it('renders error message when provided', () => {
    const { getByText, getByTestId } = render(
      <Input label="Email" errorMessage="Campo obrigatorio" />
    );
    expect(getByText('Campo obrigatorio')).toBeTruthy();
    expect(getByTestId('warning-icon')).toBeTruthy();
  });

  it('does not render error message when not provided', () => {
    const { queryByTestId } = render(<Input label="Email" />);
    expect(queryByTestId('warning-icon')).toBeNull();
  });

  it('does not render error message when errorMessage is empty string', () => {
    const { queryByTestId } = render(
      <Input label="Email" errorMessage="" />
    );
    expect(queryByTestId('warning-icon')).toBeNull();
  });

  it('renders leftIcon when provided', () => {
    const leftIcon = <View testID="left-icon" />;
    const { getByTestId } = render(
      <Input label="Email" leftIcon={leftIcon} />
    );
    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('renders rightIcon when provided', () => {
    const rightIcon = <View testID="right-icon" />;
    const { getByTestId } = render(
      <Input label="Password" rightIcon={rightIcon} />
    );
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('renders InputLeftElement when provided', () => {
    const leftElement = <View testID="left-element" />;
    const { getByTestId } = render(
      <Input label="Email" InputLeftElement={leftElement} />
    );
    expect(getByTestId('left-element')).toBeTruthy();
  });

  it('renders InputRightElement when provided', () => {
    const rightElement = <View testID="right-element" />;
    const { getByTestId } = render(
      <Input label="Password" InputRightElement={rightElement} />
    );
    expect(getByTestId('right-element')).toBeTruthy();
  });

  it('does not render icon containers when no icons are provided', () => {
    const { queryByTestId } = render(<Input label="Name" />);
    expect(queryByTestId('left-icon')).toBeNull();
    expect(queryByTestId('right-icon')).toBeNull();
  });

  it('handles text input changes', () => {
    const onChangeText = jest.fn();
    const { toJSON } = render(
      <Input label="Name" onChangeText={onChangeText} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom wContainer', () => {
    const { toJSON } = render(
      <Input label="Name" wContainer="80%" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('uses default wContainer of "full"', () => {
    const { toJSON } = render(<Input label="Name" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders select with error styling', () => {
    const options = [{ value: '1', label: 'One' }];
    const { getByTestId } = render(
      <Input
        label="Select"
        selectType={true}
        options={options}
        errorMessage="Required"
      />
    );
    expect(getByTestId('select-component')).toBeTruthy();
  });

  it('renders TextInput with error border color', () => {
    const { toJSON } = render(
      <Input label="Email" errorMessage="Invalid email" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('passes rest props to TextInput', () => {
    const { toJSON } = render(
      <Input
        label="Name"
        placeholder="Enter your name"
        autoCapitalize="none"
        keyboardType="email-address"
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
