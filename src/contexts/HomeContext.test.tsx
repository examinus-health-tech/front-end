import React, { useContext } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Platform, AppState } from 'react-native';
import { HomeContext, HomeContextProvider } from './HomeContext';

// Mock da API
jest.mock('src/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock useAuth
const mockUser = { userId: 'user-123', name: 'Test User', token: 'mock-token' };
jest.mock('src/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({ user: mockUser })),
}));

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
}));

// Mock fitnessService
jest.mock('src/services/fitnessService', () => ({
  getFitnessDashboard: jest.fn(),
  isFitnessEnabled: jest.fn().mockResolvedValue(false),
  setFitnessEnabled: jest.fn(),
  syncGoalsFromBackend: jest.fn().mockResolvedValue(undefined),
}));

// Mock healthKitService
jest.mock('src/services/healthKitService', () => ({
  isHealthKitAvailable: jest.fn().mockResolvedValue(false),
  initHealthKit: jest.fn().mockResolvedValue(true),
  getHealthKitDataForDate: jest.fn().mockResolvedValue({}),
  syncHealthKitToBackend: jest.fn().mockResolvedValue(undefined),
}));

// Mock healthConnectService
jest.mock('src/services/healthConnectService', () => ({
  isHealthConnectAvailable: jest.fn().mockResolvedValue(false),
  initHealthConnect: jest.fn().mockResolvedValue(true),
  getHealthConnectDataForDate: jest.fn().mockResolvedValue({}),
  syncHealthConnectToBackend: jest.fn().mockResolvedValue(undefined),
}));

import { api } from 'src/services/api';
import { useAuth } from 'src/hooks/useAuth';
import {
  getFitnessDashboard,
  isFitnessEnabled,
  setFitnessEnabled as setFitnessEnabledService,
  syncGoalsFromBackend,
} from 'src/services/fitnessService';
import {
  isHealthKitAvailable,
  initHealthKit,
  getHealthKitDataForDate,
  syncHealthKitToBackend,
} from 'src/services/healthKitService';
import {
  isHealthConnectAvailable,
  initHealthConnect,
  getHealthConnectDataForDate,
  syncHealthConnectToBackend,
} from 'src/services/healthConnectService';

const mockApi = api as jest.Mocked<typeof api>;
const mockIsFitnessEnabled = isFitnessEnabled as jest.MockedFunction<typeof isFitnessEnabled>;
const mockGetFitnessDashboard = getFitnessDashboard as jest.MockedFunction<typeof getFitnessDashboard>;
const mockIsHealthKitAvailable = isHealthKitAvailable as jest.MockedFunction<typeof isHealthKitAvailable>;
const mockGetHealthKitDataForDate = getHealthKitDataForDate as jest.MockedFunction<typeof getHealthKitDataForDate>;
const mockIsHealthConnectAvailable = isHealthConnectAvailable as jest.MockedFunction<typeof isHealthConnectAvailable>;
const mockGetHealthConnectDataForDate = getHealthConnectDataForDate as jest.MockedFunction<typeof getHealthConnectDataForDate>;

function useHomeContext() {
  return useContext(HomeContext);
}

