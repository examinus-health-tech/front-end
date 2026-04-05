import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScoreWarning } from './scoreWarning';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── navigation mock ─────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));
jest.mock('@assets/png/vector-48.png', () => 'Vector');

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID="action-button" onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

describe('ScoreWarning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the processing message', () => {
    const { getByText } = render(<ScoreWarning />);
    expect(getByText(/Yeaaaah! Seu Score X/)).toBeTruthy();
    expect(getByText(/está sendo processado!/)).toBeTruthy();
  });

  it('renders the explanation text', () => {
    const { getByText } = render(<ScoreWarning />);
    expect(getByText(/Fique tranquilo!/)).toBeTruthy();
    expect(getByText(/Você receberá uma notificação/)).toBeTruthy();
  });

  it('renders the action button', () => {
    const { getByText } = render(<ScoreWarning />);
    expect(getByText('Bora ficar saudável')).toBeTruthy();
  });

  it('navigates to examList when button is pressed', () => {
    const { getByTestId } = render(<ScoreWarning />);
    fireEvent.press(getByTestId('action-button'));
    expect(mockNavigate).toHaveBeenCalledWith('examList');
  });

  it('renders the illustration image', () => {
    const { getByLabelText } = render(<ScoreWarning />);
    expect(getByLabelText('Health illustration')).toBeTruthy();
  });
});
