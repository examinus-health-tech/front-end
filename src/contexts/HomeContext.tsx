import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ReactNode, createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from 'src/hooks/useAuth';

import { Platform, AppState, AppStateStatus } from 'react-native';

// ⚠️ FLAG TEMPORÁRIA: Desabilita integração Health Connect no Android
// Motivo: Crash no Android por bug do lateinit property com New Architecture (Bridgeless mode)
// O fix nativo (MainActivity.kt) requer novo build. Até lá, Android usa apenas dados do backend.
// iOS (HealthKit) continua funcionando normalmente.
// TODO: Remover após publicação do novo build nativo na Play Store
const DISABLE_ANDROID_HEALTH_CONNECT = true;
import { api } from 'src/services/api';
import { getFitnessDashboard, isFitnessEnabled, setFitnessEnabled as setFitnessEnabledService, FitnessDashboard, syncGoalsFromBackend } from 'src/services/fitnessService';
import {
  isHealthKitAvailable,
  initHealthKit,
  getHealthKitDataForDate,
  syncHealthKitToBackend,
  HealthKitData
} from 'src/services/healthKitService';
import {
  isHealthConnectAvailable,
  initHealthConnect,
  getHealthConnectDataForDate,
  syncHealthConnectToBackend,
  HealthConnectData
} from 'src/services/healthConnectService';

type homeProps = {
  medicalExamId: string;
  createdDate: string;
  generalScore: number;
  generalScoreActionRecommendation: string;
  medicalExamGender: string;
  medicalExamStatus: string;
  medicalExamItems: {
    examItemDescription: string;
    medicalExamItemReferenceValue: string;
    medicalExamItemMeasureUnit: string;
    medicalExamItemScore: number;
    medicalExamItemWeightSummaryExplanation: string;
    medicalExamItemWeightActionRecommendation: string;
    medicalExamItemWeightColor: string;
    medicalExamItemWeightDescription: string;
  }[];
  medicalExamOrganicSystemsScore: {
    examOrganicSystemId: string;
    examOrganicSystemDescription: string;
    organicSystemScore: number;
    organicSystemScoreSummaryExplanation: string;
    organicSystemScoreActionRecommendation: string;
  }[];
};

type trackerProps = {
  kcal: {
    calculation_date: string;
    kcal_completed: string;
    kcal_goal: string | null;
  }[];
  step: {
    calculation_date: string;
    step_completed: string;
    step_goal: string;
    distance_completed: string;
    distance_goal: string;
    hour_completed: string;
    hour_goal: string;
  }[];
  weight: {
    calculation_date: string;
    weight_completed: string;
    weight_goal: null;
  }[];
  hydration: {
    calculation_date: string;
    hydration_completed: string;
    hydration_goal: string;
  }[];
  nutrition: {
    calculation_date: string;
    nutrition_completed: any;
  }[];
  sleep: {
    calculation_date: string;
    sleep_completed: string;
    sleep_goal: string;
  }[];
};

type specificSystemProps = {
  sistema: string;
  nivel: string;
} | null;

export type HomeContextDataProps = {
  homeData: homeProps;
  getHomeData: () => void;
  isLoadingHomeContext: boolean;
  trackerData: trackerProps;
  currentSystem: specificSystemProps;
  setCurrentSystem: (val: specificSystemProps) => void;
  clearHomeData: () => void;
  fitnessEnabled: boolean;
  refreshFitnessData: () => Promise<void>;
  hasExamAnalyzing: boolean;
};

type HomeContextProviderProps = {
  children: ReactNode;
};

export const HomeContext = createContext<HomeContextDataProps>({} as HomeContextDataProps);

