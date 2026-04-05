import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { GoalCard } from './goalCard';

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

describe('GoalCard', () => {
  const defaultProps = {
    icon: <View testID="goal-icon" />,
    iconBgColor: 'blue.100',
    value: '1500',
    unit: 'kcal',
    label: 'Calorias',
  };

  it('renders without crashing', () => {
    const { toJSON } = render(<GoalCard {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the icon', () => {
    const { getByTestId } = render(<GoalCard {...defaultProps} />);
    expect(getByTestId('goal-icon')).toBeTruthy();
  });

  it('renders the value text', () => {
    const { getByText } = render(<GoalCard {...defaultProps} />);
    expect(getByText(/1500/)).toBeTruthy();
  });

  it('renders the unit text', () => {
    const { getByText } = render(<GoalCard {...defaultProps} />);
    expect(getByText('kcal')).toBeTruthy();
  });

  it('renders the label text', () => {
    const { getByText } = render(<GoalCard {...defaultProps} />);
    expect(getByText('Calorias')).toBeTruthy();
  });

  it('renders with different values', () => {
    const { getByText } = render(
      <GoalCard
        icon={<View />}
        iconBgColor="green.100"
        value="8000"
        unit="passos"
        label="Passos Diarios"
      />
    );
    expect(getByText(/8000/)).toBeTruthy();
    expect(getByText('passos')).toBeTruthy();
    expect(getByText('Passos Diarios')).toBeTruthy();
  });

  it('renders with different iconBgColor', () => {
    const { toJSON } = render(
      <GoalCard {...defaultProps} iconBgColor="red.200" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with empty value', () => {
    const { toJSON } = render(
      <GoalCard {...defaultProps} value="" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different unit strings', () => {
    const units = ['kcal', 'km', 'min', 'passos', 'L'];
    units.forEach((unit) => {
      const { getByText } = render(
        <GoalCard {...defaultProps} unit={unit} />
      );
      expect(getByText(unit)).toBeTruthy();
    });
  });
});
