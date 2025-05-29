import { ReactNode, createContext, useEffect, useState } from 'react';

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
  handleUploadFile: (file: DocumentPickerAsset) => Promise<void>;
};

type OnboardingContextProviderProps = {
  children: ReactNode;
};

export const OnboardingContext = createContext<OnboardingContextDataProps>({} as OnboardingContextDataProps);

export function OnboardingContextProvider({ children }: OnboardingContextProviderProps) {
  const [onboardingData, setOnboardingData] = useState<OnboardingProps>({} as OnboardingProps);

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

  async function saveOnboarding(payload: OnboardingProps) {
    console.log('!@# 🚀 ~ saveOnboarding ~ payload:', payload);
    try {
      const response = await api.post('user-personal-data', payload);
      console.log('!@# 🚀 ~ saveOnboarding ~ payload:', payload);
      console.log('!@# 🚀 ~ saveOnboarding ~ response:', response);

      const data = response.data.data;
      console.log('!@# 🚀 ~ saveOnboarding ~ data:', data);

      if (data.code == 200) {
        setOnboardingData(payload);
        jumpToUpload();
      }
    } catch (error) {
      console.log('!@# 🚀 ~ saveOnboarding ~ error:', error);

      setOnboardingData(payload);
      jumpToUpload();

      throw error;
    } finally {
    }
  }

  async function handleUploadFile(file: DocumentPickerAsset) {
    console.log('!@# 🚀 ~ handleUploadFile ~ file:', file);

    try {
      const tempFile = {
        name: file.name,
        size: file.size,
        uri: file.uri,
        type: file.mimeType,
      } as any;

      const form = new FormData();

      form.append('file', tempFile);

      const response = await api.post(
        'medical-exam/form',
        {
          filename: file.name,
        },
        {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        }
      );
      console.log('!@# 🚀 ~ handleUploadFile ~ response:', response);
    } catch (error) {
      console.log('!@# 🚀 ~ handleUploadFile ~ error:', error);
      showError();

      throw error;
    } finally {
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
        handleUploadFile,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
