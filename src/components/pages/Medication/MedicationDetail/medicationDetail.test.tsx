import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { MedicationDetail } from './medicationDetail';

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

// ── Mock navigation ──
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockRouteParams: any = { medicationId: 'med-1' };
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: mockRouteParams }),
  useFocusEffect: (cb: any) => {
    const React = require('react');
    require("react").useEffect(() => {
      const cleanup = cb();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }, []);
  },
}));

// ── Mock date-fns ──
jest.mock('date-fns', () => ({
  format: jest.fn(() => '08:00'),
}));

// ── Mock medication service ──
jest.mock('src/services/medicationService', () => ({
  MedicationFormLabels: {
    1: 'Comprimido',
    2: 'Gotas',
    3: 'Injeção',
    4: 'Pomada',
    5: 'Cápsula',
    6: 'Xarope',
  },
  MedicationFrequencyType: {
    Daily: 1,
    SpecificDays: 2,
  },
  MedicationLogStatus: {
    Pending: 0,
    Taken: 1,
    Skipped: 2,
    Missed: 3,
  },
}));

// ── Mock medication utils ──
jest.mock('../utils/medicationUtils', () => {
  const RN = require('react-native');
  return {
    MedicationIcon: (props: any) => <RN.View testID="medication-icon" {...props} />,
    getStatusColor: (status: number) => {
      if (status === 1) return '#10B981';
      if (status === 2) return '#F59E0B';
      if (status === 3) return '#EF4444';
      return '#9CA3AF';
    },
    getStatusLabel: (status: number) => {
      if (status === 1) return 'Tomou';
      if (status === 2) return 'Pulou';
      if (status === 3) return 'Perdeu';
      return 'Pendente';
    },
  };
});

// ── Mock icons ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    ChevronLeftIcon: (props: any) => <RN.View testID="chevron-left-icon" {...props} />,
  };
});

// ── Mock routes ──
jest.mock('@routes/app.routes', () => ({}));

// ── Mock hooks ──
const mockRemoveMedication = jest.fn();
const mockRefreshDashboard = jest.fn();
let mockMedications: any[] = [];
let mockTodayLogs: any[] = [];

jest.mock('src/hooks/useMedication', () => ({
  useMedication: () => ({
    medications: mockMedications,
    todayLogs: mockTodayLogs,
    removeMedication: mockRemoveMedication,
    refreshDashboard: mockRefreshDashboard,
  }),
}));

// ── Spy on Alert ──
const alertSpy = jest.spyOn(Alert, 'alert');

beforeEach(() => {
  jest.clearAllMocks();
  mockMedications = [];
  mockTodayLogs = [];
  Object.assign(mockRouteParams, { medicationId: 'med-1' });
});

// ────────────── TESTS ──────────────

