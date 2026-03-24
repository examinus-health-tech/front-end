import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MedicationTimeline } from './medicationTimeline';
import { MedicationLogStatus, MedicationForm } from 'src/services/medicationService';

// ── Mock NativeBase ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: ({ children, refreshControl, ...rest }: any) => (
      <RN.ScrollView refreshControl={refreshControl} {...rest}>{children}</RN.ScrollView>
    ),
    Progress: (props: any) => <RN.View testID="progress-bar" {...props} />,
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
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
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
  format: jest.fn((date: any, fmt: string) => {
    if (fmt === 'HH:mm') return '08:00';
    if (fmt.includes('EEE')) return 'seg, 20 de mar';
    return 'mocked-date';
  }),
  differenceInMinutes: jest.fn(() => 30),
  isPast: jest.fn(() => false),
  isToday: jest.fn(() => true),
  parseISO: jest.fn((s: string) => new Date(s)),
}));

jest.mock('date-fns/locale', () => ({
  ptBR: {},
}));

// ── Mock medication notification service ──
jest.mock('src/services/medicationNotificationService', () => ({
  requestNotificationPermission: jest.fn().mockResolvedValue(true),
}));

// ── Mock medication service (for enum values) ──
jest.mock('src/services/medicationService', () => ({
  MedicationLogStatus: {
    Pending: 0,
    Taken: 1,
    Skipped: 2,
    Missed: 3,
  },
  MedicationForm: {
    Comprimido: 1,
    Gotas: 2,
    Injecao: 3,
    Pomada: 4,
    Capsula: 5,
    Xarope: 6,
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
    CheckCircleIcon: (props: any) => <RN.View testID="check-circle-icon" {...props} />,
    ChevronLeftIcon: (props: any) => <RN.View testID="chevron-left-icon" {...props} />,
    ClockIcon: (props: any) => <RN.View testID="clock-icon" {...props} />,
    PillIcon: (props: any) => <RN.View testID="pill-icon" {...props} />,
    WarningIcon: (props: any) => <RN.View testID="warning-icon" {...props} />,
    ClockSquareIcon: (props: any) => <RN.View testID="clock-square-icon" {...props} />,
  };
});

// ── Mock atoms ──
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    CustomRefreshControl: (props: any) => <RN.View {...props} />,
  };
});

// ── Mock routes ──
jest.mock('@routes/app.routes', () => ({}));

// ── Mock hooks ──
const mockRefreshDashboard = jest.fn().mockResolvedValue(undefined);
const mockRegisterDose = jest.fn().mockResolvedValue(undefined);
let mockTodayLogs: any[] = [];
let mockMedications: any[] = [];
let mockDashboard: any = null;
let mockIsLoading = false;

