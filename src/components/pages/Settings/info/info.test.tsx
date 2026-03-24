import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Info } from './info';

const mockNavigate = jest.fn();
const mockShowError = jest.fn();
const mockShowSuccess = jest.fn();
const mockUpdateUserPhoto = jest.fn();
const mockGetUserPersonalData = jest.fn();
const mockSaveUserPersonalData = jest.fn();
const mockUploadProfilePhoto = jest.fn();
const mockDeleteProfilePhoto = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Image: (props: any) => <RN.View testID="profile-image" {...props} />,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    StatusBar: (props: any) => <RN.View testID="status-bar" {...props} />,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Flex: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Icon: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    WarningOutlineIcon: (props: any) => <RN.View {...props} />,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
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
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({}));

const mockSetValue = jest.fn();
const mockHandleSubmit = (fn: any) => fn;
const mockControl = {};
const mockFormState = { errors: {} };
jest.mock('react-hook-form', () => ({
  Controller: ({ render, name }: any) => {
    const RN = require('react-native');
    const result = render({
      field: { onChange: jest.fn(), value: name === 'country' ? 'Brasil' : '' },
      fieldState: {},
    });
    return result;
  },
  useForm: () => ({
    control: mockControl,
    handleSubmit: mockHandleSubmit,
    formState: mockFormState,
    setValue: mockSetValue,
  }),
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: () => jest.fn(),
}));

jest.mock('yup', () => ({
  object: () => ({
    required: jest.fn().mockReturnThis(),
    min: jest.fn().mockReturnThis(),
    email: jest.fn().mockReturnThis(),
    matches: jest.fn().mockReturnThis(),
    string: jest.fn().mockReturnValue({
      required: jest.fn().mockReturnValue({
        min: jest.fn().mockReturnThis(),
        email: jest.fn().mockReturnThis(),
        matches: jest.fn().mockReturnThis(),
      }),
    }),
  }),
  string: jest.fn().mockReturnValue({
    required: jest.fn().mockReturnValue({
      min: jest.fn().mockReturnThis(),
      email: jest.fn().mockReturnThis(),
      matches: jest.fn().mockReturnThis(),
    }),
  }),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
  MediaTypeOptions: { Images: 'Images' },
  CameraType: { front: 'front' },
}));

jest.mock('@assets/icons', () => ({
  CheckIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="check-icon" {...props} />;
  },
  EditIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="edit-icon" {...props} />;
  },
  MailIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View {...props} />;
  },
  UserIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="user-icon" {...props} />;
  },
}));

jest.mock('@components/atoms/Button/button', () => ({
  Button: ({ title, onPress, isLoading, disabled, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="save-button" onPress={onPress} disabled={disabled}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('@components/molecules/Input/input', () => ({
  Input: ({ label, value, onChangeText, errorMessage, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={`input-${label}`}
          value={value}
          onChangeText={onChangeText}
        />
        {errorMessage && <RN.Text testID={`error-${label}`}>{errorMessage}</RN.Text>}
      </RN.View>
    );
  },
}));

jest.mock('@components/pages/Settings/components/successSaved/successSaved', () => ({
  SuccessSaved: () => {
    const RN = require('react-native');
    return <RN.View testID="success-saved" />;
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

const mockUser = {
  userId: 'user-123',
  fullName: 'Test User',
  email: 'test@example.com',
  photoUrl: null,
  profilePhotoBase64: null,
};
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    updateUserPhoto: mockUpdateUserPhoto,
  }),
}));

jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showError: mockShowError,
    showSuccess: mockShowSuccess,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@services/userService', () => ({
  saveUserPersonalData: (...args: any[]) => mockSaveUserPersonalData(...args),
  getUserPersonalData: (...args: any[]) => mockGetUserPersonalData(...args),
  uploadProfilePhoto: (...args: any[]) => mockUploadProfilePhoto(...args),
  deleteProfilePhoto: (...args: any[]) => mockDeleteProfilePhoto(...args),
}));

jest.mock('@utils/AppErrors', () => ({
  AppError: class AppError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AppError';
    }
  },
}));

describe('Info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserPersonalData.mockResolvedValue({
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '(11) 99999-9999',
      location: 'Rua Test, 123',
      birthDate: '1990-01-15T00:00:00.000Z',
      country: 'Brasil',
    });
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<Info />);
    expect(getByText('Carregando dados...')).toBeTruthy();
  });

  it('renders form after loading completes', async () => {
    const { getByText } = render(<Info />);
    await waitFor(() => {
      expect(getByText('Informações Pessoais')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('renders all form fields', async () => {
    const { getByText } = render(<Info />);
    await waitFor(() => {
      expect(getByText('Nome Completo')).toBeTruthy();
      expect(getByText('Endereço de E-mail')).toBeTruthy();
      expect(getByText('Telefone')).toBeTruthy();
      expect(getByText('Data de Nascimento')).toBeTruthy();
      expect(getByText('Endereço')).toBeTruthy();
      expect(getByText('País')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('renders save button', async () => {
    const { getByText } = render(<Info />);
    await waitFor(() => {
      expect(getByText('Salvar')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('calls getUserPersonalData on mount', async () => {
    render(<Info />);
    await waitFor(() => {
      expect(mockGetUserPersonalData).toHaveBeenCalled();
    });
  });

  it('shows error toast when getUserPersonalData fails', async () => {
    mockGetUserPersonalData.mockRejectedValueOnce(new Error('Network error'));
    render(<Info />);
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Erro ao carregar dados' })
      );
    });
  });

  it('loads user data from backend when no profile data', async () => {
    mockGetUserPersonalData.mockResolvedValueOnce(null);
    render(<Info />);
    await waitFor(() => {
      expect(mockGetUserPersonalData).toHaveBeenCalled();
    });
  });

  it('navigates back when header back is pressed', async () => {
    const { getByTestId, getByText } = render(<Info />);
    await waitFor(() => {
      expect(getByText('Informações Pessoais')).toBeTruthy();
    }, { timeout: 3000 });
    fireEvent.press(getByTestId('header-back'));
    expect(mockNavigate).toHaveBeenCalledWith('homepage');
  });
});
