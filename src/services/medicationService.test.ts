/**
 * Testes unitários para medicationService.ts
 */

// Mocks devem vir antes dos imports
jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import {
  getMedicationDashboard,
  getActiveMedications,
  createMedication,
  updateMedication,
  deactivateMedication,
  logDose,
  getTodayLogs,
  resetMockData,
  getAdherence,
  MedicationForm,
  MedicationFrequencyType,
  MedicationLogStatus,
  MedicationFormLabels,
  MedicationFormIconNames,
  MEDICATION_CACHE_KEY,
  MedicationDTO,
  MedicationRequestDTO,
  MedicationLogRequestDTO,
} from './medicationService';

// Helper: como USE_MOCK = true, todas as funções seguem o path mock
// Para testar o path da API, precisaríamos alterar USE_MOCK — porém, como é const,
// cobrimos os caminhos mock e verificamos que os mocks de AsyncStorage são chamados corretamente.

const mockMed: MedicationDTO = {
  id: 'med-1',
  name: 'Losartana',
  dosage: '50mg',
  form: MedicationForm.Comprimido,
  formDescription: 'Comprimido',
  frequencyType: MedicationFrequencyType.Daily,
  scheduleTimes: ['08:00', '20:00'],
  instructions: 'Tomar com agua',
  totalQuantity: 60,
  remainingQuantity: 20,
  refillAlertThreshold: 10,
  needsRefill: false,
  isActive: true,
  createdDate: '2025-01-01T00:00:00.000Z',
};

const mockInactiveMed: MedicationDTO = {
  ...mockMed,
  id: 'med-inactive',
  name: 'Inativo',
  isActive: false,
};

const mockSpecificDaysMed: MedicationDTO = {
  ...mockMed,
  id: 'med-specific',
  name: 'Dipirona',
  form: MedicationForm.Gotas,
  frequencyType: MedicationFrequencyType.SpecificDays,
  frequencyDays: [new Date().getDay()], // Hoje
  scheduleTimes: ['09:00'],
  totalQuantity: undefined,
  remainingQuantity: undefined,
  refillAlertThreshold: undefined,
};

const MOCK_MEDS_KEY = '@examinus:mock_medications';
const MOCK_LOGS_KEY = '@examinus:mock_medication_logs';

