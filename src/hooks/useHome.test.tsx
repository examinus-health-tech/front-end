import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useHome } from './useHome';
import { HomeContext } from '../contexts/HomeContext';

describe('useHome', () => {
  const mockGetHomeData = jest.fn();
  const mockSetCurrentSystem = jest.fn();
  const mockClearHomeData = jest.fn();
  const mockRefreshFitnessData = jest.fn();

  const mockHomeData = {
    medicalExamId: 'exam-123',
    createdDate: '2026-03-20',
    generalScore: 85,
    generalScoreActionRecommendation: 'Manter rotina',
    medicalExamGender: 'M',
    medicalExamStatus: 'completed',
    medicalExamItems: [
      {
        examItemDescription: 'Hemoglobina',
        medicalExamItemReferenceValue: '12-16',
        medicalExamItemMeasureUnit: 'g/dL',
        medicalExamItemScore: 90,
        medicalExamItemWeightSummaryExplanation: 'Normal',
        medicalExamItemWeightActionRecommendation: 'Continuar',
        medicalExamItemWeightColor: 'green',
        medicalExamItemWeightDescription: 'Adequado',
      },
    ],
    medicalExamOrganicSystemsScore: [],
  };

  const mockTrackerData = {
    steps: 5000,
    calories: 300,
  };

  const mockCurrentSystem = {
    id: 'system-1',
    name: 'Sistema Cardiovascular',
  };

  const mockContextValue = {
    homeData: mockHomeData,
    getHomeData: mockGetHomeData,
    isLoadingHomeContext: false,
    trackerData: mockTrackerData,
    currentSystem: mockCurrentSystem,
    setCurrentSystem: mockSetCurrentSystem,
    clearHomeData: mockClearHomeData,
    fitnessEnabled: true,
    refreshFitnessData: mockRefreshFitnessData,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HomeContext.Provider value={mockContextValue as any}>
      {children}
    </HomeContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quando usado dentro do HomeContextProvider', () => {
    it('deve retornar o contexto do Home', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('deve retornar dados da home', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(result.current.homeData).toEqual(mockHomeData);
    });

    it('deve retornar dados do tracker', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(result.current.trackerData).toEqual(mockTrackerData);
    });

    it('deve retornar sistema atual', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(result.current.currentSystem).toEqual(mockCurrentSystem);
    });

    it('deve retornar estado de carregamento', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(result.current.isLoadingHomeContext).toBe(false);
    });

    it('deve retornar estado de fitness habilitado', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(result.current.fitnessEnabled).toBe(true);
    });

    it('deve retornar funcao getHomeData', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(typeof result.current.getHomeData).toBe('function');
    });

    it('deve retornar funcao setCurrentSystem', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(typeof result.current.setCurrentSystem).toBe('function');
    });

    it('deve retornar funcao clearHomeData', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(typeof result.current.clearHomeData).toBe('function');
    });

    it('deve retornar funcao refreshFitnessData', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      expect(typeof result.current.refreshFitnessData).toBe('function');
    });

    it('deve chamar getHomeData corretamente', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      result.current.getHomeData();

      expect(mockGetHomeData).toHaveBeenCalledTimes(1);
    });

    it('deve chamar setCurrentSystem com valor correto', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      const newSystem = { id: 'system-2', name: 'Sistema Endocrino' };
      result.current.setCurrentSystem(newSystem as any);

      expect(mockSetCurrentSystem).toHaveBeenCalledWith(newSystem);
    });

    it('deve chamar clearHomeData corretamente', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      result.current.clearHomeData();

      expect(mockClearHomeData).toHaveBeenCalledTimes(1);
    });

    it('deve chamar refreshFitnessData corretamente', () => {
      const { result } = renderHook(() => useHome(), { wrapper });

      result.current.refreshFitnessData();

      expect(mockRefreshFitnessData).toHaveBeenCalledTimes(1);
    });
  });

  describe('quando usado fora do HomeContextProvider', () => {
    it('deve retornar contexto vazio sem lancar erro', () => {
      // useHome nao lanca erro quando fora do provider, retorna contexto vazio
      const { result } = renderHook(() => useHome());

      expect(result.current).toBeDefined();
    });
  });

  describe('com diferentes estados de contexto', () => {
    it('deve retornar isLoadingHomeContext true durante carregamento', () => {
      const loadingContext = {
        ...mockContextValue,
        isLoadingHomeContext: true,
      };

      const loadingWrapper = ({ children }: { children: React.ReactNode }) => (
        <HomeContext.Provider value={loadingContext as any}>
          {children}
        </HomeContext.Provider>
      );

      const { result } = renderHook(() => useHome(), { wrapper: loadingWrapper });

      expect(result.current.isLoadingHomeContext).toBe(true);
    });

    it('deve retornar fitnessEnabled false quando desabilitado', () => {
      const disabledFitnessContext = {
        ...mockContextValue,
        fitnessEnabled: false,
      };

      const disabledWrapper = ({ children }: { children: React.ReactNode }) => (
        <HomeContext.Provider value={disabledFitnessContext as any}>
          {children}
        </HomeContext.Provider>
      );

      const { result } = renderHook(() => useHome(), { wrapper: disabledWrapper });

      expect(result.current.fitnessEnabled).toBe(false);
    });

    it('deve retornar homeData vazio quando nao ha dados', () => {
      const emptyContext = {
        ...mockContextValue,
        homeData: {} as any,
      };

      const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
        <HomeContext.Provider value={emptyContext as any}>
          {children}
        </HomeContext.Provider>
      );

      const { result } = renderHook(() => useHome(), { wrapper: emptyWrapper });

      expect(result.current.homeData).toEqual({});
    });
  });
});
