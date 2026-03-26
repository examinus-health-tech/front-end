import { Platform } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { FitnessSyncDataRequestDTO } from './fitnessService';

// Tipos de dados que lemos do Health Connect
export interface HealthConnectData {
  steps: number;
  distance: number; // em km
  caloriesBurned: number;
  sleepMinutes: number;
  waterMl: number;
  weightKg: number | null;
  date: Date;
}

// Verifica se Health Connect está disponível (só Android)
export async function isHealthConnectAvailable(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    if (__DEV__) console.log('[HEALTH_CONNECT] Health Connect não disponível - plataforma:', Platform.OS);
    return false;
  }

  try {
    // Timeout de segurança para evitar travamento caso o SDK não responda
    const statusPromise = getSdkStatus();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout ao verificar SDK status')), 5000)
    );

    const status = await Promise.race([statusPromise, timeoutPromise]);
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
      if (__DEV__) console.log('[HEALTH_CONNECT] SDK disponível');
      return true;
    } else if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
      if (__DEV__) console.log('[HEALTH_CONNECT] Health Connect precisa ser atualizado');
      return false;
    } else {
      if (__DEV__) console.log('[HEALTH_CONNECT] SDK não disponível:', status);
      return false;
    }
  } catch (error) {
    if (__DEV__) console.error('[HEALTH_CONNECT] Erro ao verificar disponibilidade:', error);
    return false;
  }
}

// Flag para evitar múltiplas tentativas de inicialização simultâneas
let isInitializing = false;
let isInitialized = false;

// Inicializa o Health Connect e solicita permissões
export async function initHealthConnect(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  // Evita inicialização duplicada
  if (isInitialized) {
    return true;
  }

  if (isInitializing) {
    if (__DEV__) console.log('[HEALTH_CONNECT] Já está inicializando, aguardando...');
    // Aguarda a inicialização em andamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    return isInitialized;
  }

  isInitializing = true;

  try {
    // Inicializa o SDK com timeout de segurança
    let initialized = false;
    try {
      const initPromise = initialize();
      const timeoutPromise = new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), 5000)
      );
      initialized = await Promise.race([initPromise, timeoutPromise]);
    } catch (initError) {
      if (__DEV__) console.error('[HEALTH_CONNECT] Exceção ao inicializar SDK:', initError);
      isInitializing = false;
      return false;
    }

    if (!initialized) {
      if (__DEV__) console.error('[HEALTH_CONNECT] Falha ao inicializar (timeout ou retorno false)');
      isInitializing = false;
      return false;
    }

    if (__DEV__) console.log('[HEALTH_CONNECT] SDK inicializado');

    // Solicita permissões com retry em caso de erro de inicialização do delegate
    let retries = 3;
    while (retries > 0) {
      try {
        const permPromise = requestPermission([
          { accessType: 'read', recordType: 'Steps' },
          { accessType: 'read', recordType: 'Distance' },
          { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
          { accessType: 'read', recordType: 'TotalCaloriesBurned' },
          { accessType: 'read', recordType: 'SleepSession' },
          { accessType: 'read', recordType: 'Hydration' },
          { accessType: 'read', recordType: 'Weight' },
        ]);

        // Timeout para requestPermission - pode travar se o Health Connect não responder
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout ao solicitar permissões')), 10000)
        );

        const permissions = await Promise.race([permPromise, timeoutPromise]);

        if (__DEV__) console.log('[HEALTH_CONNECT] Permissões concedidas:', permissions);
        isInitialized = true;
        isInitializing = false;
        return true;
      } catch (permError: any) {
        const errorMsg = permError?.message || '';
        // Erro específico de lateinit property não inicializada ou timeout
        if (errorMsg.includes('lateinit property') ||
            errorMsg.includes('requestPermission has not been initialized') ||
            errorMsg.includes('Timeout')) {
          if (__DEV__) console.warn(`[HEALTH_CONNECT] Tentativa ${4 - retries}/3 falhou: ${errorMsg}`);
          retries--;
          // Aguarda antes de tentar novamente (delay crescente)
          await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
          // Tenta reinicializar o SDK
          try {
            await initialize();
          } catch (reinitError) {
            if (__DEV__) console.warn('[HEALTH_CONNECT] Erro ao reinicializar:', reinitError);
          }
        } else {
          if (__DEV__) console.error('[HEALTH_CONNECT] Erro não recuperável em permissões:', permError);
          isInitializing = false;
          return false;
        }
      }
    }

    // Se chegou aqui, não conseguiu após retries
    if (__DEV__) console.warn('[HEALTH_CONNECT] Não foi possível solicitar permissões após 3 tentativas');
    isInitializing = false;
    return false;
  } catch (error) {
    if (__DEV__) console.error('[HEALTH_CONNECT] Erro fatal ao inicializar:', error);
    isInitializing = false;
    return false;
  }
}

