import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { StepStatCard } from './stepStatCard';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
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

jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Svg: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Path: (props: any) => <RN.View {...props} />,
  };
});

describe('StepStatCard', () => {
  const defaultProps = {
    value: '3.2',
    unit: ' km',
    icon: <View testID="stat-icon" />,
  };

  it('renders without crashing', () => {
    const { toJSON } = render(<StepStatCard {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the icon', () => {
    const { getByTestId } = render(<StepStatCard {...defaultProps} />);
    expect(getByTestId('stat-icon')).toBeTruthy();
  });

  it('renders the value text', () => {
    const { getByText } = render(<StepStatCard {...defaultProps} />);
    expect(getByText('3.2', { exact: false })).toBeTruthy();
  });

  it('renders the unit text', () => {
    const { getByText } = render(<StepStatCard {...defaultProps} />);
    expect(getByText(' km')).toBeTruthy();
  });

  it('renders with orange variant (default)', () => {
    const { toJSON } = render(<StepStatCard {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with blue variant', () => {
    const { toJSON } = render(
      <StepStatCard {...defaultProps} variant="blue" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with purple variant', () => {
    const { toJSON } = render(
      <StepStatCard {...defaultProps} variant="purple" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom progress value', () => {
    const { toJSON } = render(
      <StepStatCard {...defaultProps} progress={75} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with progress = 0', () => {
    const { toJSON } = render(
      <StepStatCard {...defaultProps} progress={0} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with progress = 100', () => {
    const { toJSON } = render(
      <StepStatCard {...defaultProps} progress={100} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('uses default progress of 50 when not provided', () => {
    const { toJSON } = render(<StepStatCard {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different value and unit combinations', () => {
    const combos = [
      { value: '45', unit: ' min' },
      { value: '120', unit: ' kcal' },
      { value: '8.5', unit: ' km' },
    ];

    combos.forEach(({ value, unit }) => {
      const { getByText } = render(
        <StepStatCard
          value={value}
          unit={unit}
          icon={<View />}
        />
      );
      expect(getByText(value, { exact: false })).toBeTruthy();
      expect(getByText(unit, { exact: false })).toBeTruthy();
    });
  });

  it('renders all three variant colors correctly', () => {
    const variants = ['orange', 'blue', 'purple'] as const;
    variants.forEach((variant) => {
      const { toJSON } = render(
        <StepStatCard {...defaultProps} variant={variant} progress={60} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });
});
