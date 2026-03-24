import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Score } from './score';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    useTheme: () => ({
      colors: { purple: { 500: '#8B5CF6' } },
    }),
  };
});

// ── navigation mock ─────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  DefaultTheme: { colors: { background: '#fff' } },
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));
jest.mock('@assets/png/vector-10.png', () => 'Vector');
jest.mock('@assets/png/logo.png', () => 'Logo');

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID="score-button" onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

describe('Score', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the score value', () => {
    const { getByText } = render(<Score />);
    expect(getByText('88')).toBeTruthy();
  });

  it('renders the celebration text', () => {
    const { getByText } = render(<Score />);
    expect(getByText(/Yeaaaah!/)).toBeTruthy();
    expect(getByText(/Seu Score X é 88/)).toBeTruthy();
  });

  it('renders the redirect message', () => {
    const { getByText } = render(<Score />);
    expect(getByText(/Estamos redirecionando você/)).toBeTruthy();
  });

  it('renders the action button', () => {
    const { getByText } = render(<Score />);
    expect(getByText('Bora ficar saudável')).toBeTruthy();
  });

  it('navigates to homepage when button is pressed', () => {
    const { getByTestId } = render(<Score />);
    fireEvent.press(getByTestId('score-button'));
    expect(mockNavigate).toHaveBeenCalledWith('homepage');
  });

  it('renders the vector image', () => {
    const { getAllByLabelText } = render(<Score />);
    expect(getAllByLabelText('X examinus Logo').length).toBeGreaterThan(0);
  });

  it('sets the background color on mount via DefaultTheme', () => {
    render(<Score />);
    // Should not crash - the useEffect sets the theme color
  });
});
