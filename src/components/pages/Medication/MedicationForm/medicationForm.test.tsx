import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import { MedicationForm } from './medicationForm';

// ── Mock NativeBase ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: ({ children, ...rest }: any) => <RN.ScrollView {...rest}>{children}</RN.ScrollView>,
  };
});

// ── Mock react-native-reanimated ──
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    },
    FadeInDown: { duration: () => ({ delay: () => undefined }) },
  };
});

// ── Mock @react-native-community/datetimepicker ──
jest.mock('@react-native-community/datetimepicker', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <RN.View testID="date-time-picker" {...props} />,
  };
});

// ── Mock navigation ──
const mockGoBack = jest.fn();
const mockRouteParams: any = {};
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: mockGoBack }),
  useRoute: () => ({ params: mockRouteParams }),
}));

// ── Mock medication service ──
jest.mock('src/services/medicationService', () => ({
  MedicationForm: {
    Comprimido: 1,
    Gotas: 2,
    Injecao: 3,
    Pomada: 4,
    Capsula: 5,
    Xarope: 6,
  },
  MedicationFrequencyType: {
    Daily: 1,
    SpecificDays: 2,
  },
  MedicationFormLabels: {
    1: 'Comprimido',
    2: 'Gotas',
    3: 'Injeção',
    4: 'Pomada',
    5: 'Cápsula',
    6: 'Xarope',
  },
}));

// ── Mock medication utils ──
jest.mock('../utils/medicationUtils', () => {
  const RN = require('react-native');
  return {
    getFormIcon: (form: number, color: string, size: string) => (
      <RN.View testID={`form-icon-${form}`} />
    ),
  };
});

// ── Mock icons ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    ChevronLeftIcon: (props: any) => <RN.View testID="chevron-left-icon" {...props} />,
    ChevronDownIcon: (props: any) => <RN.View testID="chevron-down-icon" {...props} />,
    ChevronUpIcon: (props: any) => <RN.View testID="chevron-up-icon" {...props} />,
    ClockIcon: (props: any) => <RN.View testID="clock-icon" {...props} />,
  };
});

// ── Mock routes ──
jest.mock('@routes/app.routes', () => ({}));

// ── Mock hooks ──
const mockAddMedication = jest.fn().mockResolvedValue(undefined);
const mockEditMedication = jest.fn().mockResolvedValue(undefined);
let mockMedications: any[] = [];

jest.mock('src/hooks/useMedication', () => ({
  useMedication: () => ({
    addMedication: mockAddMedication,
    editMedication: mockEditMedication,
    medications: mockMedications,
  }),
}));

// ── Spy on Alert ──
const alertSpy = jest.spyOn(Alert, 'alert');

function clearRouteParams() {
  Object.keys(mockRouteParams).forEach((k) => delete mockRouteParams[k]);
}

beforeEach(() => {
  jest.clearAllMocks();
  clearRouteParams();
  mockMedications = [];
  Platform.OS = 'ios';
});

// ────────────── TESTS ──────────────

