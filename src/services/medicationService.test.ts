/**
 * Testes unitários para medicationService.ts
 * Foco: funcionalidades reais (normalização de enums, chamadas API, CRUD)
 */

jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { api } from './api';
import {
  MedicationForm,
  MedicationFrequencyType,
  MedicationLogStatus,
  MedicationFormLabels,
  getMedicationDashboard,
  getActiveMedications,
  createMedication,
  updateMedication,
  deactivateMedication,
  logDose,
  getTodayLogs,
  getAdherence,
} from './medicationService';

// ============================================================
// Helpers
// ============================================================

function mockMedFromBackend(overrides: any = {}) {
  return {
    id: 'med-1',
    name: 'Losartana',
    dosage: '50mg',
    form: 'Comprimido',           // backend retorna string
    formDescription: 'Comprimido',
    frequencyType: 'Daily',       // backend retorna string
    frequencyDays: null,
    intervalHours: null,
    durationDays: null,
    scheduleTimes: ['08:00', '20:00'],
    instructions: null,
    totalQuantity: null,
    remainingQuantity: null,
    refillAlertThreshold: null,
    needsRefill: false,
    isActive: true,
    createdDate: '2026-04-07T00:00:00',
    ...overrides,
  };
}

function mockLogFromBackend(overrides: any = {}) {
  return {
    id: 'log-1',
    medicationId: 'med-1',
    medicationName: 'Losartana',
    medicationDosage: '50mg',
    medicationForm: 'Comprimido',
    scheduledTime: '2026-04-07T08:00:00',
    actionTime: null,
    status: 'Pending',            // backend retorna string
    ...overrides,
  };
}