// Busca os passos do dia
async function getSteps(startDate: Date, endDate: Date): Promise<number> {
  try {
    const result = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    const total = result.records.reduce((sum, record: any) => sum + (record.count || 0), 0);
    return total;
  } catch (error) {
    if (__DEV__) console.warn('[HEALTH_CONNECT] Erro ao buscar passos:', error);
    return 0;
  }
}

// Busca distância caminhada/corrida do dia
async function getDistance(startDate: Date, endDate: Date): Promise<number> {
  try {
    const result = await readRecords('Distance', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    // Soma todas as distâncias e converte metros para km
    const totalMeters = result.records.reduce((sum, record: any) => {
      return sum + (record.distance?.inMeters || 0);
    }, 0);

    return totalMeters / 1000;
  } catch (error) {
    if (__DEV__) console.warn('[HEALTH_CONNECT] Erro ao buscar distância:', error);
    return 0;
  }
}

// Busca calorias queimadas do dia
async function getCaloriesBurned(startDate: Date, endDate: Date): Promise<number> {
  try {
    // Tenta buscar calorias ativas primeiro
    const activeResult = await readRecords('ActiveCaloriesBurned', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    const activeCalories = activeResult.records.reduce((sum, record: any) => {
      return sum + (record.energy?.inKilocalories || 0);
    }, 0);

    // Também busca calorias totais se disponível
    try {
      const totalResult = await readRecords('TotalCaloriesBurned', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      const totalCalories = totalResult.records.reduce((sum, record: any) => {
        return sum + (record.energy?.inKilocalories || 0);
      }, 0);

      // Retorna o maior valor entre ativas e totais
      return Math.round(Math.max(activeCalories, totalCalories));
    } catch {
      return Math.round(activeCalories);
    }
  } catch (error) {
    if (__DEV__) console.warn('[HEALTH_CONNECT] Erro ao buscar calorias:', error);
    return 0;
  }
}

// Busca dados de sono da noite anterior
async function getSleep(startDate: Date, endDate: Date): Promise<number> {
  try {
    // Busca sono das últimas 24h (para pegar a noite anterior)
    const sleepStart = new Date(startDate);
    sleepStart.setDate(sleepStart.getDate() - 1);
    sleepStart.setHours(18, 0, 0, 0);

    const sleepEnd = new Date(endDate);
    sleepEnd.setHours(12, 0, 0, 0);

    const result = await readRecords('SleepSession', {
      timeRangeFilter: {
        operator: 'between',
        startTime: sleepStart.toISOString(),
        endTime: sleepEnd.toISOString(),
      },
    });

    // Calcula total em minutos
    let totalMinutes = 0;
    result.records.forEach((record: any) => {
      const start = new Date(record.startTime);
      const end = new Date(record.endTime);
      totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
    });

    return Math.round(totalMinutes);
  } catch (error) {
    if (__DEV__) console.warn('[HEALTH_CONNECT] Erro ao buscar sono:', error);
    return 0;
  }
}

// Busca consumo de água do dia
async function getWater(startDate: Date, endDate: Date): Promise<number> {
  try {
    const result = await readRecords('Hydration', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    // Soma todo o consumo do dia (em litros, converte para ml)
    const totalLiters = result.records.reduce((sum, record: any) => {
      return sum + (record.volume?.inLiters || 0);
    }, 0);

    return Math.round(totalLiters * 1000);
  } catch (error) {
    if (__DEV__) console.warn('[HEALTH_CONNECT] Erro ao buscar água:', error);
    return 0;
  }
}

// Busca peso mais recente
async function getWeight(startDate: Date, endDate: Date): Promise<number | null> {
  try {
    // Busca pesos dos últimos 30 dias
    const weightStart = new Date(startDate);
    weightStart.setDate(weightStart.getDate() - 30);

    const result = await readRecords('Weight', {
      timeRangeFilter: {
        operator: 'between',
        startTime: weightStart.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    if (result.records.length === 0) {
      return null;
    }

    // Pega o registro mais recente
    const sortedRecords = result.records.sort((a: any, b: any) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    return sortedRecords[0]?.weight?.inKilograms || null;
  } catch (error) {
    if (__DEV__) console.warn('[HEALTH_CONNECT] Erro ao buscar peso:', error);
    return null;
  }
}

// Dados vazios padrão
function emptyHealthData(date: Date): HealthConnectData {
  return {
    steps: 0,
    distance: 0,
    caloriesBurned: 0,
    sleepMinutes: 0,
    waterMl: 0,
    weightKg: null,
    date,
  };
}

// Busca todos os dados de saúde do dia
export async function getHealthConnectDataForDate(date: Date = new Date()): Promise<HealthConnectData> {
  try {
    const isAvailable = await isHealthConnectAvailable();

    if (!isAvailable) {
      return emptyHealthData(date);
    }

    if (__DEV__) console.log('[HEALTH_CONNECT] Buscando dados para:', date.toISOString());

    // Define intervalo do dia
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Busca todos os dados em paralelo
    const [steps, distance, caloriesBurned, sleepMinutes, waterMl, weightKg] = await Promise.all([
      getSteps(startOfDay, endOfDay),
      getDistance(startOfDay, endOfDay),
      getCaloriesBurned(startOfDay, endOfDay),
      getSleep(startOfDay, endOfDay),
      getWater(startOfDay, endOfDay),
      getWeight(startOfDay, endOfDay),
    ]);

    const data: HealthConnectData = {
      steps,
      distance,
      caloriesBurned,
      sleepMinutes,
      waterMl,
      weightKg,
      date,
    };

    if (__DEV__) console.log('[HEALTH_CONNECT] Dados coletados com sucesso');
    return data;
  } catch (error) {
    if (__DEV__) console.error('[HEALTH_CONNECT] Erro fatal ao buscar dados do dia:', error);
    return emptyHealthData(date);
  }
}

// Converte dados do Health Connect para o formato de sincronização do backend
export function convertToSyncData(healthData: HealthConnectData): FitnessSyncDataRequestDTO {
  return {
    dataSource: 1, // 1 = GoogleHealthConnect
    syncedAt: new Date().toISOString(),
    dailyLog: {
      date: healthData.date.toISOString(),
      steps: healthData.steps,
      stepsGoal: 10000, // Meta padrão
      caloriesBurned: healthData.caloriesBurned,
      caloriesConsumed: 0, // Health Connect não tem isso
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
      activityName: 'Caminhada (Health Connect)',
      durationMinutes: Math.round(healthData.steps / 100), // Estimativa
      caloriesBurned: healthData.caloriesBurned,
      distanceKm: healthData.distance,
      steps: healthData.steps,
      startedAt: healthData.date.toISOString(),
    }] : [],
  };
}

// Sincroniza dados do Health Connect com o backend
export async function syncHealthConnectToBackend(): Promise<void> {
  try {
    // Inicializa Health Connect se ainda não foi
    const initialized = await initHealthConnect();
    if (!initialized) {
      if (__DEV__) console.warn('[HEALTH_CONNECT] Não foi possível inicializar');
      return;
    }

    // Busca dados de hoje
    const healthData = await getHealthConnectDataForDate(new Date());

    // Converte para formato do backend
    const syncData = convertToSyncData(healthData);

    if (!syncData.dailyLog && !syncData.weight) {
      if (__DEV__) console.log('[HEALTH_CONNECT] Nenhum dado para sincronizar');
      return;
    }

    const { saveDailyLog, createWeight, getDailyLogByDate } = await import('./fitnessService');

    // Salva o daily log, preservando dados manuais
    if (syncData.dailyLog) {
      const currentLog = await getDailyLogByDate(syncData.dailyLog.date);

      // Usa o maior valor entre Health Connect e backend para dados cumulativos (nunca diminui)
      const safeMax = (a: number, b: number | undefined) => Math.max(a, Number(b) || 0);

      await saveDailyLog({
        date: syncData.dailyLog.date,
        // Dados cumulativos: sempre usa o maior valor (Health Connect vs backend)
        steps: safeMax(syncData.dailyLog.steps, currentLog?.steps),
        caloriesBurned: safeMax(syncData.dailyLog.caloriesBurned, currentLog?.caloriesBurned),
        sleepMinutes: safeMax(syncData.dailyLog.sleepMinutes, currentLog?.sleepMinutes),
        // Metas
        stepsGoal: syncData.dailyLog.stepsGoal,
        sleepGoalMinutes: syncData.dailyLog.sleepGoalMinutes,
        // Dados manuais (preserva do backend se existirem)
        caloriesConsumed: currentLog?.caloriesConsumed ?? syncData.dailyLog.caloriesConsumed,
        caloriesGoal: currentLog?.caloriesGoal ?? syncData.dailyLog.caloriesGoal,
        waterMl: currentLog?.waterMl ?? syncData.dailyLog.waterMl,
        waterGoalMl: currentLog?.waterGoalMl ?? syncData.dailyLog.waterGoalMl,
      });
      if (__DEV__) console.log('[HEALTH_CONNECT] Daily log sincronizado com backend (dados protegidos)');
    }

    // Salva o peso se disponível
    if (syncData.weight) {
      await createWeight({
        weightKg: syncData.weight.weightKg,
        recordedAt: syncData.weight.recordedAt,
      });
      if (__DEV__) console.log('[HEALTH_CONNECT] Peso sincronizado com backend');
    }

    if (__DEV__) console.log('[HEALTH_CONNECT] Sincronização concluída com sucesso');
  } catch (error) {
    if (__DEV__) console.error('[HEALTH_CONNECT] Erro na sincronização:', error);
    throw error;
  }
}
