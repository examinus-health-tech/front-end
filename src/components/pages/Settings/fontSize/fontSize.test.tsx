/* eslint-disable @typescript-eslint/no-require-imports -- factories de jest.mock não podem usar import */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { FontSize } from './fontSize';

const mockGoBack = jest.fn();
const mockSetFontScale = jest.fn();
let mockFontScale = 1;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('src/hooks/useFontScale', () => ({
  useFontScale: () => ({ fontScale: mockFontScale, setFontScale: mockSetFontScale, scaleFont: (n: number) => n }),
}));

jest.mock('native-base', () => {
  const RN = require('react-native');
  const React = require('react');
  const passthrough = (props: any) => React.createElement(RN.View, props);
  return {
    Box: passthrough,
    HStack: passthrough,
    VStack: passthrough,
    View: passthrough,
    ScrollView: passthrough,
    StatusBar: () => null,
    Text: (props: any) => React.createElement(RN.Text, props),
  };
});

jest.mock('../components/header/header', () => ({
  Header: ({ title, handleBackTo }: any) => {
    const RN = require('react-native');
    const React = require('react');
    return React.createElement(
      RN.TouchableOpacity,
      { testID: 'header-back', onPress: handleBackTo },
      React.createElement(RN.Text, null, title),
    );
  },
}));

describe('FontSize (Configurações > Tamanho da fonte)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFontScale = 1;
  });

  it('renderiza as três opções e a pré-visualização', () => {
    const { getByText, getByTestId } = render(<FontSize />);
    expect(getByText('Padrão')).toBeTruthy();
    expect(getByText('Grande')).toBeTruthy();
    expect(getByText('Muito grande')).toBeTruthy();
    expect(getByTestId('font-scale-preview')).toBeTruthy();
  });

  it('marca a opção correspondente à escala atual', () => {
    mockFontScale = 1.15;
    const { getByTestId } = render(<FontSize />);
    expect(getByTestId('btn-font-scale-large').props.accessibilityState).toEqual({ checked: true });
    expect(getByTestId('btn-font-scale-default').props.accessibilityState).toEqual({ checked: false });
  });

  it('selecionar uma opção salva a escala', () => {
    const { getByTestId } = render(<FontSize />);
    fireEvent.press(getByTestId('btn-font-scale-xlarge'));
    expect(mockSetFontScale).toHaveBeenCalledWith(1.3);
  });

  it('voltar chama goBack', () => {
    const { getByTestId } = render(<FontSize />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