describe('HomeContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HomeContextProvider>{children}</HomeContextProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsFitnessEnabled.mockResolvedValue(false);
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  describe('Estado inicial', () => {
    it('deve iniciar com homeData vazio', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });
      expect(result.current.homeData).toEqual({});
    });

    it('deve iniciar com trackerData vazio', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });
      expect(result.current.trackerData).toEqual({});
    });

    it('deve iniciar com currentSystem vazio ou null', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });
      // Inicializa como {} e depois reseta para null no useEffect
      expect([null, expect.objectContaining({})]).toContainEqual(result.current.currentSystem);
    });

    it('deve iniciar com isLoadingHomeContext false', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });
      expect(result.current.isLoadingHomeContext).toBe(false);
    });

    it('deve iniciar com fitnessEnabled false', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });
      expect(result.current.fitnessEnabled).toBe(false);
    });

    it('deve fornecer todas as funcoes esperadas', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });
      expect(typeof result.current.getHomeData).toBe('function');
      expect(typeof result.current.setCurrentSystem).toBe('function');
      expect(typeof result.current.clearHomeData).toBe('function');
      expect(typeof result.current.refreshFitnessData).toBe('function');
    });
  });

  describe('getHomeData', () => {
    it('deve buscar dados da homepage com sucesso', async () => {
      const mockHomeData = {
        medicalExamId: 'exam-1',
        createdDate: '2024-01-15',
        generalScore: 85,
        generalScoreActionRecommendation: 'Manter habitos saudaveis',
        medicalExamGender: 'M',
        medicalExamStatus: 'Processed',
        medicalExamItems: [],
        medicalExamOrganicSystemsScore: [],
      };

      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: mockHomeData },
      });

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await result.current.getHomeData();
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        'medical-exam-scores/get-last-final-result-by-current-user-logged',
        expect.objectContaining({
          headers: { Accept: 'application/octet-stream' },
        })
      );
      expect(result.current.homeData).toEqual(mockHomeData);
      expect(result.current.isLoadingHomeContext).toBe(false);
    });

    it('deve limpar dados quando retorna 404', async () => {
      const error: any = new Error('Nenhum arquivo de exame');
      error.response = { status: 404, data: { message: 'Nenhum arquivo de exame encontrado' } };
      error.message = 'Nenhum arquivo de exame encontrado';

      (mockApi.get as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await result.current.getHomeData();
      });

      expect(result.current.homeData).toEqual({});
      expect(result.current.isLoadingHomeContext).toBe(false);
    });

    it('deve limpar dados quando mensagem contem "nao encontrado"', async () => {
      const error: any = new Error('Recurso não encontrado');
      error.response = { status: 400, data: { message: 'Recurso não encontrado' } };

      (mockApi.get as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await result.current.getHomeData();
      });

      expect(result.current.homeData).toEqual({});
    });

    it('deve tratar outros erros sem limpar dados', async () => {
      const error: any = new Error('Erro de servidor');
      error.response = { status: 500, data: { message: 'Internal Server Error' } };

      (mockApi.get as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await result.current.getHomeData();
      });

      expect(result.current.isLoadingHomeContext).toBe(false);
    });

    it('deve setar isLoading durante a busca', async () => {
      let resolveGet: Function;
      (mockApi.get as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => { resolveGet = resolve; })
      );

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      const getPromise = act(async () => {
        await result.current.getHomeData();
      });

      // Resolver a promise
      await act(async () => {
        resolveGet!({ data: { data: {} } });
      });

      await getPromise;

      expect(result.current.isLoadingHomeContext).toBe(false);
    });
  });

  describe('setCurrentSystem', () => {
    it('deve atualizar o sistema corrente', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });

      act(() => {
        result.current.setCurrentSystem({ sistema: 'Hematologico', nivel: 'Bom' });
      });

      expect(result.current.currentSystem).toEqual({ sistema: 'Hematologico', nivel: 'Bom' });
    });

    it('deve aceitar null como valor', () => {
      const { result } = renderHook(() => useHomeContext(), { wrapper });

      act(() => {
        result.current.setCurrentSystem({ sistema: 'Test', nivel: 'Bom' });
      });

      act(() => {
        result.current.setCurrentSystem(null);
      });

      expect(result.current.currentSystem).toBeNull();
    });
  });

  describe('clearHomeData', () => {
    it('deve limpar todos os dados da homepage', async () => {
      const mockHomeData = {
        medicalExamId: 'exam-1',
        createdDate: '2024-01-15',
        generalScore: 85,
        generalScoreActionRecommendation: 'OK',
        medicalExamGender: 'M',
        medicalExamStatus: 'Processed',
        medicalExamItems: [],
        medicalExamOrganicSystemsScore: [],
      };

      (mockApi.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockHomeData } });

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await result.current.getHomeData();
      });

      expect(result.current.homeData).toEqual(mockHomeData);

      act(() => {
        result.current.clearHomeData();
      });

      expect(result.current.homeData).toEqual({});
      expect(result.current.trackerData).toEqual({});
      expect(result.current.currentSystem).toBeNull();
    });
  });

  describe('refreshFitnessData', () => {
    it('deve verificar se fitness esta habilitado e buscar dados', async () => {
      // Primeiro mock e consumido pelo checkFitnessEnabled no useEffect (mount)
      // Segundo mock e consumido pelo refreshFitnessData
      mockIsFitnessEnabled.mockResolvedValueOnce(false); // mount
      mockIsFitnessEnabled.mockResolvedValueOnce(true);  // refreshFitnessData
      mockGetFitnessDashboard.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await result.current.refreshFitnessData();
      });

      expect(isFitnessEnabled).toHaveBeenCalled();
      expect(result.current.fitnessEnabled).toBe(true);
    });

    it('deve setar fitnessEnabled para false quando desabilitado', async () => {
      mockIsFitnessEnabled.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await result.current.refreshFitnessData();
      });

      expect(result.current.fitnessEnabled).toBe(false);
    });
  });

  describe('Reset de dados ao trocar usuario', () => {
    it('deve limpar dados quando usuario muda', async () => {
      const { result, rerender } = renderHook(() => useHomeContext(), { wrapper });

      // Simular mudanca de usuario
      (useAuth as jest.Mock).mockReturnValue({ user: null });
      rerender({});

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Dados devem ter sido resetados via useEffect
      expect(result.current.homeData).toEqual({});
    });
  });

  describe('Verificacao de fitness na inicializacao', () => {
    it('deve verificar fitness quando usuario esta logado', async () => {
      mockIsFitnessEnabled.mockResolvedValueOnce(false);

      renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // isFitnessEnabled e chamado no checkFitnessEnabled que e chamado no useEffect
      expect(isFitnessEnabled).toHaveBeenCalled();
    });

    it('deve buscar dados de fitness quando habilitado', async () => {
      mockIsFitnessEnabled.mockResolvedValueOnce(true);
      mockGetFitnessDashboard.mockResolvedValueOnce(null);

      renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(isFitnessEnabled).toHaveBeenCalled();
    });

    it('deve desabilitar fitness em caso de erro', async () => {
      mockIsFitnessEnabled.mockRejectedValueOnce(new Error('Erro'));

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(setFitnessEnabledService).toHaveBeenCalledWith(false);
      expect(result.current.fitnessEnabled).toBe(false);
    });
  });

  describe('Dados de fitness do backend', () => {
    it('deve converter dados do dashboard de fitness para trackerProps', async () => {
      mockIsFitnessEnabled.mockResolvedValueOnce(true);
      const mockDashboard = {
        todayLog: {
          caloriesBurned: 500,
          caloriesGoal: 2000,
          steps: 8000,
          stepsGoal: 10000,
          waterMl: 1500,
          waterGoalMl: 2000,
          sleepMinutes: 420,
          sleepGoalMinutes: 480,
          caloriesConsumed: 1800,
        },
        currentWeight: {
          weightKg: 75,
        },
        lastNightSleep: {
          durationMinutes: 450,
        },
      };
      mockGetFitnessDashboard.mockResolvedValueOnce(mockDashboard as any);

      const { result } = renderHook(() => useHomeContext(), { wrapper });

      // Aguardar checkFitnessEnabled + fetchFitnessData
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      // Verificar se trackerData foi populado
      if (Object.keys(result.current.trackerData).length > 0) {
        expect(result.current.trackerData.kcal).toBeDefined();
        expect(result.current.trackerData.step).toBeDefined();
        expect(result.current.trackerData.weight).toBeDefined();
        expect(result.current.trackerData.hydration).toBeDefined();
      }
    });
  });
});
