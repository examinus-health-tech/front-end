import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useOnboarding } from './useOnboarding';
import { OnboardingContext } from '../contexts/OnboardingContext';

describe('useOnboarding', () => {
  const mockSetOnboardingData = jest.fn();
  const mockSaveOnboarding = jest.fn();
  const mockHandleNextStep = jest.fn();
  const mockHandlePreviousStep = jest.fn();
  const mockShowError = jest.fn();
  const mockShowScoreWarning = jest.fn();
  const mockJumpToUpload = jest.fn();
  const mockGetPersonalData = jest.fn();
  const mockHandleUploadFileFromOnboarding = jest.fn();
  const mockCheckOnboardingCompletion = jest.fn();
  const mockResetOnboardingState = jest.fn();

  const mockOnboardingData = {
    name: 'Joao Silva',
    birthDate: '1990-01-15',
    gender: 'M',
    height: 1.75,
    weight: 80,
  };

  const mockPersonalData = {
    name: 'Joao Silva',
    email: 'joao@test.com',
  };

  const mockStepsMap = [
    { title: 'Dados Pessoais', completed: true },
    { title: 'Upload', completed: false },
    { title: 'Resultado', completed: false },
  ];

  const mockContextValue = {
    onboardingData: mockOnboardingData,
    setOnboardingData: mockSetOnboardingData,
    saveOnboarding: mockSaveOnboarding,
    step: 0,
    handleNextStep: mockHandleNextStep,
    handlePreviousStep: mockHandlePreviousStep,
    showError: mockShowError,
    showScoreWarning: mockShowScoreWarning,
    stepsMap: mockStepsMap,
    jumpToUpload: mockJumpToUpload,
    getPersonalData: mockGetPersonalData,
    isLoadingOnboardingContext: false,
    personalData: mockPersonalData,
    isLoadingUpload: false,
    handleUploadFileFromOnboarding: mockHandleUploadFileFromOnboarding,
    scoreWarning: false,
    isOnboardingComplete: false,
    checkOnboardingCompletion: mockCheckOnboardingCompletion,
    resetOnboardingState: mockResetOnboardingState,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <OnboardingContext.Provider value={mockContextValue as any}>
      {children}
    </OnboardingContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quando usado dentro do OnboardingContextProvider', () => {
    it('deve retornar o contexto de onboarding', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('deve retornar dados de onboarding', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.onboardingData).toEqual(mockOnboardingData);
    });

    it('deve retornar step atual', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.step).toBe(0);
    });

    it('deve retornar mapa de steps', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.stepsMap).toEqual(mockStepsMap);
      expect(result.current.stepsMap).toHaveLength(3);
    });

    it('deve retornar dados pessoais', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.personalData).toEqual(mockPersonalData);
    });

    it('deve retornar estado de carregamento do onboarding', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.isLoadingOnboardingContext).toBe(false);
    });

    it('deve retornar estado de carregamento do upload', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.isLoadingUpload).toBe(false);
    });

    it('deve retornar estado de score warning', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.scoreWarning).toBe(false);
    });

    it('deve retornar estado de onboarding completo', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(result.current.isOnboardingComplete).toBe(false);
    });

    it('deve retornar funcao setOnboardingData', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.setOnboardingData).toBe('function');
    });

    it('deve retornar funcao saveOnboarding', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.saveOnboarding).toBe('function');
    });

    it('deve retornar funcao handleNextStep', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.handleNextStep).toBe('function');
    });

    it('deve retornar funcao handlePreviousStep', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.handlePreviousStep).toBe('function');
    });

    it('deve retornar funcao showError', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.showError).toBe('function');
    });

    it('deve retornar funcao showScoreWarning', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.showScoreWarning).toBe('function');
    });

    it('deve retornar funcao jumpToUpload', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.jumpToUpload).toBe('function');
    });

    it('deve retornar funcao getPersonalData', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.getPersonalData).toBe('function');
    });

    it('deve retornar funcao handleUploadFileFromOnboarding', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.handleUploadFileFromOnboarding).toBe('function');
    });

    it('deve retornar funcao checkOnboardingCompletion', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.checkOnboardingCompletion).toBe('function');
    });

    it('deve retornar funcao resetOnboardingState', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      expect(typeof result.current.resetOnboardingState).toBe('function');
    });

    it('deve chamar handleNextStep corretamente', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      result.current.handleNextStep();

      expect(mockHandleNextStep).toHaveBeenCalledTimes(1);
    });

    it('deve chamar handlePreviousStep corretamente', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      result.current.handlePreviousStep();

      expect(mockHandlePreviousStep).toHaveBeenCalledTimes(1);
    });

    it('deve chamar setOnboardingData com dados corretos', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      const newData = { name: 'Maria', gender: 'F' };
      result.current.setOnboardingData(newData as any);

      expect(mockSetOnboardingData).toHaveBeenCalledWith(newData);
    });

    it('deve chamar saveOnboarding com payload correto', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      const payload = { name: 'Joao', birthDate: '1990-01-15' };
      result.current.saveOnboarding(payload as any);

      expect(mockSaveOnboarding).toHaveBeenCalledWith(payload);
    });

    it('deve chamar jumpToUpload corretamente', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      result.current.jumpToUpload();

      expect(mockJumpToUpload).toHaveBeenCalledTimes(1);
    });

    it('deve chamar getPersonalData corretamente', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      result.current.getPersonalData();

      expect(mockGetPersonalData).toHaveBeenCalledTimes(1);
    });

    it('deve chamar checkOnboardingCompletion corretamente', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      result.current.checkOnboardingCompletion();

      expect(mockCheckOnboardingCompletion).toHaveBeenCalledTimes(1);
    });

    it('deve chamar resetOnboardingState corretamente', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper });

      result.current.resetOnboardingState();

      expect(mockResetOnboardingState).toHaveBeenCalledTimes(1);
    });
  });

  describe('quando usado fora do OnboardingContextProvider', () => {
    it('deve retornar contexto vazio sem lancar erro', () => {
      // useOnboarding nao lanca erro quando fora do provider
      const { result } = renderHook(() => useOnboarding());

      expect(result.current).toBeDefined();
    });
  });

  describe('com diferentes estados de contexto', () => {
    it('deve retornar step avancado', () => {
      const step2Context = {
        ...mockContextValue,
        step: 2,
      };

      const step2Wrapper = ({ children }: { children: React.ReactNode }) => (
        <OnboardingContext.Provider value={step2Context as any}>
          {children}
        </OnboardingContext.Provider>
      );

      const { result } = renderHook(() => useOnboarding(), { wrapper: step2Wrapper });

      expect(result.current.step).toBe(2);
    });

    it('deve retornar isOnboardingComplete true quando completo', () => {
      const completeContext = {
        ...mockContextValue,
        isOnboardingComplete: true,
      };

      const completeWrapper = ({ children }: { children: React.ReactNode }) => (
        <OnboardingContext.Provider value={completeContext as any}>
          {children}
        </OnboardingContext.Provider>
      );

      const { result } = renderHook(() => useOnboarding(), { wrapper: completeWrapper });

      expect(result.current.isOnboardingComplete).toBe(true);
    });

    it('deve retornar scoreWarning true quando aviso ativo', () => {
      const warningContext = {
        ...mockContextValue,
        scoreWarning: true,
      };

      const warningWrapper = ({ children }: { children: React.ReactNode }) => (
        <OnboardingContext.Provider value={warningContext as any}>
          {children}
        </OnboardingContext.Provider>
      );

      const { result } = renderHook(() => useOnboarding(), { wrapper: warningWrapper });

      expect(result.current.scoreWarning).toBe(true);
    });

    it('deve retornar isLoadingOnboardingContext true durante carregamento', () => {
      const loadingContext = {
        ...mockContextValue,
        isLoadingOnboardingContext: true,
      };

      const loadingWrapper = ({ children }: { children: React.ReactNode }) => (
        <OnboardingContext.Provider value={loadingContext as any}>
          {children}
        </OnboardingContext.Provider>
      );

      const { result } = renderHook(() => useOnboarding(), { wrapper: loadingWrapper });

      expect(result.current.isLoadingOnboardingContext).toBe(true);
    });

    it('deve retornar isLoadingUpload true durante upload', () => {
      const uploadingContext = {
        ...mockContextValue,
        isLoadingUpload: true,
      };

      const uploadingWrapper = ({ children }: { children: React.ReactNode }) => (
        <OnboardingContext.Provider value={uploadingContext as any}>
          {children}
        </OnboardingContext.Provider>
      );

      const { result } = renderHook(() => useOnboarding(), { wrapper: uploadingWrapper });

      expect(result.current.isLoadingUpload).toBe(true);
    });

    it('deve retornar personalData undefined quando nao carregado', () => {
      const noPersonalDataContext = {
        ...mockContextValue,
        personalData: undefined,
      };

      const noDataWrapper = ({ children }: { children: React.ReactNode }) => (
        <OnboardingContext.Provider value={noPersonalDataContext as any}>
          {children}
        </OnboardingContext.Provider>
      );

      const { result } = renderHook(() => useOnboarding(), { wrapper: noDataWrapper });

      expect(result.current.personalData).toBeUndefined();
    });
  });
});
