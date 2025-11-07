import { ReactNode, createContext, useState, useCallback, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/services/api';
import { OnboardingProps, stepProps } from 'src/@types/onboarding.type';
import { DocumentPickerAsset } from 'expo-document-picker';

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
  const [personalData, setPersonalData] = useState();
  const [isLoadingOnboardingContext, setisLoadingOnboardingContext] = useState<boolean>(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const [scoreWarning, setScoreWarning] = useState<boolean>(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);

  // Carregar dados do AsyncStorage na inicialização
  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@app:onboardingData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setOnboardingData(parsedData);
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
      const response = await api.get('user-personal-data');
      const { data } = response;
      const personalData = data.data;

      await AsyncStorage.setItem('@app:personalData', JSON.stringify(personalData));
      setPersonalData(personalData);
    } catch (error: any) {
      setPersonalData(undefined);
      setIsOnboardingComplete(false);
    } finally {
      setisLoadingOnboardingContext(false);
    }
  }, []);

  const checkOnboardingCompletion = useCallback(async () => {
    try {
      console.log('🔍 checkOnboardingCompletion: Iniciando verificação...');
      const storedPersonalData = await AsyncStorage.getItem('@app:personalData');
      console.log('📦 checkOnboardingCompletion: Dados locais:', storedPersonalData ? 'Encontrado' : 'Não encontrado');

      if (storedPersonalData) {
        const parsedData = JSON.parse(storedPersonalData);
        const hasAnyData =
          parsedData &&
          (parsedData.gender ||
            parsedData.weight ||
            parsedData.height !== undefined ||
            parsedData.age ||
            parsedData.workoutLevel ||
            parsedData.eatingHabits);

        console.log('✅ checkOnboardingCompletion: Dados locais analisados - hasAnyData:', hasAnyData);
        console.log('📊 checkOnboardingCompletion: parsedData:', parsedData);

        setIsOnboardingComplete(hasAnyData);
        setPersonalData(parsedData);
        return hasAnyData;
      }

      console.log('🌐 checkOnboardingCompletion: Buscando dados do servidor...');
      try {
        const response = await api.get('user-personal-data');
        const { data } = response;
        const serverPersonalData = data.data;

        console.log('📥 checkOnboardingCompletion: Dados do servidor recebidos:', serverPersonalData);

        if (serverPersonalData) {
          const hasAnyData =
            serverPersonalData.gender ||
            serverPersonalData.weight ||
            serverPersonalData.height !== undefined ||
            serverPersonalData.age ||
            serverPersonalData.workoutLevel ||
            serverPersonalData.eatingHabits;

          console.log('✅ checkOnboardingCompletion: Dados do servidor analisados - hasAnyData:', hasAnyData);

          await AsyncStorage.setItem('@app:personalData', JSON.stringify(serverPersonalData));
          setPersonalData(serverPersonalData);
          setIsOnboardingComplete(hasAnyData);
          return hasAnyData;
        }
      } catch (serverError: any) {
        console.log('⚠️ checkOnboardingCompletion: Erro ao buscar dados do servidor (esperado para usuário novo):', serverError?.response?.status);
      }

      console.log('❌ checkOnboardingCompletion: Nenhum dado encontrado - onboarding incompleto');
      setIsOnboardingComplete(false);
      return false;
    } catch (error: any) {
      console.log('❌ checkOnboardingCompletion: Erro na verificação:', error);
      setIsOnboardingComplete(false);
      return false;
    }
  }, []);

  async function resetOnboardingState() {
    setIsOnboardingComplete(false);
    setPersonalData(undefined);
    setStep(0);
    setOnboardingData({} as OnboardingProps);
    await AsyncStorage.removeItem('@app:onboardingData');
  }

  async function saveOnboarding(payload: OnboardingProps) {
    try {
      const personalData = await AsyncStorage.getItem('@app:personalData');

      const response = personalData
        ? await api.put('user-personal-data', payload)
        : await api.post('user-personal-data', payload);

      const data = response.data.data;

      if (data) {
        setOnboardingData(payload);
        jumpToUpload();
      }
    } catch (error) {
      setOnboardingData(payload);
      jumpToUpload();

      throw error;
    } finally {
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
