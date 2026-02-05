import { Platform } from 'react-native';
import { FitnessSyncDataRequestDTO } from './fitnessService';

// Tipo para dados do HealthKit (compatível com HomeContext)
export interface HealthKitData {
  steps: number;
  distance: number;
  caloriesBurned: number;
  sleepMinutes: number;
  waterMl: number;
  weightKg: number | null;
  heartRate: number | null;
}

// Identificadores de tipos (strings conforme API v12)
const QUANTITY_TYPES = {
  stepCount: 'HKQuantityTypeIdentifierStepCount',
  distanceWalkingRunning: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
  activeEnergyBurned: 'HKQuantityTypeIdentifierActiveEnergyBurned',
  basalEnergyBurned: 'HKQuantityTypeIdentifierBasalEnergyBurned',
  bodyMass: 'HKQuantityTypeIdentifierBodyMass',
  heartRate: 'HKQuantityTypeIdentifierHeartRate',
  dietaryWater: 'HKQuantityTypeIdentifierDietaryWater',
} as const;

const CATEGORY_TYPES = {
  sleepAnalysis: 'HKCategoryTypeIdentifierSleepAnalysis',
} as const;

// Importação lazy para evitar crash em Android
let HealthKitModule: typeof import('@kingstinct/react-native-healthkit') | null = null;

async function loadHealthKitModule(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  if (HealthKitModule !== null) {
    return true;
  }

  try {
    const module = await import('@kingstinct/react-native-healthkit');
    HealthKitModule = module;
    console.log('[HealthKit] Módulo carregado com sucesso');
    return true;
  } catch (error) {
    console.error('[HealthKit] Erro ao carregar módulo:', error);
    return false;
  }
}

/**
 * Verifica se o HealthKit está disponível
 */
export async function isHealthKitAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    console.log('[HealthKit] Não disponível - plataforma não é iOS');
    return false;
  }

  const loaded = await loadHealthKitModule();
  if (!loaded || !HealthKitModule) {
    return false;
  }

  try {
    const available = await HealthKitModule.isHealthDataAvailable();
    console.log('[HealthKit] isHealthDataAvailable:', available);
    return available;
  } catch (error) {
    console.error('[HealthKit] Erro ao verificar disponibilidade:', error);
    return false;
  }
}

/**
 * Inicializa o HealthKit solicitando permissões
 */
export async function initHealthKit(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  const loaded = await loadHealthKitModule();
  if (!loaded || !HealthKitModule) {
    console.error('[HealthKit] Módulo não carregado');
    return false;
  }

  try {
    const readPermissions = [
      QUANTITY_TYPES.stepCount,
      QUANTITY_TYPES.distanceWalkingRunning,
      QUANTITY_TYPES.activeEnergyBurned,
      QUANTITY_TYPES.basalEnergyBurned,
      QUANTITY_TYPES.bodyMass,
      QUANTITY_TYPES.heartRate,
      QUANTITY_TYPES.dietaryWater,
      CATEGORY_TYPES.sleepAnalysis,
    ];

    console.log('[HealthKit] Solicitando autorização...');
    const granted = await HealthKitModule.requestAuthorization({
      toRead: readPermissions,
    });
    console.log('[HealthKit] Autorização concedida:', granted);
    return granted;
  } catch (error) {
    console.error('[HealthKit] Erro ao solicitar autorização:', error);
    return false;
  }
}

// Função auxiliar para executar promessas e capturar erros
async function safePromise<T>(promise: Promise<T>): Promise<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: any }> {
  try {
    const value = await promise;
    return { status: 'fulfilled', value };
  } catch (reason) {
    return { status: 'rejected', reason };
  }
}

/**
 * Busca dados do HealthKit para uma data específica
 */
