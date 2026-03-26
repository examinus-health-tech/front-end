import React from 'react';
import { render } from '@testing-library/react-native';
import { WeightStepChart, DataPoint, Props } from './weightStepChart';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
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
    Line: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg-line' }),
    G: (props: any) => require("react").createElement(RN.View, props),
    Rect: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg-rect' }),
  };
});

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: (props: any) => require("react").createElement(RN.View, props),
    },
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (fn: any) => fn(),
    withTiming: (val: any) => val,
    withDelay: (_delay: any, val: any) => val,
    Easing: { out: (fn: any) => fn, cubic: {} },
    FadeIn: { delay: () => ({ duration: () => ({ easing: () => ({}) }) }), duration: () => ({ easing: () => ({}) }) },
    FadeOut: {},
  };
});

describe('WeightStepChart', () => {
  const defaultData: DataPoint[] = [
    { value: 72, label: 'Seg' },
    { value: 71.5, label: 'Ter' },
    { value: 73, label: 'Qua' },
    { value: 72.8, label: 'Qui' },
    { value: 72.2, label: 'Sex' },
  ];

  const defaultProps: Props = {
    data: defaultData,
    unit: 'kg',
  };

  it('renders without crashing', () => {
    const { toJSON } = render(<WeightStepChart {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('returns null when data is empty', () => {
    const { toJSON } = render(<WeightStepChart data={[]} />);
    expect(toJSON()).toBeNull();
  });

  it('renders with default props', () => {
    const { toJSON } = render(<WeightStepChart {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom lineColor', () => {
    const { toJSON } = render(
      <WeightStepChart {...defaultProps} lineColor="#FF0000" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom gradientColor', () => {
    const { toJSON } = render(
      <WeightStepChart {...defaultProps} gradientColor="#0000FF" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom indicatorColor', () => {
    const { toJSON } = render(
      <WeightStepChart {...defaultProps} indicatorColor="#00FF00" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with goalValue', () => {
    const { toJSON } = render(
      <WeightStepChart {...defaultProps} goalValue={70} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom goalLineColor', () => {
    const { toJSON } = render(
      <WeightStepChart {...defaultProps} goalValue={70} goalLineColor="#FF00FF" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without goalValue (no goal line)', () => {
    const { toJSON } = render(<WeightStepChart {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles single data point', () => {
    const singleData: DataPoint[] = [{ value: 72, label: 'Seg' }];
    const { toJSON } = render(<WeightStepChart data={singleData} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles large value range', () => {
    const data: DataPoint[] = [
      { value: 50 },
      { value: 200 },
      { value: 100 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles small values (below 100)', () => {
    const data: DataPoint[] = [
      { value: 5 },
      { value: 10 },
      { value: 8 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles values above 2500 for step calculation', () => {
    const data: DataPoint[] = [
      { value: 3000 },
      { value: 5000 },
      { value: 4000 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles values between 500 and 1000 for step calculation', () => {
    const data: DataPoint[] = [
      { value: 600 },
      { value: 800 },
      { value: 700 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles values between 100 and 500 for step calculation', () => {
    const data: DataPoint[] = [
      { value: 150 },
      { value: 350 },
      { value: 250 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles equal values (range = 0)', () => {
    const data: DataPoint[] = [
      { value: 72 },
      { value: 72 },
      { value: 72 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles two data points with descent', () => {
    const data: DataPoint[] = [
      { value: 75 },
      { value: 70 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles two data points with ascent', () => {
    const data: DataPoint[] = [
      { value: 70 },
      { value: 75 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with default unit "kg"', () => {
    const { toJSON } = render(<WeightStepChart data={defaultData} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles goalValue included in range calculation', () => {
    const data: DataPoint[] = [
      { value: 72 },
      { value: 73 },
    ];
    const { toJSON } = render(
      <WeightStepChart data={data} goalValue={80} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles range less than 50', () => {
    const data: DataPoint[] = [
      { value: 70 },
      { value: 75 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles range between 50 and 100', () => {
    const data: DataPoint[] = [
      { value: 50 },
      { value: 120 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles range between 1000 and 2500', () => {
    const data: DataPoint[] = [
      { value: 1000 },
      { value: 3000 },
    ];
    const { toJSON } = render(<WeightStepChart data={data} />);
    expect(toJSON()).toBeTruthy();
  });
});
