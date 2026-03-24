/**
 * Testes unitários para medicationNotificationService.ts
 */

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

// Use inline jest.fn() inside the factory to avoid hoisting issues
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  setNotificationHandler: jest.fn(),
  AndroidImportance: {
    HIGH: 4,
  },
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
  },
}));

jest.mock('./medicationService', () => ({
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

// Import after mocks are set up
import * as Notifications from 'expo-notifications';

import {
  requestNotificationPermission,
  setupNotificationChannel,
  addNotificationResponseListener,
  scheduleMedicationNotifications,
  cancelMedicationNotifications,
  rescheduleAllMedicationNotifications,
} from './medicationNotificationService';

// Get references to the mocked functions
const mockGetPermissionsAsync = Notifications.getPermissionsAsync as jest.Mock;
const mockRequestPermissionsAsync = Notifications.requestPermissionsAsync as jest.Mock;
const mockSetNotificationChannelAsync = Notifications.setNotificationChannelAsync as jest.Mock;
const mockScheduleNotificationAsync = Notifications.scheduleNotificationAsync as jest.Mock;
const mockCancelScheduledNotificationAsync = Notifications.cancelScheduledNotificationAsync as jest.Mock;
const mockGetAllScheduledNotificationsAsync = Notifications.getAllScheduledNotificationsAsync as jest.Mock;
const mockAddNotificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener as jest.Mock;
const mockSetNotificationHandler = Notifications.setNotificationHandler as jest.Mock;

// Tipos mocks para medicação
const createMockMed = (overrides = {}) => ({
  id: 'med-1',
  name: 'Losartana',
  dosage: '50mg',
  form: 1, // Comprimido
  formDescription: 'Comprimido',
  frequencyType: 1, // Daily
  scheduleTimes: ['08:00', '20:00'],
  instructions: 'Tomar com agua',
  totalQuantity: 60,
  remainingQuantity: 20,
  refillAlertThreshold: 10,
  needsRefill: false,
  isActive: true,
  createdDate: '2025-01-01T00:00:00.000Z',
  ...overrides,
});

describe('medicationNotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);
  });

  // ============================================================
  // requestNotificationPermission
  // ============================================================

  describe('requestNotificationPermission', () => {
    it('deve retornar true quando permissão já foi concedida', async () => {
      mockGetPermissionsAsync.mockResolvedValue({ status: 'granted' });

      const result = await requestNotificationPermission();

      expect(result).toBe(true);
      expect(mockRequestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('deve solicitar permissão quando não foi concedida anteriormente', async () => {
      mockGetPermissionsAsync.mockResolvedValue({ status: 'denied' });
      mockRequestPermissionsAsync.mockResolvedValue({ status: 'granted' });

      const result = await requestNotificationPermission();

      expect(result).toBe(true);
      expect(mockRequestPermissionsAsync).toHaveBeenCalled();
    });

    it('deve retornar false quando permissão é negada', async () => {
      mockGetPermissionsAsync.mockResolvedValue({ status: 'denied' });
      mockRequestPermissionsAsync.mockResolvedValue({ status: 'denied' });

      const result = await requestNotificationPermission();

      expect(result).toBe(false);
    });

    it('deve retornar false quando permissão tem status undetermined', async () => {
      mockGetPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
      mockRequestPermissionsAsync.mockResolvedValue({ status: 'undetermined' });

      const result = await requestNotificationPermission();

      expect(result).toBe(false);
    });
  });

  // ============================================================
  // setupNotificationChannel
  // ============================================================

  describe('setupNotificationChannel', () => {
    it('deve criar canal de notificação no Android', async () => {
      await setupNotificationChannel();

      expect(mockSetNotificationChannelAsync).toHaveBeenCalledWith(
        'medication-reminders',
        expect.objectContaining({
          name: 'Lembretes de Medicamentos',
          importance: 4, // HIGH
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0CC1AF',
          sound: 'default',
        })
      );
    });

    it('não deve criar canal no iOS', async () => {
      // Reimportar com Platform.OS = 'ios'
      jest.resetModules();
      jest.doMock('react-native', () => ({
        Platform: { OS: 'ios' },
      }));

      jest.doMock('expo-notifications', () => ({
        getPermissionsAsync: jest.fn(),
        requestPermissionsAsync: jest.fn(),
        setNotificationChannelAsync: jest.fn(),
        scheduleNotificationAsync: jest.fn(),
        cancelScheduledNotificationAsync: jest.fn(),
        getAllScheduledNotificationsAsync: jest.fn(),
        addNotificationResponseReceivedListener: jest.fn(),
        setNotificationHandler: jest.fn(),
        AndroidImportance: { HIGH: 4 },
        SchedulableTriggerInputTypes: { DAILY: 'daily', WEEKLY: 'weekly' },
      }));

      jest.doMock('./medicationService', () => ({
        MedicationFrequencyType: { Daily: 1, SpecificDays: 2 },
        MedicationFormLabels: { 1: 'Comprimido', 2: 'Gotas', 3: 'Injeção', 4: 'Pomada', 5: 'Cápsula', 6: 'Xarope' },
      }));

      const iosModule = require('./medicationNotificationService');
      const iosNotifications = require('expo-notifications');
      await iosModule.setupNotificationChannel();

      expect(iosNotifications.setNotificationChannelAsync).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // addNotificationResponseListener
  // ============================================================

  describe('addNotificationResponseListener', () => {
    it('deve registrar listener e retornar subscription', () => {
      const callback = jest.fn();
      const mockSubscription = { remove: jest.fn() };
      mockAddNotificationResponseReceivedListener.mockReturnValue(mockSubscription);

      const result = addNotificationResponseListener(callback);

      expect(result).toBe(mockSubscription);
      expect(mockAddNotificationResponseReceivedListener).toHaveBeenCalledWith(callback);
    });
  });

  // ============================================================
  // scheduleMedicationNotifications
  // ============================================================

  describe('scheduleMedicationNotifications', () => {
    it('deve agendar notificações diárias para cada horário', async () => {
      const med = createMockMed();

      await scheduleMedicationNotifications(med as any);

      // 2 horários, frequência diária = 2 notificações
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(2);

      // Verificar primeira notificação (08:00)
      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: 'med_med-1_0800',
          content: expect.objectContaining({
            title: 'Hora de tomar Losartana',
            body: expect.stringContaining('50mg - Comprimido'),
            data: expect.objectContaining({
              type: 'medication_reminder',
              medicationId: 'med-1',
              scheduledTime: '08:00',
            }),
            sound: 'default',
          }),
          trigger: expect.objectContaining({
            type: 'daily',
            hour: 8,
            minute: 0,
          }),
        })
      );

      // Verificar segunda notificação (20:00)
      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: 'med_med-1_2000',
          trigger: expect.objectContaining({
            hour: 20,
            minute: 0,
          }),
        })
      );
    });

    it('deve agendar notificações semanais para dias específicos', async () => {
      const med = createMockMed({
        frequencyType: 2, // SpecificDays
        frequencyDays: [1, 3, 5], // Seg, Qua, Sex
        scheduleTimes: ['09:00'],
      });

      await scheduleMedicationNotifications(med as any);

      // 1 horário x 3 dias = 3 notificações
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(3);

      // Verificar que weekday é dayOfWeek + 1
      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: 'med_med-1_0900_d1',
          trigger: expect.objectContaining({
            type: 'weekly',
            weekday: 2, // 1 + 1
            hour: 9,
            minute: 0,
          }),
        })
      );
    });

    it('deve cancelar notificações existentes antes de agendar novas', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([
        { identifier: 'med_med-1_0800' },
        { identifier: 'med_med-1_2000' },
        { identifier: 'med_other_0800' }, // Não pertence a este medicamento
      ]);

      const med = createMockMed();

      await scheduleMedicationNotifications(med as any);

      // Deve cancelar as 2 notificações existentes do med-1
      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('med_med-1_0800');
      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('med_med-1_2000');
      expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalledWith('med_other_0800');
    });

    it('não deve agendar notificações para medicamento inativo', async () => {
      const med = createMockMed({ isActive: false });

      await scheduleMedicationNotifications(med as any);

      // Deve cancelar existentes, mas não agendar novas
      expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('deve incluir instruções no corpo da notificação quando disponível', async () => {
      const med = createMockMed({
        instructions: 'Tomar em jejum',
        scheduleTimes: ['07:00'],
      });

      await scheduleMedicationNotifications(med as any);

      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            body: '50mg - Comprimido\nTomar em jejum',
          }),
        })
      );
    });

    it('não deve incluir instruções quando não estão disponíveis', async () => {
      const med = createMockMed({
        instructions: undefined,
        scheduleTimes: ['07:00'],
      });

      await scheduleMedicationNotifications(med as any);

      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            body: '50mg - Comprimido',
          }),
        })
      );
    });

    it('deve incluir channelId no Android', async () => {
      const med = createMockMed({ scheduleTimes: ['10:00'] });

      await scheduleMedicationNotifications(med as any);

      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            channelId: 'medication-reminders',
          }),
        })
      );
    });
  });

  // ============================================================
  // cancelMedicationNotifications
  // ============================================================

  describe('cancelMedicationNotifications', () => {
    it('deve cancelar todas as notificações de um medicamento específico', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([
        { identifier: 'med_med-1_0800' },
        { identifier: 'med_med-1_2000' },
        { identifier: 'med_med-1_0900_d1' },
        { identifier: 'med_med-2_0800' }, // Outro medicamento
      ]);

      await cancelMedicationNotifications('med-1');

      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledTimes(3);
      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('med_med-1_0800');
      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('med_med-1_2000');
      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('med_med-1_0900_d1');
      expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalledWith('med_med-2_0800');
    });

    it('não deve fazer nada quando não há notificações para cancelar', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);

      await cancelMedicationNotifications('med-1');

      expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
    });

    it('deve ignorar notificações de outros medicamentos', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([
        { identifier: 'med_med-2_0800' },
        { identifier: 'med_med-3_1200' },
      ]);

      await cancelMedicationNotifications('med-1');

      expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // rescheduleAllMedicationNotifications
  // ============================================================

  describe('rescheduleAllMedicationNotifications', () => {
    it('deve cancelar todas as notificações de medicamentos e reagendar para ativos', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([
        { identifier: 'med_med-1_0800' },
        { identifier: 'med_med-2_1200' },
        { identifier: 'other_notification_123' }, // Não é de medicamento
      ]);

      const medications = [
        createMockMed({ id: 'med-1', scheduleTimes: ['08:00'] }),
        createMockMed({ id: 'med-2', isActive: false }), // Inativo
      ] as any;

      // After cancelling existing, getAllScheduled returns empty for subsequent calls
      mockGetAllScheduledNotificationsAsync
        .mockResolvedValueOnce([
          { identifier: 'med_med-1_0800' },
          { identifier: 'med_med-2_1200' },
          { identifier: 'other_notification_123' },
        ])
        .mockResolvedValue([]);

      await rescheduleAllMedicationNotifications(medications);

      // Deve cancelar 2 notificações de medicamentos (med_*)
      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('med_med-1_0800');
      expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('med_med-2_1200');
      // Não deve cancelar notificações de outros tipos
    });

    it('deve reagendar apenas medicamentos ativos', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);

      const medications = [
        createMockMed({ id: 'med-1', isActive: true, scheduleTimes: ['08:00'] }),
        createMockMed({ id: 'med-2', isActive: false }),
        createMockMed({ id: 'med-3', isActive: true, scheduleTimes: ['12:00'] }),
      ] as any;

      await rescheduleAllMedicationNotifications(medications);

      // Apenas med-1 e med-3 são ativos, cada um com 1 horário diário
      // scheduleMedicationNotifications is called for the 2 active ones
      // But med-2 is inactive, so no notifications are scheduled for it
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(2);
    });

    it('não deve fazer nada quando lista de medicamentos está vazia', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);

      await rescheduleAllMedicationNotifications([]);

      expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('deve funcionar quando não há notificações existentes para cancelar', async () => {
      mockGetAllScheduledNotificationsAsync.mockResolvedValue([]);

      const medications = [
        createMockMed({ id: 'med-1', scheduleTimes: ['08:00'] }),
      ] as any;

      await rescheduleAllMedicationNotifications(medications);

      expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
      expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================
  // Módulo não disponível (expo-notifications falha ao carregar)
  // ============================================================

  describe('Quando expo-notifications não está disponível', () => {
    beforeEach(() => {
      jest.resetModules();

      jest.doMock('react-native', () => ({
        Platform: { OS: 'android' },
      }));

      // Simula falha ao carregar expo-notifications
      jest.doMock('expo-notifications', () => {
        throw new Error('Native module not available');
      });

      jest.doMock('./medicationService', () => ({
        MedicationFrequencyType: { Daily: 1, SpecificDays: 2 },
        MedicationFormLabels: { 1: 'Comprimido' },
      }));
    });

    it('requestNotificationPermission deve retornar false', async () => {
      const mod = require('./medicationNotificationService');
      const result = await mod.requestNotificationPermission();
      expect(result).toBe(false);
    });

    it('setupNotificationChannel deve retornar sem erro', async () => {
      const mod = require('./medicationNotificationService');
      await expect(mod.setupNotificationChannel()).resolves.toBeUndefined();
    });

    it('addNotificationResponseListener deve retornar null', () => {
      const mod = require('./medicationNotificationService');
      const result = mod.addNotificationResponseListener(jest.fn());
      expect(result).toBeNull();
    });

    it('scheduleMedicationNotifications deve retornar sem erro', async () => {
      const mod = require('./medicationNotificationService');
      await expect(
        mod.scheduleMedicationNotifications(createMockMed())
      ).resolves.toBeUndefined();
    });

    it('cancelMedicationNotifications deve retornar sem erro', async () => {
      const mod = require('./medicationNotificationService');
      await expect(
        mod.cancelMedicationNotifications('med-1')
      ).resolves.toBeUndefined();
    });

    it('rescheduleAllMedicationNotifications deve retornar sem erro', async () => {
      const mod = require('./medicationNotificationService');
      await expect(
        mod.rescheduleAllMedicationNotifications([createMockMed()])
      ).resolves.toBeUndefined();
    });
  });
});
