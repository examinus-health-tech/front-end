import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Health } from './health';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    Container: mockComponent('Container'),
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    VStack: mockComponent('VStack'),
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
jest.mock('@assets/png/vector-3.png', () => 'mocked-vector');

// ── Molecules / Atoms ──
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderProgress: ({ progressValue, jumpTo }: any) => (
      <RN.View testID="header-progress">
        <RN.Text testID="progress-value">{progressValue}</RN.Text>
        <RN.TouchableOpacity testID="jump-to-button" onPress={jumpTo}>
          <RN.Text>Skip</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    ),
  };
});

jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...props }: any) => (
      <RN.TouchableOpacity testID="fab-button" onPress={onPress}>
        <RN.Text>{title || 'Next'}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

describe('Health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the heading text', () => {
    const { getByText } = render(<Health />);
    expect(getByText('Acompanhe sua saúde em um só lugar.')).toBeTruthy();
  });

  it('renders the description text', () => {
    const { getByText } = render(<Health />);
    expect(
      getByText(/Veja seus resultados, histórico e evolução/)
    ).toBeTruthy();
  });

  it('renders the HeaderProgress with progressValue 66', () => {
    const { getByTestId } = render(<Health />);
    expect(getByTestId('header-progress')).toBeTruthy();
    expect(getByTestId('progress-value').props.children).toBe(66);
  });

  it('navigates to signIn when jumpTo is pressed (skip)', () => {
    const { getByTestId } = render(<Health />);
    fireEvent.press(getByTestId('jump-to-button'));
    expect(mockNavigate).toHaveBeenCalledWith('signIn');
  });

  it('navigates to stayCalm when the FAB button is pressed', () => {
    const { getByTestId } = render(<Health />);
    fireEvent.press(getByTestId('fab-button'));
    expect(mockNavigate).toHaveBeenCalledWith('stayCalm');
  });

  it('renders the background vector image', () => {
    const { getByTestId } = render(<Health />);
    expect(getByTestId('image-vector')).toBeTruthy();
  });
});
