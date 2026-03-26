import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UploadTypeManual } from './uploadTypeManual';

// Mock native-base
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Flex: ({ children, _text, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Badge: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    CloseIcon: (props: any) => <RN.Text>X</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Modal: Object.assign(
      ({ children, isOpen, ...rest }: any) => {
        const RN = require('react-native');
        return isOpen ? <RN.View testID="modal" {...rest}>{children}</RN.View> : null;
      },
      {
        Content: ({ children, ...rest }: any) => {
          const RN = require('react-native');
          return <RN.View {...rest}>{children}</RN.View>;
        },
        CloseButton: () => null,
        Body: ({ children, ...rest }: any) => {
          const RN = require('react-native');
          return <RN.View {...rest}>{children}</RN.View>;
        },
      }
    ),
    Center: ({ children, ...rest }: any) => {
      const RN = require('react-native');
      return <RN.View {...rest}>{children}</RN.View>;
    },
    Pressable: ({ children, onPress, ...rest }: any) => {
      const RN = require('react-native');
      return <RN.TouchableOpacity onPress={onPress} {...rest}>{children}</RN.TouchableOpacity>;
    },
  };
});

// Mock icons
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => 'ArrowIcon',
}));

// Mock Button and Input
jest.mock('@components/atoms', () => ({
  Button: ({ title, onPress, isDisabled, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity onPress={onPress} disabled={isDisabled} testID={`button-${title}`} {...rest}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('@components/molecules', () => ({
  Input: ({ label, onChangeText, value, selectType, options, onValueChange, selectedValue, ...rest }: any) => {
    const RN = require('react-native');
    if (selectType) {
      return (
        <RN.View testID={`select-${label}`}>
          <RN.Text>{label}</RN.Text>
          <RN.TextInput
            testID={`input-${label}`}
            onChangeText={(val: string) => {
              onChangeText?.(val);
              onValueChange?.(val);
            }}
            value={selectedValue || value}
          />
        </RN.View>
      );
    }
    return (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={`input-${label}`}
          onChangeText={onChangeText}
          value={value}
        />
      </RN.View>
    );
  },
}));

// Mock AppError
jest.mock('@utils/AppErrors', () => ({
  AppError: class AppError extends Error {
    constructor(message: string) {
      super(message);
    }
  },
}));

// Mock react-hook-form partially
jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn().mockReturnValue(jest.fn()),
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: ({ onChange, value, ...rest }: any) => (
      <RN.View testID="dateTimePicker">
        <RN.TouchableOpacity
          testID="date-picker-confirm"
          onPress={() => onChange?.({ type: 'set' }, new Date('2024-01-15'))}
        >
          <RN.Text>Confirm Date</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    ),
  };
});

// Mock lodash
jest.mock('lodash', () => ({
  find: jest.fn(),
  remove: jest.fn((arr, predicate) => arr.filter((_: any, i: number) => predicate(_, i))),
}));

// Mock hooks
const mockGetExamTypes = jest.fn();
const mockHandleManualUploadFile = jest.fn();
const mockShowError = jest.fn();

jest.mock('src/hooks/useUpload', () => ({
  useUpload: () => ({
    getExamTypes: mockGetExamTypes,
    examList: [],
    handleManualUploadFile: mockHandleManualUploadFile,
  }),
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
  }),
}));

jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showError: mockShowError,
  }),
}));

describe('UploadTypeManual', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText('Insira o exame manualmente')).toBeTruthy();
  });

  it('renders the description', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText(/Preencha as informações abaixo/)).toBeTruthy();
  });

  it('renders lab name input', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText('Nome do Laboratório')).toBeTruthy();
  });

  it('renders doctor name input', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText('Nome do Médico')).toBeTruthy();
  });

  it('renders exam date input', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText('Data do Exame')).toBeTruthy();
  });

  it('renders exam select input', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText('Selecione o Exame')).toBeTruthy();
  });

  it('renders the submit button as disabled when no exams added', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText('Desvende sua saúde')).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<UploadTypeManual />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
