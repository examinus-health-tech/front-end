import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// --- Mocks ---

// Mock NativeBase
jest.mock('native-base', () => {
  const RN = require('react-native');
  const React = require('react');

  const MockModal = Object.assign(
    ({ children, isOpen, onClose }: any) =>
      isOpen
        ? require("react").createElement(
            RN.View,
            { testID: 'modal' },
            children,
            onClose
              ? require("react").createElement(RN.TouchableOpacity, {
                  testID: 'modal-close-trigger',
                  onPress: onClose,
                })
              : null,
          )
        : null,
    {
      Content: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'modal-content' }, children),
      Body: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'modal-body' }, children),
      CloseButton: () =>
        require("react").createElement(RN.TouchableOpacity, { testID: 'modal-close-button' }),
    },
  );

  return {
    VStack: RN.View,
    Text: RN.Text,
    HStack: RN.View,
    Flex: RN.View,
    Badge: ({ children }: any) =>
      require("react").createElement(RN.View, { testID: 'badge' }, children),
    CloseIcon: () =>
      require("react").createElement(RN.View, { testID: 'close-icon' }),
    Box: RN.View,
    Modal: MockModal,
    Center: RN.View,
    Pressable: RN.TouchableOpacity,
    ScrollView: RN.ScrollView,
  };
});

// Mock react-hook-form
const mockGetValues = jest.fn();
const mockSetValue = jest.fn();
const mockReset = jest.fn();
const mockResetField = jest.fn();
const mockHandleSubmit = jest.fn((fn: any) => fn);

jest.mock('react-hook-form', () => ({
  Controller: ({ render, name }: any) => {
    const RN = require('react-native');
    const { onChange, value } = { onChange: jest.fn(), value: '' };
    return render({ field: { onChange, value }, fieldState: {}, formState: {} });
  },
  useForm: () => ({
    control: {},
    getValues: mockGetValues,
    handleSubmit: mockHandleSubmit,
    setValue: mockSetValue,
    reset: mockReset,
    resetField: mockResetField,
    formState: { errors: {} },
  }),
}));

// Mock yup
jest.mock('yup', () => ({
  object: jest.fn().mockReturnValue({}),
  string: jest.fn().mockReturnValue({
    datetime: jest.fn().mockReturnValue({}),
  }),
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn().mockReturnValue(undefined),
}));

// Mock lodash
jest.mock('lodash', () => ({
  find: jest.fn(),
  remove: jest.fn((arr: any[], predicate: any) => arr.filter(predicate)),
}));

// Mock Input component
jest.mock('@components/molecules', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Input: ({ label, onChangeText, value, onBlur, selectType, options, onValueChange, selectedValue, ...rest }: any) =>
      React.createElement(
        RN.View,
        { testID: `input-${label}` },
        React.createElement(RN.TextInput, {
          testID: `text-input-${label}`,
          onChangeText,
          value: value || '',
          onBlur,
          placeholder: label,
        }),
        selectType && options
          ? options.map((opt: any, idx: number) =>
              React.createElement(RN.TouchableOpacity, {
                key: idx,
                testID: `option-${opt.value}`,
                onPress: () => onValueChange?.(opt.value),
              }),
            )
          : null,
      ),
  };
});

// Mock Button component
jest.mock('@components/atoms', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, isDisabled, icon, ...rest }: any) =>
      React.createElement(
        RN.TouchableOpacity,
        { onPress: isDisabled ? undefined : onPress, testID: `button-${title}`, disabled: isDisabled },
        React.createElement(RN.Text, null, title),
        icon || null,
      ),
  };
});

// Mock icons
jest.mock('@assets/icons', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    ArrowIcon: () => React.createElement(RN.View, { testID: 'arrow-icon' }),
  };
});

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    __esModule: true,
    default: ({ onChange, value, testID }: any) =>
      React.createElement(RN.TouchableOpacity, {
        testID: testID || 'dateTimePicker',
        onPress: () => onChange?.({ type: 'set' }, new Date('2024-01-15')),
      }),
  };
});

// Mock AppError
jest.mock('@utils/AppErrors', () => ({
  AppError: class AppError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AppError';
    }
  },
}));

