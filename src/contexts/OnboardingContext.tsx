import { ReactNode, createContext, useEffect, useState } from 'react';

import { api } from 'src/services/api';
import { OnboardingProps, stepProps } from 'src/@types/onboarding.type';

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
};

type OnboardingContextProviderProps = {
  children: ReactNode;
};

export const OnboardingContext = createContext<OnboardingContextDataProps>({} as OnboardingContextDataProps);

export function OnboardingContextProvider({ children }: OnboardingContextProviderProps) {
  const [onboardingData, setOnboardingData] = useState<OnboardingProps>({} as OnboardingProps);

  const [step, setStep] = useState<number>(0);

  const stepsMap: stepProps[] = [
    { progress: 16, currentStep: 'gender', nextStep: 'weight' },
    {
      progress: 32,
      currentStep: 'weight',
      nextStep: 'age',
      previousStep: 'gender',
    },
    {
      progress: 48,
      currentStep: 'age',
      nextStep: 'physical',
      previousStep: 'weight',
    },
    {
      progress: 64,
      currentStep: 'physical',
      nextStep: 'habits',
      previousStep: 'age',
    },
    {
      progress: 80,
      currentStep: 'habits',
      nextStep: 'upload',
      previousStep: 'physical',
    },
    { progress: 96, currentStep: 'upload', previousStep: 'habits' },
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
    try {
      const response = await api.post('/user/change-attribute', payload);

      const data = response.data.data;

      if (data.code == 200) {
        setOnboardingData(payload);
        jumpToUpload();
      }
    } catch (error) {
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
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
