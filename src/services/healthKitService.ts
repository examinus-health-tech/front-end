import { Platform } from 'react-native';
import Healthkit, {
  AuthorizationRequestStatus,
  queryQuantitySamples,
  queryCategorySamples,
  type QuantityTypeIdentifier,
  type CategoryTypeIdentifier,
} from '@kingstinct/react-native-healthkit';
import { FitnessSyncDataRequestDTO } from './fitnessService';

// Tipo para dados do HealthKit (compatível com HomeContext)
export interface HealthKitData {
  steps: number;
  distance: number; // em km
  caloriesBurned: number;
  sleepMinutes: number;
  waterMl: number;
  weightKg: number | null;
  heartRate: number | null;
}

// Tipos de dados que lemos do HealthKit (string literals)
const HEALTHKIT_READ_PERMISSIONS: (QuantityTypeIdentifier | CategoryTypeIdentifier)[] = [
  'HKQuantityTypeIdentifierStepCount',
  'HKQuantityTypeIdentifierDistanceWalkingRunning',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKQuantityTypeIdentifierBasalEnergyBurned',
  'HKQuantityTypeIdentifierBodyMass',
  'HKQuantityTypeIdentifierHeartRate',
  'HKQuantityTypeIdentifierDietaryWater',
  'HKCategoryTypeIdentifierSleepAnalysis',
];

/**
 * Verifica se o HealthKit esta disponivel no dispositivo
 */
export async function isHealthKitAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    const available = Healthkit.isHealthDataAvailable();
    console.log('[HealthKit] Disponivel:', available);
    return available;
  } catch (error) {
    console.error('[HealthKit] Erro ao verificar disponibilidade:', error);
    return false;
  }
}

/**
 * Solicita permissoes do HealthKit
 */
export async function requestHealthKitPermissions(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    console.log('[HealthKit] Nao disponivel em Android');
    return false;
  }

  try {
    const granted = await Healthkit.requestAuthorization(HEALTHKIT_READ_PERMISSIONS);
    console.log('[HealthKit] Autorizacao concedida:', granted);
    return granted;
  } catch (error) {
    console.error('[HealthKit] Erro ao solicitar permissoes:', error);
    return false;
  }
}

/**
 * Verifica se as permissoes foram concedidas
 */
export async function checkHealthKitPermissions(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    const status = await Healthkit.getRequestStatusForAuthorization(HEALTHKIT_READ_PERMISSIONS);
    return status === AuthorizationRequestStatus.unnecessary;
  } catch (error) {
    console.error('[HealthKit] Erro ao verificar permissoes:', error);
    return false;
  }
}

/**
 * Busca dados de passos do dia
 */
export async function getStepsToday(): Promise<number> {
  if (Platform.OS !== 'ios') return 0;

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const samples = await queryQuantitySamples('HKQuantityTypeIdentifierStepCount', {
      filter: {
        date: {
          startDate: startOfDay,
          endDate: now,
        },
      },
      limit: 0, // 0 ou negativo = sem limite
    });

    const totalSteps = samples.reduce((sum, sample) => sum + sample.quantity, 0);
    console.log('[HealthKit] Passos hoje:', totalSteps);
    return Math.round(totalSteps);
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar passos:', error);
    return 0;
  }
}

/**
 * Busca distancia percorrida do dia (em metros)
 */
export async function getDistanceToday(): Promise<number> {
  if (Platform.OS !== 'ios') return 0;

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const samples = await queryQuantitySamples('HKQuantityTypeIdentifierDistanceWalkingRunning', {
      filter: {
        date: {
          startDate: startOfDay,
          endDate: now,
        },
      },
      limit: 0,
    });

    const totalDistance = samples.reduce((sum, sample) => sum + sample.quantity, 0);
    console.log('[HealthKit] Distancia hoje (m):', totalDistance);
    return Math.round(totalDistance);
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar distancia:', error);
    return 0;
  }
}

/**
 * Busca calorias ativas do dia
 */
export async function getActiveCaloriesToday(): Promise<number> {
  if (Platform.OS !== 'ios') return 0;

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const samples = await queryQuantitySamples('HKQuantityTypeIdentifierActiveEnergyBurned', {
      filter: {
        date: {
          startDate: startOfDay,
          endDate: now,
        },
      },
      limit: 0,
    });

    const totalCalories = samples.reduce((sum, sample) => sum + sample.quantity, 0);
    console.log('[HealthKit] Calorias ativas hoje:', totalCalories);
    return Math.round(totalCalories);
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar calorias ativas:', error);
    return 0;
  }
}

