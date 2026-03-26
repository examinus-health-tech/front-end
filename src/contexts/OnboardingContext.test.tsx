import React, { useContext } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingContext, OnboardingContextProvider } from './OnboardingContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock da API
jest.mock('src/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock do userService
jest.mock('@services/userService', () => ({
  saveUserPersonalData: jest.fn(),
  getUserPersonalData: jest.fn(),
  getOnboardingStatus: jest.fn(),
  completeOnboarding: jest.fn(),
}));

import { api } from 'src/services/api';
import {
  saveUserPersonalData,
  getUserPersonalData,
  getOnboardingStatus,
  completeOnboarding,
} from '@services/userService';

const mockApi = api as jest.Mocked<typeof api>;
const mockSaveUserPersonalData = saveUserPersonalData as jest.MockedFunction<typeof saveUserPersonalData>;
const mockGetUserPersonalData = getUserPersonalData as jest.MockedFunction<typeof getUserPersonalData>;
const mockGetOnboardingStatus = getOnboardingStatus as jest.MockedFunction<typeof getOnboardingStatus>;
const mockCompleteOnboarding = completeOnboarding as jest.MockedFunction<typeof completeOnboarding>;

function useOnboardingContext() {
  return useContext(OnboardingContext);
}

describe('OnboardingContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <OnboardingContextProvider>{children}</OnboardingContextProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Estado inicial', () => {
    it('deve iniciar com onboardingData vazio', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.onboardingData).toEqual({});
    });

    it('deve iniciar com step 0', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.step).toBe(0);
    });

    it('deve iniciar com isLoadingOnboardingContext false', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.isLoadingOnboardingContext).toBe(false);
    });

    it('deve iniciar com personalData undefined', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.personalData).toBeUndefined();
    });

    it('deve iniciar com isLoadingUpload false', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.isLoadingUpload).toBe(false);
    });

    it('deve iniciar com scoreWarning false', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.scoreWarning).toBe(false);
    });

    it('deve iniciar com isOnboardingComplete false', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.isOnboardingComplete).toBe(false);
    });

    it('deve ter stepsMap com passos corretos', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });
      expect(result.current.stepsMap).toBeDefined();
      expect(result.current.stepsMap.length).toBeGreaterThan(0);
      expect(result.current.stepsMap[0].currentStep).toBe('gender');
    });
  });

  describe('Carregamento de dados do AsyncStorage', () => {
    it('deve carregar dados do onboarding do AsyncStorage na inicializacao', async () => {
      const storedData = { gender: 'M', weight: 80, height: 1.75 };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(storedData));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      // Aguardar useEffect
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@app:onboardingData');
    });

    it('deve tratar dados invalidos no AsyncStorage graciosamente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid-json{{{');

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Deve limpar dados invalidos
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@app:onboardingData');
    });

    it('deve tratar erro ao carregar dados do AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Nao deve quebrar
      expect(result.current.onboardingData).toEqual({});
    });
  });

  describe('handleNextStep', () => {
    it('deve avancar para o proximo passo', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      expect(result.current.step).toBe(0);

      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.step).toBe(1);
    });

    it('deve avancar multiplos passos sequencialmente', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      act(() => {
        result.current.handleNextStep();
      });
      act(() => {
        result.current.handleNextStep();
      });
      act(() => {
        result.current.handleNextStep();
      });

      expect(result.current.step).toBe(3);
    });
  });

  describe('handlePreviousStep', () => {
    it('deve voltar para o passo anterior', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      act(() => {
        result.current.handleNextStep();
      });
      act(() => {
        result.current.handleNextStep();
      });

      act(() => {
        result.current.handlePreviousStep();
      });

      expect(result.current.step).toBe(1);
    });
  });

  describe('jumpToUpload', () => {
    it('deve pular para o passo de upload', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      act(() => {
        result.current.jumpToUpload();
      });

      const uploadIndex = result.current.stepsMap.findIndex(s => s.currentStep === 'upload');
      expect(result.current.step).toBe(uploadIndex);
    });
  });

  describe('showError', () => {
    it('deve navegar para o passo de erro', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      act(() => {
        result.current.showError();
      });

      const errorIndex = result.current.stepsMap.findIndex(s => s.currentStep === 'error');
      expect(result.current.step).toBe(errorIndex);
    });
  });

  describe('showScoreWarning', () => {
    it('deve navegar para o passo de score', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      act(() => {
        result.current.showScoreWarning();
      });

      const scoreIndex = result.current.stepsMap.findIndex(s => s.currentStep === 'score');
      expect(result.current.step).toBe(scoreIndex);
    });
  });

  describe('setOnboardingData', () => {
    it('deve atualizar dados do onboarding', () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      const newData = { gender: 'F' as const, weight: 65 };

      act(() => {
        result.current.setOnboardingData(newData);
      });

      expect(result.current.onboardingData).toEqual(newData);
    });

    it('deve persistir dados no AsyncStorage quando mudar', async () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      const newData = { gender: 'M' as const, weight: 80, height: 1.80 };

      await act(async () => {
        result.current.setOnboardingData(newData);
        // Aguardar useEffect de persistencia
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@app:onboardingData',
        JSON.stringify(newData)
      );
    });
  });

  describe('getPersonalData', () => {
    it('deve buscar dados pessoais com sucesso', async () => {
      const mockPersonalData = {
        gender: 'M',
        weight: 80,
        height: 175, // Em cm do backend
        age: 30,
      };

      mockGetUserPersonalData.mockResolvedValueOnce(mockPersonalData as any);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.getPersonalData();
      });

      // Deve normalizar altura de cm para metros
      expect(result.current.personalData.height).toBe(1.75);
      expect(result.current.isLoadingOnboardingContext).toBe(false);
    });

    it('deve definir personalData como undefined quando nao ha dados', async () => {
      mockGetUserPersonalData.mockResolvedValueOnce(null as any);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.getPersonalData();
      });

      expect(result.current.personalData).toBeUndefined();
      expect(result.current.isOnboardingComplete).toBe(false);
    });

    it('deve tratar erro ao buscar dados pessoais', async () => {
      mockGetUserPersonalData.mockRejectedValueOnce(new Error('Erro de rede'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.getPersonalData();
      });

      expect(result.current.personalData).toBeUndefined();
      expect(result.current.isOnboardingComplete).toBe(false);
      expect(result.current.isLoadingOnboardingContext).toBe(false);
    });

    it('nao deve converter altura que ja esta em metros', async () => {
      const mockPersonalData = {
        gender: 'F',
        weight: 60,
        height: 1.65, // Ja em metros (< 10)
        age: 25,
      };

      mockGetUserPersonalData.mockResolvedValueOnce(mockPersonalData as any);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.getPersonalData();
      });

      expect(result.current.personalData.height).toBe(1.65);
    });
  });

  describe('checkOnboardingCompletion', () => {
    it('deve retornar true quando onboarding esta completo', async () => {
      mockGetOnboardingStatus.mockResolvedValueOnce({ hasCompletedOnboarding: true });
      mockGetUserPersonalData.mockResolvedValueOnce({ gender: 'M', weight: 80, height: 175 } as any);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      let isComplete: boolean = false;
      await act(async () => {
        isComplete = await result.current.checkOnboardingCompletion();
      });

      expect(isComplete).toBe(true);
      expect(result.current.isOnboardingComplete).toBe(true);
    });

    it('deve buscar dados pessoais quando onboarding esta completo', async () => {
      mockGetOnboardingStatus.mockResolvedValueOnce({ hasCompletedOnboarding: true });
      const mockData = { gender: 'M', weight: 80, height: 175 };
      mockGetUserPersonalData.mockResolvedValueOnce(mockData as any);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.checkOnboardingCompletion();
      });

      expect(mockGetUserPersonalData).toHaveBeenCalled();
      expect(result.current.personalData).toBeDefined();
    });

    it('deve retornar false quando onboarding nao esta completo', async () => {
      mockGetOnboardingStatus.mockResolvedValueOnce({ hasCompletedOnboarding: false });

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      let isComplete: boolean = true;
      await act(async () => {
        isComplete = await result.current.checkOnboardingCompletion();
      });

      expect(isComplete).toBe(false);
      expect(result.current.isOnboardingComplete).toBe(false);
      expect(result.current.personalData).toBeUndefined();
    });

    it('deve limpar dados pessoais quando onboarding nao esta completo', async () => {
      mockGetOnboardingStatus.mockResolvedValueOnce({ hasCompletedOnboarding: false });

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.checkOnboardingCompletion();
      });

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@app:personalData');
    });

    it('deve retornar false quando ocorre erro', async () => {
      mockGetOnboardingStatus.mockRejectedValueOnce(new Error('Erro'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      let isComplete: boolean = true;
      await act(async () => {
        isComplete = await result.current.checkOnboardingCompletion();
      });

      expect(isComplete).toBe(false);
      expect(result.current.isOnboardingComplete).toBe(false);
    });

    it('deve tratar erro ao buscar dados pessoais apos onboarding completo', async () => {
      mockGetOnboardingStatus.mockResolvedValueOnce({ hasCompletedOnboarding: true });
      mockGetUserPersonalData.mockRejectedValueOnce(new Error('Erro ao buscar dados'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      let isComplete: boolean = false;
      await act(async () => {
        isComplete = await result.current.checkOnboardingCompletion();
      });

      // Mesmo com erro nos dados pessoais, onboarding continua como completo
      expect(isComplete).toBe(true);
      expect(result.current.isOnboardingComplete).toBe(true);
    });
  });

  describe('resetOnboardingState', () => {
    it('deve resetar todo o estado do onboarding', async () => {
      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      // Primeiro, configurar algum estado
      act(() => {
        result.current.setOnboardingData({ gender: 'M' as const, weight: 80 });
        result.current.handleNextStep();
        result.current.handleNextStep();
      });

      await act(async () => {
        await result.current.resetOnboardingState();
      });

      expect(result.current.step).toBe(0);
      expect(result.current.onboardingData).toEqual({});
      expect(result.current.personalData).toBeUndefined();
      expect(result.current.isOnboardingComplete).toBe(false);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@app:onboardingData');
    });

    it('deve continuar mesmo com erro ao limpar AsyncStorage', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.resetOnboardingState();
      });

      // States devem ter sido limpos mesmo com erro no storage
      expect(result.current.step).toBe(0);
      expect(result.current.isOnboardingComplete).toBe(false);
    });
  });

  describe('saveOnboarding', () => {
    const mockPayload = {
      gender: 'M' as const,
      weight: 80,
      height: 1.80,
      age: 30,
      workoutLevel: 3,
    };

    it('deve salvar dados do onboarding no backend com sucesso', async () => {
      mockSaveUserPersonalData.mockResolvedValueOnce(undefined as any);
      mockCompleteOnboarding.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.saveOnboarding(mockPayload);
      });

      // Deve converter altura de metros para cm antes de enviar
      expect(mockSaveUserPersonalData).toHaveBeenCalledWith(
        expect.objectContaining({
          height: 180, // 1.80 * 100
        })
      );
      expect(mockCompleteOnboarding).toHaveBeenCalled();
      expect(result.current.isOnboardingComplete).toBe(true);
    });

    it('deve normalizar workoutLevel e physicalLevel', async () => {
      mockSaveUserPersonalData.mockResolvedValueOnce(undefined as any);
      mockCompleteOnboarding.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.saveOnboarding({ ...mockPayload, physicalLevel: 4 });
      });

      expect(mockSaveUserPersonalData).toHaveBeenCalledWith(
        expect.objectContaining({
          workoutLevel: 3,
          physicalLevel: 4,
        })
      );
    });

    it('deve pular para upload apos salvar com sucesso', async () => {
      mockSaveUserPersonalData.mockResolvedValueOnce(undefined as any);
      mockCompleteOnboarding.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.saveOnboarding(mockPayload);
      });

      const uploadIndex = result.current.stepsMap.findIndex(s => s.currentStep === 'upload');
      expect(result.current.step).toBe(uploadIndex);
    });

    it('deve salvar localmente e continuar quando backend falha', async () => {
      mockSaveUserPersonalData.mockRejectedValueOnce(new Error('Backend error'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.saveOnboarding(mockPayload);
      });

      // Deve ter salvo localmente mesmo com erro
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@app:onboardingData',
        JSON.stringify(mockPayload)
      );
      // Deve pular para upload mesmo com erro
      const uploadIndex = result.current.stepsMap.findIndex(s => s.currentStep === 'upload');
      expect(result.current.step).toBe(uploadIndex);
    });

    it('deve continuar quando completeOnboarding falha', async () => {
      mockSaveUserPersonalData.mockResolvedValueOnce(undefined as any);
      mockCompleteOnboarding.mockRejectedValueOnce(new Error('Complete error'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.saveOnboarding(mockPayload);
      });

      // Nao deve quebrar - deve continuar o fluxo
      const uploadIndex = result.current.stepsMap.findIndex(s => s.currentStep === 'upload');
      expect(result.current.step).toBe(uploadIndex);
    });

    it('nao deve converter altura que ja esta em cm', async () => {
      mockSaveUserPersonalData.mockResolvedValueOnce(undefined as any);
      mockCompleteOnboarding.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.saveOnboarding({ ...mockPayload, height: 180 }); // Ja em cm
      });

      expect(mockSaveUserPersonalData).toHaveBeenCalledWith(
        expect.objectContaining({
          height: 180,
        })
      );
    });
  });

  describe('handleUploadFileFromOnboarding', () => {
    const mockFile = {
      name: 'exame.pdf',
      mimeType: 'application/pdf',
      uri: 'file:///tmp/exame.pdf',
    } as any;

    it('deve fazer upload de arquivo com sucesso', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        data: { message: 'Success' },
      });

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFileFromOnboarding(mockFile);
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'medical-exam/form',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-type': 'multipart/form-data',
            Accept: 'application/octet-stream',
          },
        })
      );
      expect(result.current.scoreWarning).toBe(true);
      expect(result.current.isLoadingUpload).toBe(false);
    });

    it('deve navegar para erro quando upload falha', async () => {
      (mockApi.post as jest.Mock).mockRejectedValueOnce(new Error('Upload error'));

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await expect(
        act(async () => {
          await result.current.handleUploadFileFromOnboarding(mockFile);
        })
      ).rejects.toThrow('Upload error');

      expect(result.current.isLoadingUpload).toBe(false);
    });

    it('deve detectar tipo MIME para arquivo jpg sem mimeType', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        data: { message: 'Success' },
      });

      const jpgFile = {
        name: 'foto.jpg',
        uri: 'file:///tmp/foto.jpg',
      } as any;

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFileFromOnboarding(jpgFile);
      });

      expect(result.current.scoreWarning).toBe(true);
    });

    it('deve detectar tipo MIME para arquivo png sem mimeType', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        data: { message: 'Success' },
      });

      const pngFile = {
        name: 'imagem.png',
        uri: 'file:///tmp/imagem.png',
      } as any;

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFileFromOnboarding(pngFile);
      });

      expect(result.current.scoreWarning).toBe(true);
    });

    it('deve usar fallback PDF para arquivo sem mimeType e extensao desconhecida', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        data: { message: 'Success' },
      });

      const unknownFile = {
        name: 'arquivo.xyz',
        uri: 'file:///tmp/arquivo.xyz',
      } as any;

      const { result } = renderHook(() => useOnboardingContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFileFromOnboarding(unknownFile);
      });

      expect(result.current.scoreWarning).toBe(true);
    });
  });
});
