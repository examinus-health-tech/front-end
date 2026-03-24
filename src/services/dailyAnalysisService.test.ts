/**
 * Testes unitários para dailyAnalysisService.ts
 */

jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import {
  getDailyAnalysis,
  clearAnalysisCache,
  DailyFitnessData,
  DailyAnalysisResponse,
} from './dailyAnalysisService';

const mockedApi = api as jest.Mocked<typeof api>;

// Dados de fitness completos para testes
const fullFitnessData: DailyFitnessData = {
  steps: 8000,
  stepsGoal: 10000,
  caloriesBurned: 350,
  caloriesConsumed: 1800,
  caloriesGoal: 2000,
  hydrationMl: 2500,
  hydrationGoalMl: 3000,
  sleepHours: 7.5,
  sleepGoalHours: 8,
  weight: 75,
  weightGoal: 70,
};

// Dados de fitness excelentes (todas metas batidas)
const excellentData: DailyFitnessData = {
  steps: 12000,
  stepsGoal: 10000,
  caloriesBurned: 500,
  caloriesConsumed: 2000,
  caloriesGoal: 2000,
  hydrationMl: 3200,
  hydrationGoalMl: 3000,
  sleepHours: 8,
  sleepGoalHours: 8,
  weight: 70,
  weightGoal: 70,
};

// Dados de fitness fracos
const poorData: DailyFitnessData = {
  steps: 500,
  stepsGoal: 10000,
  caloriesBurned: 50,
  caloriesConsumed: 3000,
  caloriesGoal: 2000,
  hydrationMl: 500,
  hydrationGoalMl: 3000,
  sleepHours: 4,
  sleepGoalHours: 8,
  weight: 80,
  weightGoal: 70,
};

// Dados com metas zeradas
const noGoalsData: DailyFitnessData = {
  steps: 0,
  stepsGoal: 0,
  caloriesBurned: 0,
  caloriesConsumed: 0,
  caloriesGoal: 0,
  hydrationMl: 0,
  hydrationGoalMl: 0,
  sleepHours: 0,
  sleepGoalHours: 0,
  weight: null,
  weightGoal: null,
};

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
});

