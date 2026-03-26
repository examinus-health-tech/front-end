import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FitnessCard } from './fitnessCard';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Flex: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

jest.mock('@assets/icons', () => ({
  EditIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="edit-icon" {...props} />;
  },
}));

describe('FitnessCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title', () => {
    const { getByText } = render(<FitnessCard title="Weight" />);
    expect(getByText('Weight')).toBeTruthy();
  });

  it('renders the value', () => {
    const { getByText } = render(<FitnessCard title="Weight" value="75" />);
    expect(getByText('75')).toBeTruthy();
  });

  it('renders the unit', () => {
    const { getByText } = render(<FitnessCard title="Weight" value="75" unit="kg" />);
    expect(getByText('kg')).toBeTruthy();
  });

  it('renders the edit icon', () => {
    const { getByTestId } = render(<FitnessCard title="Weight" />);
    expect(getByTestId('edit-icon')).toBeTruthy();
  });

  it('calls goTo when pressed', () => {
    const goTo = jest.fn();
    const { getByText } = render(
      <FitnessCard title="Weight" value="75" unit="kg" goTo={goTo} />
    );
    fireEvent.press(getByText('Weight'));
    expect(goTo).toHaveBeenCalledTimes(1);
  });

  it('renders with different units', () => {
    const units: Array<'kg' | 'mg' | 'kcal' | 'h' | 'ml'> = ['kg', 'mg', 'kcal', 'h', 'ml'];
    units.forEach((unit) => {
      const { getByText } = render(
        <FitnessCard title="Test" value="100" unit={unit} />
      );
      expect(getByText(unit)).toBeTruthy();
    });
  });

  it('renders without value', () => {
    const { getByText } = render(<FitnessCard title="Empty Card" />);
    expect(getByText('Empty Card')).toBeTruthy();
  });

  it('renders without goTo (not pressable)', () => {
    const { getByText } = render(<FitnessCard title="No Nav" value="50" unit="kg" />);
    expect(getByText('No Nav')).toBeTruthy();
    expect(getByText('50')).toBeTruthy();
  });

  it('renders value and unit together', () => {
    const { getByText } = render(
      <FitnessCard title="Calorias" value="1,500" unit="kcal" />
    );
    expect(getByText('Calorias')).toBeTruthy();
    expect(getByText('1,500')).toBeTruthy();
    expect(getByText('kcal')).toBeTruthy();
  });
});
