import { ReactNode, createContext, useState, useCallback, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/services/api';
import { OnboardingProps, stepProps } from 'src/@types/onboarding.type';
import { DocumentPickerAsset } from 'expo-document-picker';
import { saveUserPersonalData, getUserPersonalData, getOnboardingStatus, completeOnboarding } from '@services/userService';

export type OnboardingContextDataProps = {
  onboardingData: OnboardingProps;
  setOnboardingData: (data: OnboardingProps) => void;
  saveOnboarding: (payload: OnboardingProps) => Promise<void>;
  step: number;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  showError: () => void;
  showScoreWarning: () => void;
  stepsMap: stepProps[];
  jumpToUpload: () => void;
  getPersonalData: () => void;
  isLoadingOnboardingContext: boolean;
  personalData: object | undefined;
  isLoadingUpload: boolean;
  handleUploadFileFromOnboarding: (file: DocumentPickerAsset) => Promise<void>;
  scoreWarning: boolean;
  isOnboardingComplete: boolean;
  checkOnboardingCompletion: () => Promise<boolean>;
  resetOnboardingState: () => void;
};

type OnboardingContextProviderProps = {
  children: ReactNode;
};

export const OnboardingContext = createContext<OnboardingContextDataProps>({} as OnboardingContextDataProps);

export function OnboardingContextProvider({ children }: OnboardingContextProviderProps) {
  const [onboardingData, setOnboardingData] = useState<OnboardingProps>({} as OnboardingProps);
  const [personalData, setPersonalData] = useState<any>();
  const [isLoadingOnboardingContext, setisLoadingOnboardingContext] = useState<boolean>(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const [scoreWarning, setScoreWarning] = useState<boolean>(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);

  // Função para normalizar altura: converte cm (backend) para metros (frontend)
  const normalizeHeightFromBackend = (data: any) => {
    if (!data) return data;

    return {
      ...data,
      // Se altura > 10, está em cm, converter para metros
      height: data.height && data.height > 10 ? data.height / 100 : data.height,
    };
  };

  // Carregar dados do AsyncStorage na inicialização
  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@app:onboardingData');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setOnboardingData(parsedData);
          } catch (parseError) {
            if (__DEV__) console.log('❌ OnboardingContext: Erro ao fazer parse dos dados:', parseError);
            await AsyncStorage.removeItem('@app:onboardingData');
          }
        }
      } catch (error) {
        if (__DEV__) console.log('❌ OnboardingContext: Erro ao carregar dados:', error);
      }
    };
    loadOnboardingData();
  }, []);

  // Persistir dados no AsyncStorage sempre que onboardingData mudar
  useEffect(() => {
    const saveOnboardingData = async () => {
      try {
        if (Object.keys(onboardingData).length > 0) {
          await AsyncStorage.setItem('@app:onboardingData', JSON.stringify(onboardingData));
        }
      } catch (error) {
        if (__DEV__) console.log('❌ OnboardingContext: Erro ao salvar dados:', error);
      }
    };
    saveOnboardingData();
  }, [onboardingData]);

  const stepsMap: stepProps[] = [
    { progress: 12, currentStep: 'gender', nextStep: 'weight' },
    {
      progress: 24,
      currentStep: 'weight',
      nextStep: 'height',
      previousStep: 'gender',
    },
    {
      progress: 36,
      currentStep: 'height',
      nextStep: 'age',
      previousStep: 'weight',
    },
    {
      progress: 48,
      currentStep: 'age',
      nextStep: 'physical',
      previousStep: 'weight',
    },
    {
      progress: 60,
      currentStep: 'physical',
      nextStep: 'humour',
      previousStep: 'age',
    },
    {
      progress: 66,
      currentStep: 'humour',
      nextStep: 'habits',
      previousStep: 'physical',
    },
    {
      progress: 72,
      currentStep: 'habits',
      nextStep: 'upload',
      previousStep: 'humour',
    },
    { progress: 84, currentStep: 'upload', previousStep: 'habits' },
    { currentStep: 'error', previousStep: 'upload' },
    { currentStep: 'score' },
  ];

  function handleNextStep() {
    const newStep = step + 1;

    setStep(newStep);
  }

  function handlePreviousStep() {
    const newStep = step - 1;

    setStep(newStep);
  }

  function jumpToUpload() {
    const newStep = stepsMap.findIndex((step) => step.currentStep === 'upload');
    setStep(newStep);
  }

  function showError() {
    const newStep = stepsMap.findIndex((step) => step.currentStep === 'error');
    setStep(newStep);
  }

  function showScoreWarning() {
    const newStep = stepsMap.findIndex((step) => step.currentStep === 'score');
    setStep(newStep);
  }

  const getPersonalData = useCallback(async () => {
    try {
      setisLoadingOnboardingContext(true);
      const personalData = await getUserPersonalData();

      if (personalData) {
        // Normalizar altura de cm para metros
        const normalizedData = normalizeHeightFromBackend(personalData);

        await AsyncStorage.setItem('@app:personalData', JSON.stringify(normalizedData));
        setPersonalData(normalizedData);
      } else {
        setPersonalData(undefined);
        setIsOnboardingComplete(false);
      }
    } catch (error: any) {
      setPersonalData(undefined);
      setIsOnboardingComplete(false);
    } finally {
      setisLoadingOnboardingContext(false);
    }
  }, []);

  const checkOnboardingCompletion = useCallback(async () => {
    try {
      if (__DEV__) console.log('🔍 [ONBOARDING] Verificando status do onboarding via endpoint...');

      // Usar o endpoint dedicado do backend
      const { hasCompletedOnboarding } = await getOnboardingStatus();

      if (__DEV__) console.log('✅ [ONBOARDING] Status do onboarding:', { hasCompletedOnboarding });

      setIsOnboardingComplete(hasCompletedOnboarding);

      // Se completou onboarding, buscar dados pessoais para o cache local
      if (hasCompletedOnboarding) {
        try {
          const serverPersonalData = await getUserPersonalData();
          if (serverPersonalData) {
            const normalizedData = normalizeHeightFromBackend(serverPersonalData);
            await AsyncStorage.setItem('@app:personalData', JSON.stringify(normalizedData));
            setPersonalData(normalizedData);
          }
        } catch (dataError) {
          if (__DEV__) console.log('⚠️ [ONBOARDING] Erro ao buscar dados pessoais:', dataError);
        }
      } else {
        setPersonalData(undefined);
        await AsyncStorage.removeItem('@app:personalData');
      }

      return hasCompletedOnboarding;
    } catch (error: any) {
      if (__DEV__) console.log('❌ [ONBOARDING] Erro na verificação:', error);
      setIsOnboardingComplete(false);
      setPersonalData(undefined);
      return false;
    }
  }, []);

  async function resetOnboardingState() {
    if (__DEV__) console.log('🔄 [OnboardingContext] Resetando estado do onboarding...');
    try {
      setIsOnboardingComplete(false);
      setPersonalData(undefined);
      setStep(0);
      setOnboardingData({} as OnboardingProps);

      await AsyncStorage.removeItem('@app:onboardingData');
      if (__DEV__) console.log('✅ [OnboardingContext] AsyncStorage limpo');
      if (__DEV__) console.log('✅ [OnboardingContext] Estado resetado com sucesso');
    } catch (error) {
      if (__DEV__) console.error('❌ [OnboardingContext] Erro ao resetar estado:', error);
      // Continuar mesmo com erro, pois já limpamos os states
    }
  }

  async function saveOnboarding(payload: OnboardingProps) {
    try {
      if (__DEV__) console.log('💾 [ONBOARDING] Salvando dados do onboarding no backend:', payload);
      if (__DEV__) console.log('📊 [ONBOARDING] Campos recebidos:', {
        gender: payload.gender,
        weight: payload.weight,
        height: payload.height,
        age: payload.age,
        workoutLevel: payload.workoutLevel,
        physicalLevel: payload.physicalLevel,
        eatingHabits: payload.eatingHabits,
      });

      // Backend espera MoodLevel como char (F=Feliz, N=Normal, T=Triste, A=Ansioso, D=Depressivo)
      // Mobile guarda humor como 1-5 (definido no Humour/humour.tsx)
      const MOOD_MAP: Record<number, string> = { 1: 'F', 2: 'N', 3: 'T', 4: 'A', 5: 'D' };

      // Normalizar payload - garantir que tanto workoutLevel quanto physicalLevel sejam enviados
      // Converter altura de metros para centímetros (backend espera cm)
      const normalizedPayload = {
        ...payload,
        // Se veio workoutLevel mas não physicalLevel, usar workoutLevel para ambos
        workoutLevel: payload.workoutLevel || payload.physicalLevel,
        physicalLevel: payload.physicalLevel || payload.workoutLevel,
        // Converter altura: se está em metros (< 10), multiplicar por 100 para cm
        height: payload.height && payload.height < 10 ? payload.height * 100 : payload.height,
        // Mapear humor (1-5) → MoodLevel ('F','N','T','A','D')
        moodLevel: payload.humor ? MOOD_MAP[payload.humor] : undefined,
      };

      if (__DEV__) console.log('📤 [ONBOARDING] Payload normalizado:', normalizedPayload);
      if (__DEV__) console.log('🔗 [ONBOARDING] API Base URL:', process.env.EXPO_PUBLIC_API_URL);

      // Usar a função que sempre usa PUT (UPSERT - cria ou atualiza)
      const response = await saveUserPersonalData(normalizedPayload);

      if (__DEV__) console.log('✅ [ONBOARDING] Dados salvos com sucesso no backend!');

      // Marcar onboarding como completo no backend
      try {
        await completeOnboarding();
        if (__DEV__) console.log('✅ [ONBOARDING] Flag de onboarding completo atualizada no backend');
      } catch (completeError) {
        if (__DEV__) console.warn('⚠️ [ONBOARDING] Erro ao marcar onboarding como completo:', completeError);
      }

      // Atualizar cache local (manter altura em metros para o frontend)
      const dataForLocalStorage = {
        ...payload,
        workoutLevel: normalizedPayload.workoutLevel,
        physicalLevel: normalizedPayload.physicalLevel,
        height: payload.height, // Manter em metros
      };

      await AsyncStorage.setItem('@app:personalData', JSON.stringify(dataForLocalStorage));

      setOnboardingData(dataForLocalStorage);
      setIsOnboardingComplete(true);
      setPersonalData(dataForLocalStorage);

      if (__DEV__) console.log('✅ [ONBOARDING] Estado local atualizado, onboarding marcado como completo');

      jumpToUpload();
    } catch (error) {
      if (__DEV__) console.error('❌ [ONBOARDING] Erro ao salvar no backend:', error);

      // Mesmo com erro, continuar o fluxo (salvar localmente)
      setOnboardingData(payload);
      await AsyncStorage.setItem('@app:onboardingData', JSON.stringify(payload));
      jumpToUpload();

      // Não fazer throw para não quebrar o fluxo
      // throw error;
    }
  }

  async function handleUploadFileFromOnboarding({ name, mimeType, uri }: DocumentPickerAsset) {
    setIsLoadingUpload(true);

    try {
      // Determinar o tipo MIME correto baseado na extensão do arquivo ou mimeType fornecido
      let fileType = mimeType;

      if (!fileType) {
        // Se não há mimeType, tentar determinar pelo nome do arquivo
        const fileName = name.toLowerCase();
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          fileType = 'image/jpeg';
        } else if (fileName.endsWith('.png')) {
          fileType = 'image/png';
        } else if (fileName.endsWith('.pdf')) {
          fileType = 'application/pdf';
        } else {
          // Fallback para PDF se não conseguir determinar
          fileType = 'application/pdf';
        }
      }

      const file = {
        name: name,
        type: fileType,
        uri: uri,
      } as any;

      const bodyFormData = new FormData();
      bodyFormData.append('File', file);

      const response = await api.post('medical-exam/form', bodyFormData, {
        headers: {
          'Content-type': 'multipart/form-data',
          Accept: 'application/octet-stream',
        },
      });
    } catch (error) {
      showError();
      setIsLoadingUpload(false);
      throw error;
    } finally {
      showScoreWarning();
      setScoreWarning(true);
      setIsLoadingUpload(false);
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        setOnboardingData,
        saveOnboarding,
        step,
        handleNextStep,
        handlePreviousStep,
        stepsMap,
        jumpToUpload,
        showError,
        showScoreWarning,
        getPersonalData,
        isLoadingOnboardingContext,
        personalData,
        isLoadingUpload,
        scoreWarning,
        handleUploadFileFromOnboarding,
        isOnboardingComplete,
        checkOnboardingCompletion,
        resetOnboardingState,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
