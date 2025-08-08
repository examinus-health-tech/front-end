import { ReactNode, createContext, useState } from 'react';

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

  const [step, setStep] = useState<number>(0);

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

  async function getPersonalData() {
    try {
      setisLoadingOnboardingContext(true);

      const response = await api.get('/user-personal-data');

      const { data } = response;
      const personalData = data.data;

      await AsyncStorage.setItem('@app:personalData', JSON.stringify(personalData));

      setPersonalData(personalData);
    } catch (error: any) {
      throw error;
    } finally {
      setisLoadingOnboardingContext(false);
    }
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

      console.log('!@# 🚀 ~ handleUploadFileFromOnboarding ~ file:', file);

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
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
