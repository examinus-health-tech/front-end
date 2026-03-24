import React, { useContext } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { MedicationContext, MedicationContextProvider } from './MedicationContext';

// Mock do medicationService
jest.mock('src/services/medicationService', () => ({
  MedicationLogStatus: {
    Pending: 0,
    Taken: 1,
    Skipped: 2,
    Missed: 3,
  },
  getMedicationDashboard: jest.fn(),
  getActiveMedications: jest.fn(),
  createMedication: jest.fn(),
  updateMedication: jest.fn(),
  deactivateMedication: jest.fn(),
  logDose: jest.fn(),
  getTodayLogs: jest.fn(),
  getAdherence: jest.fn(),
}));

// Mock do medicationNotificationService
jest.mock('src/services/medicationNotificationService', () => ({
  scheduleMedicationNotifications: jest.fn().mockResolvedValue(undefined),
  cancelMedicationNotifications: jest.fn().mockResolvedValue(undefined),
  rescheduleAllMedicationNotifications: jest.fn().mockResolvedValue(undefined),
}));

import {
  getMedicationDashboard,
  getActiveMedications,
  createMedication,
  updateMedication,
  deactivateMedication,
  logDose,
  getTodayLogs,
  getAdherence,
  MedicationLogStatus,
} from 'src/services/medicationService';

import {
  scheduleMedicationNotifications,
  cancelMedicationNotifications,
  rescheduleAllMedicationNotifications,
} from 'src/services/medicationNotificationService';

const mockGetDashboard = getMedicationDashboard as jest.MockedFunction<typeof getMedicationDashboard>;
const mockGetActiveMeds = getActiveMedications as jest.MockedFunction<typeof getActiveMedications>;
const mockCreateMed = createMedication as jest.MockedFunction<typeof createMedication>;
const mockUpdateMed = updateMedication as jest.MockedFunction<typeof updateMedication>;
const mockDeactivateMed = deactivateMedication as jest.MockedFunction<typeof deactivateMedication>;
const mockLogDose = logDose as jest.MockedFunction<typeof logDose>;
const mockGetTodayLogs = getTodayLogs as jest.MockedFunction<typeof getTodayLogs>;
const mockGetAdherence = getAdherence as jest.MockedFunction<typeof getAdherence>;

function useMedicationContext() {
  return useContext(MedicationContext);
}

const mockMedication = {
  id: 'med-1',
  name: 'Paracetamol',
  dosage: '500mg',
  form: 1,
  formDescription: 'Comprimido',
  frequencyType: 1,
  scheduleTimes: ['08:00', '20:00'],
  instructions: 'Tomar com agua',
  totalQuantity: 30,
  remainingQuantity: 25,
  refillAlertThreshold: 5,
  needsRefill: false,
  isActive: true,
  createdDate: '2024-01-01',
};

const mockMedication2 = {
  id: 'med-2',
  name: 'Vitamina D',
  dosage: '1000UI',
  form: 5,
  formDescription: 'Capsula',
  frequencyType: 1,
  scheduleTimes: ['12:00'],
  totalQuantity: 60,
  remainingQuantity: 50,
  refillAlertThreshold: 10,
  needsRefill: false,
  isActive: true,
  createdDate: '2024-01-15',
};

const mockLog = {
  id: 'log-1',
  medicationId: 'med-1',
  medicationName: 'Paracetamol',
  medicationDosage: '500mg',
  medicationForm: 1,
  scheduledTime: '08:00',
  status: 0, // Pending
};

const mockLog2 = {
  id: 'log-2',
  medicationId: 'med-2',
  medicationName: 'Vitamina D',
  medicationDosage: '1000UI',
  medicationForm: 5,
  scheduledTime: '12:00',
  status: 0, // Pending
};

const mockDashboard = {
  activeMedications: [mockMedication, mockMedication2] as any,
  todayLogs: [mockLog, mockLog2] as any,
  needRefill: [],
  todayAdherencePercent: 0,
};

