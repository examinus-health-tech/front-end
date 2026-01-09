import { Platform } from 'react-native';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
  HealthInputOptions,
} from 'react-native-health';
import { FitnessSyncDataRequestDTO } from './fitnessService';

// Permissões que vamos solicitar
const HEALTHKIT_PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Water,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.Height,
      AppleHealthKit.Constants.Permissions.HeartRate,
    ],
    write: [],
  },
};

// Tipos de dados que lemos do HealthKit
export interface HealthKitData {
  steps: number;
  distance: number; // em km
  caloriesBurned: number;
  sleepMinutes: number;
  waterMl: number;
  weightKg: number | null;
  heartRate: number | null;
  date: Date;
}

// Verifica se HealthKit está disponível (só iOS)
export function isHealthKitAvailable(): boolean {
  if (Platform.OS !== 'ios') {
    console.log('[HEALTHKIT] HealthKit não disponível - plataforma:', Platform.OS);
    return false;
  }
  return true;
}

// Inicializa o HealthKit e solicita permissões
export function initHealthKit(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!isHealthKitAvailable()) {
      resolve(false);
      return;
    }

    AppleHealthKit.initHealthKit(HEALTHKIT_PERMISSIONS, (error: string) => {
      if (error) {
        console.error('[HEALTHKIT] Erro ao inicializar:', error);
        reject(new Error(error));
        return;
      }

      console.log('[HEALTHKIT] Inicializado com sucesso');
      resolve(true);
    });
  });
}

// Busca os passos do dia
function getSteps(date: Date): Promise<number> {
  return new Promise((resolve) => {
    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: true,
    };

    AppleHealthKit.getStepCount(options, (error: string, results: HealthValue) => {
      if (error) {
        console.warn('[HEALTHKIT] Erro ao buscar passos:', error);
        resolve(0);
        return;
      }
      resolve(results?.value || 0);
    });
  });
}

// Busca distância caminhada/corrida do dia
function getDistance(date: Date): Promise<number> {
  return new Promise((resolve) => {
    const options: HealthInputOptions = {
      date: date.toISOString(),
      includeManuallyAdded: true,
    };

    AppleHealthKit.getDistanceWalkingRunning(options, (error: string, results: HealthValue) => {
      if (error) {
        console.warn('[HEALTHKIT] Erro ao buscar distância:', error);
        resolve(0);
        return;
      }
      // Converte metros para km
      resolve((results?.value || 0) / 1000);
    });
  });
}

// Busca calorias queimadas do dia
function getCaloriesBurned(date: Date): Promise<number> {
  return new Promise((resolve) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    AppleHealthKit.getActiveEnergyBurned(options, (error: string, results: HealthValue[]) => {
      if (error) {
        console.warn('[HEALTHKIT] Erro ao buscar calorias:', error);
        resolve(0);
        return;
      }

      // Soma todas as calorias do dia
      const total = (results || []).reduce((sum, item) => sum + (item.value || 0), 0);
      resolve(Math.round(total));
    });
  });
}

// Busca dados de sono da noite anterior
function getSleep(date: Date): Promise<number> {
  return new Promise((resolve) => {
    // Busca sono das últimas 24h
    const endDate = new Date(date);
    endDate.setHours(12, 0, 0, 0); // Meio-dia de hoje

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(18, 0, 0, 0); // 18h de ontem

    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    AppleHealthKit.getSleepSamples(options, (error: string, results: any[]) => {
      if (error) {
        console.warn('[HEALTHKIT] Erro ao buscar sono:', error);
        resolve(0);
        return;
      }

      // Filtra apenas sono real (não "in bed")
      const sleepSamples = (results || []).filter(
        sample => sample.value === 'ASLEEP' || sample.value === 'INBED'
      );

      // Calcula total em minutos
      let totalMinutes = 0;
      sleepSamples.forEach(sample => {
        const start = new Date(sample.startDate);
        const end = new Date(sample.endDate);
        totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
      });

      resolve(Math.round(totalMinutes));
    });
  });
}

// Busca consumo de água do dia
function getWater(date: Date): Promise<number> {
  return new Promise((resolve) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    AppleHealthKit.getWater(options, (error: string, results: HealthValue[]) => {
      if (error) {
        console.warn('[HEALTHKIT] Erro ao buscar água:', error);
        resolve(0);
        return;
      }

      // Soma todo o consumo do dia (em litros, converte para ml)
      const totalLiters = (results || []).reduce((sum, item) => sum + (item.value || 0), 0);
      resolve(Math.round(totalLiters * 1000));
    });
  });
}

