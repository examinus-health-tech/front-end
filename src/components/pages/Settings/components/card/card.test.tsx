import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Card } from './card';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
  };
});

jest.mock('@assets/icons', () => ({
  ChevronRightIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="chevron-right-icon" {...props} />;
  },
  EditIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="edit-icon" {...props} />;
  },
}));

describe('Card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -- Primary variant tests --
  it('renders with primary variant and title', () => {
    const { getByText } = render(
      <Card title="Test Card" variant="primary" />
    );
    expect(getByText('Test Card')).toBeTruthy();
  });

  it('renders icon in primary variant', () => {
    const RN = require('react-native');
    const icon = <RN.View testID="custom-icon" />;
    const { getByTestId } = render(
      <Card title="With Icon" variant="primary" icon={icon} />
    );
    expect(getByTestId('custom-icon')).toBeTruthy();
  });

  it('renders chevron action for primary variant', () => {
    const { getByTestId } = render(
      <Card title="Chevron Card" variant="primary" action="chevron" />
    );
    expect(getByTestId('chevron-right-icon')).toBeTruthy();
  });

  it('renders value action with value text', () => {
    const { getByText, getByTestId } = render(
      <Card title="Value Card" variant="primary" action="value" value="100" />
    );
    expect(getByText('100')).toBeTruthy();
    expect(getByTestId('chevron-right-icon')).toBeTruthy();
  });

  it('calls goTo when card with chevron action is pressed', () => {
    const goTo = jest.fn();
    const { getByText } = render(
      <Card title="Clickable" variant="primary" action="chevron" goTo={goTo} />
    );
    fireEvent.press(getByText('Clickable'));
    expect(goTo).toHaveBeenCalledTimes(1);
  });

  // -- Description variant tests --
  it('renders description variant with title and subtitle', () => {
    const { getByText } = render(
      <Card title="Desc Title" subTitle="Desc Subtitle" variant="description" />
    );
    expect(getByText('Desc Title')).toBeTruthy();
    expect(getByText('Desc Subtitle')).toBeTruthy();
  });

  // -- Value variant tests --
  it('renders value variant with title', () => {
    const { getByText } = render(
      <Card title="Value Title" variant="value" />
    );
    expect(getByText('Value Title')).toBeTruthy();
  });

  // -- comingSoon tests --
  it('renders "Em Breve" badge when comingSoon is true (non-switch)', () => {
    const { getByText } = render(
      <Card title="Coming" variant="primary" action="chevron" comingSoon />
    );
    expect(getByText('Em Breve')).toBeTruthy();
  });

  it('does not call goTo when comingSoon is true', () => {
    const goTo = jest.fn();
    const { getByText } = render(
      <Card title="Coming" variant="primary" action="chevron" comingSoon goTo={goTo} />
    );
    fireEvent.press(getByText('Coming'));
    expect(goTo).not.toHaveBeenCalled();
  });

  // -- Switch action tests --
  it('renders switch variant with toggle', () => {
    const { getByText } = render(
      <Card
        title="Switch Card"
        subTitle="Toggle me"
        variant="description"
        action="switch"
        switchValue={false}
        onSwitchChange={jest.fn()}
      />
    );
    expect(getByText('Switch Card')).toBeTruthy();
    expect(getByText('Toggle me')).toBeTruthy();
  });

  it('calls onSwitchChange when switch card is pressed', () => {
    const onSwitchChange = jest.fn();
    const { getByText } = render(
      <Card
        title="Toggle Card"
        variant="description"
        action="switch"
        switchValue={false}
        onSwitchChange={onSwitchChange}
      />
    );
    fireEvent.press(getByText('Toggle Card'));
    expect(onSwitchChange).toHaveBeenCalledWith(true);
  });

  it('calls onSwitchChange with false when switchValue is true', () => {
    const onSwitchChange = jest.fn();
    const { getByText } = render(
      <Card
        title="Toggle Off"
        variant="description"
        action="switch"
        switchValue={true}
        onSwitchChange={onSwitchChange}
      />
    );
    fireEvent.press(getByText('Toggle Off'));
    expect(onSwitchChange).toHaveBeenCalledWith(false);
  });

  it('does not call onSwitchChange when disabled', () => {
    const onSwitchChange = jest.fn();
    const { getByText } = render(
      <Card
        title="Disabled Switch"
        variant="description"
        action="switch"
        switchValue={false}
        onSwitchChange={onSwitchChange}
        disabled
      />
    );
    fireEvent.press(getByText('Disabled Switch'));
    expect(onSwitchChange).not.toHaveBeenCalled();
  });

  it('renders "Em Breve" badge on switch variant when comingSoon', () => {
    const { getByText } = render(
      <Card
        title="Coming Switch"
        variant="description"
        action="switch"
        comingSoon
      />
    );
    expect(getByText('Em Breve')).toBeTruthy();
  });

  it('does not call onSwitchChange when comingSoon on switch variant', () => {
    const onSwitchChange = jest.fn();
    const { getByText } = render(
      <Card
        title="Coming Switch"
        variant="description"
        action="switch"
        comingSoon
        switchValue={false}
        onSwitchChange={onSwitchChange}
      />
    );
    fireEvent.press(getByText('Coming Switch'));
    expect(onSwitchChange).not.toHaveBeenCalled();
  });

  // -- Warning tests --
  it('renders with warning style', () => {
    const { getByText } = render(
      <Card title="Warning Card" variant="primary" warning />
    );
    expect(getByText('Warning Card')).toBeTruthy();
  });

  it('renders chevron with warning color', () => {
    const { getByTestId } = render(
      <Card title="Warning Chevron" variant="primary" action="chevron" warning />
    );
    expect(getByTestId('chevron-right-icon')).toBeTruthy();
  });

  // -- Disabled tests --
  it('does not call goTo when disabled (non-switch)', () => {
    const goTo = jest.fn();
    const { getByText } = render(
      <Card title="Disabled Card" variant="primary" action="chevron" goTo={goTo} disabled />
    );
    fireEvent.press(getByText('Disabled Card'));
    expect(goTo).not.toHaveBeenCalled();
  });

  // -- No action tests --
  it('renders without any action', () => {
    const { getByText, queryByTestId } = render(
      <Card title="No Action" variant="primary" />
    );
    expect(getByText('No Action')).toBeTruthy();
    expect(queryByTestId('chevron-right-icon')).toBeNull();
  });

  // -- renderLeftBox only for primary variant --
  it('does not render left box for description variant', () => {
    const RN = require('react-native');
    const icon = <RN.View testID="desc-icon" />;
    const { queryByTestId } = render(
      <Card title="Description" variant="description" icon={icon} />
    );
    // Icon is passed but renderLeftBox only renders for primary variant
    // In description variant the icon prop is not used in renderLeftBox
    expect(queryByTestId('desc-icon')).toBeNull();
  });
});
