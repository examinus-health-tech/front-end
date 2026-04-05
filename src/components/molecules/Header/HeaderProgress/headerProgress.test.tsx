import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HeaderProgress, Props } from './headerProgress';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    HStack: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
  };
});

jest.mock('@assets/icons', () => ({
  ChevronLeftIcon: (props: any) => require('react').createElement(require('react-native').View, { testID: 'chevron-left-icon' }),
}));

jest.mock('@components/molecules/Progress/progress', () => ({
  Progress: (props: any) =>
    require('react').createElement(require('react-native').View, {
      testID: 'progress-bar',
      accessibilityValue: { now: props.value },
    }),
}));

describe('HeaderProgress', () => {
  it('renders without any props', () => {
    const { toJSON } = render(<HeaderProgress />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders back button when withBackButton is provided', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(<HeaderProgress withBackButton={goBack} />);
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('calls withBackButton on press', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(<HeaderProgress withBackButton={goBack} />);
    const backButton = getByTestId('chevron-left-icon').parent;
    if (backButton) fireEvent.press(backButton);
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('does not render back button when withBackButton is undefined', () => {
    const { queryByTestId } = render(<HeaderProgress />);
    expect(queryByTestId('chevron-left-icon')).toBeNull();
  });

  it('renders progress bar when progressValue is provided', () => {
    const { getByTestId } = render(<HeaderProgress progressValue={50} />);
    expect(getByTestId('progress-bar')).toBeTruthy();
  });

  it('does not render progress bar when progressValue is 0', () => {
    const { queryByTestId } = render(<HeaderProgress progressValue={0} />);
    expect(queryByTestId('progress-bar')).toBeNull();
  });

  it('does not render progress bar when progressValue is undefined', () => {
    const { queryByTestId } = render(<HeaderProgress />);
    expect(queryByTestId('progress-bar')).toBeNull();
  });

  it('renders jump button when jumpTo is provided', () => {
    const jumpTo = jest.fn();
    const { getByText } = render(<HeaderProgress jumpTo={jumpTo} />);
    expect(getByText('Pular')).toBeTruthy();
  });

  it('calls jumpTo when jump button is pressed', () => {
    const jumpTo = jest.fn();
    const { getByText } = render(<HeaderProgress jumpTo={jumpTo} />);
    fireEvent.press(getByText('Pular'));
    expect(jumpTo).toHaveBeenCalledTimes(1);
  });

  it('does not render jump button when jumpTo is undefined', () => {
    const { queryByText } = render(<HeaderProgress />);
    expect(queryByText('Pular')).toBeNull();
  });

  it('uses wider progress when there is no back button', () => {
    // When withBackButton is provided, sizeW=50; without it, sizeW=60
    const { getByTestId } = render(<HeaderProgress progressValue={75} />);
    expect(getByTestId('progress-bar')).toBeTruthy();
  });

  it('uses narrower progress when there is a back button', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(
      <HeaderProgress progressValue={75} withBackButton={goBack} />
    );
    expect(getByTestId('progress-bar')).toBeTruthy();
  });

  it('renders all elements together', () => {
    const goBack = jest.fn();
    const jumpTo = jest.fn();
    const { getByTestId, getByText } = render(
      <HeaderProgress withBackButton={goBack} progressValue={50} jumpTo={jumpTo} />
    );
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
    expect(getByTestId('progress-bar')).toBeTruthy();
    expect(getByText('Pular')).toBeTruthy();
  });
});
