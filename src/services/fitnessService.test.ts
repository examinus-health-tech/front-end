/**
 * Testes unitários para fitnessService.ts
 */

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
  isFitnessEnabled,
  setFitnessEnabled,
  getFitnessDashboard,
  getDailyLogByDate,
  saveDailyLog,
  createActivity,
  createWeight,
  createSleep,
  getWeightHistory,
  getActivities,
  getDailyLogsHistory,
  getSleepHistory,
  syncGoalsFromBackend,
  setWeightGoal,
  getWeightGoal,
  setCaloriesGoal,
  getCaloriesGoal,
  setHydrationGoal,
  getHydrationGoal,
  setStepsGoal,
  getStepsGoal,
  FITNESS_ENABLED_KEY,
  WEIGHT_GOAL_KEY,
  CALORIES_GOAL_KEY,
  HYDRATION_GOAL_KEY,
  STEPS_GOAL_KEY,
} from './fitnessService';

describe('fitnessService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  // ============================================================
  // Constantes exportadas
  // ============================================================

  describe('Constantes exportadas', () => {
    it('deve ter as chaves de storage corretas', () => {
      expect(FITNESS_ENABLED_KEY).toBe('@examinus:fitness_enabled');
      expect(WEIGHT_GOAL_KEY).toBe('@examinus:weight_goal');
      expect(CALORIES_GOAL_KEY).toBe('@examinus:calories_goal');
      expect(HYDRATION_GOAL_KEY).toBe('@examinus:hydration_goal');
      expect(STEPS_GOAL_KEY).toBe('@examinus:steps_goal');
    });
  });

  // ============================================================
  // isFitnessEnabled
  // ============================================================

  describe('isFitnessEnabled', () => {
    it('deve retornar true quando storage contém "true"', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const result = await isFitnessEnabled();

      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(FITNESS_ENABLED_KEY);
    });

    it('deve retornar false quando storage contém "false"', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('false');

      const result = await isFitnessEnabled();

      expect(result).toBe(false);
    });

    it('deve retornar false quando storage está vazio', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await isFitnessEnabled();

      expect(result).toBe(false);
    });

    it('deve retornar false quando AsyncStorage lança erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage Error'));

      const result = await isFitnessEnabled();

      expect(result).toBe(false);
    });
  });

  // ============================================================
  // setFitnessEnabled
  // ============================================================

  describe('setFitnessEnabled', () => {
    it('deve salvar "true" no storage quando habilitado', async () => {
      await setFitnessEnabled(true);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(FITNESS_ENABLED_KEY, 'true');
    });

    it('deve salvar "false" no storage quando desabilitado', async () => {
      await setFitnessEnabled(false);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(FITNESS_ENABLED_KEY, 'false');
    });

    it('deve lançar erro quando AsyncStorage falha', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage Error'));

      await expect(setFitnessEnabled(true)).rejects.toThrow('Storage Error');
    });
  });

  // ============================================================
  // getFitnessDashboard
  // ============================================================

  describe('getFitnessDashboard', () => {
    it('deve retornar dashboard quando API responde com sucesso', async () => {
      const dashboardData = {
        todayLog: { id: '1', steps: 5000 },
        currentWeight: null,
        recentActivities: [],
        lastNightSleep: null,
        activeGoals: [],
        healthSync: null,
      };

      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: dashboardData },
      });

      const result = await getFitnessDashboard();

      expect(result).toEqual(dashboardData);
      expect(api.get).toHaveBeenCalledWith('fitness/dashboard');
    });

    it('deve retornar null quando API responde com 404', async () => {
      const error = new Error('Not Found');
      (error as any).response = { status: 404 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getFitnessDashboard();

      expect(result).toBeNull();
    });

    it('deve lançar erro quando API falha com erro diferente de 404', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500 };
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getFitnessDashboard()).rejects.toThrow('Server Error');
    });
  });

  // ============================================================
  // getDailyLogByDate
  // ============================================================

  describe('getDailyLogByDate', () => {
    it('deve retornar log diário de uma data específica', async () => {
      const logData = { id: '1', date: '2025-01-15', steps: 8000 };
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: logData },
      });

      const result = await getDailyLogByDate('2025-01-15');

      expect(result).toEqual(logData);
      expect(api.get).toHaveBeenCalledWith('fitness/daily-log/2025-01-15');
    });

    it('deve retornar null quando não há log para a data (404)', async () => {
      const error = new Error('Not Found');
      (error as any).response = { status: 404 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getDailyLogByDate('2025-01-15');

      expect(result).toBeNull();
    });

    it('deve retornar null quando API retorna data vazio', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: null },
      });

      const result = await getDailyLogByDate('2025-01-15');

      expect(result).toBeNull();
    });

    it('deve retornar null quando API falha com erro genérico', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getDailyLogByDate('2025-01-15');

      expect(result).toBeNull();
    });
  });

  // ============================================================
  // saveDailyLog
  // ============================================================

  describe('saveDailyLog', () => {
    it('deve salvar log diário com sucesso', async () => {
      const logData = { date: '2025-01-15', steps: 10000, stepsGoal: 10000 };
      const responseData = { id: '1', ...logData };

      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: responseData },
      });

      const result = await saveDailyLog(logData);

      expect(result).toEqual(responseData);
      expect(api.post).toHaveBeenCalledWith('fitness/daily-log', logData);
    });

    it('deve lançar erro quando API falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Save failed'));

      await expect(saveDailyLog({ date: '2025-01-15' })).rejects.toThrow('Save failed');
    });
  });

  // ============================================================
  // createActivity
  // ============================================================

  describe('createActivity', () => {
    it('deve registrar atividade com sucesso', async () => {
      const activityData = { activityType: 1, durationMinutes: 30 };
      const responseData = { id: '1', ...activityData };

      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: responseData },
      });

      const result = await createActivity(activityData);

      expect(result).toEqual(responseData);
      expect(api.post).toHaveBeenCalledWith('fitness/activities', activityData);
    });

    it('deve lançar erro quando API falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Activity creation failed'));

      await expect(createActivity({})).rejects.toThrow('Activity creation failed');
    });
  });

  // ============================================================
  // createWeight
  // ============================================================

  describe('createWeight', () => {
    it('deve registrar peso com sucesso', async () => {
      const weightData = { weightKg: 75.5, recordedAt: '2025-01-15T10:00:00Z' };
      const responseData = { id: '1', ...weightData };

      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: responseData },
      });

      const result = await createWeight(weightData);

      expect(result).toEqual(responseData);
      expect(api.post).toHaveBeenCalledWith('fitness/weight', weightData);
    });

    it('deve lançar erro quando API falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Weight creation failed'));

      await expect(createWeight({})).rejects.toThrow('Weight creation failed');
    });
  });

  // ============================================================
  // createSleep
  // ============================================================

  describe('createSleep', () => {
    it('deve registrar sono com sucesso', async () => {
      const sleepData = { sleepStart: '2025-01-15T22:00:00Z', sleepEnd: '2025-01-16T06:00:00Z', durationMinutes: 480 };
      const responseData = { id: '1', ...sleepData };

      (api.post as jest.Mock).mockResolvedValue({
        data: { success: true, data: responseData },
      });

      const result = await createSleep(sleepData);

      expect(result).toEqual(responseData);
      expect(api.post).toHaveBeenCalledWith('fitness/sleep', sleepData);
    });

    it('deve lançar erro quando API falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Sleep creation failed'));

      await expect(createSleep({})).rejects.toThrow('Sleep creation failed');
    });
  });

  // ============================================================
  // getWeightHistory
  // ============================================================

  describe('getWeightHistory', () => {
    it('deve retornar histórico de peso com parâmetro padrão de 6 meses', async () => {
      const weightHistory = [{ id: '1', weightKg: 75, recordedAt: '2025-01-15' }];
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: weightHistory },
      });

      const result = await getWeightHistory();

      expect(result).toEqual(weightHistory);
      expect(api.get).toHaveBeenCalledWith('fitness/weight/history?months=6');
    });

    it('deve aceitar parâmetro customizado de meses', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [] },
      });

      await getWeightHistory(12);

      expect(api.get).toHaveBeenCalledWith('fitness/weight/history?months=12');
    });

    it('deve retornar array vazio quando API responde com 404', async () => {
      const error = new Error('Not Found');
      (error as any).response = { status: 404 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getWeightHistory();

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando data é null', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: null },
      });

      const result = await getWeightHistory();

      expect(result).toEqual([]);
    });

    it('deve lançar erro quando API falha com erro diferente de 404', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500 };
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getWeightHistory()).rejects.toThrow('Server Error');
    });
  });

  // ============================================================
  // getActivities
  // ============================================================

  describe('getActivities', () => {
    it('deve retornar atividades do período especificado', async () => {
      const activities = [{ id: '1', activityType: 1, durationMinutes: 30 }];
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: activities },
      });

      const result = await getActivities('2025-01-01', '2025-01-31');

      expect(result).toEqual(activities);
      expect(api.get).toHaveBeenCalledWith('fitness/activities?startDate=2025-01-01&endDate=2025-01-31');
    });

    it('deve retornar array vazio quando API responde com 404', async () => {
      const error = new Error('Not Found');
      (error as any).response = { status: 404 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getActivities('2025-01-01', '2025-01-31');

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando data é null', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: null },
      });

      const result = await getActivities('2025-01-01', '2025-01-31');

      expect(result).toEqual([]);
    });

    it('deve lançar erro quando API falha com erro diferente de 404', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500 };
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getActivities('2025-01-01', '2025-01-31')).rejects.toThrow('Server Error');
    });
  });

  // ============================================================
  // getDailyLogsHistory
  // ============================================================

  describe('getDailyLogsHistory', () => {
    it('deve retornar histórico de logs com parâmetro padrão de 30 dias', async () => {
      const logs = [{ id: '1', date: '2025-01-15', steps: 8000 }];
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: logs },
      });

      const result = await getDailyLogsHistory();

      expect(result).toEqual(logs);
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('fitness/daily-log?startDate='));
    });

    it('deve aceitar parâmetro customizado de dias', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [] },
      });

      await getDailyLogsHistory(7);

      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('fitness/daily-log?startDate='));
    });

    it('deve retornar array vazio quando API responde com 404', async () => {
      const error = new Error('Not Found');
      (error as any).response = { status: 404 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getDailyLogsHistory();

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando data é null', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: null },
      });

      const result = await getDailyLogsHistory();

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando API falha com erro genérico', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getDailyLogsHistory();

      expect(result).toEqual([]);
    });
  });

  // ============================================================
  // getSleepHistory
  // ============================================================

  describe('getSleepHistory', () => {
    it('deve retornar histórico de sono com parâmetro padrão de 30 dias', async () => {
      const sleepData = [{ id: '1', sleepStart: '2025-01-15T22:00:00Z', durationMinutes: 480 }];
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: sleepData },
      });

      const result = await getSleepHistory();

      expect(result).toEqual(sleepData);
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('fitness/sleep?startDate='));
    });

    it('deve aceitar parâmetro customizado de dias', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [] },
      });

      await getSleepHistory(14);

      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('fitness/sleep?startDate='));
    });

    it('deve retornar array vazio quando API responde com 404', async () => {
      const error = new Error('Not Found');
      (error as any).response = { status: 404 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getSleepHistory();

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando data é null', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: null },
      });

      const result = await getSleepHistory();

      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando API falha com erro genérico', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500 };
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getSleepHistory();

      expect(result).toEqual([]);
    });
  });

  // ============================================================
  // syncGoalsFromBackend
  // ============================================================

  describe('syncGoalsFromBackend', () => {
    it('deve sincronizar todas as metas do backend para o cache local', async () => {
      const goals = [
        { goalType: 2, targetValue: 75 },   // TargetWeight
        { goalType: 5, targetValue: 2000 },  // DailyCalories
        { goalType: 3, targetValue: 2500 },  // DailyWater
        { goalType: 1, targetValue: 10000 }, // DailySteps
      ];

      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: goals },
      });

      await syncGoalsFromBackend();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(WEIGHT_GOAL_KEY, '75');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(CALORIES_GOAL_KEY, '2000');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(HYDRATION_GOAL_KEY, '2500');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STEPS_GOAL_KEY, '10000');
    });

    it('deve ignorar tipos de meta desconhecidos', async () => {
      const goals = [
        { goalType: 99, targetValue: 100 }, // Tipo desconhecido
      ];

      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: goals },
      });

      await syncGoalsFromBackend();

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('deve funcionar com lista vazia de metas', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: [] },
      });

      await syncGoalsFromBackend();

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('deve funcionar com data null', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: null },
      });

      await syncGoalsFromBackend();

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('não deve lançar erro quando a API falha', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(syncGoalsFromBackend()).resolves.toBeUndefined();
    });
  });

  // ============================================================
  // Metas - set/get
  // ============================================================

  describe('setWeightGoal / getWeightGoal', () => {
    it('deve salvar meta de peso no cache e no backend', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      await setWeightGoal(75.5);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(WEIGHT_GOAL_KEY, '75.5');
      expect(api.post).toHaveBeenCalledWith('fitness/goals', {
        goalType: 2, // TargetWeight
        targetValue: 75.5,
        unit: 'kg',
      });
    });

    it('deve recuperar meta de peso do cache (parseFloat)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('75.5');

      const result = await getWeightGoal();

      expect(result).toBe(75.5);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(WEIGHT_GOAL_KEY);
    });

    it('deve retornar null quando não há meta de peso', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getWeightGoal();

      expect(result).toBeNull();
    });

    it('deve retornar null quando o valor é NaN', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('abc');

      const result = await getWeightGoal();

      expect(result).toBeNull();
    });
  });

  describe('setCaloriesGoal / getCaloriesGoal', () => {
    it('deve salvar meta de calorias no cache e no backend', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      await setCaloriesGoal(2000);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(CALORIES_GOAL_KEY, '2000');
      expect(api.post).toHaveBeenCalledWith('fitness/goals', {
        goalType: 5, // DailyCalories
        targetValue: 2000,
        unit: 'kcal',
      });
    });

    it('deve recuperar meta de calorias do cache (parseInt)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2000');

      const result = await getCaloriesGoal();

      expect(result).toBe(2000);
    });

    it('deve retornar null quando não há meta de calorias', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getCaloriesGoal();

      expect(result).toBeNull();
    });
  });

  describe('setHydrationGoal / getHydrationGoal', () => {
    it('deve salvar meta de hidratação no cache e no backend', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      await setHydrationGoal(2500);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(HYDRATION_GOAL_KEY, '2500');
      expect(api.post).toHaveBeenCalledWith('fitness/goals', {
        goalType: 3, // DailyWater
        targetValue: 2500,
        unit: 'ml',
      });
    });

    it('deve recuperar meta de hidratação do cache', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2500');

      const result = await getHydrationGoal();

      expect(result).toBe(2500);
    });
  });

  describe('setStepsGoal / getStepsGoal', () => {
    it('deve salvar meta de passos no cache e no backend', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      await setStepsGoal(10000);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STEPS_GOAL_KEY, '10000');
      expect(api.post).toHaveBeenCalledWith('fitness/goals', {
        goalType: 1, // DailySteps
        targetValue: 10000,
        unit: 'steps',
      });
    });

    it('deve recuperar meta de passos do cache', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('10000');

      const result = await getStepsGoal();

      expect(result).toBe(10000);
    });
  });

  describe('saveGoal - tratamento de erros', () => {
    it('deve salvar no cache mesmo quando backend falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Não deve lançar erro
      await expect(setWeightGoal(80)).resolves.toBeUndefined();

      // Cache deve ser salvo
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(WEIGHT_GOAL_KEY, '80');
    });
  });

  describe('getGoal - tratamento de erros', () => {
    it('deve retornar null quando AsyncStorage lança erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage Error'));

      const result = await getWeightGoal();

      expect(result).toBeNull();
    });

    it('deve retornar null para string vazia como NaN', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('');

      const result = await getCaloriesGoal();

      expect(result).toBeNull();
    });

    it('deve retornar null para string NaN em getHydrationGoal', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not-a-number');

      const result = await getHydrationGoal();

      expect(result).toBeNull();
    });

    it('deve retornar null para string NaN em getStepsGoal', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('abc');

      const result = await getStepsGoal();

      expect(result).toBeNull();
    });
  });

  // ============================================================
  // getDailyLogByDate - branch adicional: erro sem response
  // ============================================================

  describe('getDailyLogByDate - branches adicionais', () => {
    it('deve retornar null quando erro não tem response (erro de rede)', async () => {
      const error = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getDailyLogByDate('2025-01-15');

      expect(result).toBeNull();
    });
  });

  // ============================================================
  // getFitnessDashboard - branch adicional: erro sem response
  // ============================================================

  describe('getFitnessDashboard - branches adicionais', () => {
    it('deve lançar erro quando não tem response (erro de rede)', async () => {
      const error = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getFitnessDashboard()).rejects.toThrow('Network Error');
    });
  });

  // ============================================================
  // getWeightHistory - branch adicional: erro sem response
  // ============================================================

  describe('getWeightHistory - branches adicionais', () => {
    it('deve lançar erro quando não tem response (erro de rede)', async () => {
      const error = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getWeightHistory()).rejects.toThrow('Network Error');
    });
  });

  // ============================================================
  // getActivities - branch adicional: erro sem response
  // ============================================================

  describe('getActivities - branches adicionais', () => {
    it('deve lançar erro quando não tem response (erro de rede)', async () => {
      const error = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getActivities('2025-01-01', '2025-01-31')).rejects.toThrow('Network Error');
    });
  });

  // ============================================================
  // getDailyLogsHistory - branch adicional: erro sem response
  // ============================================================

  describe('getDailyLogsHistory - branches adicionais', () => {
    it('deve retornar array vazio quando erro não tem response (erro de rede)', async () => {
      const error = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getDailyLogsHistory();

      expect(result).toEqual([]);
    });
  });

  // ============================================================
  // getSleepHistory - branch adicional: erro sem response
  // ============================================================

  describe('getSleepHistory - branches adicionais', () => {
    it('deve retornar array vazio quando erro não tem response (erro de rede)', async () => {
      const error = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await getSleepHistory();

      expect(result).toEqual([]);
    });
  });

  // ============================================================
  // syncGoalsFromBackend - branches adicionais
  // ============================================================

  describe('syncGoalsFromBackend - branches adicionais', () => {
    it('deve sincronizar apenas metas de tipo DailySleep (tipo 4) e DailyCaloriesBurned (tipo 6) sem efeito', async () => {
      const goals = [
        { goalType: 4, targetValue: 480 },  // DailySleep - nao tem case no switch
        { goalType: 6, targetValue: 500 },  // DailyCaloriesBurned - nao tem case no switch
      ];

      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: goals },
      });

      await syncGoalsFromBackend();

      // Nenhuma das metas acima tem case no switch, nao deve salvar nada
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
