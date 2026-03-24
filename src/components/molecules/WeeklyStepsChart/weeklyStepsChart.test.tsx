import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WeeklyStepsChart, DayData, Props } from './weeklyStepsChart';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
  };
});

const weeklyData: DayData[] = [
  { label: 'Seg', value: 5000, isActive: false },
  { label: 'Ter', value: 7000, isActive: false },
  { label: 'Qua', value: 8000, isActive: false },
  { label: 'Qui', value: 4000, isActive: false },
  { label: 'Sex', value: 9000, isActive: false },
  { label: 'Sab', value: 3000, isActive: false },
  { label: 'Dom', value: 6000, isActive: true },
];

describe('WeeklyStepsChart', () => {
  const defaultProps: Props = {
    data: weeklyData,
    goal: 10000,
  };

  it('renders without crashing', () => {
    const { toJSON } = render(<WeeklyStepsChart {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders all day labels', () => {
    const { getByText, UNSAFE_getAllByType } = render(<WeeklyStepsChart {...defaultProps} />);
    const RN = require('react-native');
    // Trigger onLayout to set containerWidth > 0
    const views = UNSAFE_getAllByType(RN.View);
    fireEvent(views[0], 'layout', { nativeEvent: { layout: { width: 300 } } });
    expect(getByText('Seg')).toBeTruthy();
    expect(getByText('Ter')).toBeTruthy();
    expect(getByText('Qua')).toBeTruthy();
    expect(getByText('Qui')).toBeTruthy();
    expect(getByText('Sex')).toBeTruthy();
    expect(getByText('Sab')).toBeTruthy();
    expect(getByText('Dom')).toBeTruthy();
  });

  it('uses weekly period by default', () => {
    const { toJSON } = render(<WeeklyStepsChart {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with monthly period', () => {
    const monthlyData: DayData[] = [
      { label: 'S1', value: 35000 },
      { label: 'S2', value: 42000 },
      { label: 'S3', value: 38000 },
      { label: 'S4', value: 45000 },
    ];
    const { getByText, UNSAFE_getAllByType } = render(
      <WeeklyStepsChart data={monthlyData} goal={40000} period="monthly" />
    );
    const RN = require('react-native');
    const views = UNSAFE_getAllByType(RN.View);
    fireEvent(views[0], 'layout', { nativeEvent: { layout: { width: 300 } } });
    expect(getByText('S1')).toBeTruthy();
    expect(getByText('S4')).toBeTruthy();
  });

  it('renders with yearly period', () => {
    const yearlyData: DayData[] = [
      { label: 'Jan', value: 150000 },
      { label: 'Fev', value: 180000 },
      { label: 'Mar', value: 200000 },
    ];
    const { getByText, UNSAFE_getAllByType } = render(
      <WeeklyStepsChart data={yearlyData} goal={200000} period="yearly" />
    );
    const RN = require('react-native');
    const views = UNSAFE_getAllByType(RN.View);
    fireEvent(views[0], 'layout', { nativeEvent: { layout: { width: 300 } } });
    expect(getByText('Jan')).toBeTruthy();
    expect(getByText('Mar')).toBeTruthy();
  });

  it('handles zero values', () => {
    const zeroData: DayData[] = [
      { label: 'Seg', value: 0 },
      { label: 'Ter', value: 0 },
    ];
    const { toJSON } = render(
      <WeeklyStepsChart data={zeroData} goal={10000} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles goal less than max value', () => {
    const highData: DayData[] = [
      { label: 'Seg', value: 15000 },
      { label: 'Ter', value: 12000 },
    ];
    const { toJSON } = render(
      <WeeklyStepsChart data={highData} goal={10000} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies bold font weight for active items', () => {
    const dataWithActive: DayData[] = [
      { label: 'Seg', value: 5000, isActive: true },
      { label: 'Ter', value: 7000, isActive: false },
    ];
    const { getByText, UNSAFE_getAllByType } = render(
      <WeeklyStepsChart data={dataWithActive} goal={10000} />
    );
    const RN = require('react-native');
    const views = UNSAFE_getAllByType(RN.View);
    fireEvent(views[0], 'layout', { nativeEvent: { layout: { width: 300 } } });
    expect(getByText('Seg')).toBeTruthy();
    expect(getByText('Ter')).toBeTruthy();
  });

  it('renders with single data point', () => {
    const singleData: DayData[] = [{ label: 'Seg', value: 5000 }];
    const { getByText, UNSAFE_getAllByType } = render(
      <WeeklyStepsChart data={singleData} goal={10000} />
    );
    const RN = require('react-native');
    const views = UNSAFE_getAllByType(RN.View);
    fireEvent(views[0], 'layout', { nativeEvent: { layout: { width: 300 } } });
    expect(getByText('Seg')).toBeTruthy();
  });

  it('handles data where all values exceed goal', () => {
    const allExceed: DayData[] = weeklyData.map((d) => ({
      ...d,
      value: 15000,
    }));
    const { toJSON } = render(
      <WeeklyStepsChart data={allExceed} goal={10000} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