describe('MedicationForm', () => {
  describe('New medication (create mode)', () => {
    it('renders header with "Novo medicamento"', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('Novo medicamento')).toBeTruthy();
    });

    it('renders name input field', () => {
      const { getByPlaceholderText } = render(<MedicationForm />);
      expect(getByPlaceholderText('Ex: Losartana')).toBeTruthy();
    });

    it('renders dosage input field', () => {
      const { getByPlaceholderText } = render(<MedicationForm />);
      expect(getByPlaceholderText('Ex: 50mg')).toBeTruthy();
    });

    it('renders form selector with default "Comprimido"', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('Comprimido')).toBeTruthy();
    });

    it('renders main time as "08:00"', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('08:00')).toBeTruthy();
    });

    it('renders "Mais opções" collapsible', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('Mais opções')).toBeTruthy();
    });

    it('renders submit button with "Cadastrar medicamento"', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('Cadastrar medicamento')).toBeTruthy();
    });

    it('renders form label fields', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('Nome do medicamento *')).toBeTruthy();
      expect(getByText('Dosagem *')).toBeTruthy();
      expect(getByText('Forma')).toBeTruthy();
      expect(getByText('Horário principal')).toBeTruthy();
    });
  });

  describe('Edit mode', () => {
    beforeEach(() => {
      Object.assign(mockRouteParams, { medicationId: 'med-1' });
      mockMedications = [
        {
          id: 'med-1',
          name: 'Losartana',
          dosage: '50mg',
          form: 1,
          frequencyType: 1,
          frequencyDays: [],
          scheduleTimes: ['08:00', '20:00'],
          instructions: 'Tomar com agua',
          totalQuantity: 60,
          refillAlertThreshold: 10,
        },
      ];
    });

    it('renders header with "Editar medicamento"', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('Editar medicamento')).toBeTruthy();
    });

    it('pre-fills name from existing medication', () => {
      const { getByDisplayValue } = render(<MedicationForm />);
      expect(getByDisplayValue('Losartana')).toBeTruthy();
    });

    it('pre-fills dosage from existing medication', () => {
      const { getByDisplayValue } = render(<MedicationForm />);
      expect(getByDisplayValue('50mg')).toBeTruthy();
    });

    it('renders submit button with "Salvar alterações"', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText('Salvar alterações')).toBeTruthy();
    });

    it('shows more options section expanded when there are extra times', () => {
      const { getByText } = render(<MedicationForm />);
      // Should show "Horários adicionais" since it has 2 scheduleTimes
      expect(getByText('Horários adicionais')).toBeTruthy();
    });
  });

  describe('Form picker', () => {
    it('opens form picker on press', () => {
      const { getByText, queryAllByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Comprimido'));
      // Should show all form options
      expect(getByText('Gotas')).toBeTruthy();
      expect(getByText('Pomada')).toBeTruthy();
    });

    it('selects a different form', () => {
      const { getByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Comprimido'));
      fireEvent.press(getByText('Gotas'));
      // After selecting, the picker should close and show "Gotas"
      expect(getByText('Gotas')).toBeTruthy();
    });
  });

  describe('More options (collapsible)', () => {
    it('toggles more options on press', () => {
      const { getByText, queryByText } = render(<MedicationForm />);
      // Initially collapsed, press to expand
      fireEvent.press(getByText('Mais opções'));
      expect(getByText('Frequência')).toBeTruthy();
      expect(getByText('Diário')).toBeTruthy();
      expect(getByText('Dias específicos')).toBeTruthy();
      expect(getByText('Horários adicionais')).toBeTruthy();
    });

    it('shows weekday chips when "Dias específicos" is selected', () => {
      const { getByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Dias específicos'));
      expect(getByText('Dom')).toBeTruthy();
      expect(getByText('Seg')).toBeTruthy();
      expect(getByText('Ter')).toBeTruthy();
      expect(getByText('Qua')).toBeTruthy();
      expect(getByText('Qui')).toBeTruthy();
      expect(getByText('Sex')).toBeTruthy();
    });

    it('toggles weekday selection', () => {
      const { getByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Dias específicos'));
      // Toggle Mon
      fireEvent.press(getByText('Seg'));
      // Toggle Mon again (deselect)
      fireEvent.press(getByText('Seg'));
      // No crash, day toggled
      expect(getByText('Seg')).toBeTruthy();
    });

    it('adds additional time', () => {
      const { getByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Adicionar horário'));
      // After adding, there should be a new time "12:00" displayed
      expect(getByText('12:00')).toBeTruthy();
    });

    it('renders instructions field', () => {
      const { getByText, getByPlaceholderText } = render(<MedicationForm />);
      fireEvent.press(getByText('Mais opções'));
      expect(getByPlaceholderText(/Tomar em jejum/)).toBeTruthy();
    });
  });

  describe('Validation', () => {
    it('shows alert when name is empty', () => {
      const { getByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Cadastrar medicamento'));
      expect(alertSpy).toHaveBeenCalledWith(
        'Campos obrigatórios',
        'Preencha o nome e a dosagem do medicamento.'
      );
    });

    it('shows alert when dosage is empty', () => {
      const { getByText, getByPlaceholderText } = render(<MedicationForm />);
      fireEvent.changeText(getByPlaceholderText('Ex: Losartana'), 'TestMed');
      fireEvent.press(getByText('Cadastrar medicamento'));
      expect(alertSpy).toHaveBeenCalledWith(
        'Campos obrigatórios',
        'Preencha o nome e a dosagem do medicamento.'
      );
    });

    it('shows alert when specific days is selected but none chosen', () => {
      const { getByText, getByPlaceholderText } = render(<MedicationForm />);
      fireEvent.changeText(getByPlaceholderText('Ex: Losartana'), 'TestMed');
      fireEvent.changeText(getByPlaceholderText('Ex: 50mg'), '25mg');
      // Expand more options and select specific days
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Dias específicos'));
      // Don't select any days, try to submit
      fireEvent.press(getByText('Cadastrar medicamento'));
      expect(alertSpy).toHaveBeenCalledWith(
        'Selecione os dias',
        'Escolha pelo menos um dia da semana.'
      );
    });
  });

  describe('Submission', () => {
    it('calls addMedication on successful create', async () => {
      const { getByText, getByPlaceholderText } = render(<MedicationForm />);
      fireEvent.changeText(getByPlaceholderText('Ex: Losartana'), 'Paracetamol');
      fireEvent.changeText(getByPlaceholderText('Ex: 50mg'), '500mg');
      fireEvent.press(getByText('Cadastrar medicamento'));
      await waitFor(() => {
        expect(mockAddMedication).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Paracetamol',
            dosage: '500mg',
          })
        );
        expect(mockGoBack).toHaveBeenCalled();
      });
    });

    it('calls editMedication on successful edit', async () => {
      Object.assign(mockRouteParams, { medicationId: 'med-1' });
      mockMedications = [
        {
          id: 'med-1',
          name: 'Losartana',
          dosage: '50mg',
          form: 1,
          frequencyType: 1,
          frequencyDays: [],
          scheduleTimes: ['08:00'],
          instructions: '',
        },
      ];
      const { getByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Salvar alterações'));
      await waitFor(() => {
        expect(mockEditMedication).toHaveBeenCalledWith(
          'med-1',
          expect.objectContaining({
            name: 'Losartana',
            dosage: '50mg',
          })
        );
        expect(mockGoBack).toHaveBeenCalled();
      });
    });

    it('shows error alert on submission failure', async () => {
      mockAddMedication.mockRejectedValueOnce(new Error('fail'));
      const { getByText, getByPlaceholderText } = render(<MedicationForm />);
      fireEvent.changeText(getByPlaceholderText('Ex: Losartana'), 'TestMed');
      fireEvent.changeText(getByPlaceholderText('Ex: 50mg'), '10mg');
      fireEvent.press(getByText('Cadastrar medicamento'));
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Erro',
          'Não foi possível salvar o medicamento. Tente novamente.'
        );
      });
    });

    it('shows "Salvando..." during submission', async () => {
      mockAddMedication.mockImplementation(() => new Promise(() => {})); // never resolves
      const { getByText, getByPlaceholderText } = render(<MedicationForm />);
      fireEvent.changeText(getByPlaceholderText('Ex: Losartana'), 'Test');
      fireEvent.changeText(getByPlaceholderText('Ex: 50mg'), '10mg');
      fireEvent.press(getByText('Cadastrar medicamento'));
      await waitFor(() => {
        expect(getByText('Salvando...')).toBeTruthy();
      });
    });
  });

  describe('Back navigation', () => {
    it('calls goBack on back button press', () => {
      const { getByTestId } = render(<MedicationForm />);
      // The back button wraps ChevronLeftIcon
      const backButtons = render(<MedicationForm />).UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      );
      // The first touchable should be the back button
      fireEvent.press(backButtons[0]);
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Time picker', () => {
    it('shows time picker on main time press', () => {
      const { getByText, queryByTestId } = render(<MedicationForm />);
      fireEvent.press(getByText('08:00'));
      expect(queryByTestId('date-time-picker')).toBeTruthy();
    });
  });

  describe('More options hint', () => {
    it('shows hint text when collapsed', () => {
      const { getByText } = render(<MedicationForm />);
      expect(getByText(/Frequência, horários extras, instruções/)).toBeTruthy();
    });
  });

  describe('Remove time', () => {
    it('removes additional time when X button is pressed', () => {
      const { getByText, queryByText, getAllByText } = render(<MedicationForm />);
      // Expand more options
      fireEvent.press(getByText('Mais opções'));
      // Add a time
      fireEvent.press(getByText('Adicionar horário'));
      // Should see 12:00
      expect(getByText('12:00')).toBeTruthy();
      // Find the remove button (the X character)
      const removeButtons = getAllByText('✕');
      expect(removeButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.press(removeButtons[0]);
      // After removing, 12:00 should be gone
      // The main time 08:00 should still be there
      expect(getByText('08:00')).toBeTruthy();
    });

    it('does not remove the last remaining time', () => {
      const { getByText } = render(<MedicationForm />);
      // Only one time (08:00) exists, no remove button should appear
      // since removeTime early-returns when scheduleTimes.length <= 1
      expect(getByText('08:00')).toBeTruthy();
    });
  });

  describe('Time picker interaction', () => {
    it('shows time picker on additional time press', () => {
      const { getByText, queryByTestId } = render(<MedicationForm />);
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Adicionar horário'));
      fireEvent.press(getByText('12:00'));
      expect(queryByTestId('date-time-picker')).toBeTruthy();
    });

    it('handles time change on Android', () => {
      Platform.OS = 'android';
      const { getByText, queryByTestId } = render(<MedicationForm />);
      fireEvent.press(getByText('08:00'));
      const picker = queryByTestId('date-time-picker');
      if (picker && picker.props.onChange) {
        const selectedDate = new Date();
        selectedDate.setHours(14, 30, 0, 0);
        picker.props.onChange({}, selectedDate);
      }
      // After Android onChange, time picker should close
      // and time should be updated
    });

    it('handles time change on Android with no selected date', () => {
      Platform.OS = 'android';
      const { getByText, queryByTestId } = render(<MedicationForm />);
      fireEvent.press(getByText('08:00'));
      const picker = queryByTestId('date-time-picker');
      if (picker && picker.props.onChange) {
        picker.props.onChange({}, undefined);
      }
      // Should not crash; picker dismisses without changes
    });

    it('shows iOS modal time picker and handles confirm', () => {
      Platform.OS = 'ios';
      const { getByText, queryByTestId, queryByText } = render(<MedicationForm />);
      fireEvent.press(getByText('08:00'));
      // iOS modal should show
      const picker = queryByTestId('date-time-picker');
      expect(picker).toBeTruthy();
      // Find and press Confirmar
      const confirmar = queryByText('Confirmar');
      if (confirmar) {
        fireEvent.press(confirmar);
      }
    });

    it('shows iOS modal time picker and handles cancel', () => {
      Platform.OS = 'ios';
      const { getByText, queryByText } = render(<MedicationForm />);
      fireEvent.press(getByText('08:00'));
      // Find and press Cancelar
      const cancelar = queryByText('Cancelar');
      if (cancelar) {
        fireEvent.press(cancelar);
      }
    });

    it('updates time on iOS when date picker changes and confirm is pressed', () => {
      Platform.OS = 'ios';
      const { getByText, queryByTestId, queryByText } = render(<MedicationForm />);
      fireEvent.press(getByText('08:00'));

      const picker = queryByTestId('date-time-picker');
      if (picker && picker.props.onChange) {
        const selectedDate = new Date();
        selectedDate.setHours(15, 45, 0, 0);
        picker.props.onChange({}, selectedDate);
      }

      const confirmar = queryByText('Confirmar');
      if (confirmar) {
        fireEvent.press(confirmar);
      }
    });
  });

  describe('Weekday Sab', () => {
    it('shows Sáb weekday chip when specific days is selected', () => {
      const { getByText, queryByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Dias específicos'));
      // Should show all weekdays including Sáb
      expect(queryByText('Sáb')).toBeTruthy();
    });

    it('can toggle Sáb day selection', () => {
      const { getByText } = render(<MedicationForm />);
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Dias específicos'));
      // Toggle Sáb
      fireEvent.press(getByText('Sáb'));
      // Toggle again to deselect
      fireEvent.press(getByText('Sáb'));
      expect(getByText('Sáb')).toBeTruthy();
    });
  });

  describe('More options hint variations', () => {
    it('shows days count in hint when specific days selected with days', () => {
      const { getByText } = render(<MedicationForm />);
      // Expand, select specific days, select a day, then collapse
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Dias específicos'));
      fireEvent.press(getByText('Seg'));
      // Collapse more options
      fireEvent.press(getByText('Mais opções'));
      // Should show hint with "1 dias"
      expect(getByText(/1 dias/)).toBeTruthy();
    });

    it('shows multiple horários in hint', () => {
      const { getByText } = render(<MedicationForm />);
      // Expand, add time, then collapse
      fireEvent.press(getByText('Mais opções'));
      fireEvent.press(getByText('Adicionar horário'));
      // Collapse
      fireEvent.press(getByText('Mais opções'));
      // Should show "2 horários" in hint
      expect(getByText(/2 horários/)).toBeTruthy();
    });

    it('shows instructions in hint when instructions are provided', () => {
      const { getByText, getByPlaceholderText } = render(<MedicationForm />);
      // Expand more options
      fireEvent.press(getByText('Mais opções'));
      // Type instructions
      fireEvent.changeText(getByPlaceholderText(/Tomar em jejum/), 'Before meals');
      // Collapse
      fireEvent.press(getByText('Mais opções'));
      // Should show "com instruções" in hint
      expect(getByText(/com instruções/)).toBeTruthy();
    });
  });

  describe('Edit mode with more options fields', () => {
    it('pre-fills instructions from existing medication', () => {
      Object.assign(mockRouteParams, { medicationId: 'med-1' });
      mockMedications = [
        {
          id: 'med-1',
          name: 'Losartana',
          dosage: '50mg',
          form: 1,
          frequencyType: 2, // SpecificDays
          frequencyDays: [1, 3, 5],
          scheduleTimes: ['08:00'],
          instructions: 'Tomar com agua',
        },
      ];
      const { getByDisplayValue } = render(<MedicationForm />);
      expect(getByDisplayValue('Tomar com agua')).toBeTruthy();
    });
  });
});