// Busca peso mais recente
function getWeight(): Promise<number | null> {
  return new Promise((resolve) => {
    const options = {
      unit: 'kg',
    };

    AppleHealthKit.getLatestWeight(options, (error: string, results: HealthValue) => {
      if (error) {
        console.warn('[HEALTHKIT] Erro ao buscar peso:', error);
        resolve(null);
        return;
      }
      resolve(results?.value || null);
    });
  });
}

// Busca frequência cardíaca média do dia
function getHeartRate(date: Date): Promise<number | null> {
  return new Promise((resolve) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    AppleHealthKit.getHeartRateSamples(options, (error: string, results: HealthValue[]) => {
      if (error) {
        console.warn('[HEALTHKIT] Erro ao buscar frequência cardíaca:', error);
        resolve(null);
        return;
      }

      if (!results || results.length === 0) {
        resolve(null);
        return;
      }

      // Calcula média
      const sum = results.reduce((acc, item) => acc + (item.value || 0), 0);
      resolve(Math.round(sum / results.length));
    });
  });
}

// Busca todos os dados de saúde do dia
export async function getHealthKitDataForDate(date: Date = new Date()): Promise<HealthKitData> {
  if (!isHealthKitAvailable()) {
    return {
      steps: 0,
      distance: 0,
      caloriesBurned: 0,
      sleepMinutes: 0,
      waterMl: 0,
      weightKg: null,
      heartRate: null,
      date,
    };
  }

  console.log('[HEALTHKIT] Buscando dados para:', date.toISOString());

  // Busca todos os dados em paralelo
  const [steps, distance, caloriesBurned, sleepMinutes, waterMl, weightKg, heartRate] = await Promise.all([
    getSteps(date),
    getDistance(date),
    getCaloriesBurned(date),
    getSleep(date),
    getWater(date),
    getWeight(),
    getHeartRate(date),
  ]);

  const data: HealthKitData = {
    steps,
    distance,
    caloriesBurned,
    sleepMinutes,
    waterMl,
    weightKg,
    heartRate,
    date,
  };

  console.log('[HEALTHKIT] Dados coletados:', data);
  return data;
}

// Converte dados do HealthKit para o formato de sincronização do backend
export function convertToSyncData(healthData: HealthKitData): FitnessSyncDataRequestDTO {
  return {
    dataSource: 0, // 0 = AppleHealth
    syncedAt: new Date().toISOString(),
    dailyLog: {
      date: healthData.date.toISOString(),
      steps: healthData.steps,
      stepsGoal: 10000, // Meta padrão
      caloriesBurned: healthData.caloriesBurned,
      caloriesConsumed: 0, // HealthKit não tem isso
      caloriesGoal: 2000,
      waterMl: healthData.waterMl,
      waterGoalMl: 2000,
      sleepMinutes: healthData.sleepMinutes,
      sleepGoalMinutes: 480, // 8 horas
    },
    weight: healthData.weightKg ? {
      weightKg: healthData.weightKg,
      recordedAt: healthData.date.toISOString(),
    } : undefined,
    activities: healthData.distance > 0 ? [{
      activityType: 1, // Walking
      activityName: 'Caminhada (Apple Health)',
      durationMinutes: Math.round(healthData.steps / 100), // Estimativa
      caloriesBurned: healthData.caloriesBurned,
      distanceKm: healthData.distance,
      steps: healthData.steps,
      avgHeartRate: healthData.heartRate || undefined,
      startedAt: healthData.date.toISOString(),
    }] : [],
  };
}

// Sincroniza dados do HealthKit com o backend
export async function syncHealthKitToBackend(): Promise<void> {
  try {
    // Inicializa HealthKit se ainda não foi
    await initHealthKit();

    // Busca dados de hoje
    const healthData = await getHealthKitDataForDate(new Date());

    // Converte para formato do backend
    const syncData = convertToSyncData(healthData);

    console.log('[HEALTHKIT] Dados para sincronizar:', syncData);

    // Importa api dinamicamente para evitar dependência circular
    const { api } = await import('./api');

    // Envia para o backend
    await api.post('fitness/sync', syncData);

    console.log('[HEALTHKIT] Sincronização concluída com sucesso');
  } catch (error) {
    console.error('[HEALTHKIT] Erro na sincronização:', error);
    throw error;
  }
}
