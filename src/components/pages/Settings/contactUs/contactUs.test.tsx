import React from 'react';
import { render } from '@testing-library/react-native';
import { ContactUs } from './contactUs';

const mockNavigate = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Image: (props: any) => <RN.View testID="logo-image" {...props} />,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@assets/icons', () => ({
  TelephoneIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="telephone-icon" {...props} />;
  },
}));

jest.mock('@assets/png/logo.png', () => 'mock-logo');

jest.mock('../components/card/card', () => ({
  Card: ({ title, ...rest }: any) => {
    const RN = require('react-native');
    return <RN.View testID="card-component"><RN.Text>{title}</RN.Text></RN.View>;
  },
}));

jest.mock('../components/header/header', () => ({
  Header: ({ title, handleBackTo, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="header-back" onPress={handleBackTo}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

describe('ContactUs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with correct title', () => {
    const { getByText } = render(<ContactUs />);
    expect(getByText('Fale Conosco')).toBeTruthy();
  });

  it('renders the logo image', () => {
    const { getByTestId } = render(<ContactUs />);
    expect(getByTestId('logo-image')).toBeTruthy();
  });

  it('renders the version text', () => {
    const { getByText } = render(<ContactUs />);
    expect(getByText('Examinus v1.3.0')).toBeTruthy();
  });

  it('renders the contact email card', () => {
    const { getByText } = render(<ContactUs />);
    expect(getByText('contato@examinus.com.br')).toBeTruthy();
  });

  it('navigates to myAccount when header back is pressed', () => {
    const { getByTestId } = render(<ContactUs />);
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('myAccount');
  });
});