export function HomeContextProvider({ children }: HomeContextProviderProps) {
  const [homeData, setHomeData] = useState<homeProps>({} as homeProps);
  const [examListData, setExamListData] = useState<homeProps>({} as homeProps);
  const [trackerData, setTrackerData] = useState<trackerProps>({} as trackerProps);
  const [currentSystem, setCurrentSystem] = useState<specificSystemProps>({} as specificSystemProps);
  const [isLoadingHomeContext, setIsLoading] = useState<boolean>(false);
  const [fitnessEnabled, setFitnessEnabled] = useState<boolean>(false);
  const [hasExamAnalyzing, setHasExamAnalyzing] = useState<boolean>(false);

  const { user } = useAuth();
  const appState = useRef(AppState.currentState);

  // Sync ao mudar de estado do app (foreground/background)
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (!user?.userId) return;

      if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        // App indo para background → sync dados para não perder
        console.log('📤 [HomeContext] App em background, sincronizando dados...');
        fetchFitnessData().catch(err =>
          console.warn('⚠️ [HomeContext] Erro ao sincronizar no background:', err)
        );
      } else if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // App voltando para foreground → atualiza dados
        console.log('📥 [HomeContext] App em foreground, atualizando dados...');
        fetchFitnessData().catch(err =>
          console.warn('⚠️ [HomeContext] Erro ao atualizar no foreground:', err)
        );
      }

      appState.current = nextState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [user?.userId]);

  // Reset de todos os dados quando o usuário mudar (login/logout/troca de conta)
  useEffect(() => {
    console.log('🔄 [HomeContext] Usuário mudou:', user?.userId);

    // Limpa todos os dados do usuário anterior
    setHomeData({} as homeProps);
    setExamListData({} as homeProps);
    setTrackerData({} as trackerProps);
    setCurrentSystem(null);
    setFitnessEnabled(false);

    // Se tem usuário logado, busca os dados novos
    if (user?.userId) {
      checkFitnessEnabled();
    }
  }, [user?.userId]);

  async function checkFitnessEnabled() {
    try {
      const enabled = await isFitnessEnabled();
      setFitnessEnabled(enabled);
      if (enabled) {
        // Sincroniza metas do backend para cache local
        syncGoalsFromBackend().catch(err =>
          console.warn('⚠️ [HomeContext] Erro ao sincronizar metas:', err)
        );
        await fetchFitnessData();
      }
    } catch (error) {
      console.error('❌ [HomeContext] Erro ao verificar fitness, desabilitando:', error);
      // Se der erro, desabilita o fitness para evitar crash loop
      await setFitnessEnabledService(false);
      setFitnessEnabled(false);
    }
  }

  // Converte dados do HealthKit para o formato trackerProps
  function convertHealthKitToTracker(healthData: HealthKitData): trackerProps {
    const today = new Date().toISOString().split('T')[0];

    return {
      kcal: [{
        calculation_date: today,
        kcal_completed: String(healthData.caloriesBurned || 0),
        kcal_goal: '2000',
      }],
      step: [{
        calculation_date: today,
        step_completed: String(healthData.steps || 0),
        step_goal: '10000',
        distance_completed: String(((healthData.distance || 0) / 1000).toFixed(2)),
        distance_goal: '5',
        hour_completed: '0',
        hour_goal: '1',
      }],
      weight: healthData.weightKg ? [{
        calculation_date: today,
        weight_completed: String(healthData.weightKg),
        weight_goal: null,
      }] : [],
      hydration: [{
        calculation_date: today,
        hydration_completed: String(Math.floor((healthData.waterMl || 0) / 250)),
        hydration_goal: '8', // 8 copos = 2L
      }],
      nutrition: [{
        calculation_date: today,
        nutrition_completed: 0,
      }],
      sleep: [{
        calculation_date: today,
        sleep_completed: String(Math.round((healthData.sleepMinutes || 0) / 60)),
        sleep_goal: '8',
      }],
    };
  }

  // Converte dados do Health Connect (Android) para o formato trackerProps
  function convertHealthConnectToTracker(healthData: HealthConnectData): trackerProps {
    const today = new Date().toISOString().split('T')[0];

    return {
      kcal: [{
        calculation_date: today,
        kcal_completed: String(healthData.caloriesBurned || 0),
        kcal_goal: '2000',
      }],
      step: [{
        calculation_date: today,
        step_completed: String(healthData.steps || 0),
        step_goal: '10000',
        distance_completed: String(((healthData.distance || 0) / 1000).toFixed(2)),
        distance_goal: '5',
        hour_completed: '0',
        hour_goal: '1',
      }],
      weight: healthData.weightKg ? [{
        calculation_date: today,
        weight_completed: String(healthData.weightKg),
        weight_goal: null,
      }] : [],
      hydration: [{
        calculation_date: today,
        hydration_completed: String(Math.floor((healthData.waterMl || 0) / 250)),
        hydration_goal: '8', // 8 copos = 2L
      }],
      nutrition: [{
        calculation_date: today,
        nutrition_completed: 0,
      }],
      sleep: [{
        calculation_date: today,
        sleep_completed: String(Math.round((healthData.sleepMinutes || 0) / 60)),
        sleep_goal: '8',
      }],
    };
  }

  // Converte dados do dashboard de fitness (backend) para o formato trackerProps
  function convertFitnessToTracker(dashboard: FitnessDashboard): trackerProps {
    const today = new Date().toISOString().split('T')[0];

    return {
      kcal: dashboard.todayLog ? [{
        calculation_date: today,
        kcal_completed: String(dashboard.todayLog.caloriesBurned || 0),
        kcal_goal: String(dashboard.todayLog.caloriesGoal || 2000),
      }] : [],
      step: dashboard.todayLog ? [{
        calculation_date: today,
        step_completed: String(dashboard.todayLog.steps || 0),
        step_goal: String(dashboard.todayLog.stepsGoal || 10000),
        distance_completed: '0',
        distance_goal: '5',
        hour_completed: '0',
        hour_goal: '1',
      }] : [],
      weight: dashboard.currentWeight ? [{
        calculation_date: today,
        weight_completed: String(dashboard.currentWeight.weightKg || 0),
        weight_goal: null,
      }] : [],
      hydration: dashboard.todayLog ? [{
        calculation_date: today,
        hydration_completed: String(Math.floor((dashboard.todayLog.waterMl || 0) / 250)), // Converte ml para copos (250ml)
        hydration_goal: String(Math.floor((dashboard.todayLog.waterGoalMl || 2000) / 250)),
      }] : [],
      nutrition: dashboard.todayLog ? [{
        calculation_date: today,
        nutrition_completed: dashboard.todayLog.caloriesConsumed || 0,
      }] : [],
      sleep: dashboard.lastNightSleep ? [{
        calculation_date: today,
        sleep_completed: String(Math.round((dashboard.lastNightSleep.durationMinutes || 0) / 60)), // Converte minutos para horas
        sleep_goal: String(Math.round((dashboard.todayLog?.sleepGoalMinutes || 480) / 60)),
      }] : dashboard.todayLog ? [{
        calculation_date: today,
        sleep_completed: String(Math.round((dashboard.todayLog.sleepMinutes || 0) / 60)),
        sleep_goal: String(Math.round((dashboard.todayLog.sleepGoalMinutes || 480) / 60)),
      }] : [],
    };
  }

  // Mescla dados do HealthKit com dados do backend (prioriza o maior valor)
  function mergeTrackerData(healthKitData: trackerProps, backendData: trackerProps): trackerProps {
    const today = new Date().toISOString().split('T')[0];

    // Função auxiliar para pegar o maior valor
    const maxVal = (a: string | undefined, b: string | undefined): string => {
      const numA = Number(a) || 0;
      const numB = Number(b) || 0;
      return String(Math.max(numA, numB));
    };

    return {
      kcal: [{
        calculation_date: today,
        kcal_completed: maxVal(healthKitData.kcal?.[0]?.kcal_completed, backendData.kcal?.[0]?.kcal_completed),
        kcal_goal: backendData.kcal?.[0]?.kcal_goal || healthKitData.kcal?.[0]?.kcal_goal || '2000',
      }],
      step: [{
        calculation_date: today,
        step_completed: maxVal(healthKitData.step?.[0]?.step_completed, backendData.step?.[0]?.step_completed),
        step_goal: backendData.step?.[0]?.step_goal || healthKitData.step?.[0]?.step_goal || '10000',
        distance_completed: maxVal(healthKitData.step?.[0]?.distance_completed, backendData.step?.[0]?.distance_completed),
        distance_goal: '5',
        hour_completed: '0',
        hour_goal: '1',
      }],
      weight: (healthKitData.weight?.length || backendData.weight?.length) ? [{
        calculation_date: today,
        weight_completed: backendData.weight?.[0]?.weight_completed || healthKitData.weight?.[0]?.weight_completed || '0',
        weight_goal: null,
      }] : [],
      hydration: [{
        calculation_date: today,
        hydration_completed: maxVal(healthKitData.hydration?.[0]?.hydration_completed, backendData.hydration?.[0]?.hydration_completed),
        hydration_goal: backendData.hydration?.[0]?.hydration_goal || healthKitData.hydration?.[0]?.hydration_goal || '8',
      }],
      nutrition: [{
        calculation_date: today,
        nutrition_completed: backendData.nutrition?.[0]?.nutrition_completed || 0,
      }],
      sleep: [{
        calculation_date: today,
        sleep_completed: maxVal(healthKitData.sleep?.[0]?.sleep_completed, backendData.sleep?.[0]?.sleep_completed),
        sleep_goal: backendData.sleep?.[0]?.sleep_goal || healthKitData.sleep?.[0]?.sleep_goal || '8',
      }],
    };
  }

  async function fetchFitnessData() {
    try {
      console.log('🏃 [HomeContext] Buscando dados de fitness...');
      console.log('🏃 [HomeContext] Platform:', Platform.OS);

      let nativeHealthData: trackerProps = {} as trackerProps;
      let backendData: trackerProps = {} as trackerProps;

      // 1. Tenta buscar dados do HealthKit (iOS) ou Health Connect (Android)
      if (Platform.OS === 'ios') {
        try {
          const healthKitAvailable = await isHealthKitAvailable();
          console.log('📱 [HomeContext] HealthKit disponível:', healthKitAvailable);

          if (healthKitAvailable) {
            console.log('📱 [HomeContext] Inicializando HealthKit...');
            const initResult = await initHealthKit();
            console.log('📱 [HomeContext] HealthKit inicializado:', initResult);

            console.log('📱 [HomeContext] Buscando dados do HealthKit para hoje...');
            const rawHealthData = await getHealthKitDataForDate(new Date());
            console.log('📱 [HomeContext] Dados brutos do HealthKit:', rawHealthData);

            nativeHealthData = convertHealthKitToTracker(rawHealthData);
            console.log('✅ [HomeContext] Dados convertidos do HealthKit:', nativeHealthData);

            // Sincroniza com backend em background (não bloqueia UI)
            syncHealthKitToBackend().catch(err =>
              console.warn('⚠️ [HomeContext] Erro ao sincronizar com backend:', err)
            );
          }
        } catch (healthKitError) {
          console.warn('⚠️ [HomeContext] Erro ao buscar do HealthKit:', healthKitError);
        }
      } else if (Platform.OS === 'android') {
        if (DISABLE_ANDROID_HEALTH_CONNECT) {
          console.log('⚠️ [HomeContext] Health Connect desabilitado no Android (aguardando build nativo)');
        } else {
          try {
            const isAvailable = await isHealthConnectAvailable();
            if (isAvailable) {
              console.log('📱 [HomeContext] Inicializando Health Connect...');
              const initSuccess = await initHealthConnect();

              if (initSuccess) {
                const rawHealthData = await getHealthConnectDataForDate(new Date());
                nativeHealthData = convertHealthConnectToTracker(rawHealthData);
                console.log('✅ [HomeContext] Dados do Health Connect:', nativeHealthData);

                // Sincroniza com backend em background (não bloqueia UI)
                syncHealthConnectToBackend().catch(err =>
                  console.warn('⚠️ [HomeContext] Erro ao sincronizar com backend:', err)
                );
              } else {
                console.warn('⚠️ [HomeContext] Health Connect não inicializou, usando apenas backend');
              }
            } else {
              console.log('📭 [HomeContext] Health Connect não disponível');
            }
          } catch (healthConnectError) {
            console.warn('⚠️ [HomeContext] Erro ao buscar do Health Connect:', healthConnectError);
          }
        }
      }

      // 2. Busca dados do backend
      try {
        const dashboard = await getFitnessDashboard();
        if (dashboard) {
          backendData = convertFitnessToTracker(dashboard);
          console.log('✅ [HomeContext] Dados do backend:', backendData);
        }
      } catch (backendError) {
        console.warn('⚠️ [HomeContext] Erro ao buscar do backend:', backendError);
      }

      // 3. Mescla os dados (HealthKit/Health Connect + Backend)
      const hasNativeHealth = Object.keys(nativeHealthData).length > 0;
      const hasBackend = Object.keys(backendData).length > 0;

      if (hasNativeHealth && hasBackend) {
        const mergedData = mergeTrackerData(nativeHealthData, backendData);
        setTrackerData(mergedData);
        console.log('✅ [HomeContext] Dados mesclados (Native + Backend):', mergedData);
      } else if (hasNativeHealth) {
        setTrackerData(nativeHealthData);
        console.log('✅ [HomeContext] Usando apenas dados nativos');
      } else if (hasBackend) {
        setTrackerData(backendData);
        console.log('✅ [HomeContext] Usando apenas dados do backend');
      } else {
        console.log('📭 [HomeContext] Nenhum dado de fitness encontrado');
        setTrackerData({} as trackerProps);
      }
    } catch (error) {
      console.error('❌ [HomeContext] Erro ao buscar dados de fitness:', error);
    }
  }

  const refreshFitnessData = useCallback(async () => {
    const enabled = await isFitnessEnabled();
    setFitnessEnabled(enabled);
    // Sempre buscar dados do backend independente do status de fitness nativo
    // Isso garante que dados manuais (hidratação, nutrição) sejam sempre atualizados
    await fetchFitnessData();
  }, []);

  async function checkProcessingExams() {
    try {
      const response = await api.get('medical-exam/get-all-exams-upload-by-logged-user');
      const exams: any[] = response?.data?.data || response?.data || [];
      const processingStatuses = ['Received', 'Extracted', 'Analyzed'];
      const hasProcessing = Array.isArray(exams) && exams.some((exam) =>
        processingStatuses.includes(exam.medicalExamStatus)
      );
      setHasExamAnalyzing(hasProcessing);
    } catch {
      setHasExamAnalyzing(false);
    }
  }

  async function getHomeData() {
    setIsLoading(true);

    try {
      const response = await api.get('medical-exam-scores/get-last-final-result-by-current-user-logged', {
        headers: {
          'Accept': 'application/octet-stream'
        }
      });

      const { data } = response;
      setHomeData(data.data);
      setHasExamAnalyzing(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '';
      const isNoDataError =
        error.response?.status === 404 ||
        errorMessage.toLowerCase().includes('nenhum arquivo de exame') ||
        errorMessage.toLowerCase().includes('não encontrado') ||
        errorMessage.toLowerCase().includes('not found');

      // Limpa os dados quando não há exames com score
      if (isNoDataError) {
        console.log('📭 [HomeContext] Nenhum exame com score encontrado, limpando dados');
        setHomeData({} as homeProps);
        await checkProcessingExams();
        return;
      }

      // Para outros erros, loga e não quebra a aplicação
      console.error('❌ [HomeContext] Erro ao buscar dados:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function clearHomeData() {
    console.log('🧹 [HomeContext] Limpando dados da homepage');
    setHomeData({} as homeProps);
    setExamListData({} as homeProps);
    setTrackerData({} as trackerProps);
    setCurrentSystem(null);
  }

  return (
    <HomeContext.Provider
      value={{
        homeData,
        getHomeData,
        isLoadingHomeContext,
        trackerData,
        currentSystem,
        setCurrentSystem,
        clearHomeData,
        fitnessEnabled,
        refreshFitnessData,
        hasExamAnalyzing,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