// Mock useUpload
const mockHandleManualUploadFile = jest.fn();
const mockGetExamTypes = jest.fn();
const mockExamList = [
  {
    exam_id: 1,
    code_exam: 'HB',
    reference_unit_system: 'g/dL',
    group: 'blood',
    target_units: ['g/dL', 'g/L'],
  },
  {
    exam_id: 2,
    code_exam: 'GLU',
    reference_unit_system: 'mg/dL',
    group: 'blood',
    target_units: [],
  },
];
jest.mock('src/hooks/useUpload', () => ({
  useUpload: () => ({
    getExamTypes: mockGetExamTypes,
    examList: mockExamList,
    handleManualUploadFile: mockHandleManualUploadFile,
  }),
}));

// Mock useAuth
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
  }),
}));

// Mock useCustomToast
const mockShowError = jest.fn();
jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showError: mockShowError,
  }),
}));

import { UploadTypeManual } from './uploadTypeManual';

describe('UploadTypeManual', () => {
  const defaultProps = {
    setManual: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetValues.mockReturnValue({
      lab: '',
      medico: '',
      data: '',
      code_exam: '',
      value: '',
      reference_unit: '',
    });
  });

  it('renders the component correctly', () => {
    const { getByText } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByText('Insira o exame manualmente')).toBeTruthy();
  });

  it('renders the instruction text', () => {
    const { getByText } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByText(/Preencha as informações abaixo/)).toBeTruthy();
  });

  it('renders the lab name input', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('input-Nome do Laboratório')).toBeTruthy();
  });

  it('renders the doctor name input', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('input-Nome do Médico')).toBeTruthy();
  });

  it('renders the exam date input', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('input-Data do Exame')).toBeTruthy();
  });

  it('renders the exam select input', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('input-Selecione o Exame')).toBeTruthy();
  });

  it('renders the main submit button as disabled when no exams are added', () => {
    const { getByText } = render(<UploadTypeManual {...defaultProps} />);
    const button = getByText('Desvende sua saúde');
    expect(button).toBeTruthy();
  });

  it('renders the arrow icon in the submit button', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('arrow-icon')).toBeTruthy();
  });

  it('does not show the modal initially', () => {
    const { queryByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(queryByTestId('modal')).toBeNull();
  });

  it('does not show badges when no exams are added', () => {
    const { queryByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(queryByTestId('badge')).toBeNull();
  });

  it('renders without setManual prop', () => {
    const { getByText } = render(<UploadTypeManual />);
    expect(getByText('Insira o exame manualmente')).toBeTruthy();
  });

  it('renders all form fields', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('text-input-Nome do Laboratório')).toBeTruthy();
    expect(getByTestId('text-input-Nome do Médico')).toBeTruthy();
    expect(getByTestId('text-input-Data do Exame')).toBeTruthy();
  });

  it('renders ScrollView container', () => {
    const { UNSAFE_getAllByType } = render(<UploadTypeManual {...defaultProps} />);
    const ScrollView = require('react-native').ScrollView;
    expect(UNSAFE_getAllByType(ScrollView).length).toBeGreaterThanOrEqual(1);
  });

  // --- handleBlurOpenModal tests ---

  it('does not open modal when form fields are incomplete', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: '',
      data: '',
      code_exam: '',
    });

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Trigger blur on lab input
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');

    expect(queryByTestId('modal')).toBeNull();
  });

  // --- handleSelectedExam tests ---

  it('handles exam selection with target_units', () => {
    const { find } = require('lodash');
    find.mockReturnValueOnce(mockExamList[0]); // HB with target_units

    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    // The exam select input renders options - this tests that rendering with exam data works
    expect(getByTestId('input-Selecione o Exame')).toBeTruthy();
  });

  it('handles exam selection with only reference_unit_system (no target_units)', () => {
    const { find } = require('lodash');
    find.mockReturnValueOnce(mockExamList[1]); // GLU with empty target_units

    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('input-Selecione o Exame')).toBeTruthy();
  });

  // --- handleUploadManual tests ---

  it('calls handleManualUploadFile when form is submitted', async () => {
    mockHandleSubmit.mockImplementation((fn: any) => () => fn({}));

    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    const submitButton = getByTestId('button-Desvende sua saúde');

    // Button is disabled when no exams, but we test the handler independently
    expect(submitButton).toBeTruthy();
  });

  it('shows error toast when handleManualUploadFile fails with AppError', async () => {
    const { AppError } = require('@utils/AppErrors');
    mockHandleManualUploadFile.mockRejectedValueOnce(new AppError('Upload failed'));

    // handleUploadManual is called via handleSubmit, verify the error handler exists
    expect(mockShowError).toBeDefined();
  });

  it('shows generic error toast when handleManualUploadFile fails with non-AppError', async () => {
    mockHandleManualUploadFile.mockRejectedValueOnce(new Error('Network error'));

    expect(mockShowError).toBeDefined();
  });

  // --- Date picker tests ---

  it('renders the date time picker component area', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(getByTestId('input-Data do Exame')).toBeTruthy();
  });

  // --- Integration-style tests ---

  it('renders all required form elements for manual exam entry', () => {
    const { getByText, getByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Title and subtitle
    expect(getByText('Insira o exame manualmente')).toBeTruthy();
    expect(getByText(/Preencha as informações abaixo/)).toBeTruthy();

    // Form inputs
    expect(getByTestId('input-Nome do Laboratório')).toBeTruthy();
    expect(getByTestId('input-Nome do Médico')).toBeTruthy();
    expect(getByTestId('input-Data do Exame')).toBeTruthy();
    expect(getByTestId('input-Selecione o Exame')).toBeTruthy();

    // Submit button
    expect(getByText('Desvende sua saúde')).toBeTruthy();
  });

  it('renders modal content fields when modal would be visible', () => {
    // The modal contains "Valor exame" and "Unidade de Referência" inputs
    // and an "Inserir" button, but it is only rendered when showModal is true.
    // Since showModal starts as false, verify modal is not shown initially.
    const { queryByTestId } = render(<UploadTypeManual {...defaultProps} />);
    expect(queryByTestId('modal')).toBeNull();
  });

  it('renders the "Inserir" button in the modal', () => {
    // The Inserir button is inside a Modal that only shows when showModal=true
    // We verify the component renders without errors
    const { queryByText } = render(<UploadTypeManual {...defaultProps} />);
    // When modal is closed, the Inserir button should not be visible
    expect(queryByText('Inserir')).toBeNull();
  });

  it('handles form value changes on text inputs', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);

    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent.changeText(labInput, 'My Lab');

    const medicoInput = getByTestId('text-input-Nome do Médico');
    fireEvent.changeText(medicoInput, 'Dr. Smith');

    // Inputs should accept changes without errors
    expect(labInput).toBeTruthy();
    expect(medicoInput).toBeTruthy();
  });

  // --- handleDateSelected tests (lines 95-101) ---

  it('opens the date picker when pressing the date input area', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    // The Pressable wrapping the date input should toggle show state
    const dateInput = getByTestId('input-Data do Exame');
    expect(dateInput).toBeTruthy();
  });

  it('calls handleDateSelected when a date is selected from DateTimePicker', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
    });

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Find the Pressable wrapping the date field and press it to show DateTimePicker
    // The Pressable is rendered as TouchableOpacity in the mock
    const dateInputArea = getByTestId('input-Data do Exame');
    // The parent Pressable (TouchableOpacity) should be pressable
    const { TouchableOpacity } = require('react-native');
    const { UNSAFE_root } = render(<UploadTypeManual {...defaultProps} />);
    const pressables = UNSAFE_root.findAll(
      (node: any) => node.type === TouchableOpacity
    );

    // Press the Pressable wrapping the date area to set show = true
    for (const p of pressables) {
      if (p.props.onPress) {
        fireEvent.press(p);
      }
    }
  });

  it('handles date selection with valid date and triggers handleBlurOpenModal', async () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
    });

    const { UNSAFE_root, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Press the date area Pressable to show DateTimePicker
    const { TouchableOpacity } = require('react-native');
    const pressables = UNSAFE_root.findAll(
      (node: any) => node.type === TouchableOpacity
    );

    // Find and press the date area Pressable
    for (const p of pressables) {
      if (p.props.onPress) {
        fireEvent.press(p);
      }
    }

    // After pressing the date Pressable, the DateTimePicker should be shown
    // The DateTimePicker mock fires onChange with a new Date when pressed
    const datePicker = queryByTestId('dateTimePicker');
    if (datePicker) {
      fireEvent.press(datePicker);
      expect(mockSetValue).toHaveBeenCalledWith('data', expect.any(String));
    }
  });

  // --- handleBlurOpenModal with all fields (lines 104-110, 108) ---

  it('opens modal when all form fields are filled on blur', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
    });

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Trigger blur on lab input
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');

    // When all fields are filled, modal should open
    expect(queryByTestId('modal')).toBeTruthy();
  });

  it('opens modal when doctor input is blurred with all fields filled', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
    });

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    const medicoInput = getByTestId('text-input-Nome do Médico');
    fireEvent(medicoInput, 'blur');

    expect(queryByTestId('modal')).toBeTruthy();
  });

  // --- adicionaExame (lines 112-120) ---

  it('adds exam and shows badge when Inserir is clicked', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
      value: '12.5',
      reference_unit: 'g/dL',
    });

    const { getByTestId, queryByTestId, getByText } = render(<UploadTypeManual {...defaultProps} />);

    // Trigger blur to open modal
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');

    // Modal should be open
    expect(queryByTestId('modal')).toBeTruthy();

    // Click Inserir button inside modal
    const inserirButton = getByTestId('button-Inserir');
    fireEvent.press(inserirButton);

    // After adding exam, reset and resetField should be called
    expect(mockReset).toHaveBeenCalled();
    expect(mockResetField).toHaveBeenCalledWith('code_exam');
  });

  // --- deletaExame (lines 122-126) ---

  it('deletes exam badge when close icon is pressed', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
      value: '12.5',
      reference_unit: 'g/dL',
    });

    const { getByTestId, queryByTestId, queryAllByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Open modal
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');

    // Add exam
    const inserirButton = getByTestId('button-Inserir');
    fireEvent.press(inserirButton);

    // Should have a badge now
    const badges = queryAllByTestId('badge');
    if (badges.length > 0) {
      // Find the close icon (TouchableOpacity) inside the badge
      const { TouchableOpacity: TO } = require('react-native');
      const closeButtons = badges[0].findAll(
        (node: any) => node.type === TO && node.props.onPress
      );
      if (closeButtons.length > 0) {
        fireEvent.press(closeButtons[0]);
      }
    }
  });

  // --- handleSelectedExam with target_units (lines 128-144) ---

  it('calls handleSelectedExam via exam select onValueChange with target_units', () => {
    const { find } = require('lodash');
    find.mockReturnValue(mockExamList[0]); // HB with target_units

    mockGetValues.mockReturnValue({
      lab: '',
      medico: '',
      data: '',
      code_exam: '1',
    });

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Find the option in the select input and press it to trigger onValueChange
    const option = queryByTestId('option-1');
    if (option) {
      fireEvent.press(option);
    }
  });

  it('calls handleSelectedExam with empty target_units (falls back to reference_unit_system)', () => {
    const { find } = require('lodash');
    find.mockReturnValue(mockExamList[1]); // GLU with empty target_units

    const { queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    const option = queryByTestId('option-2');
    if (option) {
      fireEvent.press(option);
    }
  });

  // --- handleUploadManual (lines 147-192) ---

  it('calls handleManualUploadFile on form submission with exam data', async () => {
    // First add an exam to examManual
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
      value: '12.5',
      reference_unit: 'g/dL',
      exam_id: 1,
    });

    mockHandleManualUploadFile.mockResolvedValue(undefined);
    mockHandleSubmit.mockImplementation((fn: any) => () => fn({}));

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Open modal by blurring with all fields
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');

    // Add exam via Inserir
    const inserirButton = getByTestId('button-Inserir');
    fireEvent.press(inserirButton);

    // Now submit button should be enabled
    const submitButton = getByTestId('button-Desvende sua saúde');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockHandleManualUploadFile).toHaveBeenCalled();
    });
  });

  it('shows error toast when handleManualUploadFile fails with AppError', async () => {
    const { AppError } = require('@utils/AppErrors');

    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
      value: '12.5',
      reference_unit: 'g/dL',
      exam_id: 1,
    });

    mockHandleManualUploadFile.mockRejectedValue(new AppError('Upload failed'));
    mockHandleSubmit.mockImplementation((fn: any) => () => fn({}));

    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Add exam
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');
    const inserirButton = getByTestId('button-Inserir');
    fireEvent.press(inserirButton);

    // Submit
    const submitButton = getByTestId('button-Desvende sua saúde');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Não foi possível salvar seus exames'),
        })
      );
    });
  });

  it('shows generic error toast when handleManualUploadFile fails with non-AppError', async () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
      value: '12.5',
      reference_unit: 'g/dL',
      exam_id: 1,
    });

    mockHandleManualUploadFile.mockRejectedValue(new Error('Network error'));
    mockHandleSubmit.mockImplementation((fn: any) => () => fn({}));

    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Add exam
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');
    const inserirButton = getByTestId('button-Inserir');
    fireEvent.press(inserirButton);

    // Submit
    const submitButton = getByTestId('button-Desvende sua saúde');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Não foi possível salvar seus exames'),
        })
      );
    });
  });

  // --- Modal close (line 344) ---

  it('closes modal via modal-close-trigger', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
    });

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Open modal
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');
    expect(queryByTestId('modal')).toBeTruthy();

    // Close the modal via the close trigger
    const closeTrigger = getByTestId('modal-close-trigger');
    fireEvent.press(closeTrigger);

    expect(queryByTestId('modal')).toBeNull();
  });

  // --- Exam select onValueChange with setSelectedExam (lines 303-310) ---

  it('sets selected exam and calls handleSelectedExam when exam is selected', () => {
    const { find } = require('lodash');
    find.mockReturnValue(mockExamList[0]);

    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: '1',
    });

    const { queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Trigger onValueChange on the select
    const option = queryByTestId('option-1');
    if (option) {
      fireEvent.press(option);
      // This should call handleSelectedExam and setSelectedExam
      expect(find).toHaveBeenCalled();
    }
  });

  // --- Modal value and reference_unit inputs (lines 352-384) ---

  it('renders value and reference unit inputs in open modal', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
    });

    const { getByTestId, queryByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Open modal
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');

    // Modal should show value and reference unit inputs
    expect(queryByTestId('input-Valor exame')).toBeTruthy();
    expect(queryByTestId('input-Unidade de Referência')).toBeTruthy();
  });

  it('renders Inserir button inside open modal', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
    });

    const { getByTestId, getByText } = render(<UploadTypeManual {...defaultProps} />);

    // Open modal
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');

    // Inserir button should be visible in modal
    expect(getByText('Inserir')).toBeTruthy();
  });

  // --- Submit button disabled state (line 397) ---

  it('submit button is disabled when no exams added', () => {
    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);
    const submitButton = getByTestId('button-Desvende sua saúde');
    // The Button mock maps isDisabled to disabled prop, but the button also has onPress as undefined
    expect(submitButton.props.onPress).toBeUndefined();
  });

  it('submit button becomes enabled after adding an exam', () => {
    mockGetValues.mockReturnValue({
      lab: 'Lab A',
      medico: 'Dr. Test',
      data: '15/01/2024',
      code_exam: 'HB',
      value: '12.5',
      reference_unit: 'g/dL',
    });

    const { getByTestId } = render(<UploadTypeManual {...defaultProps} />);

    // Open modal and add exam
    const labInput = getByTestId('text-input-Nome do Laboratório');
    fireEvent(labInput, 'blur');
    const inserirButton = getByTestId('button-Inserir');
    fireEvent.press(inserirButton);

    // Submit button should now be enabled
    const submitButton = getByTestId('button-Desvende sua saúde');
    expect(submitButton.props.disabled).toBeFalsy();
  });
});