describe('medicationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
    // @ts-ignore - __DEV__ global
    global.__DEV__ = true;
  });

  // ============================================================
  // Enums e constantes
  // ============================================================

  describe('Enums e constantes exportadas', () => {
    it('deve ter os valores corretos para MedicationForm', () => {
      expect(MedicationForm.Comprimido).toBe(1);
      expect(MedicationForm.Gotas).toBe(2);
      expect(MedicationForm.Injecao).toBe(3);
      expect(MedicationForm.Pomada).toBe(4);
      expect(MedicationForm.Capsula).toBe(5);
      expect(MedicationForm.Xarope).toBe(6);
    });

    it('deve ter os valores corretos para MedicationFrequencyType', () => {
      expect(MedicationFrequencyType.Daily).toBe(1);
      expect(MedicationFrequencyType.SpecificDays).toBe(2);
    });

    it('deve ter os valores corretos para MedicationLogStatus', () => {
      expect(MedicationLogStatus.Pending).toBe(0);
      expect(MedicationLogStatus.Taken).toBe(1);
      expect(MedicationLogStatus.Skipped).toBe(2);
      expect(MedicationLogStatus.Missed).toBe(3);
    });

    it('deve ter labels corretos para cada forma de medicamento', () => {
      expect(MedicationFormLabels[MedicationForm.Comprimido]).toBe('Comprimido');
      expect(MedicationFormLabels[MedicationForm.Gotas]).toBe('Gotas');
      expect(MedicationFormLabels[MedicationForm.Injecao]).toBe('Injeção');
      expect(MedicationFormLabels[MedicationForm.Pomada]).toBe('Pomada');
      expect(MedicationFormLabels[MedicationForm.Capsula]).toBe('Cápsula');
      expect(MedicationFormLabels[MedicationForm.Xarope]).toBe('Xarope');
    });

    it('deve ter nomes de ícones corretos para cada forma', () => {
      expect(MedicationFormIconNames[MedicationForm.Comprimido]).toBe('pill');
      expect(MedicationFormIconNames[MedicationForm.Gotas]).toBe('waterDropFilled');
      expect(MedicationFormIconNames[MedicationForm.Injecao]).toBe('syringe');
      expect(MedicationFormIconNames[MedicationForm.Pomada]).toBe('bandAid');
      expect(MedicationFormIconNames[MedicationForm.Capsula]).toBe('pillSquareDouble');
      expect(MedicationFormIconNames[MedicationForm.Xarope]).toBe('flaskRound');
    });

    it('deve exportar a chave de cache correta', () => {
      expect(MEDICATION_CACHE_KEY).toBe('@examinus:medication_dashboard');
    });
  });

  // ============================================================
  // getMedicationDashboard
  // ============================================================

  describe('getMedicationDashboard', () => {
    it('deve retornar dashboard com seed data quando storage está vazio', async () => {
      // Storage vazio => ensureSeedData vai criar dados
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getMedicationDashboard();

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('activeMedications');
      expect(result).toHaveProperty('todayLogs');
      expect(result).toHaveProperty('needRefill');
      expect(result).toHaveProperty('todayAdherencePercent');
      expect(Array.isArray(result!.activeMedications)).toBe(true);
      expect(Array.isArray(result!.todayLogs)).toBe(true);
    });

    it('deve retornar dashboard com medicamentos existentes', async () => {
      const meds = [mockMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getMedicationDashboard();

      expect(result).not.toBeNull();
      expect(result!.activeMedications).toHaveLength(1);
      expect(result!.activeMedications[0].name).toBe('Losartana');
    });

    it('deve filtrar medicamentos inativos do dashboard', async () => {
      const meds = [mockMed, mockInactiveMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getMedicationDashboard();

      expect(result!.activeMedications).toHaveLength(1);
      expect(result!.activeMedications[0].id).toBe('med-1');
    });

    it('deve calcular aderência como 0 quando não há logs', async () => {
      const meds = [{ ...mockMed, scheduleTimes: [] }]; // Sem horários = sem logs
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getMedicationDashboard();

      expect(result!.todayAdherencePercent).toBe(0);
    });

    it('deve identificar medicamentos que precisam de refill', async () => {
      const needsRefillMed = { ...mockMed, needsRefill: true, remainingQuantity: 5 };
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([needsRefillMed]));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getMedicationDashboard();

      expect(result!.needRefill).toHaveLength(1);
      expect(result!.needRefill[0].needsRefill).toBe(true);
    });
  });

  // ============================================================
  // getActiveMedications
  // ============================================================

  describe('getActiveMedications', () => {
    it('deve retornar apenas medicamentos ativos', async () => {
      const meds = [mockMed, mockInactiveMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const result = await getActiveMedications();

      expect(result).toHaveLength(1);
      expect(result[0].isActive).toBe(true);
    });

    it('deve criar seed data se o storage estiver vazio', async () => {
      // When storage is empty, ensureSeedData creates seed data via setItem,
      // but since AsyncStorage is mocked, the second getItem still returns null.
      // So we verify that setItem was called (seed data was created),
      // even though the subsequent read returns empty because the mock doesn't persist.
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getActiveMedications();

      // The mock doesn't persist setItem values, so getActiveMedications reads null again
      // and returns []. But we can verify ensureSeedData ran by checking setItem was called.
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });

    it('deve retornar array vazio quando não há medicamentos ativos', async () => {
      const meds = [mockInactiveMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const result = await getActiveMedications();

      expect(result).toHaveLength(0);
    });
  });

  // ============================================================
  // createMedication
  // ============================================================

  describe('createMedication', () => {
    it('deve criar um novo medicamento com sucesso', async () => {
      const existingMeds = [mockMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(existingMeds));
        return Promise.resolve(null);
      });

      const request: MedicationRequestDTO = {
        name: 'Paracetamol',
        dosage: '500mg',
        form: MedicationForm.Comprimido,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['08:00'],
        instructions: 'Tomar após refeição',
        totalQuantity: 30,
        refillAlertThreshold: 5,
      };

      const result = await createMedication(request);

      expect(result.name).toBe('Paracetamol');
      expect(result.dosage).toBe('500mg');
      expect(result.form).toBe(MedicationForm.Comprimido);
      expect(result.formDescription).toBe('Comprimido');
      expect(result.isActive).toBe(true);
      expect(result.needsRefill).toBe(false);
      expect(result.remainingQuantity).toBe(30);
      expect(result.id).toBeDefined();
      expect(result.createdDate).toBeDefined();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('deve gerar um ID UUID válido para o novo medicamento', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationRequestDTO = {
        name: 'Teste',
        dosage: '10mg',
        form: MedicationForm.Capsula,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['12:00'],
      };

      const result = await createMedication(request);

      // UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('deve adicionar o medicamento à lista existente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([mockMed]));
        return Promise.resolve(null);
      });

      const request: MedicationRequestDTO = {
        name: 'Novo',
        dosage: '1mg',
        form: MedicationForm.Gotas,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['10:00'],
      };

      await createMedication(request);

      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        (call: any[]) => call[0] === MOCK_MEDS_KEY
      );
      const savedMeds = JSON.parse(savedData![1]);
      expect(savedMeds).toHaveLength(2);
    });

    it('deve criar medicamento sem totalQuantity', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationRequestDTO = {
        name: 'Sem Quantidade',
        dosage: '5ml',
        form: MedicationForm.Xarope,
        frequencyType: MedicationFrequencyType.SpecificDays,
        frequencyDays: [1, 3, 5],
        scheduleTimes: ['09:00'],
      };

      const result = await createMedication(request);

      expect(result.totalQuantity).toBeUndefined();
      expect(result.remainingQuantity).toBeUndefined();
    });
  });

  // ============================================================
  // updateMedication
  // ============================================================

  describe('updateMedication', () => {
    it('deve atualizar um medicamento existente', async () => {
      const meds = [mockMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const request: MedicationRequestDTO = {
        name: 'Losartana Atualizada',
        dosage: '100mg',
        form: MedicationForm.Comprimido,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['09:00', '21:00'],
      };

      const result = await updateMedication('med-1', request);

      expect(result.name).toBe('Losartana Atualizada');
      expect(result.dosage).toBe('100mg');
      expect(result.scheduleTimes).toEqual(['09:00', '21:00']);
      expect(result.id).toBe('med-1'); // ID mantido
    });

    it('deve lançar erro ao tentar atualizar medicamento inexistente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([mockMed]));
        return Promise.resolve(null);
      });

      const request: MedicationRequestDTO = {
        name: 'Inexistente',
        dosage: '1mg',
        form: MedicationForm.Comprimido,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['08:00'],
      };

      await expect(updateMedication('id-invalido', request)).rejects.toThrow(
        'Medicamento nao encontrado'
      );
    });

    it('deve manter campos não alteráveis ao atualizar', async () => {
      const meds = [mockMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const request: MedicationRequestDTO = {
        name: 'Atualizado',
        dosage: '200mg',
        form: MedicationForm.Capsula,
        frequencyType: MedicationFrequencyType.Daily,
        scheduleTimes: ['10:00'],
      };

      const result = await updateMedication('med-1', request);

      // Campos que devem ser preservados do original
      expect(result.createdDate).toBe(mockMed.createdDate);
      expect(result.isActive).toBe(mockMed.isActive);
    });
  });

  // ============================================================
  // deactivateMedication
  // ============================================================

  describe('deactivateMedication', () => {
    it('deve desativar um medicamento existente', async () => {
      const meds = [{ ...mockMed }];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const result = await deactivateMedication('med-1');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      // Verificar que o medicamento foi desativado no storage
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        (call: any[]) => call[0] === MOCK_MEDS_KEY
      );
      const savedMeds = JSON.parse(savedData![1]);
      expect(savedMeds[0].isActive).toBe(false);
    });

    it('deve retornar false ao tentar desativar medicamento inexistente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([mockMed]));
        return Promise.resolve(null);
      });

      const result = await deactivateMedication('id-invalido');

      expect(result).toBe(false);
    });

    it('deve retornar false quando a lista de medicamentos está vazia', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await deactivateMedication('qualquer-id');

      expect(result).toBe(false);
    });
  });

  // ============================================================
  // logDose
  // ============================================================

  describe('logDose', () => {
    it('deve registrar dose como tomada com sucesso', async () => {
      const meds = [{ ...mockMed }];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationLogRequestDTO = {
        medicationId: 'med-1',
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Taken,
      };

      const result = await logDose(request);

      expect(result).not.toBeNull();
      expect(result!.medicationName).toBe('Losartana');
      expect(result!.medicationDosage).toBe('50mg');
      expect(result!.status).toBe(MedicationLogStatus.Taken);
      expect(result!.actionTime).toBeDefined();
    });

    it('deve decrementar remainingQuantity quando dose é tomada', async () => {
      const meds = [{ ...mockMed, remainingQuantity: 20 }];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationLogRequestDTO = {
        medicationId: 'med-1',
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Taken,
      };

      await logDose(request);

      // Deve ter chamado setItem para meds com remainingQuantity decrementada
      const medsCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        (call: any[]) => call[0] === MOCK_MEDS_KEY
      );
      expect(medsCalls.length).toBeGreaterThan(0);
      const savedMeds = JSON.parse(medsCalls[medsCalls.length - 1][1]);
      expect(savedMeds[0].remainingQuantity).toBe(19);
    });

    it('deve atualizar needsRefill quando remainingQuantity atinge o threshold', async () => {
      const meds = [{ ...mockMed, remainingQuantity: 11, refillAlertThreshold: 10 }];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationLogRequestDTO = {
        medicationId: 'med-1',
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Taken,
      };

      await logDose(request);

      const medsCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        (call: any[]) => call[0] === MOCK_MEDS_KEY
      );
      const savedMeds = JSON.parse(medsCalls[medsCalls.length - 1][1]);
      expect(savedMeds[0].needsRefill).toBe(true);
    });

    it('não deve decrementar remainingQuantity quando dose é pulada', async () => {
      const meds = [{ ...mockMed, remainingQuantity: 20 }];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationLogRequestDTO = {
        medicationId: 'med-1',
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Skipped,
      };

      await logDose(request);

      // Apenas o log deve ser salvo, não os meds
      const medsCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        (call: any[]) => call[0] === MOCK_MEDS_KEY
      );
      expect(medsCalls).toHaveLength(0);
    });

    it('deve retornar null quando o medicamento não existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([mockMed]));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationLogRequestDTO = {
        medicationId: 'id-invalido',
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Taken,
      };

      const result = await logDose(request);

      expect(result).toBeNull();
    });

    it('deve substituir log existente para o mesmo slot de horário', async () => {
      const existingLog = {
        id: 'log-existente',
        medicationId: 'med-1',
        medicationName: 'Losartana',
        medicationDosage: '50mg',
        medicationForm: MedicationForm.Comprimido,
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Pending,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([{ ...mockMed }]));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([existingLog]));
        return Promise.resolve(null);
      });

      const request: MedicationLogRequestDTO = {
        medicationId: 'med-1',
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Taken,
      };

      const result = await logDose(request);

      expect(result!.status).toBe(MedicationLogStatus.Taken);
      // O log antigo deve ter sido removido e o novo adicionado
      const logsCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        (call: any[]) => call[0] === MOCK_LOGS_KEY
      );
      const savedLogs = JSON.parse(logsCalls[logsCalls.length - 1][1]);
      expect(savedLogs).toHaveLength(1);
      expect(savedLogs[0].status).toBe(MedicationLogStatus.Taken);
    });

    it('não deve decrementar se remainingQuantity é null', async () => {
      const medSemQuantidade = {
        ...mockMed,
        remainingQuantity: undefined as any,
        refillAlertThreshold: undefined as any,
      };
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([medSemQuantidade]));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const request: MedicationLogRequestDTO = {
        medicationId: 'med-1',
        scheduledTime: '2025-01-15T08:00:00.000Z',
        status: MedicationLogStatus.Taken,
      };

      await logDose(request);

      // Não deve ter salvado meds (pois remainingQuantity é null)
      const medsCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        (call: any[]) => call[0] === MOCK_MEDS_KEY
      );
      expect(medsCalls).toHaveLength(0);
    });
  });

  // ============================================================
  // getTodayLogs
  // ============================================================

  describe('getTodayLogs', () => {
    it('deve retornar logs do dia para medicamentos ativos', async () => {
      const meds = [mockMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getTodayLogs();

      expect(Array.isArray(result)).toBe(true);
      // mockMed tem 2 scheduleTimes, então deve gerar 2 logs
      expect(result).toHaveLength(2);
    });

    it('deve criar seed data se storage estiver vazio', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getTodayLogs();

      expect(Array.isArray(result)).toBe(true);
    });

    it('deve retornar logs existentes ao invés de criar novos', async () => {
      const today = new Date().toISOString().split('T')[0];
      const existingLog = {
        id: 'log-1',
        medicationId: 'med-1',
        medicationName: 'Losartana',
        medicationDosage: '50mg',
        medicationForm: MedicationForm.Comprimido,
        scheduledTime: `${today}T08:00:00.000Z`,
        actionTime: '2025-01-15T08:05:00.000Z',
        status: MedicationLogStatus.Taken,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([mockMed]));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([existingLog]));
        return Promise.resolve(null);
      });

      const result = await getTodayLogs();

      const takenLog = result.find(l => l.id === 'log-1');
      expect(takenLog).toBeDefined();
      expect(takenLog!.status).toBe(MedicationLogStatus.Taken);
    });

    it('deve ordenar logs por scheduledTime', async () => {
      const meds = [mockMed]; // scheduleTimes: ['08:00', '20:00']
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getTodayLogs();

      if (result.length >= 2) {
        expect(result[0].scheduledTime.localeCompare(result[1].scheduledTime)).toBeLessThanOrEqual(0);
      }
    });

    it('deve excluir medicamentos inativos dos logs do dia', async () => {
      const meds = [mockInactiveMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getTodayLogs();

      expect(result).toHaveLength(0);
    });

    it('deve respeitar dias específicos para medicamentos com frequência SpecificDays', async () => {
      // Cria um med com dias que NÃO incluem hoje
      const todayDow = new Date().getDay();
      const otherDay = (todayDow + 1) % 7;
      const medNotToday = {
        ...mockSpecificDaysMed,
        frequencyDays: [otherDay],
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([medNotToday]));
        if (key === MOCK_LOGS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getTodayLogs();

      expect(result).toHaveLength(0);
    });
  });

  // ============================================================
  // resetMockData
  // ============================================================

  describe('resetMockData', () => {
    it('deve remover todas as chaves de mock do storage', async () => {
      await resetMockData();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([MOCK_MEDS_KEY, MOCK_LOGS_KEY]);
    });
  });

  // ============================================================
  // getAdherence
  // ============================================================

  describe('getAdherence', () => {
    it('deve retornar dados de aderência para um mês/ano', async () => {
      const meds = [mockMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const result = await getAdherence(1, 2025);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('dailyAdherence');
      expect(result).toHaveProperty('monthlyAverage');
      expect(result).toHaveProperty('byMedication');
      expect(typeof result!.monthlyAverage).toBe('number');
    });

    it('deve gerar aderência por medicamento apenas para medicamentos ativos', async () => {
      const meds = [mockMed, mockInactiveMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const result = await getAdherence(1, 2025);

      // Apenas o medicamento ativo deve aparecer em byMedication
      expect(result!.byMedication).toHaveLength(1);
      expect(result!.byMedication[0].medicationName).toBe('Losartana');
    });

    it('deve gerar dailyAdherence com chaves no formato YYYY-MM-DD', async () => {
      const meds = [mockMed];
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        return Promise.resolve(null);
      });

      const result = await getAdherence(1, 2025);

      const keys = Object.keys(result!.dailyAdherence);
      if (keys.length > 0) {
        expect(keys[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('deve retornar monthlyAverage como 0 quando não há dados', async () => {
      // Mês futuro para garantir que não há dados
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify([]));
        return Promise.resolve(null);
      });

      const result = await getAdherence(12, 2099);

      expect(result).not.toBeNull();
      expect(result!.monthlyAverage).toBe(0);
      expect(result!.byMedication).toHaveLength(0);
    });

    it('deve criar seed data se necessário antes de retornar aderência', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getAdherence(1, 2025);

      expect(result).not.toBeNull();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  // ============================================================
  // Tratamento de erros no AsyncStorage (path mock)
  // ============================================================

  describe('Tratamento de erros de storage', () => {
    it('getMockMeds deve retornar array vazio quando AsyncStorage lança erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.reject(new Error('Storage error'));
        return Promise.resolve(null);
      });

      // ensureSeedData chama getMockMeds, que deve retornar [] no catch
      // Então vai criar seed data
      const result = await getActiveMedications();

      expect(Array.isArray(result)).toBe(true);
    });

    it('getMockLogs deve retornar array vazio quando AsyncStorage lança erro', async () => {
      const meds = [mockMed];
      let callCount = 0;
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === MOCK_MEDS_KEY) return Promise.resolve(JSON.stringify(meds));
        if (key === MOCK_LOGS_KEY) return Promise.reject(new Error('Storage error'));
        return Promise.resolve(null);
      });

      const result = await getTodayLogs();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
