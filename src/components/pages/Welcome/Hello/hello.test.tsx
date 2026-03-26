import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Hello } from './hello';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Image: ({ alt, ...props }: any) => <RN.View testID="image-vector" {...props} />,
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Center: mockComponent('Center'),
    Flex: mockComponent('Flex'),
    HStack: mockComponent('HStack'),
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
jest.mock('@assets/png/vector-34.png', () => 'mocked-vector');

// ── SVG mocks ──
jest.mock('@assets/svg/robot.svg', () => 'RobotSvg');
jest.mock('@assets/svg/logo.svg', () => 'LogoSvg');

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

describe('Hello', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the greeting text "Olá, eu sou a"', () => {
    const { getByText } = render(<Hello />);
    expect(getByText(/Olá, eu sou a/)).toBeTruthy();
  });

  it('renders the brand name "examinus."', () => {
    const { getByText } = render(<Hello />);
    expect(getByText('examinus.')).toBeTruthy();
  });

  it('renders the description text', () => {
    const { getByText } = render(<Hello />);
    expect(
      getByText(/Seu assistente pessoal para organizar/)
    ).toBeTruthy();
  });

  it('renders the "Iniciar" button', () => {
    const { getByText } = render(<Hello />);
    expect(getByText('Iniciar')).toBeTruthy();
  });

  it('navigates to simplify when "Iniciar" is pressed', () => {
    const { getByText } = render(<Hello />);
    fireEvent.press(getByText('Iniciar'));
    expect(mockNavigate).toHaveBeenCalledWith('simplify');
  });

  it('renders the "Já tem uma conta?" text', () => {
    const { getByText } = render(<Hello />);
    expect(getByText('Já tem uma conta?')).toBeTruthy();
  });

  it('renders the "Conecte-se." link', () => {
    const { getByText } = render(<Hello />);
    expect(getByText(/Conecte-se\./)).toBeTruthy();
  });

  it('navigates to signIn when "Conecte-se." is pressed', () => {
    const { getByText } = render(<Hello />);
    fireEvent.press(getByText(/Conecte-se\./));
    expect(mockNavigate).toHaveBeenCalledWith('signIn');
  });

  it('renders the background vector image', () => {
    const { getByTestId } = render(<Hello />);
    expect(getByTestId('image-vector')).toBeTruthy();
  });
});
