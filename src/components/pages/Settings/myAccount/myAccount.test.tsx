import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { MyAccount } from './myAccount';

const mockNavigate = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue(undefined);
const mockDeleteAccount = jest.fn().mockResolvedValue(undefined);
const mockUpdateUserPhoto = jest.fn();
const mockClearHomeData = jest.fn();
const mockGetUserPersonalData = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    IScrollViewProps: {},
    Image: (props: any) => <RN.View testID="profile-image" {...props} />,
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    StatusBar: (props: any) => <RN.View {...props} />,
    Actionsheet: Object.assign(
      ({ children, isOpen, ...rest }: any) =>
        isOpen ? <RN.View testID="actionsheet" {...rest}>{children}</RN.View> : null,
      {
        Content: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
        Item: ({ children, onPress, ...rest }: any) => (
          <RN.TouchableOpacity onPress={onPress} {...rest}>{children}</RN.TouchableOpacity>
        ),
      }
    ),
    useDisclose: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    }),
    Flex: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Input: (props: any) => <RN.TextInput {...props} />,
    Spinner: (props: any) => <RN.View testID="spinner" {...props} />,
  };
});

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    },
    FadeInDown: {
      duration: () => ({ delay: () => undefined }),
    },
  };
});

// Use a variable Animated mock to allow wrapping children
const AnimatedMock = {
  View: ({ children, onLayout, ...rest }: any) => {
    const RN = require('react-native');
    return <RN.View onLayout={onLayout} {...rest}>{children}</RN.View>;
  },
};
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: AnimatedMock,
  FadeInDown: { duration: () => ({ delay: () => undefined }) },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: (cb: any) => {
    const React = require('react');
    React.useEffect(() => {
      const cleanup = cb();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }, []);
  },
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  const makeIcon = (name: string) => (props: any) => <RN.View testID={`icon-${name}`} {...props} />;
  return {
    ArrowCurvedIcon: makeIcon('arrow-curved'),
    BellSecondaryIcon: makeIcon('bell-secondary'),
    ChatIcon: makeIcon('chat'),
    EditIcon: makeIcon('edit'),
    EyeIcon: makeIcon('eye'),
    FlagIcon: makeIcon('flag'),
    GearIcon: makeIcon('gear'),
    LockIcon: makeIcon('lock'),
    MoreIcon: makeIcon('more'),
    QuestionIcon: makeIcon('question'),
    StarIcon: makeIcon('star'),
    TelephoneIcon: makeIcon('telephone'),
    TrashIcon: makeIcon('trash'),
    UserIcon: makeIcon('user'),
    WarningIcon: makeIcon('warning'),
  };
});

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
  Card: ({ title, goTo, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID={`card-${title}`} onPress={goTo}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('@components/atoms', () => ({
  Button: ({ title, onPress, isLoading, isDisabled, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID={`button-${title}`} onPress={onPress} disabled={isDisabled}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      userId: 'user-123',
      fullName: 'John Doe',
      email: 'john@example.com',
      photoUrl: null,
      profilePhotoBase64: null,
    },
    signOut: mockSignOut,
    deleteAccount: mockDeleteAccount,
    updateUserPhoto: mockUpdateUserPhoto,
  }),
}));

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    clearHomeData: mockClearHomeData,
  }),
}));

jest.mock('@services/userService', () => ({
  getUserPersonalData: (...args: any[]) => mockGetUserPersonalData(...args),
}));

describe('MyAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserPersonalData.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the header with "Minha Conta" title', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Minha Conta')).toBeTruthy();
  });

  it('renders user full name', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders user email', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('renders Configurações Gerais section', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Configurações Gerais')).toBeTruthy();
  });

  it('renders all settings cards', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Informação Pessoal')).toBeTruthy();
    expect(getByText('Notificações')).toBeTruthy();
    expect(getByText('Preferências')).toBeTruthy();
    expect(getByText('Segurança')).toBeTruthy();
  });

  it('renders Promoções section with Meu Voucher card', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Promoções')).toBeTruthy();
    expect(getByText('Meu Voucher')).toBeTruthy();
  });

  it('renders Acessibilidade section', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Acessibilidade')).toBeTruthy();
    expect(getByText('Idioma')).toBeTruthy();
    expect(getByText('Dark Mode')).toBeTruthy();
  });

  it('renders Ajuda & Suporte section', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Ajuda & Suporte')).toBeTruthy();
    expect(getByText('Sobre')).toBeTruthy();
    expect(getByText('Central de Ajuda')).toBeTruthy();
    expect(getByText('Fale com o Team X')).toBeTruthy();
  });

  it('renders Desconectar section', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Desconectar')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
  });

  it('renders Deletar Conta button', () => {
    const { getByText } = render(<MyAccount />);
    expect(getByText('Deletar Conta')).toBeTruthy();
  });

  it('navigates to info when profile card is pressed', () => {
    const { getByText } = render(<MyAccount />);
    fireEvent.press(getByText('John Doe'));
    expect(mockNavigate).toHaveBeenCalledWith('info');
  });

  it('navigates to info when Informação Pessoal card is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('card-Informação Pessoal'));
    expect(mockNavigate).toHaveBeenCalledWith('info');
  });

  it('navigates to configNotifications when Notificações card is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('card-Notificações'));
    expect(mockNavigate).toHaveBeenCalledWith('configNotifications');
  });

  it('navigates to preferences when Preferências card is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('card-Preferências'));
    expect(mockNavigate).toHaveBeenCalledWith('preferences');
  });

  it('navigates to security when Segurança card is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('card-Segurança'));
    expect(mockNavigate).toHaveBeenCalledWith('security');
  });

  it('navigates to bonus when Meu Voucher card is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('card-Meu Voucher'));
    expect(mockNavigate).toHaveBeenCalledWith('bonus');
  });

  it('navigates to aboutUs when Sobre card is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('card-Sobre'));
    expect(mockNavigate).toHaveBeenCalledWith('aboutUs');
  });

  it('navigates to contactUs when Fale com o Team X card is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('card-Fale com o Team X'));
    expect(mockNavigate).toHaveBeenCalledWith('contactUs');
  });

  it('navigates to homepage when header back is pressed', () => {
    const { getByTestId } = render(<MyAccount />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('homepage');
  });
});