/**
 * Busca calorias basais do dia
 */
export async function getBasalCaloriesToday(): Promise<number> {
  if (Platform.OS !== 'ios') return 0;

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const samples = await queryQuantitySamples('HKQuantityTypeIdentifierBasalEnergyBurned', {
      filter: {
        date: {
          startDate: startOfDay,
          endDate: now,
        },
      },
      limit: 0,
    });

    const totalCalories = samples.reduce((sum, sample) => sum + sample.quantity, 0);
    console.log('[HealthKit] Calorias basais hoje:', totalCalories);
    return Math.round(totalCalories);
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar calorias basais:', error);
    return 0;
  }
}

/**
 * Busca calorias totais do dia (ativas + basais)
 */
export async function getTotalCaloriesToday(): Promise<number> {
  const activeCalories = await getActiveCaloriesToday();
  const basalCalories = await getBasalCaloriesToday();
  return activeCalories + basalCalories;
}

/**
 * Busca dados de sono da ultima noite (em minutos)
 */
export async function getSleepLastNight(): Promise<number> {
  if (Platform.OS !== 'ios') return 0;

  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(18, 0, 0, 0); // A partir das 18h de ontem

    const samples = await queryCategorySamples('HKCategoryTypeIdentifierSleepAnalysis', {
      filter: {
        date: {
          startDate: yesterday,
          endDate: now,
        },
      },
      limit: 0,
    });

    // Filtrar apenas sono real (nao "in bed")
    // value 1 = asleepUnspecified or similar
    const sleepSamples = samples.filter(
      (sample) => sample.value === 1
    );

    let totalMinutes = 0;
    sleepSamples.forEach((sample) => {
      const start = new Date(sample.startDate);
      const end = new Date(sample.endDate);
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      totalMinutes += durationMinutes;
    });

    console.log('[HealthKit] Sono ultima noite (min):', totalMinutes);
    return Math.round(totalMinutes);
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar sono:', error);
    return 0;
  }
}

/**
 * Busca hidratacao do dia (em ml)
 */
export async function getHydrationToday(): Promise<number> {
  if (Platform.OS !== 'ios') return 0;

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const samples = await queryQuantitySamples('HKQuantityTypeIdentifierDietaryWater', {
      filter: {
        date: {
          startDate: startOfDay,
          endDate: now,
        },
      },
      limit: 0,
    });

    // dietaryWater retorna em litros, converter para ml
    const totalLiters = samples.reduce((sum, sample) => sum + sample.quantity, 0);
    const totalMl = totalLiters * 1000;
    console.log('[HealthKit] Hidratacao hoje (ml):', totalMl);
    return Math.round(totalMl);
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar hidratacao:', error);
    return 0;
  }
}

/**
 * Busca peso mais recente (em kg)
 */
export async function getLatestWeight(): Promise<number | null> {
  if (Platform.OS !== 'ios') return null;

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const samples = await queryQuantitySamples('HKQuantityTypeIdentifierBodyMass', {
      filter: {
        date: {
          startDate: thirtyDaysAgo,
          endDate: now,
        },
      },
      limit: 1,
      ascending: false,
    });

    if (samples.length > 0) {
      const weight = samples[0].quantity;
      console.log('[HealthKit] Peso mais recente (kg):', weight);
      return weight;
    }

    return null;
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar peso:', error);
    return null;
  }
}

/**
 * Busca frequencia cardiaca mais recente
 */
export async function getLatestHeartRate(): Promise<number | null> {
  if (Platform.OS !== 'ios') return null;

  try {
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const samples = await queryQuantitySamples('HKQuantityTypeIdentifierHeartRate', {
      filter: {
        date: {
          startDate: oneDayAgo,
          endDate: now,
        },
      },
      limit: 1,
      ascending: false,
    });

    if (samples.length > 0) {
      const heartRate = samples[0].quantity;
      console.log('[HealthKit] Frequencia cardiaca:', heartRate);
      return Math.round(heartRate);
    }

    return null;
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar frequencia cardiaca:', error);
    return null;
  }
}

/**
 * Busca todos os dados de saude para sincronizacao
 */