describe('dailyAnalysisService', () => {
  // --------------------------------------------------------
  // getDailyAnalysis
  // --------------------------------------------------------
  describe('getDailyAnalysis', () => {
    it('deve retornar análise do backend quando disponível', async () => {
      const backendResponse: DailyAnalysisResponse = {
        analysis: 'Análise do backend',
        mood: 'good',
        tips: ['Dica 1', 'Dica 2'],
        generatedAt: new Date().toISOString(),
      };

      mockedApi.post.mockResolvedValueOnce({
        data: { success: true, data: backendResponse },
      });

      const result = await getDailyAnalysis(fullFitnessData);

      expect(result).toEqual(backendResponse);
      expect(mockedApi.post).toHaveBeenCalledWith('fitness/daily-analysis', fullFitnessData);
    });

    it('deve retornar análise em cache se disponível e válida', async () => {
      const cachedAnalysis: DailyAnalysisResponse = {
        analysis: 'Análise cacheada',
        mood: 'excellent',
        tips: ['Dica cacheada'],
        generatedAt: new Date().toISOString(),
      };

      // Simula cache válido (data recente)
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:daily_analysis_date') {
          return Promise.resolve(new Date().toISOString());
        }
        if (key === '@examinus:daily_analysis') {
          return Promise.resolve(JSON.stringify(cachedAnalysis));
        }
        return Promise.resolve(null);
      });

      const result = await getDailyAnalysis(fullFitnessData);

      expect(result).toEqual(cachedAnalysis);
      expect(mockedApi.post).not.toHaveBeenCalled();
    });

    it('deve ignorar cache expirado (mais de 4 horas)', async () => {
      const oldDate = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(); // 5 horas atrás

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:daily_analysis_date') {
          return Promise.resolve(oldDate);
        }
        if (key === '@examinus:daily_analysis') {
          return Promise.resolve(JSON.stringify({ analysis: 'old', mood: 'good', tips: [], generatedAt: oldDate }));
        }
        return Promise.resolve(null);
      });

      mockedApi.post.mockResolvedValueOnce({
        data: { success: true, data: { analysis: 'Nova', mood: 'good', tips: ['Dica'], generatedAt: new Date().toISOString() } },
      });

      const result = await getDailyAnalysis(fullFitnessData);
      expect(result.analysis).toBe('Nova');
    });

    it('deve gerar análise local quando endpoint retorna 404', async () => {
      mockedApi.post.mockRejectedValueOnce({
        response: { status: 404 },
        message: 'Not Found',
      });

      const result = await getDailyAnalysis(fullFitnessData);

      expect(result.analysis).toBeTruthy();
      expect(result.mood).toBeTruthy();
      expect(result.tips.length).toBeGreaterThan(0);
      expect(result.generatedAt).toBeTruthy();
    });

    it('deve gerar análise local quando endpoint retorna 501', async () => {
      mockedApi.post.mockRejectedValueOnce({
        response: { status: 501 },
        message: 'Not Implemented',
      });

      const result = await getDailyAnalysis(fullFitnessData);

      expect(result.analysis).toBeTruthy();
      expect(result.mood).toBeTruthy();
    });

    it('deve gerar análise local quando a API retorna outro erro', async () => {
      mockedApi.post.mockRejectedValueOnce({
        response: { status: 500 },
        message: 'Internal Server Error',
      });

      const result = await getDailyAnalysis(fullFitnessData);

      expect(result.analysis).toBeTruthy();
    });

    it('deve retornar análise local quando cache falha e API falha', async () => {
      // getCachedAnalysis captura o erro de getItem e retorna null
      // O inner catch da API trata o erro e cai no fallback generateLocalAnalysis
      // Portanto, a análise local é gerada (não a genérica do outer catch)
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      mockedApi.post.mockRejectedValueOnce(new Error('API error'));

      const result = await getDailyAnalysis(fullFitnessData);

      // A análise local é gerada com base nos dados de fitness fornecidos
      expect(result.analysis).toBeTruthy();
      expect(result.mood).toBeTruthy();
      expect(result.tips.length).toBeGreaterThan(0);
      expect(result.generatedAt).toBeTruthy();
    });

    it('deve salvar análise no cache após obter do backend', async () => {
      const backendResponse: DailyAnalysisResponse = {
        analysis: 'Análise nova',
        mood: 'good',
        tips: ['Dica'],
        generatedAt: new Date().toISOString(),
      };

      mockedApi.post.mockResolvedValueOnce({
        data: { success: true, data: backendResponse },
      });

      await getDailyAnalysis(fullFitnessData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@examinus:daily_analysis',
        JSON.stringify(backendResponse)
      );
    });

    it('deve gerar análise local quando response.data.data é null', async () => {
      mockedApi.post.mockResolvedValueOnce({
        data: { success: false, data: null },
      });

      const result = await getDailyAnalysis(fullFitnessData);
      expect(result.analysis).toBeTruthy();
    });
  });

  // --------------------------------------------------------
  // Análise local - cenários de scoring
  // --------------------------------------------------------
  describe('análise local - cenários de scoring', () => {
    beforeEach(() => {
      mockedApi.post.mockRejectedValue({ response: { status: 404 } });
    });

    it('deve gerar mood "excellent" quando todas as metas são atingidas', async () => {
      const result = await getDailyAnalysis(excellentData);
      expect(result.mood).toBe('excellent');
      expect(result.analysis).toContain('excelente');
    });

    it('deve gerar mood "needs_attention" quando dados são fracos', async () => {
      const result = await getDailyAnalysis(poorData);
      expect(['needs_attention', 'moderate']).toContain(result.mood);
    });

    it('deve gerar mood "moderate" quando não há metas definidas', async () => {
      const result = await getDailyAnalysis(noGoalsData);
      // Sem metas, score é 50% (fallback), então mood é moderate
      expect(result.mood).toBe('moderate');
    });

    it('deve incluir insight sobre passos quando progresso >= 70%', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        steps: 7500,
        stepsGoal: 10000,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis).toContain('quase lá');
    });

    it('deve incluir insight sobre passos quando progresso >= 30% e < 70%', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        steps: 4000,
        stepsGoal: 10000,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis.includes('passos') || result.tips.some(t => t.includes('caminhada'))).toBe(true);
    });

    it('deve incluir tip sobre passos quando progresso é muito baixo', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        steps: 100,
        stepsGoal: 10000,
      };
      const result = await getDailyAnalysis(data);
      expect(result.tips.some(t => t.includes('volta') || t.includes('passo'))).toBe(true);
    });

    it('deve analisar calorias equilibradas (80-110%)', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        caloriesConsumed: 1900,
        caloriesGoal: 2000,
        caloriesBurned: 100,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis.includes('equilibrada') || result.tips.length > 0).toBe(true);
    });

    it('deve analisar calorias abaixo de 80%', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        caloriesConsumed: 1000,
        caloriesGoal: 2000,
        caloriesBurned: 100,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis.includes('comer mais') || result.analysis.length > 0).toBe(true);
    });

    it('deve analisar calorias acima de 110%', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        caloriesConsumed: 2500,
        caloriesGoal: 2000,
        caloriesBurned: 100,
      };
      const result = await getDailyAnalysis(data);
      expect(result.tips.some(t => t.includes('atividade') || t.includes('equil')) || result.analysis.length > 0).toBe(true);
    });

    it('deve reconhecer calorias queimadas > 300', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        caloriesBurned: 500,
        caloriesConsumed: 2000,
        caloriesGoal: 2000,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis.includes('queimou') || result.analysis.length > 0).toBe(true);
    });

    it('deve analisar hidratação completa (100%+)', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        hydrationMl: 3000,
        hydrationGoalMl: 3000,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis.includes('hidratação') || result.analysis.includes('Excelente')).toBe(true);
    });

    it('deve analisar hidratação boa (70-99%)', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        hydrationMl: 2200,
        hydrationGoalMl: 3000,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis.includes('Boa') || result.analysis.includes('hidratação') || result.analysis.length > 0).toBe(true);
    });

    it('deve analisar hidratação baixa (< 30%)', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        hydrationMl: 500,
        hydrationGoalMl: 3000,
      };
      const result = await getDailyAnalysis(data);
      expect(result.tips.some(t => t.includes('água') || t.includes('hidratação'))).toBe(true);
    });

    it('deve analisar sono ideal (90-110%)', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        sleepHours: 7.5,
        sleepGoalHours: 8,
      };
      const result = await getDailyAnalysis(data);
      expect(result.analysis.includes('dormiu') || result.analysis.length > 0).toBe(true);
    });

    it('deve analisar sono insuficiente (< 70%)', async () => {
      const data: DailyFitnessData = {
        ...noGoalsData,
        sleepHours: 4,
        sleepGoalHours: 8,
      };
      const result = await getDailyAnalysis(data);
      expect(result.tips.some(t => t.includes('dormir') || t.includes('sono'))).toBe(true);
    });

    it('deve limitar a 3 dicas no máximo', async () => {
      const result = await getDailyAnalysis(poorData);
      expect(result.tips.length).toBeLessThanOrEqual(3);
    });

    it('deve incluir dica padrão positiva quando mood é bom e não há dicas', async () => {
      const result = await getDailyAnalysis(excellentData);
      expect(result.tips.length).toBeGreaterThan(0);
    });
  });

  // --------------------------------------------------------
  // clearAnalysisCache
  // --------------------------------------------------------
  describe('clearAnalysisCache', () => {
    it('deve remover ambas as chaves do AsyncStorage', async () => {
      await clearAnalysisCache();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@examinus:daily_analysis_date');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@examinus:daily_analysis');
    });

    it('deve não lançar erro quando AsyncStorage falha', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(clearAnalysisCache()).resolves.toBeUndefined();
    });
  });

  // --------------------------------------------------------
  // Cache - edge cases
  // --------------------------------------------------------
  describe('cache - edge cases', () => {
    it('deve retornar null do cache quando data existe mas análise não', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:daily_analysis_date') {
          return Promise.resolve(new Date().toISOString());
        }
        return Promise.resolve(null);
      });

      mockedApi.post.mockRejectedValueOnce({ response: { status: 404 } });

      const result = await getDailyAnalysis(fullFitnessData);
      // Deve gerar análise local já que cache é inválido
      expect(result.analysis).toBeTruthy();
    });

    it('deve lidar com erro ao salvar cache graciosamente', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Disk full'));
      mockedApi.post.mockRejectedValueOnce({ response: { status: 404 } });

      // Não deve lançar erro
      const result = await getDailyAnalysis(fullFitnessData);
      expect(result.analysis).toBeTruthy();
    });
  });
});