jest.mock('src/hooks/useMedication', () => ({
  useMedication: () => ({
    todayLogs: mockTodayLogs,
    medications: mockMedications,
    dashboard: mockDashboard,
    isLoading: mockIsLoading,
    refreshDashboard: mockRefreshDashboard,
    registerDose: mockRegisterDose,
  }),
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { fullName: 'Maria Silva' },
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockTodayLogs = [];
  mockMedications = [];
  mockDashboard = null;
  mockIsLoading = false;
});

// ────────────── TESTS ──────────────

describe('MedicationTimeline', () => {
  const pendingLog = {
    id: 'log-1',
    medicationId: 'med-1',
    medicationName: 'Losartana',
    medicationDosage: '50mg',
    medicationForm: 1,
    scheduledTime: '2025-01-01T08:00:00.000Z',
    status: MedicationLogStatus.Pending,
  };

  const takenLog = {
    id: 'log-2',
    medicationId: 'med-2',
    medicationName: 'Vitamina D',
    medicationDosage: '2000 UI',
    medicationForm: 5,
    scheduledTime: '2025-01-01T12:00:00.000Z',
    status: MedicationLogStatus.Taken,
    actionTime: '2025-01-01T12:05:00.000Z',
  };

  const missedLog = {
    id: 'log-3',
    medicationId: 'med-3',
    medicationName: 'Dipirona',
    medicationDosage: '20 gotas',
    medicationForm: 2,
    scheduledTime: '2025-01-01T09:00:00.000Z',
    status: MedicationLogStatus.Missed,
  };

  const baseMedication = {
    id: 'med-1',
    name: 'Losartana',
    dosage: '50mg',
    form: 1,
    isActive: true,
    scheduleTimes: ['08:00'],
  };

  describe('Empty state', () => {
    it('renders empty state when no medications', () => {
      mockMedications = [];
      mockIsLoading = false;
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Nenhum medicamento cadastrado')).toBeTruthy();
    });

    it('renders add medication button in empty state', () => {
      mockMedications = [];
      mockIsLoading = false;
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Adicionar medicamento')).toBeTruthy();
    });

    it('navigates to medication form on add button press in empty state', () => {
      mockMedications = [];
      mockIsLoading = false;
      const { getByText } = render(<MedicationTimeline />);
      fireEvent.press(getByText('Adicionar medicamento'));
      expect(mockNavigate).toHaveBeenCalledWith('medicationForm');
    });
  });

  describe('Greeting', () => {
    it('renders greeting with user first name', () => {
      mockMedications = [];
      const { getByText } = render(<MedicationTimeline />);
      // "Bom dia" or "Boa tarde" or "Boa noite" depending on time + first name
      expect(getByText(/Maria/)).toBeTruthy();
    });

    it('renders BETA badge', () => {
      mockMedications = [];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('BETA')).toBeTruthy();
    });
  });

  describe('With medication data', () => {
    beforeEach(() => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 75 };
    });

    it('renders "Histórico" button when has data', () => {
      mockTodayLogs = [pendingLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Histórico')).toBeTruthy();
    });

    it('navigates to medicationAdherence on Histórico press', () => {
      mockTodayLogs = [pendingLog];
      const { getByText } = render(<MedicationTimeline />);
      fireEvent.press(getByText('Histórico'));
      expect(mockNavigate).toHaveBeenCalledWith('medicationAdherence');
    });

    it('renders "Adicionar medicamento" button', () => {
      mockTodayLogs = [pendingLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Adicionar medicamento')).toBeTruthy();
    });
  });

  describe('Day progress', () => {
    it('renders progress section when dashboard and logs exist', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 50 };
      mockTodayLogs = [pendingLog, takenLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Progresso do dia')).toBeTruthy();
    });

    it('shows taken count out of total doses', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 50 };
      mockTodayLogs = [pendingLog, takenLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('1 de 2 doses tomadas')).toBeTruthy();
    });
  });

  describe('Next pending dose (hero card)', () => {
    it('renders next pending dose card', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 0 };
      mockTodayLogs = [pendingLog];
      const { getAllByText } = render(<MedicationTimeline />);
      expect(getAllByText('Losartana').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('Tomei').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('Pular').length).toBeGreaterThanOrEqual(1);
    });

    it('calls registerDose with Taken on "Tomei" press', async () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 0 };
      mockTodayLogs = [pendingLog];
      const { getByText } = render(<MedicationTimeline />);
      fireEvent.press(getByText('Tomei'));
      await waitFor(() => {
        expect(mockRegisterDose).toHaveBeenCalledWith(
          expect.objectContaining({
            medicationId: 'med-1',
            status: MedicationLogStatus.Taken,
          })
        );
      });
    });

    it('calls registerDose with Skipped on "Pular" press', async () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 0 };
      mockTodayLogs = [pendingLog];
      const { getByText } = render(<MedicationTimeline />);
      fireEvent.press(getByText('Pular'));
      await waitFor(() => {
        expect(mockRegisterDose).toHaveBeenCalledWith(
          expect.objectContaining({
            medicationId: 'med-1',
            status: MedicationLogStatus.Skipped,
          })
        );
      });
    });

    it('renders "Tudo em dia!" when no pending doses', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 100 };
      mockTodayLogs = [takenLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Tudo em dia!')).toBeTruthy();
    });
  });

  describe('Missed doses alert', () => {
    it('renders missed dose alert', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 0 };
      mockTodayLogs = [missedLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText(/Você esqueceu a dose/)).toBeTruthy();
    });

    it('renders "Registrar dose" button for missed dose', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 0 };
      mockTodayLogs = [missedLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Registrar dose')).toBeTruthy();
    });

    it('registers missed dose as Taken on press', async () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 0 };
      mockTodayLogs = [missedLog];
      const { getByText } = render(<MedicationTimeline />);
      fireEvent.press(getByText('Registrar dose'));
      await waitFor(() => {
        expect(mockRegisterDose).toHaveBeenCalledWith(
          expect.objectContaining({
            medicationId: 'med-3',
            status: MedicationLogStatus.Taken,
          })
        );
      });
    });
  });

  describe('Checklist', () => {
    it('renders checklist section title', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 50 };
      mockTodayLogs = [pendingLog, takenLog];
      const { getByText } = render(<MedicationTimeline />);
      expect(getByText('Checklist do dia')).toBeTruthy();
    });

    it('renders medication names in checklist', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 50 };
      mockTodayLogs = [pendingLog, takenLog];
      const { getAllByText } = render(<MedicationTimeline />);
      expect(getAllByText('Losartana').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('Vitamina D').length).toBeGreaterThanOrEqual(1);
    });

    it('navigates to medication detail on checklist item press', () => {
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 50 };
      mockTodayLogs = [takenLog];
      const { getByText } = render(<MedicationTimeline />);
      fireEvent.press(getByText('Vitamina D'));
      expect(mockNavigate).toHaveBeenCalledWith('medicationDetail', { medicationId: 'med-2' });
    });
  });

  describe('Dose registered feedback', () => {
    it('handles registerDose error gracefully', async () => {
      mockRegisterDose.mockRejectedValue(new Error('Network'));
      mockMedications = [baseMedication];
      mockDashboard = { todayAdherencePercent: 0 };
      mockTodayLogs = [pendingLog];
      const { getByText } = render(<MedicationTimeline />);
      fireEvent.press(getByText('Tomei'));
      // Should not crash
      await waitFor(() => {
        expect(mockRegisterDose).toHaveBeenCalled();
      });
    });
  });
});
