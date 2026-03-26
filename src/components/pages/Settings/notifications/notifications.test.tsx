import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ConfigNotifications } from './notifications';

const mockGoBack = jest.fn();
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
const mockAsyncStorageGetItem = jest.fn();
const mockAsyncStorageSetItem = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    IScrollViewProps: {},
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    StatusBar: (props: any) => <RN.View {...props} />,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useFocusEffect: (cb: any) => {
    const React = require('react');
    React.useEffect(() => {
      const cleanup = cb();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }, []);
  },
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (...args: any[]) => mockAsyncStorageGetItem(...args),
  setItem: (...args: any[]) => mockAsyncStorageSetItem(...args),
}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    Notifications: {
      getPermissionAsync: jest.fn().mockResolvedValue(true),
    },
    User: {
      addTag: jest.fn(),
    },
  },
}));

jest.mock('../components/header/header', () => ({
  Header: ({ title, handleBackTo }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="header-back" onPress={handleBackTo}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('../components/card/card', () => ({
  Card: ({ title, subTitle, switchValue, onSwitchChange, action, goTo, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID={`card-${title}`}>
        <RN.Text>{title}</RN.Text>
        {subTitle && <RN.Text>{subTitle}</RN.Text>}
        {action === 'switch' && onSwitchChange && (
          <RN.TouchableOpacity
            testID={`switch-${title}`}
            onPress={() => onSwitchChange(!switchValue)}
          >
            <RN.Text>{switchValue ? 'ON' : 'OFF'}</RN.Text>
          </RN.TouchableOpacity>
        )}
        {goTo && (
          <RN.TouchableOpacity testID={`goto-${title}`} onPress={goTo}>
            <RN.Text>Go</RN.Text>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  },
}));

jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

describe('ConfigNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorageGetItem.mockResolvedValue(null);
    mockAsyncStorageSetItem.mockResolvedValue(undefined);
  });

  it('renders the header with "Notificações" title', async () => {
    const { getByText } = render(<ConfigNotifications />);
    await waitFor(() => {
      expect(getByText('Notificações')).toBeTruthy();
    });
  });

  it('renders push notifications card', async () => {
    const { getByText } = render(<ConfigNotifications />);
    await waitFor(() => {
      expect(getByText('Notificações Push')).toBeTruthy();
    });
  });

  it('renders Configurações Gerais section', async () => {
    const { getByText } = render(<ConfigNotifications />);
    await waitFor(() => {
      expect(getByText('Configurações Gerais')).toBeTruthy();
    });
  });

  it('renders all notification switches', async () => {
    const { getByText } = render(<ConfigNotifications />);
    await waitFor(() => {
      expect(getByText('Lembretes Diários')).toBeTruthy();
      expect(getByText('Health Insights')).toBeTruthy();
      expect(getByText('Informações sobre Exames')).toBeTruthy();
      expect(getByText('Notificações do ChatBot')).toBeTruthy();
    });
  });

  it('loads saved preferences from AsyncStorage', async () => {
    mockAsyncStorageGetItem.mockResolvedValueOnce(
      JSON.stringify({
        dailyReminders: false,
        healthInsights: true,
        examInfo: false,
        chatbotNotifications: true,
      })
    );

    render(<ConfigNotifications />);

    await waitFor(() => {
      expect(mockAsyncStorageGetItem).toHaveBeenCalledWith('@examinus:notification_prefs');
    });
  });

  it('toggles daily reminders and saves preference', async () => {
    const { getByTestId } = render(<ConfigNotifications />);

    await waitFor(() => {
      expect(getByTestId('switch-Lembretes Diários')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('switch-Lembretes Diários'));
    });

    await waitFor(() => {
      expect(mockAsyncStorageSetItem).toHaveBeenCalledWith(
        '@examinus:notification_prefs',
        expect.any(String)
      );
    });
  });

  it('toggles health insights and saves preference', async () => {
    const { getByTestId } = render(<ConfigNotifications />);

    await waitFor(() => {
      expect(getByTestId('switch-Health Insights')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('switch-Health Insights'));
    });

    await waitFor(() => {
      expect(mockAsyncStorageSetItem).toHaveBeenCalled();
    });
  });

  it('toggles exam info and saves preference', async () => {
    const { getByTestId } = render(<ConfigNotifications />);

    await waitFor(() => {
      expect(getByTestId('switch-Informações sobre Exames')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('switch-Informações sobre Exames'));
    });

    await waitFor(() => {
      expect(mockAsyncStorageSetItem).toHaveBeenCalled();
    });
  });

  it('toggles chatbot notifications and saves preference', async () => {
    const { getByTestId } = render(<ConfigNotifications />);

    await waitFor(() => {
      expect(getByTestId('switch-Notificações do ChatBot')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('switch-Notificações do ChatBot'));
    });

    await waitFor(() => {
      expect(mockAsyncStorageSetItem).toHaveBeenCalled();
    });
  });

  it('navigates back when header back is pressed', () => {
    const { getByTestId } = render(<ConfigNotifications />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows success toast when preference is saved', async () => {
    const { getByTestId } = render(<ConfigNotifications />);

    await waitFor(() => {
      expect(getByTestId('switch-Lembretes Diários')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('switch-Lembretes Diários'));
    });

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Salvo' })
      );
    });
  });
});
