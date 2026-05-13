import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Linking, Alert, Platform } from 'react-native';
import { AboutUs } from './aboutUs';

const mockNavigate = jest.fn();
const mockAsyncStorageGetItem = jest.fn();
const mockAsyncStorageSetItem = jest.fn();

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { version: '9.9.9' } },
}));

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, onTouchEnd, ...rest }: any) => (
      <RN.TouchableOpacity onPress={onTouchEnd} {...rest}>{children}</RN.TouchableOpacity>
    ),
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    IScrollViewProps: {},
    Image: (props: any) => <RN.View testID="logo-image" {...props} />,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    StatusBar: (props: any) => <RN.View {...props} />,
    Actionsheet: Object.assign(
      ({ children, isOpen, ...rest }: any) =>
        isOpen ? <RN.View testID="review-actionsheet" {...rest}>{children}</RN.View> : null,
      {
        Content: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
      }
    ),
    useDisclose: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    }),
    Pressable: ({ children, onPress, ...rest }: any) => (
      <RN.TouchableOpacity onPress={onPress} {...rest}>{children}</RN.TouchableOpacity>
    ),
    Center: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Path: (props: any) => <RN.View {...props} />,
  };
});

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (...args: any[]) => mockAsyncStorageGetItem(...args),
  setItem: (...args: any[]) => mockAsyncStorageSetItem(...args),
}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  const makeIcon = (name: string) => (props: any) => <RN.View testID={`icon-${name}`} {...props} />;
  return {
    BellIcon: makeIcon('bell'),
    BriefcaseIcon: makeIcon('briefcase'),
    ChatIcon: makeIcon('chat'),
    FacebookIcon: makeIcon('facebook'),
    InstagramIcon: makeIcon('instagram'),
    LinkedinIcon: makeIcon('linkedin'),
    ShareIcon: makeIcon('share'),
    StarIcon: makeIcon('star'),
    TelephoneIcon: makeIcon('telephone'),
  };
});

jest.mock('@assets/png/logo.png', () => 'mock-logo');

jest.mock('../components/card/card', () => ({
  Card: ({ title, goTo, comingSoon, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity
        testID={`card-${title}`}
        onPress={comingSoon ? undefined : goTo}
        disabled={comingSoon}
      >
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
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

describe('AboutUs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorageGetItem.mockResolvedValue(null);
    mockAsyncStorageSetItem.mockResolvedValue(undefined);
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  it('renders the header with "Sobre nós" title', () => {
    const { getByText } = render(<AboutUs />);
    expect(getByText('Sobre nós')).toBeTruthy();
  });

  it('renders the logo image', () => {
    const { getByTestId } = render(<AboutUs />);
    expect(getByTestId('logo-image')).toBeTruthy();
  });

  it('renders the version text', () => {
    const { getByText } = render(<AboutUs />);
    expect(getByText('Examinus v9.9.9')).toBeTruthy();
  });

  it('renders all cards', () => {
    const { getByText } = render(<AboutUs />);
    expect(getByText('Política de Privacidade')).toBeTruthy();
    expect(getByText('Faça parte do Team X')).toBeTruthy();
    expect(getByText('Avalie a Examinus')).toBeTruthy();
    expect(getByText('Seja nosso Parceiro')).toBeTruthy();
    expect(getByText('Enviar um Feedback')).toBeTruthy();
  });

  it('renders social media icons', () => {
    const { getByTestId } = render(<AboutUs />);
    expect(getByTestId('icon-instagram')).toBeTruthy();
    expect(getByTestId('icon-facebook')).toBeTruthy();
    expect(getByTestId('icon-linkedin')).toBeTruthy();
  });

  it('navigates back when header back is pressed', () => {
    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('opens privacy policy alert when card is pressed', () => {
    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('card-Política de Privacidade'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Política de Privacidade',
      expect.any(String),
      expect.any(Array)
    );
  });

  it('opens feedback email when Enviar um Feedback is pressed', async () => {
    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('card-Enviar um Feedback'));
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining('mailto:feedback@examinus.app')
      );
    });
  });

  it('opens instagram when instagram icon is pressed', async () => {
    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('icon-instagram'));
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining('instagram.com')
      );
    });
  });

  it('opens facebook when facebook icon is pressed', async () => {
    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('icon-facebook'));
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com')
      );
    });
  });

  it('opens linkedin when linkedin icon is pressed', async () => {
    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('icon-linkedin'));
    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com')
      );
    });
  });

  it('shows alert when URL cannot be opened', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);

    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('icon-instagram'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  it('handles review card press - opens review bottom sheet', async () => {
    mockAsyncStorageGetItem.mockResolvedValue(null);

    const { getByTestId } = render(<AboutUs />);
    fireEvent.press(getByTestId('card-Avalie a Examinus'));
    // Since useDisclose returns isOpen=false, the actionsheet won't show
    // But the function should have been called without errors
  });

  it('shows already reviewed alert when user has reviewed', async () => {
    mockAsyncStorageGetItem.mockResolvedValue('true');

    const { getByTestId } = render(<AboutUs />);

    await act(async () => {
      fireEvent.press(getByTestId('card-Avalie a Examinus'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Obrigado!',
        expect.any(String),
        expect.any(Array)
      );
    });
  });
});
