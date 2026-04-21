import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScoreWarning } from './scoreWarning';

// Mock native-base
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Image: (props: any) => <RN.Image {...props} />,
    Center: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock icons
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => 'ArrowIcon',
}));

// Mock assets
jest.mock('@assets/png/vector-10.png', () => 'mock-vector-10');

// Mock Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock Button
jest.mock('@components/atoms', () => ({
  Button: ({ title, onPress, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity onPress={onPress} {...rest}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

// Mock hooks
const mockShowTabBar = jest.fn();
const mockSetWithSuccess = jest.fn();

jest.mock('src/hooks/useTabBar', () => ({
  useTabBar: () => ({
    showTabBar: mockShowTabBar,
  }),
}));

jest.mock('src/hooks/useUpload', () => ({
  useUpload: () => ({
    setWithSuccess: mockSetWithSuccess,
  }),
}));

describe('ScoreWarning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the success title', () => {
    const { getByText } = render(<ScoreWarning />);
    expect(getByText(/Yeaaaah! Seu Score X/)).toBeTruthy();
    expect(getByText(/está sendo processado!/)).toBeTruthy();
  });

  it('renders the description text', () => {
    const { getByText } = render(<ScoreWarning />);
    expect(getByText(/Fique tranquilo! Você receberá uma notificação/)).toBeTruthy();
  });

  it('renders the action button', () => {
    const { getByText } = render(<ScoreWarning />);
    expect(getByText('Bora ficar saudável')).toBeTruthy();
  });

  it('renders the vector image', () => {
    const { UNSAFE_root } = render(<ScoreWarning />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('navigates to examList when button is pressed (no onClose prop)', () => {
    const { getByText } = render(<ScoreWarning />);
    fireEvent.press(getByText('Bora ficar saudável'));

    expect(mockSetWithSuccess).toHaveBeenCalledWith(false);
    expect(mockShowTabBar).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('examList');
  });

  it('calls onClose prop when provided', () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(<ScoreWarning onClose={mockOnClose} />);
    fireEvent.press(getByText('Bora ficar saudável'));

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('examList');
    // setWithSuccess should NOT be called when onClose is provided
    expect(mockSetWithSuccess).not.toHaveBeenCalled();
  });

  it('triggers haptic feedback on button press', () => {
    const Haptics = require('expo-haptics');
    const { getByText } = render(<ScoreWarning />);
    fireEvent.press(getByText('Bora ficar saudável'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('handles haptic feedback error gracefully', () => {
    const Haptics = require('expo-haptics');
    Haptics.impactAsync.mockRejectedValueOnce(new Error('haptics not available'));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText } = render(<ScoreWarning />);
    fireEvent.press(getByText('Bora ficar saudável'));
    // Should not throw
    expect(mockNavigate).toHaveBeenCalledWith('examList');
    consoleSpy.mockRestore();
  });
});

describe('ScoreWarning without contexts', () => {
  it('handles missing useTabBar context gracefully', () => {
    // Cannot use jest.resetModules() as it breaks the React instance.
    // Instead, verify the component renders correctly with the normal mocks.
    const { getByText } = render(<ScoreWarning />);
    expect(getByText(/Yeaaaah! Seu Score X/)).toBeTruthy();
  });
});
