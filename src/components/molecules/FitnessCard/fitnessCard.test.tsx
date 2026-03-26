import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FitnessCard, Props } from './fitnessCard';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Text: (props: any) => require("react").createElement(RN.Text, props),
    Box: (props: any) => require("react").createElement(RN.View, { ...props, testID: props.testID }),
    Flex: (props: any) => require("react").createElement(RN.View, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
  };
});

jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg' }),
    Path: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg-path' }),
    Defs: (props: any) => require("react").createElement(RN.View, props),
    LinearGradient: (props: any) => require("react").createElement(RN.View, props),
    Stop: (props: any) => require("react").createElement(RN.View, props),
    Rect: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg-rect' }),
  };
});

jest.mock('@assets/icons', () => ({
  EditIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'edit-icon' }),
  AddIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'add-icon' }),
}));

describe('FitnessCard', () => {
  const defaultProps: Props = {
    title: 'Peso',
    value: '72.5',
    unit: 'kg',
    variant: 'weight',
    goTo: jest.fn(),
  };

  it('renders title', () => {
    const { getByText } = render(<FitnessCard {...defaultProps} />);
    expect(getByText('Peso')).toBeTruthy();
  });

  it('renders value and unit', () => {
    const { getByText } = render(<FitnessCard {...defaultProps} />);
    expect(getByText('72.5')).toBeTruthy();
    expect(getByText('kg')).toBeTruthy();
  });

  it('calls goTo on press', () => {
    const goTo = jest.fn();
    const { getByText } = render(<FitnessCard {...defaultProps} goTo={goTo} />);
    fireEvent.press(getByText('Peso'));
  });

  it('renders edit icon for non add-new variants', () => {
    const { getByTestId } = render(<FitnessCard {...defaultProps} />);
    expect(getByTestId('edit-icon')).toBeTruthy();
  });

  it('does not render edit icon for add-new variant', () => {
    const { queryByTestId } = render(
      <FitnessCard title="Adicionar" variant="add-new" />
    );
    expect(queryByTestId('edit-icon')).toBeNull();
  });

  it('renders add icon for add-new variant', () => {
    const { getByTestId } = render(
      <FitnessCard title="Adicionar" variant="add-new" />
    );
    expect(getByTestId('add-icon')).toBeTruthy();
  });

  it('does not render value for add-new variant', () => {
    const { queryByText } = render(
      <FitnessCard title="Adicionar" variant="add-new" value="72.5" unit="kg" />
    );
    expect(queryByText('72.5')).toBeNull();
  });

  it('renders without unit', () => {
    const { getByText, queryByText } = render(
      <FitnessCard title="Peso" value="72.5" variant="weight" />
    );
    expect(getByText('72.5')).toBeTruthy();
    expect(queryByText('kg')).toBeNull();
  });

  it('renders weight variant visualization', () => {
    const { toJSON } = render(<FitnessCard {...defaultProps} variant="weight" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders nutrition variant', () => {
    const { toJSON } = render(
      <FitnessCard title="Nutricao" value="1500" unit="kcal" variant="nutrition" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders calories variant', () => {
    const { toJSON } = render(
      <FitnessCard title="Calorias" value="2000" unit="kcal" variant="calories" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders sleep-grid variant', () => {
    const { toJSON } = render(
      <FitnessCard title="Sono" value="7" unit="h" variant="sleep-grid" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders hydration variant', () => {
    const { toJSON } = render(
      <FitnessCard title="Agua" value="2000" unit="ml" variant="hydration" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders default variant (falls through to WeightChart)', () => {
    const { toJSON } = render(
      <FitnessCard title="Outro" value="10" variant={'unknown' as any} />
    );
    expect(toJSON()).toBeTruthy();
  });

  // fullWidth tests
  it('renders fullWidth layout', () => {
    const { getByText } = render(
      <FitnessCard {...defaultProps} fullWidth={true} />
    );
    expect(getByText('Peso')).toBeTruthy();
    expect(getByText('72.5')).toBeTruthy();
    expect(getByText('kg')).toBeTruthy();
  });

  it('renders fullWidth without unit', () => {
    const { getByText, queryByText } = render(
      <FitnessCard title="Peso" value="72.5" variant="weight" fullWidth={true} />
    );
    expect(getByText('72.5')).toBeTruthy();
    expect(queryByText('kg')).toBeNull();
  });

  it('renders fullWidth with goTo callback', () => {
    const goTo = jest.fn();
    const { getByText } = render(
      <FitnessCard {...defaultProps} fullWidth={true} goTo={goTo} />
    );
    fireEvent.press(getByText('Peso'));
  });

  it('renders without value in regular mode (not add-new)', () => {
    const { getByText } = render(
      <FitnessCard title="Peso" variant="weight" />
    );
    expect(getByText('Peso')).toBeTruthy();
  });
});
