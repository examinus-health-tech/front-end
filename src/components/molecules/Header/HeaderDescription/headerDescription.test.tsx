import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HeaderDescription, Props } from './headerDescription';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    HStack: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    Pressable: (props: any) => require("react").createElement(RN.TouchableOpacity, props),
    Menu: Object.assign(
      (props: any) => {
        // Render the trigger and the children
        const trigger = props.trigger?.({ onPress: jest.fn() });
        return require("react").createElement(
          RN.View,
          { testID: 'menu' },
          trigger,
          props.children
        );
      },
      {
        Item: (props: any) => require("react").createElement(RN.TouchableOpacity, { ...props, testID: 'menu-item' }),
      }
    ),
  };
});

jest.mock('@assets/icons', () => ({
  ChevronLeftIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'chevron-left-icon' }),
  MoreIcon: (props: any) => require('react').createElement(require('react-native').View, { testID: 'more-icon' }),
  TrashIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'trash-icon' }),
}));

describe('HeaderDescription', () => {
  it('renders title when provided', () => {
    const { getByText } = render(<HeaderDescription title="Hemograma" />);
    expect(getByText('Hemograma')).toBeTruthy();
  });

  it('does not render title section when title is not provided', () => {
    const { queryByText } = render(<HeaderDescription />);
    expect(queryByText('Hemograma')).toBeNull();
  });

  it('renders subtitle when provided', () => {
    const { getByText } = render(
      <HeaderDescription title="Hemograma" subTitle="Resultado de 01/01/2025" />
    );
    expect(getByText('Resultado de 01/01/2025')).toBeTruthy();
  });

  it('does not render subtitle when not provided', () => {
    const { queryByText } = render(<HeaderDescription title="Hemograma" />);
    expect(queryByText('Resultado de 01/01/2025')).toBeNull();
  });

  it('renders back button when withBackButton is provided', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(<HeaderDescription withBackButton={goBack} />);
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('calls withBackButton on press', () => {
    const goBack = jest.fn();
    const { getByTestId } = render(<HeaderDescription withBackButton={goBack} />);
    const backButton = getByTestId('chevron-left-icon').parent;
    if (backButton) fireEvent.press(backButton);
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('does not render back button when withBackButton is undefined', () => {
    const { queryByTestId } = render(<HeaderDescription title="Test" />);
    expect(queryByTestId('chevron-left-icon')).toBeNull();
  });

  it('renders menu with more icon', () => {
    const { getByTestId } = render(<HeaderDescription title="Test" />);
    expect(getByTestId('more-icon')).toBeTruthy();
  });

  it('renders delete menu item with trash icon', () => {
    const { getByTestId, getByText } = render(
      <HeaderDescription title="Test" onDeletePress={jest.fn()} />
    );
    expect(getByTestId('trash-icon')).toBeTruthy();
    expect(getByText('Excluir exame')).toBeTruthy();
  });

  it('calls onDeletePress when menu item is pressed', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <HeaderDescription title="Test" onDeletePress={onDelete} />
    );
    fireEvent.press(getByTestId('menu-item'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('renders all elements together', () => {
    const goBack = jest.fn();
    const onDelete = jest.fn();
    const { getByText, getByTestId } = render(
      <HeaderDescription
        withBackButton={goBack}
        title="Hemograma Completo"
        subTitle="01/01/2025"
        onDeletePress={onDelete}
      />
    );
    expect(getByText('Hemograma Completo')).toBeTruthy();
    expect(getByText('01/01/2025')).toBeTruthy();
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
    expect(getByTestId('more-icon')).toBeTruthy();
  });
});
