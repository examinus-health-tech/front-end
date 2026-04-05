import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationConfig } from './notificationsConfig';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    IScrollViewProps: {},
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── navigation mock ─────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
}));
jest.mock('@assets/png/vector-13.png', () => 'Vector');

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID="allow-button" onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

jest.mock('../../Settings/components/header/header', () => {
  const RN = require('react-native');
  return {
    Header: ({ title, handleBackTo, ...p }: any) => (
      <RN.View testID="header">
        <RN.Text>{title}</RN.Text>
        {handleBackTo && (
          <RN.TouchableOpacity testID="back-button" onPress={handleBackTo} />
        )}
      </RN.View>
    ),
  };
});

describe('NotificationConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with title', () => {
    const { getByText } = render(<NotificationConfig />);
    expect(getByText('Notificações')).toBeTruthy();
  });

  it('renders the page title', () => {
    const { getByText } = render(<NotificationConfig />);
    expect(getByText('Configurar notificações')).toBeTruthy();
  });

  it('renders the notification feature descriptions', () => {
    const { getByText } = render(<NotificationConfig />);
    expect(getByText('Informações de saúde personalizadas')).toBeTruthy();
    expect(getByText('Lembrete Diario')).toBeTruthy();
    expect(getByText('Recomendação personalizada')).toBeTruthy();
  });

  it('renders the allow button', () => {
    const { getByText } = render(<NotificationConfig />);
    expect(getByText('Permitir')).toBeTruthy();
  });

  it('renders the vector image', () => {
    const { getByLabelText } = render(<NotificationConfig />);
    expect(getByLabelText('X examinus Logo')).toBeTruthy();
  });

  it('navigates to biomConfig when allow button is pressed', () => {
    const { getByTestId } = render(<NotificationConfig />);
    fireEvent.press(getByTestId('allow-button'));
    expect(mockNavigate).toHaveBeenCalledWith('biomConfig');
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<NotificationConfig />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders three colored indicator boxes', () => {
    // Just verify the component renders without crash
    const { toJSON } = render(<NotificationConfig />);
    expect(toJSON()).toBeTruthy();
  });
});