describe('MedicationContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MedicationContextProvider>{children}</MedicationContextProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve iniciar com dashboard null', () => {
      const { result } = renderHook(() => useMedicationContext(), { wrapper });
      expect(result.current.dashboard).toBeNull();
    });

    it('deve iniciar com medications vazio', () => {
      const { result } = renderHook(() => useMedicationContext(), { wrapper });
      expect(result.current.medications).toEqual([]);
    });

    it('deve iniciar com todayLogs vazio', () => {
      const { result } = renderHook(() => useMedicationContext(), { wrapper });
      expect(result.current.todayLogs).toEqual([]);
    });

    it('deve iniciar com adherence null', () => {
      const { result } = renderHook(() => useMedicationContext(), { wrapper });
      expect(result.current.adherence).toBeNull();
    });

    it('deve iniciar com isLoading false', () => {
      const { result } = renderHook(() => useMedicationContext(), { wrapper });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('refreshDashboard', () => {
    it('deve buscar e armazenar dados do dashboard com sucesso', async () => {
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      expect(result.current.dashboard).toEqual(mockDashboard);
      expect(result.current.medications).toEqual(mockDashboard.activeMedications);
      expect(result.current.todayLogs).toEqual(mockDashboard.todayLogs);
      expect(result.current.isLoading).toBe(false);
    });

    it('deve sincronizar notificacoes ao buscar dashboard', async () => {
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      expect(rescheduleAllMedicationNotifications).toHaveBeenCalledWith(mockDashboard.activeMedications);
    });

    it('deve tratar erro ao buscar dashboard sem quebrar', async () => {
      mockGetDashboard.mockRejectedValueOnce(new Error('Erro de rede'));

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      expect(result.current.dashboard).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar dashboard null graciosamente', async () => {
      mockGetDashboard.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      expect(result.current.dashboard).toBeNull();
      expect(result.current.medications).toEqual([]);
    });

    it('deve continuar mesmo se sincronizacao de notificacoes falhar', async () => {
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);
      (rescheduleAllMedicationNotifications as jest.Mock).mockRejectedValueOnce(
        new Error('Notification error')
      );

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      // Dashboard deve ter sido atualizado mesmo com erro de notificacao
      expect(result.current.dashboard).toEqual(mockDashboard);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('refreshMedications', () => {
    it('deve buscar medicamentos ativos com sucesso', async () => {
      mockGetActiveMeds.mockResolvedValueOnce([mockMedication, mockMedication2] as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshMedications();
      });

      expect(result.current.medications).toHaveLength(2);
      expect(result.current.medications[0].name).toBe('Paracetamol');
    });

    it('deve tratar erro ao buscar medicamentos sem quebrar', async () => {
      mockGetActiveMeds.mockRejectedValueOnce(new Error('Erro'));

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshMedications();
      });

      expect(result.current.medications).toEqual([]);
    });
  });

  describe('refreshTodayLogs', () => {
    it('deve buscar logs de hoje com sucesso', async () => {
      mockGetTodayLogs.mockResolvedValueOnce([mockLog, mockLog2] as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshTodayLogs();
      });

      expect(result.current.todayLogs).toHaveLength(2);
    });

    it('deve tratar erro ao buscar logs sem quebrar', async () => {
      mockGetTodayLogs.mockRejectedValueOnce(new Error('Erro'));

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshTodayLogs();
      });

      expect(result.current.todayLogs).toEqual([]);
    });
  });

  describe('loadAdherence', () => {
    const mockAdherenceData = {
      dailyAdherence: { '2024-01-01': 100, '2024-01-02': 50 },
      monthlyAverage: 75,
      byMedication: [
        {
          medicationId: 'med-1',
          medicationName: 'Paracetamol',
          adherencePercent: 80,
          totalDoses: 60,
          takenDoses: 48,
        },
      ],
    };

    it('deve carregar dados de adesao com sucesso', async () => {
      mockGetAdherence.mockResolvedValueOnce(mockAdherenceData as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.loadAdherence(1, 2024);
      });

      expect(mockGetAdherence).toHaveBeenCalledWith(1, 2024);
      expect(result.current.adherence).toEqual(mockAdherenceData);
    });

    it('deve tratar erro ao carregar adesao sem quebrar', async () => {
      mockGetAdherence.mockRejectedValueOnce(new Error('Erro'));

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.loadAdherence(1, 2024);
      });

      expect(result.current.adherence).toBeNull();
    });
  });

  describe('addMedication', () => {
    const mockRequest = {
      name: 'Ibuprofeno',
      dosage: '400mg',
      form: 1,
      frequencyType: 1,
      scheduleTimes: ['09:00'],
    } as any;

    it('deve criar medicamento e agendar notificacoes', async () => {
      const newMed = { ...mockMedication, id: 'med-new', name: 'Ibuprofeno' };
      mockCreateMed.mockResolvedValueOnce(newMed as any);
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      let createdMed: any;
      await act(async () => {
        createdMed = await result.current.addMedication(mockRequest);
      });

      expect(mockCreateMed).toHaveBeenCalledWith(mockRequest);
      expect(scheduleMedicationNotifications).toHaveBeenCalledWith(newMed);
      expect(createdMed).toEqual(newMed);
      // Deve ter chamado refreshDashboard
      expect(mockGetDashboard).toHaveBeenCalled();
    });

    it('deve criar medicamento mesmo se agendamento de notificacoes falhar', async () => {
      const newMed = { ...mockMedication, id: 'med-new' };
      mockCreateMed.mockResolvedValueOnce(newMed as any);
      (scheduleMedicationNotifications as jest.Mock).mockRejectedValueOnce(new Error('Notification error'));
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      let createdMed: any;
      await act(async () => {
        createdMed = await result.current.addMedication(mockRequest);
      });

      expect(createdMed).toEqual(newMed);
    });

    it('deve propagar erro quando criacao falha', async () => {
      mockCreateMed.mockRejectedValueOnce(new Error('Erro ao criar'));

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await expect(
        act(async () => {
          await result.current.addMedication(mockRequest);
        })
      ).rejects.toThrow('Erro ao criar');
    });
  });

  describe('editMedication', () => {
    const mockRequest = {
      name: 'Paracetamol',
      dosage: '750mg',
      form: 1,
      frequencyType: 1,
      scheduleTimes: ['08:00', '16:00'],
    } as any;

    it('deve editar medicamento e reagendar notificacoes', async () => {
      const updatedMed = { ...mockMedication, dosage: '750mg' };
      mockUpdateMed.mockResolvedValueOnce(updatedMed as any);
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      let editedMed: any;
      await act(async () => {
        editedMed = await result.current.editMedication('med-1', mockRequest);
      });

      expect(mockUpdateMed).toHaveBeenCalledWith('med-1', mockRequest);
      expect(scheduleMedicationNotifications).toHaveBeenCalledWith(updatedMed);
      expect(editedMed.dosage).toBe('750mg');
    });

    it('deve propagar erro quando edicao falha', async () => {
      mockUpdateMed.mockRejectedValueOnce(new Error('Medicamento nao encontrado'));

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await expect(
        act(async () => {
          await result.current.editMedication('med-inexistente', mockRequest);
        })
      ).rejects.toThrow('Medicamento nao encontrado');
    });
  });

  describe('removeMedication', () => {
    it('deve remover medicamento e cancelar notificacoes quando desativacao bem-sucedida', async () => {
      mockDeactivateMed.mockResolvedValueOnce(true);
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.removeMedication('med-1');
      });

      expect(success).toBe(true);
      expect(cancelMedicationNotifications).toHaveBeenCalledWith('med-1');
      expect(mockGetDashboard).toHaveBeenCalled();
    });

    it('deve nao cancelar notificacoes quando desativacao falha', async () => {
      mockDeactivateMed.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      let success: boolean = true;
      await act(async () => {
        success = await result.current.removeMedication('med-1');
      });

      expect(success).toBe(false);
      expect(cancelMedicationNotifications).not.toHaveBeenCalled();
    });

    it('deve continuar mesmo se cancelamento de notificacoes falhar', async () => {
      mockDeactivateMed.mockResolvedValueOnce(true);
      (cancelMedicationNotifications as jest.Mock).mockRejectedValueOnce(new Error('Notification error'));
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.removeMedication('med-1');
      });

      expect(success).toBe(true);
    });
  });

  describe('registerDose', () => {
    it('deve registrar dose e atualizar logs otimisticamente', async () => {
      const mockLogResult = { id: 'log-result-1', medicationId: 'med-1', scheduledTime: '08:00', status: 1 };
      mockLogDose.mockResolvedValueOnce(mockLogResult as any);

      // Primeiro, popular todayLogs via dashboard
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      const doseData = {
        medicationId: 'med-1',
        scheduledTime: '08:00',
        status: MedicationLogStatus.Taken,
      };

      let logResult: any;
      await act(async () => {
        logResult = await result.current.registerDose(doseData);
      });

      expect(mockLogDose).toHaveBeenCalledWith(doseData);
      expect(logResult).toEqual(mockLogResult);

      // Verificar atualizacao otimista dos logs
      const updatedLog = result.current.todayLogs.find(l => l.medicationId === 'med-1');
      expect(updatedLog?.status).toBe(MedicationLogStatus.Taken);
    });

    it('deve decrementar quantidade restante quando dose e Taken', async () => {
      mockLogDose.mockResolvedValueOnce({ id: 'log-result-1' } as any);
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      const initialQuantity = result.current.medications.find(m => m.id === 'med-1')?.remainingQuantity;

      await act(async () => {
        await result.current.registerDose({
          medicationId: 'med-1',
          scheduledTime: '08:00',
          status: MedicationLogStatus.Taken,
        });
      });

      const updatedMed = result.current.medications.find(m => m.id === 'med-1');
      expect(updatedMed?.remainingQuantity).toBe(initialQuantity! - 1);
    });

    it('deve marcar needsRefill quando quantidade cai abaixo do limite', async () => {
      const medNearRefill = {
        ...mockMedication,
        remainingQuantity: 6,
        refillAlertThreshold: 5,
      };
      const dashboardNearRefill = {
        ...mockDashboard,
        activeMedications: [medNearRefill],
      };

      mockGetDashboard.mockResolvedValueOnce(dashboardNearRefill as any);
      mockLogDose.mockResolvedValueOnce({ id: 'log-result-1' } as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      await act(async () => {
        await result.current.registerDose({
          medicationId: 'med-1',
          scheduledTime: '08:00',
          status: MedicationLogStatus.Taken,
        });
      });

      const updatedMed = result.current.medications.find(m => m.id === 'med-1');
      expect(updatedMed?.remainingQuantity).toBe(5);
      expect(updatedMed?.needsRefill).toBe(true);
    });

    it('nao deve decrementar quantidade quando dose e Skipped', async () => {
      mockLogDose.mockResolvedValueOnce({ id: 'log-result-1' } as any);
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      const initialQuantity = result.current.medications.find(m => m.id === 'med-1')?.remainingQuantity;

      await act(async () => {
        await result.current.registerDose({
          medicationId: 'med-1',
          scheduledTime: '08:00',
          status: MedicationLogStatus.Skipped,
        });
      });

      const updatedMed = result.current.medications.find(m => m.id === 'med-1');
      expect(updatedMed?.remainingQuantity).toBe(initialQuantity);
    });

    it('deve propagar erro quando logDose falha', async () => {
      mockLogDose.mockRejectedValueOnce(new Error('Erro ao registrar dose'));

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await expect(
        act(async () => {
          await result.current.registerDose({
            medicationId: 'med-1',
            scheduledTime: '08:00',
            status: MedicationLogStatus.Taken,
          });
        })
      ).rejects.toThrow('Erro ao registrar dose');
    });
  });

  describe('clearMedicationData', () => {
    it('deve limpar todos os dados de medicacao', async () => {
      mockGetDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useMedicationContext(), { wrapper });

      await act(async () => {
        await result.current.refreshDashboard();
      });

      expect(result.current.dashboard).not.toBeNull();
      expect(result.current.medications).not.toEqual([]);

      act(() => {
        result.current.clearMedicationData();
      });

      expect(result.current.dashboard).toBeNull();
      expect(result.current.medications).toEqual([]);
      expect(result.current.todayLogs).toEqual([]);
      expect(result.current.adherence).toBeNull();
    });
  });
});
