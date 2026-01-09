import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key para preferência do fitness
export const FITNESS_ENABLED_KEY = '@examinus:fitness_enabled';

// Types baseados nos DTOs do backend
export interface FitnessDailyLog {
  id: string;
  userId: string;
  date: string;
  steps: number;
  stepsGoal: number;
  stepsProgress: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  caloriesGoal: number;
  caloriesProgress: number;
  waterMl: number;
  waterGoalMl: number;
  waterProgress: number;
  sleepMinutes: number;
  sleepGoalMinutes: number;
  sleepProgress: number;
  createdDate: string;
}

export interface FitnessWeight {
  id: string;
  userId: string;
  weightKg: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  notes?: string;
  recordedAt: string;
  createdDate: string;
}

export interface FitnessActivity {
  id: string;
  userId: string;
  activityType: number;
  activityName?: string;
  durationMinutes: number;
  caloriesBurned?: number;
  distanceKm?: number;
  steps?: number;
  avgHeartRate?: number;
  notes?: string;
  startedAt: string;
  createdDate: string;
}

export interface FitnessSleep {
  id: string;
  userId: string;
  sleepStart: string;
  sleepEnd: string;
  durationMinutes: number;
  quality: number;
  deepSleepMinutes?: number;
  lightSleepMinutes?: number;
  remSleepMinutes?: number;
  awakeMinutes?: number;
  notes?: string;
  createdDate: string;
}

export interface FitnessGoal {
  id: string;
  userId: string;
  goalType: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate?: string;
  isCompleted: boolean;
  createdDate: string;
}

export interface FitnessHealthSync {
  id: string;
  userId: string;
  dataSource: number;
  lastSyncAt: string;
  isEnabled: boolean;
  accessToken?: string;
  refreshToken?: string;
  createdDate: string;
}

export interface FitnessDashboard {
  todayLog: FitnessDailyLog | null;
  currentWeight: FitnessWeight | null;
  recentActivities: FitnessActivity[];
  lastNightSleep: FitnessSleep | null;
  activeGoals: FitnessGoal[];
  healthSync: FitnessHealthSync | null;
}

// DTO para sincronização de dados do HealthKit/Health Connect
export interface FitnessSyncDataRequestDTO {
  dataSource: number; // 0 = AppleHealth, 1 = GoogleHealthConnect
  syncedAt: string;
  dailyLog?: {
    date: string;
    steps: number;
    stepsGoal: number;
    caloriesBurned: number;
    caloriesConsumed: number;
    caloriesGoal: number;
    waterMl: number;
    waterGoalMl: number;
    sleepMinutes: number;
    sleepGoalMinutes: number;
  };
  weight?: {
    weightKg: number;
    bodyFatPercentage?: number;
    muscleMassKg?: number;
    recordedAt: string;
  };
  activities?: {
    activityType: number;
    activityName?: string;
    durationMinutes: number;
    caloriesBurned?: number;
    distanceKm?: number;
    steps?: number;
    avgHeartRate?: number;
    startedAt: string;
  }[];
  sleep?: {
    sleepStart: string;
    sleepEnd: string;
    durationMinutes: number;
    quality?: number;
    deepSleepMinutes?: number;
    lightSleepMinutes?: number;
    remSleepMinutes?: number;
  };
}

/**
 * Verifica se o módulo fitness está habilitado
 */
export async function isFitnessEnabled(): Promise<boolean> {
  try {
    const enabled = await AsyncStorage.getItem(FITNESS_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('[FITNESS_SERVICE] Erro ao verificar se fitness está habilitado:', error);
    return false;
  }
}

/**
 * Habilita ou desabilita o módulo fitness
 */
export async function setFitnessEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(FITNESS_ENABLED_KEY, enabled.toString());
    console.log(`[FITNESS_SERVICE] Fitness ${enabled ? 'habilitado' : 'desabilitado'}`);
  } catch (error) {
    console.error('[FITNESS_SERVICE] Erro ao salvar preferência de fitness:', error);
    throw error;
  }
}

/**
 * Busca o dashboard completo do fitness
 */
