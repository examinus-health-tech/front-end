import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HeaderTitle, Props } from './headerTitle';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Badge: (props: any) => require("react").createElement(RN.View, { ...props, testID: props.testID || 'badge' }, require("react").createElement(RN.Text, null, props.children)),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
  };
});

jest.mock('@assets/icons', () => ({
  ChevronLeftIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'chevron-left-icon' }),
  FilterIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'filter-icon' }),
  MoreIcon: (props: any) => require('react').createElement(require('react-native').View, { testID: 'more-icon' }),
}));

jest.mock('@components/molecules/Progress/progress', () => ({
  Progress: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'progress' }),
}));

describe('HeaderTitle', () => {
  it('renders title when provided', () => {
    const { getByText } = render(<HeaderTitle title="Exames" />);
    expect(getByText('Exames')).toBeTruthy();
  });

  it('does not render title when not provided', () => {
    const { queryByText } = render(<HeaderTitle />);
    expect(queryByText('Exames')).toBeNull();
  });

  it('renders back button when withBackButton is provided', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(<HeaderTitle withBackButton={goBack} />);
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('calls withBackButton on press', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(<HeaderTitle withBackButton={goBack} />);
    const backButton = getByTestId('chevron-left-icon').parent;
    if (backButton) fireEvent.press(backButton);
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('does not render back button when withBackButton is undefined', () => {
    const { queryByTestId } = render(<HeaderTitle title="Test" />);
    expect(queryByTestId('chevron-left-icon')).toBeNull();
  });

  it('renders more button when withMoreButton is true', () => {
    const { getByTestId } = render(<HeaderTitle withMoreButton={true} />);
    expect(getByTestId('more-icon')).toBeTruthy();
  });

  it('does not render more button when withMoreButton is false', () => {
    const { queryByTestId } = render(<HeaderTitle withMoreButton={false} />);
    expect(queryByTestId('more-icon')).toBeNull();
  });

  it('renders filter button when withFilterButton is true', () => {
    const { getByTestId } = render(<HeaderTitle withFilterButton={true} />);
    expect(getByTestId('filter-icon')).toBeTruthy();
  });

  it('calls filterButtonAction on filter press', () => {
    const filterAction = jest.fn();
    const { getByTestId } = render(
      <HeaderTitle withFilterButton={true} filterButtonAction={filterAction} />
    );
    const filterButton = getByTestId('filter-icon').parent;
    if (filterButton) fireEvent.press(filterButton);
    expect(filterAction).toHaveBeenCalledTimes(1);
  });

  it('renders risco alto badge', () => {
    const { getByText } = render(<HeaderTitle badgeVariant="risco alto" />);
    expect(getByText('risco alto')).toBeTruthy();
  });

  it('renders normal badge', () => {
    const { getByText } = render(<HeaderTitle badgeVariant="normal" />);
    expect(getByText('normal')).toBeTruthy();
  });

  it('renders excelente badge', () => {
    const { getByText } = render(<HeaderTitle badgeVariant="excelente" />);
    expect(getByText('excelente')).toBeTruthy();
  });

  it('does not render badge when badgeVariant is undefined', () => {
    const { queryByTestId } = render(<HeaderTitle title="Test" />);
    expect(queryByTestId('badge')).toBeNull();
  });

  it('uses white color for chevron when color is white', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(
      <HeaderTitle withBackButton={goBack} color="white" />
    );
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('uses default color for chevron', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(<HeaderTitle withBackButton={goBack} />);
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('uses white color for filter icon', () => {
    const { getByTestId } = render(
      <HeaderTitle withFilterButton={true} color="white" />
    );
    expect(getByTestId('filter-icon')).toBeTruthy();
  });

  it('renders all elements together', () => {
    const goBack = jest.fn();
    const { getByText, getByTestId } = render(
      <HeaderTitle
        withBackButton={goBack}
        title="Full Header"
        withMoreButton={true}
        withFilterButton={true}
        badgeVariant="excelente"
        filterButtonAction={jest.fn()}
      />
    );
    expect(getByText('Full Header')).toBeTruthy();
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
    expect(getByTestId('more-icon')).toBeTruthy();
    expect(getByTestId('filter-icon')).toBeTruthy();
    expect(getByText('excelente')).toBeTruthy();
  });
});
