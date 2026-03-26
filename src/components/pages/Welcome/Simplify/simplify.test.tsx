import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Simplify } from './simplify';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  const mockComponent = (name: string) =>
    ({ children, ...props }: any) =>
      <RN.View {...props} testID={props.testID || name}>{children}</RN.View>;
  return {
    VStack: mockComponent('VStack'),
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Container: mockComponent('Container'),
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
jest.mock('@assets/png/vector-2.png', () => 'mocked-vector');

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

describe('Simplify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the heading text', () => {
    const { getByText } = render(<Simplify />);
    expect(getByText('Entenda seus exames com facilidade.')).toBeTruthy();
  });

  it('renders the description text', () => {
    const { getByText } = render(<Simplify />);
    expect(
      getByText(/A Examinus transforma resultados laboratoriais/)
    ).toBeTruthy();
  });

  it('renders the HeaderProgress with progressValue 33', () => {
    const { getByTestId } = render(<Simplify />);
    expect(getByTestId('header-progress')).toBeTruthy();
    expect(getByTestId('progress-value').props.children).toBe(33);
  });

  it('navigates to signIn when jumpTo is pressed (skip)', () => {
    const { getByTestId } = render(<Simplify />);
    fireEvent.press(getByTestId('jump-to-button'));
    expect(mockNavigate).toHaveBeenCalledWith('signIn');
  });

  it('navigates to health when the FAB button is pressed', () => {
    const { getByTestId } = render(<Simplify />);
    fireEvent.press(getByTestId('fab-button'));
    expect(mockNavigate).toHaveBeenCalledWith('health');
  });

  it('renders the background vector image', () => {
    const { getByTestId } = render(<Simplify />);
    expect(getByTestId('image-vector')).toBeTruthy();
  });
});
