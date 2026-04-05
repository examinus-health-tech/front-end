import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SuccessLink } from './successLink';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Center: mockComponent('Center'),
    Image: ({ alt, ...props }: any) => <RN.View testID="image-vector" {...props} />,
  };
});

// ── Navigation mock ──
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));

// ── Icons mock ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  const icon = (name: string) => (props: any) => <RN.View testID={`icon-${name}`} {...props} />;
  return {
    ArrowIcon: icon('Arrow'),
  };
});

// ── PNG mock ──
jest.mock('@assets/png/vector-43.png', () => 'mocked-vector');

// ── Atoms mock ──
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...props }: any) => (
      <RN.TouchableOpacity testID={`button-${title}`} onPress={onPress}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

describe('SuccessLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the success message heading', () => {
    const { getByText } = render(<SuccessLink />);
    expect(
      getByText('Enviamos um link para o seu e-mail cadastrado.')
    ).toBeTruthy();
  });

  it('renders the subtitle text', () => {
    const { getByText } = render(<SuccessLink />);
    expect(getByText('Cheque sua caixa de entrada ;)')).toBeTruthy();
  });

  it('renders the vector image', () => {
    const { getByTestId } = render(<SuccessLink />);
    expect(getByTestId('image-vector')).toBeTruthy();
  });

  it('renders the "Tenho o código" button', () => {
    const { getByText } = render(<SuccessLink />);
    expect(getByText('Tenho o código')).toBeTruthy();
  });

  it('navigates to code screen when button is pressed', () => {
    const { getByText } = render(<SuccessLink />);
    fireEvent.press(getByText('Tenho o código'));
    expect(mockNavigate).toHaveBeenCalledWith('code');
  });
});