describe('MedicationDetail', () => {
  const baseMedication = {
    id: 'med-1',
    name: 'Losartana',
    dosage: '50mg',
    form: 1,
    frequencyType: 1, // Daily
    frequencyDays: undefined,
    scheduleTimes: ['08:00', '20:00'],
    instructions: 'Tomar com agua',
    isActive: true,
  };

  const specificDaysMedication = {
    ...baseMedication,
    id: 'med-2',
    name: 'Dipirona',
    frequencyType: 2, // SpecificDays
    frequencyDays: [1, 3, 5], // Mon, Wed, Fri
    scheduleTimes: ['09:00'],
    instructions: undefined,
  };

  describe('Not found state', () => {
    it('renders "Medicamento não encontrado" when medication is not in list', () => {
      mockMedications = [];
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('Medicamento não encontrado')).toBeTruthy();
    });
  });

  describe('Rendering with data', () => {
    beforeEach(() => {
      mockMedications = [baseMedication];
    });

    it('renders the header "Detalhes"', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('Detalhes')).toBeTruthy();
    });

    it('renders medication name', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('Losartana')).toBeTruthy();
    });

    it('renders medication dosage and form', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('50mg - Comprimido')).toBeTruthy();
    });

    it('renders frequency as "Todos os dias" for daily', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('Todos os dias')).toBeTruthy();
    });

    it('renders frequency section title', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('FREQUÊNCIA')).toBeTruthy();
    });

    it('renders schedule times', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('08:00')).toBeTruthy();
      expect(getByText('20:00')).toBeTruthy();
    });

    it('renders schedule times section title', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('HORÁRIOS')).toBeTruthy();
    });

    it('renders instructions', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('INSTRUÇÕES')).toBeTruthy();
      expect(getByText('Tomar com agua')).toBeTruthy();
    });

    it('does not render instructions when not available', () => {
      mockMedications = [{ ...baseMedication, instructions: undefined }];
      const { queryByText } = render(<MedicationDetail />);
      expect(queryByText('INSTRUÇÕES')).toBeNull();
    });

    it('renders medication icon', () => {
      const { getByTestId } = render(<MedicationDetail />);
      expect(getByTestId('medication-icon')).toBeTruthy();
    });
  });

  describe('Specific days frequency', () => {
    it('renders frequency days for specific days type', () => {
      Object.assign(mockRouteParams, { medicationId: 'med-2' });
      mockMedications = [specificDaysMedication];
      const { getByText } = render(<MedicationDetail />);
      expect(getByText(/Segunda/)).toBeTruthy();
      expect(getByText(/Quarta/)).toBeTruthy();
      expect(getByText(/Sexta/)).toBeTruthy();
    });
  });

  describe('Today logs', () => {
    it('renders "Doses de hoje" when there are today logs', () => {
      mockMedications = [baseMedication];
      mockTodayLogs = [
        {
          id: 'log-1',
          medicationId: 'med-1',
          scheduledTime: '2025-01-01T08:00:00.000Z',
          status: 1, // Taken
        },
      ];
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('Doses de hoje')).toBeTruthy();
    });

    it('renders log time and status label', () => {
      mockMedications = [baseMedication];
      mockTodayLogs = [
        {
          id: 'log-1',
          medicationId: 'med-1',
          scheduledTime: '2025-01-01T08:00:00.000Z',
          status: 1,
        },
      ];
      const { getAllByText } = render(<MedicationDetail />);
      expect(getAllByText('08:00').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('Tomou').length).toBeGreaterThanOrEqual(1);
    });

    it('does not render "Doses de hoje" when no logs for this medication', () => {
      mockMedications = [baseMedication];
      mockTodayLogs = [
        {
          id: 'log-x',
          medicationId: 'other-med',
          scheduledTime: '2025-01-01T08:00:00.000Z',
          status: 0,
        },
      ];
      const { queryByText } = render(<MedicationDetail />);
      expect(queryByText('Doses de hoje')).toBeNull();
    });
  });

  describe('Action buttons', () => {
    beforeEach(() => {
      mockMedications = [baseMedication];
    });

    it('renders "Editar" button', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('Editar')).toBeTruthy();
    });

    it('renders "Desativar" button', () => {
      const { getByText } = render(<MedicationDetail />);
      expect(getByText('Desativar')).toBeTruthy();
    });

    it('navigates to edit form on "Editar" press', () => {
      const { getByText } = render(<MedicationDetail />);
      fireEvent.press(getByText('Editar'));
      expect(mockNavigate).toHaveBeenCalledWith('medicationForm', { medicationId: 'med-1' });
    });

    it('shows confirmation alert on "Desativar" press', () => {
      const { getByText } = render(<MedicationDetail />);
      fireEvent.press(getByText('Desativar'));
      expect(alertSpy).toHaveBeenCalledWith(
        'Desativar medicamento',
        expect.stringContaining('Losartana'),
        expect.any(Array)
      );
    });

    it('calls removeMedication on confirmation and goes back on success', async () => {
      mockRemoveMedication.mockResolvedValue(true);
      const { getByText } = render(<MedicationDetail />);
      fireEvent.press(getByText('Desativar'));

      // Get the "Desativar" button callback from the Alert
      const alertCall = alertSpy.mock.calls[0];
      const buttons = alertCall[2] as any[];
      const deactivateButton = buttons.find((b: any) => b.text === 'Desativar');

      await deactivateButton.onPress();

      expect(mockRemoveMedication).toHaveBeenCalledWith('med-1');
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('shows error alert if removeMedication fails', async () => {
      mockRemoveMedication.mockResolvedValue(false);
      const { getByText } = render(<MedicationDetail />);
      fireEvent.press(getByText('Desativar'));

      const alertCall = alertSpy.mock.calls[0];
      const buttons = alertCall[2] as any[];
      const deactivateButton = buttons.find((b: any) => b.text === 'Desativar');

      await deactivateButton.onPress();

      expect(mockRemoveMedication).toHaveBeenCalledWith('med-1');
      // Second alert call for the error
      expect(alertSpy).toHaveBeenCalledWith(
        'Erro',
        'Não foi possível desativar o medicamento.'
      );
    });

    it('does nothing on cancel in deactivate alert', () => {
      const { getByText } = render(<MedicationDetail />);
      fireEvent.press(getByText('Desativar'));

      const alertCall = alertSpy.mock.calls[0];
      const buttons = alertCall[2] as any[];
      const cancelButton = buttons.find((b: any) => b.text === 'Cancelar');
      // Cancel button has style 'cancel' and no onPress that does navigation
      expect(cancelButton.style).toBe('cancel');
    });
  });

  describe('Back navigation', () => {
    it('navigates back on header back button press', () => {
      mockMedications = [baseMedication];
      const rendered = render(<MedicationDetail />);
      // Get the first TouchableOpacity (back button)
      const touchables = rendered.UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      );
      fireEvent.press(touchables[0]);
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
