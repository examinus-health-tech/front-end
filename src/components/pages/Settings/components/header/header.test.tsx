import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from './header';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@assets/icons', () => ({
  ChevronLeftIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="chevron-left-icon" {...props} />;
  },
}));

describe('Header (Settings)', () => {
  const mockHandleBackTo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title text', () => {
    const { getByText } = render(
      <Header title="Test Title" handleBackTo={mockHandleBackTo} />
    );
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders the back button icon', () => {
    const { getByTestId } = render(
      <Header title="Test Title" handleBackTo={mockHandleBackTo} />
    );
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('calls handleBackTo when back button is pressed', () => {
    const { getByTestId } = render(
      <Header title="Test Title" handleBackTo={mockHandleBackTo} />
    );
    fireEvent.press(getByTestId('chevron-left-icon'));
    expect(mockHandleBackTo).toHaveBeenCalledTimes(1);
  });

  it('renders with bgMode true (white text and icon)', () => {
    const { getByText, getByTestId } = render(
      <Header title="BG Title" bgMode handleBackTo={mockHandleBackTo} />
    );
    expect(getByText('BG Title')).toBeTruthy();
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('renders with bgMode false (default colors)', () => {
    const { getByText } = render(
      <Header title="Default Title" bgMode={false} handleBackTo={mockHandleBackTo} />
    );
    expect(getByText('Default Title')).toBeTruthy();
  });

  it('renders with different title values', () => {
    const titles = ['Informações Pessoais', 'Segurança', 'Notificações', 'Preferências'];
    titles.forEach((title) => {
      const { getByText } = render(
        <Header title={title} handleBackTo={mockHandleBackTo} />
      );
      expect(getByText(title)).toBeTruthy();
    });
  });
});
