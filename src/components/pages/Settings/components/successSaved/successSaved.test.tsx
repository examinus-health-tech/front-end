import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SuccessSaved } from './successSaved';

const mockNavigate = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Image: (props: any) => <RN.View testID="success-image" {...props} />,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@assets/png/vector-11.png', () => 'mock-vector-image');

jest.mock('@assets/icons', () => ({
  GearIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="gear-icon" {...props} />;
  },
}));

jest.mock('@components/atoms/Button/button', () => ({
  Button: ({ title, onPress, icon, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="success-button" onPress={onPress} {...rest}>
        {icon}
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

describe('SuccessSaved', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders success message text', () => {
    const { getByText } = render(<SuccessSaved />);
    expect(getByText(/Conta Atualizada/)).toBeTruthy();
    expect(getByText(/com Sucesso!/)).toBeTruthy();
  });

  it('renders the thank you text', () => {
    const { getByText } = render(<SuccessSaved />);
    expect(getByText('Obrigado por atualizar sua conta!')).toBeTruthy();
  });

  it('renders the image', () => {
    const { getByTestId } = render(<SuccessSaved />);
    expect(getByTestId('success-image')).toBeTruthy();
  });

  it('renders the button with correct title', () => {
    const { getByText } = render(<SuccessSaved />);
    expect(getByText('Voltar as Configurações')).toBeTruthy();
  });

  it('renders the gear icon in button', () => {
    const { getByTestId } = render(<SuccessSaved />);
    expect(getByTestId('gear-icon')).toBeTruthy();
  });

  it('navigates to myAccount when button is pressed', () => {
    const { getByTestId } = render(<SuccessSaved />);
    fireEvent.press(getByTestId('success-button'));
    expect(mockNavigate).toHaveBeenCalledWith('myAccount');
  });
});