export async function getFitnessDashboard(): Promise<FitnessDashboard | null> {
  try {
    console.log('[FITNESS_SERVICE] Buscando dashboard do fitness...');

    const response = await api.get<{ success: boolean; data: FitnessDashboard }>('fitness/dashboard');

    console.log('[FITNESS_SERVICE] Dashboard recuperado com sucesso');
    return response.data.data;
  } catch (error: any) {
    // 404 é esperado quando não há dados ainda
    if (error.response?.status === 404) {
      console.log('[FITNESS_SERVICE] Nenhum dado de fitness encontrado');
      return null;
    }

    console.error('[FITNESS_SERVICE] Erro ao buscar dashboard:', error);
    throw error;
  }
}

/**
 * Cria ou atualiza o log diário
 */
export async function saveDailyLog(data: Partial<FitnessDailyLog>): Promise<FitnessDailyLog> {
  try {
    console.log('[FITNESS_SERVICE] Salvando log diário:', data);

    const response = await api.post<{ success: boolean; data: FitnessDailyLog }>('fitness/daily-log', data);

    console.log('[FITNESS_SERVICE] Log diário salvo com sucesso');
    return response.data.data;
  } catch (error: any) {
    console.error('[FITNESS_SERVICE] Erro ao salvar log diário:', error);
    throw error;
  }
}

/**
 * Registra uma atividade física
 */
export async function createActivity(data: Partial<FitnessActivity>): Promise<FitnessActivity> {
  try {
    console.log('[FITNESS_SERVICE] Registrando atividade:', data);

    const response = await api.post<{ success: boolean; data: FitnessActivity }>('fitness/activities', data);

    console.log('[FITNESS_SERVICE] Atividade registrada com sucesso');
    return response.data.data;
  } catch (error: any) {
    console.error('[FITNESS_SERVICE] Erro ao registrar atividade:', error);
    throw error;
  }
}

/**
 * Registra o peso
 */
export async function createWeight(data: Partial<FitnessWeight>): Promise<FitnessWeight> {
  try {
    console.log('[FITNESS_SERVICE] Registrando peso:', data);

    const response = await api.post<{ success: boolean; data: FitnessWeight }>('fitness/weight', data);

    console.log('[FITNESS_SERVICE] Peso registrado com sucesso');
    return response.data.data;
  } catch (error: any) {
    console.error('[FITNESS_SERVICE] Erro ao registrar peso:', error);
    throw error;
  }
}

/**
 * Registra dados de sono
 */
export async function createSleep(data: Partial<FitnessSleep>): Promise<FitnessSleep> {
  try {
    console.log('[FITNESS_SERVICE] Registrando sono:', data);

    const response = await api.post<{ success: boolean; data: FitnessSleep }>('fitness/sleep', data);

    console.log('[FITNESS_SERVICE] Sono registrado com sucesso');
    return response.data.data;
  } catch (error: any) {
    console.error('[FITNESS_SERVICE] Erro ao registrar sono:', error);
    throw error;
  }
}

/**
 * Busca histórico de peso
 */
export async function getWeightHistory(months: number = 6): Promise<FitnessWeight[]> {
  try {
    console.log('[FITNESS_SERVICE] Buscando histórico de peso...');

    const response = await api.get<{ success: boolean; data: FitnessWeight[] }>(
      `fitness/weight/history?months=${months}`
    );

    console.log('[FITNESS_SERVICE] Histórico de peso recuperado');
    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error('[FITNESS_SERVICE] Erro ao buscar histórico de peso:', error);
    throw error;
  }
}

/**
 * Busca atividades em um período
 */
export async function getActivities(startDate: string, endDate: string): Promise<FitnessActivity[]> {
  try {
    console.log('[FITNESS_SERVICE] Buscando atividades...');

    const response = await api.get<{ success: boolean; data: FitnessActivity[] }>(
      `fitness/activities?startDate=${startDate}&endDate=${endDate}`
    );

    console.log('[FITNESS_SERVICE] Atividades recuperadas');
    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error('[FITNESS_SERVICE] Erro ao buscar atividades:', error);
    throw error;
  }
}
