import { ReactNode, createContext, useState, useCallback, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/services/api';
import { OnboardingProps, stepProps } from 'src/@types/onboarding.type';
import { DocumentPickerAsset } from 'expo-document-picker';
import { saveUserPersonalData, getUserPersonalData } from '@services/userService';

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
            console.log('❌ OnboardingContext: Erro ao fazer parse dos dados:', parseError);
            await AsyncStorage.removeItem('@app:onboardingData');
          }
        }
      } catch (error) {
        console.log('❌ OnboardingContext: Erro ao carregar dados:', error);
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
        console.log('❌ OnboardingContext: Erro ao salvar dados:', error);
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
      nextStep: 'habits',
      previousStep: 'age',
    },
    // {
    //   progress: 66,
    //   currentStep: 'humour',
    //   nextStep: 'habits',
    //   previousStep: 'physical',
    // },
    {
      progress: 72,
      currentStep: 'habits',
      nextStep: 'upload',
      previousStep: 'physical',
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
      console.log('🔍 [ONBOARDING] Iniciando verificação de completude...');

      // SEMPRE buscar dados do servidor primeiro para garantir que são do usuário correto
      console.log('🌐 [ONBOARDING] Buscando dados do servidor...');
      try {
        const serverPersonalData = await getUserPersonalData();

        console.log('📥 [ONBOARDING] Dados do servidor recebidos:', {
          hasData: !!serverPersonalData,
          gender: serverPersonalData?.gender,
          weight: serverPersonalData?.weight,
          height: serverPersonalData?.height,
          age: serverPersonalData?.age,
        });

        if (serverPersonalData) {
          // Normalizar altura de cm para metros
          const normalizedData = normalizeHeightFromBackend(serverPersonalData);

          // Verificar se tem PELO MENOS UM dos campos principais do onboarding COM VALOR
          // Não consideramos fullName/email/phone/location/birthDate/country pois são da tela Info
          // Importante: verificar se tem valor não-null/undefined
          const hasOnboardingData =
            (normalizedData.gender !== null && normalizedData.gender !== undefined) ||
            (normalizedData.weight !== null && normalizedData.weight !== undefined) ||
            (normalizedData.height !== null && normalizedData.height !== undefined) ||
            (normalizedData.age !== null && normalizedData.age !== undefined) ||
            (normalizedData.workoutLevel !== null && normalizedData.workoutLevel !== undefined) ||
            (normalizedData.physicalLevel !== null && normalizedData.physicalLevel !== undefined) ||
            (normalizedData.eatingHabits !== null && normalizedData.eatingHabits !== undefined) ||
            (normalizedData.moodLevel !== null && normalizedData.moodLevel !== undefined);

          console.log('✅ [ONBOARDING] Análise dos dados do servidor:', {
            hasOnboardingData,
            gender: normalizedData.gender !== null && normalizedData.gender !== undefined,
            weight: normalizedData.weight !== null && normalizedData.weight !== undefined,
            height: normalizedData.height !== null && normalizedData.height !== undefined,
            age: normalizedData.age !== null && normalizedData.age !== undefined,
            workoutLevel: normalizedData.workoutLevel !== null && normalizedData.workoutLevel !== undefined,
            eatingHabits: normalizedData.eatingHabits !== null && normalizedData.eatingHabits !== undefined,
          });

          // Só atualizar cache local se realmente tiver dados de onboarding
          if (hasOnboardingData) {
            await AsyncStorage.setItem('@app:personalData', JSON.stringify(normalizedData));
            setPersonalData(normalizedData);
          } else {
            console.log('ℹ️ [ONBOARDING] Dados existem mas estão todos null - considerando onboarding incompleto');
            await AsyncStorage.removeItem('@app:personalData');
            setPersonalData(undefined);
          }

          setIsOnboardingComplete(hasOnboardingData);
          return hasOnboardingData;
        } else {
          console.log('⚠️ [ONBOARDING] Servidor retornou resposta vazia');
        }
      } catch (serverError: any) {
        console.log('⚠️ [ONBOARDING] Erro ao buscar dados do servidor:', {
          message: serverError?.message,
        });

        // getUserPersonalData() já retorna null em caso de 404
        // Se chegou aqui com erro, é um erro real (não 404)
        console.log('❌ [ONBOARDING] Erro real ao buscar dados (não é 404)');
        await AsyncStorage.removeItem('@app:personalData');
        setIsOnboardingComplete(false);
        setPersonalData(undefined);

        // Para outros erros, verificar cache local como fallback
        console.log('🔄 [ONBOARDING] Verificando cache local como fallback...');
        const storedPersonalData = await AsyncStorage.getItem('@app:personalData');

        if (storedPersonalData) {
          try {
            const parsedData = JSON.parse(storedPersonalData);

            // Verificar campos do onboarding COM VALOR (não campos da tela Info)
            const hasOnboardingData =
              parsedData &&
              ((parsedData.gender !== null && parsedData.gender !== undefined) ||
                (parsedData.weight !== null && parsedData.weight !== undefined) ||
                (parsedData.height !== null && parsedData.height !== undefined) ||
                (parsedData.age !== null && parsedData.age !== undefined) ||
                (parsedData.workoutLevel !== null && parsedData.workoutLevel !== undefined) ||
                (parsedData.physicalLevel !== null && parsedData.physicalLevel !== undefined) ||
                (parsedData.eatingHabits !== null && parsedData.eatingHabits !== undefined) ||
                (parsedData.moodLevel !== null && parsedData.moodLevel !== undefined));

            console.log('📦 [ONBOARDING] Usando dados do cache local - onboarding completo:', hasOnboardingData);
            setPersonalData(parsedData);
            setIsOnboardingComplete(hasOnboardingData);
            return hasOnboardingData;
          } catch (parseError) {
            console.log('❌ [ONBOARDING] Erro ao fazer parse do cache local:', parseError);
            await AsyncStorage.removeItem('@app:personalData');
          }
        }
      }

      console.log('❌ [ONBOARDING] Nenhum dado encontrado - onboarding incompleto');
      setIsOnboardingComplete(false);
      setPersonalData(undefined);
      return false;
    } catch (error: any) {
      console.log('❌ [ONBOARDING] Erro na verificação:', error);
      setIsOnboardingComplete(false);
      setPersonalData(undefined);
      return false;
    }
  }, []);

  async function resetOnboardingState() {
    console.log('🔄 [OnboardingContext] Resetando estado do onboarding...');
    try {
      setIsOnboardingComplete(false);
      setPersonalData(undefined);
      setStep(0);
      setOnboardingData({} as OnboardingProps);

      await AsyncStorage.removeItem('@app:onboardingData');
      console.log('✅ [OnboardingContext] AsyncStorage limpo');
      console.log('✅ [OnboardingContext] Estado resetado com sucesso');
    } catch (error) {
      console.error('❌ [OnboardingContext] Erro ao resetar estado:', error);
      // Continuar mesmo com erro, pois já limpamos os states
    }
  }

  async function saveOnboarding(payload: OnboardingProps) {
    try {
      console.log('💾 [ONBOARDING] Salvando dados do onboarding no backend:', payload);
      console.log('📊 [ONBOARDING] Campos recebidos:', {
        gender: payload.gender,
        weight: payload.weight,
        height: payload.height,
        age: payload.age,
        workoutLevel: payload.workoutLevel,
        physicalLevel: payload.physicalLevel,
        eatingHabits: payload.eatingHabits,
      });

      // Normalizar payload - garantir que tanto workoutLevel quanto physicalLevel sejam enviados
      // Converter altura de metros para centímetros (backend espera cm)
      const normalizedPayload = {
        ...payload,
        // Se veio workoutLevel mas não physicalLevel, usar workoutLevel para ambos
        workoutLevel: payload.workoutLevel || payload.physicalLevel,
        physicalLevel: payload.physicalLevel || payload.workoutLevel,
        // Converter altura: se está em metros (< 10), multiplicar por 100 para cm
        height: payload.height && payload.height < 10 ? payload.height * 100 : payload.height,
      };

      console.log('📤 [ONBOARDING] Payload normalizado:', normalizedPayload);

      // Usar a função que sempre usa PUT (UPSERT - cria ou atualiza)
      const response = await saveUserPersonalData(normalizedPayload);

      console.log('✅ [ONBOARDING] Dados salvos com sucesso no backend!');

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

      console.log('✅ [ONBOARDING] Estado local atualizado, onboarding marcado como completo');

      jumpToUpload();
    } catch (error) {
      console.error('❌ [ONBOARDING] Erro ao salvar no backend:', error);

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