export async function getHealthKitDataForDate(date: Date): Promise<HealthKitData> {
  const defaultData: HealthKitData = {
    steps: 0,
    distance: 0,
    caloriesBurned: 0,
    sleepMinutes: 0,
    waterMl: 0,
    weightKg: null,
    heartRate: null,
  };

  if (Platform.OS !== 'ios') {
    return defaultData;
  }

  const loaded = await loadHealthKitModule();
  if (!loaded || !HealthKitModule) {
    return defaultData;
  }

  try {
    // Define o intervalo do dia
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('[HealthKit] Buscando dados para:', date.toISOString().split('T')[0]);

    // Opções de filtro para o período do dia (API v12)
    const dateFilter = {
      filter: {
        date: {
          startDate: startOfDay,
          endDate: endOfDay,
        },
      },
      limit: 0, // 0 = todos os samples
    };

    // Buscar dados em paralelo usando queryQuantitySamples
    const [
      stepsResult,
      distanceResult,
      activeEnergyResult,
      basalEnergyResult,
      waterResult,
      weightResult,
      heartRateResult,
      sleepResult,
    ] = await Promise.all([
      safePromise(HealthKitModule.queryQuantitySamples(QUANTITY_TYPES.stepCount as any, dateFilter)),
      safePromise(HealthKitModule.queryQuantitySamples(QUANTITY_TYPES.distanceWalkingRunning as any, dateFilter)),
      safePromise(HealthKitModule.queryQuantitySamples(QUANTITY_TYPES.activeEnergyBurned as any, dateFilter)),
      safePromise(HealthKitModule.queryQuantitySamples(QUANTITY_TYPES.basalEnergyBurned as any, dateFilter)),
      safePromise(HealthKitModule.queryQuantitySamples(QUANTITY_TYPES.dietaryWater as any, dateFilter)),
      safePromise(HealthKitModule.getMostRecentQuantitySample(QUANTITY_TYPES.bodyMass as any)),
      safePromise(HealthKitModule.getMostRecentQuantitySample(QUANTITY_TYPES.heartRate as any)),
      safePromise(HealthKitModule.queryCategorySamples(CATEGORY_TYPES.sleepAnalysis as any, dateFilter)),
    ]);

    // Função para somar samples
    const sumSamples = (result: any): number => {
      if (result.status !== 'fulfilled' || !result.value) return 0;
      const samples = Array.isArray(result.value) ? result.value : [];
      return samples.reduce((sum: number, sample: any) => sum + (sample.quantity || 0), 0);
    };

    // Calcular totais
    const steps = Math.round(sumSamples(stepsResult));
    const distance = sumSamples(distanceResult); // já vem em metros
    const activeEnergy = sumSamples(activeEnergyResult);
    const basalEnergy = sumSamples(basalEnergyResult);
    const caloriesBurned = Math.round(activeEnergy + basalEnergy);
    const waterMl = Math.round(sumSamples(waterResult) * 1000); // L para ml

    // Peso (mais recente)
    let weightKg: number | null = null;
    if (weightResult.status === 'fulfilled' && weightResult.value) {
      weightKg = (weightResult.value as any).quantity || null;
    }

    // Frequência cardíaca (mais recente)
    let heartRate: number | null = null;
    if (heartRateResult.status === 'fulfilled' && heartRateResult.value) {
      heartRate = Math.round((heartRateResult.value as any).quantity || 0);
    }

    // Sono em minutos
    let sleepMinutes = 0;
    if (sleepResult.status === 'fulfilled' && sleepResult.value) {
      const samples = Array.isArray(sleepResult.value) ? sleepResult.value : [];
      for (const sample of samples) {
        const start = new Date(sample.startDate);
        const end = new Date(sample.endDate);
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        sleepMinutes += durationMinutes;
      }
    }

    const result: HealthKitData = {
      steps,
      distance: Math.round(distance),
      caloriesBurned,
      sleepMinutes: Math.round(sleepMinutes),
      waterMl,
      weightKg,
      heartRate,
    };

    console.log('[HealthKit] Dados obtidos:', result);
    return result;
  } catch (error) {
    console.error('[HealthKit] Erro ao buscar dados:', error);
    return defaultData;
  }
}

/**
 * Busca dados para sincronização com backend
 */
export async function getHealthKitDataForSync(): Promise<FitnessSyncDataRequestDTO | null> {
  if (Platform.OS !== 'ios') {
    return null;
  }

  const loaded = await loadHealthKitModule();
  if (!loaded || !HealthKitModule) {
    return null;
  }

  try {
    const today = new Date();
    const data = await getHealthKitDataForDate(today);

    // Só retornar se tiver algum dado
    if (data.steps === 0 && data.caloriesBurned === 0 && data.distance === 0) {
      console.log('[HealthKit] Nenhum dado para sincronizar');
      return null;
    }

    const syncData: FitnessSyncDataRequestDTO = {
      dataSource: 0, // 0 = AppleHealth
      syncedAt: new Date().toISOString(),
      dailyLog: {
        date: today.toISOString().split('T')[0],
        steps: data.steps,
        stepsGoal: 10000,
        caloriesBurned: data.caloriesBurned,
        caloriesConsumed: 0,
        caloriesGoal: 2000,
        waterMl: data.waterMl,
        waterGoalMl: 2000,
        sleepMinutes: data.sleepMinutes,
        sleepGoalMinutes: 480,
      },
      weight: data.weightKg ? {
        weightKg: data.weightKg,
        recordedAt: new Date().toISOString(),
      } : undefined,
    };

    console.log('[HealthKit] Dados para sync preparados');
    return syncData;
  } catch (error) {
    console.error('[HealthKit] Erro ao preparar sync:', error);
    return null;
  }
}

/**
 * Sincroniza dados com o backend
 */
export async function syncHealthKitToBackend(): Promise<boolean> {
  const syncData = await getHealthKitDataForSync();
  if (!syncData) {
    console.log('[HealthKit] Nenhum dado para sincronizar');
    return false;
  }

  // A sincronização real é feita pelo fitnessService
  console.log('[HealthKit] Dados preparados para sync');
  return true;
}
