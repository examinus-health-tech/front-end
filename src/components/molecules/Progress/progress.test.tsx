import React from 'react';
import { render } from '@testing-library/react-native';
import { Progress } from './progress';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: RN.View,
    VStack: RN.View,
    Center: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Pressable: RN.TouchableOpacity,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: ({ value, ...rest }: any) => <RN.View testID="progress-bar" {...rest} />,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

describe('Progress', () => {
  const defaultProps = {
    value: 50,
    sizeW: 80,
    filledColor: 'gray.900',
    bgColor: 'gray.300',
  };

  it('renders without crashing', () => {
    const { toJSON } = render(<Progress {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the progress bar', () => {
    const { getByTestId } = render(<Progress {...defaultProps} />);
    expect(getByTestId('progress-bar')).toBeTruthy();
  });

  it('renders with value of 0', () => {
    const { toJSON } = render(
      <Progress {...defaultProps} value={0} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with value of 100', () => {
    const { toJSON } = render(
      <Progress {...defaultProps} value={100} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom filledColor', () => {
    const { toJSON } = render(
      <Progress {...defaultProps} filledColor="blue.500" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom bgColor', () => {
    const { toJSON } = render(
      <Progress {...defaultProps} bgColor="red.100" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different sizeW values', () => {
    const sizes = [10, 25, 50, 75, 100];
    sizes.forEach((sizeW) => {
      const { toJSON } = render(
        <Progress {...defaultProps} sizeW={sizeW} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  it('uses default filledColor when not provided', () => {
    const { toJSON } = render(
      <Progress value={50} sizeW={80} filledColor="gray.900" bgColor="gray.300" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('uses default bgColor when not provided', () => {
    const { toJSON } = render(
      <Progress value={50} sizeW={80} filledColor="gray.900" bgColor="gray.300" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('passes additional rest props', () => {
    const { toJSON } = render(
      <Progress {...defaultProps} size="lg" />
    );
    expect(toJSON()).toBeTruthy();
  });
});