describe('medicationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // Enums e Labels
  // ============================================================

  describe('Enums', () => {
    it('deve ter os valores corretos de MedicationForm', () => {
      expect(MedicationForm.Comprimido).toBe(1);
      expect(MedicationForm.Gotas).toBe(2);
      expect(MedicationForm.Injecao).toBe(3);
      expect(MedicationForm.Pomada).toBe(4);
      expect(MedicationForm.Capsula).toBe(5);
      expect(MedicationForm.Xarope).toBe(6);
    });

    it('deve ter os valores corretos de MedicationFrequencyType', () => {
      expect(MedicationFrequencyType.Daily).toBe(1);
      expect(MedicationFrequencyType.SpecificDays).toBe(2);
      expect(MedicationFrequencyType.IntervalHours).toBe(3);
    });

    it('deve ter os valores corretos de MedicationLogStatus', () => {
      expect(MedicationLogStatus.Pending).toBe(0);
      expect(MedicationLogStatus.Taken).toBe(1);
      expect(MedicationLogStatus.Skipped).toBe(2);
      expect(MedicationLogStatus.Missed).toBe(3);
    });

    it('deve ter labels para todas as formas de medicamento', () => {
      expect(MedicationFormLabels[MedicationForm.Comprimido]).toBe('Comprimido');
      expect(MedicationFormLabels[MedicationForm.Gotas]).toBe('Gotas');
      expect(MedicationFormLabels[MedicationForm.Injecao]).toBe('Injeção');
      expect(MedicationFormLabels[MedicationForm.Pomada]).toBe('Pomada');
      expect(MedicationFormLabels[MedicationForm.Capsula]).toBe('Cápsula');
      expect(MedicationFormLabels[MedicationForm.Xarope]).toBe('Xarope');
    });
  });

  // ============================================================
  // Normalização de enums (backend retorna strings)
  // ============================================================

  describe('Normalização de dados do backend', () => {
    it('deve converter frequencyType string para número ao buscar medicamentos', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [mockMedFromBackend({ frequencyType: 'IntervalHours' })] },
      });

      const result = await getActiveMedications();
      expect(result[0].frequencyType).toBe(MedicationFrequencyType.IntervalHours);
    });

    it('deve converter form string para número ao buscar medicamentos', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [mockMedFromBackend({ form: 'Capsula' })] },
      });

      const result = await getActiveMedications();
      expect(result[0].form).toBe(MedicationForm.Capsula);
    });

    it('deve converter status string para número nos logs do dashboard', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: {
            activeMedications: [mockMedFromBackend()],
            todayLogs: [
              mockLogFromBackend({ status: 'Taken' }),
              mockLogFromBackend({ id: 'log-2', status: 'Missed' }),
            ],
            needRefill: [],
            todayAdherencePercent: 50,
          },
        },
      });

      const result = await getMedicationDashboard();
      expect(result!.todayLogs[0].status).toBe(MedicationLogStatus.Taken);
      expect(result!.todayLogs[1].status).toBe(MedicationLogStatus.Missed);
    });

    it('deve converter status string para número nos logs do dia', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [mockLogFromBackend({ status: 'Skipped' })] },
      });

      const result = await getTodayLogs();
      expect(result[0].status).toBe(MedicationLogStatus.Skipped);
    });

    it('deve tratar status desconhecido como Pending', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [mockLogFromBackend({ status: 'Unknown' })] },
      });

      const result = await getTodayLogs();
      expect(result[0].status).toBe(MedicationLogStatus.Pending);
    });

    it('deve preservar valores numéricos já corretos', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [mockMedFromBackend({ form: 1, frequencyType: 2 })] },
      });

      const result = await getActiveMedications();
      expect(result[0].form).toBe(MedicationForm.Comprimido);
      expect(result[0].frequencyType).toBe(MedicationFrequencyType.SpecificDays);
    });
  });

  // ============================================================
  // Envio de dados para API (enums como string)
  // ============================================================

  describe('Envio de dados para o backend', () => {
    it('deve enviar form e frequencyType como string ao criar medicamento', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: mockMedFromBackend() },
      });

      await createMedication({
        name: 'Losartana',
        dosage: '50mg',
        form: MedicationForm.Comprimido,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['08:00'],
      });

      const sentData = (api.post as jest.Mock).mock.calls[0][1];
      expect(sentData.form).toBe('Comprimido');
      expect(sentData.frequencyType).toBe('Daily');
    });

    it('deve enviar IntervalHours com intervalHours e durationDays', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: mockMedFromBackend({ frequencyType: 'IntervalHours' }) },
      });

      await createMedication({
        name: 'Dipirona',
        dosage: '1g',
        form: MedicationForm.Comprimido,
        frequencyType: MedicationFrequencyType.IntervalHours,
        intervalHours: 8,
        durationDays: 7,
        scheduleTimes: ['08:00'],
      });

      const sentData = (api.post as jest.Mock).mock.calls[0][1];
      expect(sentData.frequencyType).toBe('IntervalHours');
      expect(sentData.intervalHours).toBe(8);
      expect(sentData.durationDays).toBe(7);
    });

    it('deve enviar status como string ao registrar dose', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: mockLogFromBackend({ status: 'Taken' }) },
      });

      await logDose({
        medicationId: 'med-1',
        scheduledTime: '2026-04-07T08:00:00',
        status: MedicationLogStatus.Taken,
      });

      const sentData = (api.post as jest.Mock).mock.calls[0][1];
      expect(sentData.status).toBe('Taken');
    });

    it('deve enviar form e frequencyType como string ao atualizar medicamento', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: mockMedFromBackend({ form: 'Xarope' }) },
      });

      await updateMedication('med-1', {
        name: 'Losartana',
        dosage: '50mg',
        form: MedicationForm.Xarope,
        frequencyType: MedicationFrequencyType.SpecificDays,
        frequencyDays: [1, 3, 5],
        scheduleTimes: ['09:00'],
      });

      const sentData = (api.put as jest.Mock).mock.calls[0][1];
      expect(sentData.form).toBe('Xarope');
      expect(sentData.frequencyType).toBe('SpecificDays');
    });
  });

  // ============================================================
  // CRUD - Dashboard
  // ============================================================

  describe('getMedicationDashboard', () => {
    it('deve retornar dashboard com dados normalizados', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: {
            activeMedications: [mockMedFromBackend()],
            todayLogs: [mockLogFromBackend({ status: 'Taken' })],
            needRefill: [],
            todayAdherencePercent: 100,
          },
        },
      });

      const result = await getMedicationDashboard();
      expect(result).not.toBeNull();
      expect(result!.activeMedications).toHaveLength(1);
      expect(result!.activeMedications[0].form).toBe(MedicationForm.Comprimido);
      expect(result!.todayLogs[0].status).toBe(MedicationLogStatus.Taken);
    });

    it('deve retornar null quando a API retorna 404', async () => {
      (api.get as jest.Mock).mockRejectedValue({ response: { status: 404 } });

      const result = await getMedicationDashboard();
      expect(result).toBeNull();
    });

    it('deve retornar null em caso de erro de rede', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      const result = await getMedicationDashboard();
      expect(result).toBeNull();
    });
  });

  // ============================================================
  // CRUD - Lista de medicamentos
  // ============================================================

  describe('getActiveMedications', () => {
    it('deve retornar lista vazia quando API falha', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Server Error'));

      const result = await getActiveMedications();
      expect(result).toEqual([]);
    });

    it('deve retornar medicamentos normalizados', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: [
            mockMedFromBackend({ form: 'Gotas', frequencyType: 'SpecificDays' }),
          ],
        },
      });

      const result = await getActiveMedications();
      expect(result[0].form).toBe(MedicationForm.Gotas);
      expect(result[0].frequencyType).toBe(MedicationFrequencyType.SpecificDays);
    });
  });

  // ============================================================
  // CRUD - Criar medicamento
  // ============================================================

  describe('createMedication', () => {
    it('deve chamar POST /medication e retornar o medicamento normalizado', async () => {
      const backendMed = mockMedFromBackend({ name: 'Novo Med' });
      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: backendMed },
      });

      const result = await createMedication({
        name: 'Novo Med',
        dosage: '10mg',
        form: MedicationForm.Capsula,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['12:00'],
      });

      expect(api.post).toHaveBeenCalledWith('medication', expect.any(Object));
      expect(result.form).toBe(MedicationForm.Comprimido); // normalizado do backend
    });

    it('deve propagar erro quando API falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Validation Error'));

      await expect(
        createMedication({
          name: '',
          dosage: '',
          form: MedicationForm.Comprimido,
          frequencyType: MedicationFrequencyType.Daily,
          scheduleTimes: ['08:00'],
        })
      ).rejects.toThrow();
    });
  });

  // ============================================================
  // CRUD - Atualizar medicamento
  // ============================================================

  describe('updateMedication', () => {
    it('deve chamar PUT /medication/:id com dados convertidos', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: mockMedFromBackend() },
      });

      await updateMedication('med-1', {
        name: 'Losartana',
        dosage: '100mg',
        form: MedicationForm.Comprimido,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['08:00'],
      });

      expect(api.put).toHaveBeenCalledWith('medication/med-1', expect.objectContaining({
        form: 'Comprimido',
        frequencyType: 'Daily',
      }));
    });

    it('deve propagar erro quando API falha', async () => {
      (api.put as jest.Mock).mockRejectedValue(new Error('Not Found'));

      await expect(
        updateMedication('invalid-id', {
          name: 'Test',
          dosage: '10mg',
          form: MedicationForm.Comprimido,
          frequencyType: MedicationFrequencyType.Daily,
          scheduleTimes: ['08:00'],
        })
      ).rejects.toThrow();
    });
  });

  // ============================================================
  // CRUD - Desativar medicamento
  // ============================================================

  describe('deactivateMedication', () => {
    it('deve chamar DELETE /medication/:id e retornar true', async () => {
      (api.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await deactivateMedication('med-1');
      expect(result).toBe(true);
      expect(api.delete).toHaveBeenCalledWith('medication/med-1');
    });

    it('deve retornar false quando API falha', async () => {
      (api.delete as jest.Mock).mockRejectedValue(new Error('Server Error'));

      const result = await deactivateMedication('med-1');
      expect(result).toBe(false);
    });
  });

  // ============================================================
  // Registrar dose
  // ============================================================

  describe('logDose', () => {
    it('deve registrar dose como Taken e normalizar resposta', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: mockLogFromBackend({ status: 'Taken', actionTime: '2026-04-07T08:05:00' }),
        },
      });

      const result = await logDose({
        medicationId: 'med-1',
        scheduledTime: '2026-04-07T08:00:00',
        status: MedicationLogStatus.Taken,
      });

      expect(result).not.toBeNull();
      expect(result!.status).toBe(MedicationLogStatus.Taken);
    });

    it('deve registrar dose como Skipped', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: mockLogFromBackend({ status: 'Skipped' }),
        },
      });

      const result = await logDose({
        medicationId: 'med-1',
        scheduledTime: '2026-04-07T08:00:00',
        status: MedicationLogStatus.Skipped,
      });

      expect(result!.status).toBe(MedicationLogStatus.Skipped);
      const sentData = (api.post as jest.Mock).mock.calls[0][1];
      expect(sentData.status).toBe('Skipped');
    });

    it('deve retornar null quando API falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Server Error'));

      const result = await logDose({
        medicationId: 'med-1',
        scheduledTime: '2026-04-07T08:00:00',
        status: MedicationLogStatus.Taken,
      });

      expect(result).toBeNull();
    });
  });

  // ============================================================
  // Adesão
  // ============================================================

  describe('getAdherence', () => {
    it('deve buscar adesão do mês e retornar dados', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: {
            dailyAdherence: { '2026-04-01': 100, '2026-04-02': 50 },
            monthlyAverage: 75,
            byMedication: [
              { medicationId: 'med-1', medicationName: 'Losartana', adherencePercent: 80, totalDoses: 10, takenDoses: 8 },
            ],
          },
        },
      });

      const result = await getAdherence(4, 2026);
      expect(api.get).toHaveBeenCalledWith('medication/adherence?month=4&year=2026');
      expect(result).not.toBeNull();
      expect(result!.monthlyAverage).toBe(75);
      expect(result!.byMedication).toHaveLength(1);
    });

    it('deve retornar null quando API falha', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Server Error'));

      const result = await getAdherence(4, 2026);
      expect(result).toBeNull();
    });
  });
});
