import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ForceUpdateScreen } from './ForceUpdateScreen';
import { Platform } from 'react-native';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const React = require('react');
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      React.createElement(RN.View, { ...props, testID: props.testID || name }, children);
  return {
    VStack: mockComponent('VStack'),
    Text: ({ children, ...props }: any) => React.createElement(RN.Text, props, children),
    Box: mockComponent('Box'),
    Center: mockComponent('Center'),
    Pressable: ({ children, onPress, _pressed, bg, w, py, px, borderRadius, alignItems, justifyContent, mt, ...props }: any) =>
      React.createElement(RN.Pressable, { testID: 'update-button', onPress }, children),
  };
});

// ── Services mock ──
jest.mock('@services/versionService');

// ── Expo vector icons mock ──
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    MaterialCommunityIcons: ({ name, ...props }: any) =>
      React.createElement(RN.View, { testID: `icon-${name}`, ...props }),
  };
});

describe('ForceUpdateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title "Atualização Necessária"', () => {
    const { getByText } = render(<ForceUpdateScreen />);
    expect(getByText('Atualização Necessária')).toBeTruthy();
  });

  it('renders the default description when no message prop is provided', () => {
    const { getByText } = render(<ForceUpdateScreen />);
    expect(
      getByText(/Uma nova versão do Examinus está disponível/)
    ).toBeTruthy();
  });

  it('renders a custom message when the message prop is provided', () => {
    const customMessage = 'Versão 2.0 disponível agora!';
    const { getByText } = render(<ForceUpdateScreen message={customMessage} />);
    expect(getByText(customMessage)).toBeTruthy();
  });

  it('renders the cellphone-arrow-down icon', () => {
    const { getByTestId } = render(<ForceUpdateScreen />);
    expect(getByTestId('icon-cellphone-arrow-down')).toBeTruthy();
  });

  it('renders the store-specific button text for iOS', () => {
    Platform.OS = 'ios';
    const { getByText } = render(<ForceUpdateScreen />);
    expect(getByText('Atualizar na App Store')).toBeTruthy();
  });

  it('renders the store-specific button text for Android', () => {
    Platform.OS = 'android';
    const { getByText } = render(<ForceUpdateScreen />);
    expect(getByText('Atualizar na Play Store')).toBeTruthy();
  });

  it('calls openAppStore when the update button is pressed', () => {
    const { openAppStore } = require('@services/versionService');
    const { getByTestId } = render(<ForceUpdateScreen />);
    fireEvent.press(getByTestId('update-button'));
    expect(openAppStore).toHaveBeenCalledTimes(1);
  });

  it('renders the note text about reopening the app', () => {
    const { getByText } = render(<ForceUpdateScreen />);
    expect(
      getByText('Após atualizar, abra o aplicativo novamente para continuar.')
    ).toBeTruthy();
  });
});