export async function getAllHealthData(): Promise<HealthKitData | null> {
  if (Platform.OS !== 'ios') {
    console.log('[HealthKit] Nao disponivel em Android');
    return null;
  }

  try {
    const hasPermissions = await checkHealthKitPermissions();
    if (!hasPermissions) {
      console.log('[HealthKit] Sem permissoes');
      return null;
    }

    return await getHealthKitDataForDate(new Date());
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar todos os dados:', error);
    return null;
  }
}

/**
 * Inicializa o HealthKit e solicita permissoes
 */
export async function initHealthKit(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    const available = Healthkit.isHealthDataAvailable();
    if (!available) {
      console.log('[HealthKit] Nao disponivel neste dispositivo');
      return false;
    }

    const granted = await requestHealthKitPermissions();
    console.log('[HealthKit] Inicializacao completa, permissoes:', granted);
    return granted;
  } catch (error) {
    console.error('[HealthKit] Erro ao inicializar:', error);
    return false;
  }
}

/**
 * Busca dados do HealthKit para uma data especifica
 */
export async function getHealthKitDataForDate(date: Date): Promise<HealthKitData> {
  if (Platform.OS !== 'ios') {
    return {
      steps: 0,
      distance: 0,
      caloriesBurned: 0,
      sleepMinutes: 0,
      waterMl: 0,
      weightKg: null,
      heartRate: null,
    };
  }

  try {
    const [
      steps,
      distanceMeters,
      activeCalories,
      basalCalories,
      sleepMinutes,
      hydrationMl,
      weight,
      heartRate,
    ] = await Promise.all([
      getStepsToday(),
      getDistanceToday(),
      getActiveCaloriesToday(),
      getBasalCaloriesToday(),
      getSleepLastNight(),
      getHydrationToday(),
      getLatestWeight(),
      getLatestHeartRate(),
    ]);

    return {
      steps,
      distance: distanceMeters / 1000, // converte para km
      caloriesBurned: activeCalories + basalCalories,
      sleepMinutes,
      waterMl: hydrationMl,
      weightKg: weight,
      heartRate,
    };
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar dados para data:', error);
    return {
      steps: 0,
      distance: 0,
      caloriesBurned: 0,
      sleepMinutes: 0,
      waterMl: 0,
      weightKg: null,
      heartRate: null,
    };
  }
}

/**
 * Converte dados do HealthKit para o formato de sincronizacao do backend
 */
function convertToSyncData(healthData: HealthKitData): FitnessSyncDataRequestDTO {
  const now = new Date();
  return {
    dataSource: 0, // 0 = AppleHealth
    syncedAt: now.toISOString(),
    dailyLog: {
      date: now.toISOString(),
      steps: healthData.steps,
      stepsGoal: 10000, // Meta padrao
      caloriesBurned: healthData.caloriesBurned,
      caloriesConsumed: 0, // HealthKit nao tem isso
      caloriesGoal: 2000,
      waterMl: healthData.waterMl,
      waterGoalMl: 2000,
      sleepMinutes: healthData.sleepMinutes,
      sleepGoalMinutes: 480, // 8 horas
    },
    weight: healthData.weightKg ? {
      weightKg: healthData.weightKg,
      recordedAt: now.toISOString(),
    } : undefined,
    activities: healthData.distance > 0 ? [{
      activityType: 1, // Walking
      activityName: 'Caminhada (HealthKit)',
      durationMinutes: Math.round(healthData.steps / 100), // Estimativa
      caloriesBurned: healthData.caloriesBurned,
      distanceKm: healthData.distance,
      steps: healthData.steps,
      avgHeartRate: healthData.heartRate || undefined,
      startedAt: now.toISOString(),
    }] : [],
  };
}

/**
 * Sincroniza dados do HealthKit com o backend
 */
export async function syncHealthKitToBackend(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    const healthData = await getHealthKitDataForDate(new Date());
    if (!healthData || (healthData.steps === 0 && !healthData.weightKg)) {
      console.log('[HealthKit] Sem dados para sincronizar');
      return false;
    }

    // Converte para formato do backend
    const syncData = convertToSyncData(healthData);

    console.log('[HealthKit] Dados para sincronizar:', syncData);

    // Importa api dinamicamente para evitar dependencia circular
    const { api } = await import('./api');

    // Envia para o backend
    await api.post('fitness/sync', syncData);

    console.log('[HealthKit] Dados sincronizados com sucesso');
    return true;
  } catch (error) {
    console.error('[HealthKit] Erro ao sincronizar com backend:', error);
    return false;
  }
}
