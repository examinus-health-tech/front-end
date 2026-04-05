import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const DAILY_ANALYSIS_CACHE_KEY = '@examinus:daily_analysis';
const DAILY_ANALYSIS_DATE_KEY = '@examinus:daily_analysis_date';

export interface DailyFitnessData {
  steps: number;
  stepsGoal: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  caloriesGoal: number;
  hydrationMl: number;
  hydrationGoalMl: number;
  sleepHours: number;
  sleepGoalHours: number;
  weight: number | null;
  weightGoal: number | null;
}

export interface DailyAnalysisResponse {
  analysis: string;
  mood: 'excellent' | 'good' | 'moderate' | 'needs_attention';
  tips: string[];
  generatedAt: string;
}

/**
 * Gera uma análise do dia usando IA
 */
export async function getDailyAnalysis(data: DailyFitnessData): Promise<DailyAnalysisResponse> {
  try {
    if (__DEV__) console.log('[DAILY_ANALYSIS] Gerando análise do dia...', data);

    // Verifica se já tem análise em cache para hoje
    const cachedAnalysis = await getCachedAnalysis();
    if (cachedAnalysis) {
      if (__DEV__) console.log('[DAILY_ANALYSIS] Retornando análise em cache');
      return cachedAnalysis;
    }

    // Tenta buscar do backend primeiro
    try {
      const response = await api.post<{ success: boolean; data: DailyAnalysisResponse }>(
        'fitness/daily-analysis',
        data
      );

      if (response.data?.data) {
        await cacheAnalysis(response.data.data);
        return response.data.data;
      }
    } catch (apiError: any) {
      // Se o endpoint não existir, gera análise local
      if (apiError.response?.status === 404 || apiError.response?.status === 501) {
        if (__DEV__) console.log('[DAILY_ANALYSIS] Endpoint não disponível, gerando análise local');
      } else {
        if (__DEV__) console.warn('[DAILY_ANALYSIS] Erro na API:', apiError.message);
      }
    }

    // Fallback: gera análise local baseada em regras
    const localAnalysis = generateLocalAnalysis(data);
    await cacheAnalysis(localAnalysis);
    return localAnalysis;

  } catch (error: any) {
    if (__DEV__) console.error('[DAILY_ANALYSIS] Erro ao gerar análise:', error);
    // Retorna análise genérica em caso de erro
    return {
      analysis: 'Continue acompanhando suas métricas para receber análises personalizadas do seu dia.',
      mood: 'moderate',
      tips: ['Mantenha-se hidratado', 'Tente se movimentar regularmente'],
      generatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Gera análise local baseada em regras
 */
function generateLocalAnalysis(data: DailyFitnessData): DailyAnalysisResponse {
  const insights: string[] = [];
  const tips: string[] = [];
  let score = 0;
  let maxScore = 0;

  // Análise de passos
  if (data.stepsGoal > 0) {
    maxScore += 25;
    const stepsProgress = (data.steps / data.stepsGoal) * 100;
    if (stepsProgress >= 100) {
      insights.push(`Parabéns! Você atingiu sua meta de ${data.stepsGoal.toLocaleString('pt-BR')} passos.`);
      score += 25;
    } else if (stepsProgress >= 70) {
      insights.push(`Você está quase lá! Faltam ${(data.stepsGoal - data.steps).toLocaleString('pt-BR')} passos para bater a meta.`);
      score += 18;
    } else if (stepsProgress >= 30) {
      insights.push(`Você deu ${data.steps.toLocaleString('pt-BR')} passos hoje.`);
      tips.push('Tente fazer uma caminhada rápida para aumentar seus passos');
      score += 10;
    } else if (data.steps > 0) {
      tips.push('Que tal dar uma volta? Cada passo conta!');
      score += 5;
    }
  }

  // Análise de calorias consumidas vs queimadas
  if (data.caloriesGoal > 0) {
    maxScore += 25;
    const caloriesBalance = data.caloriesConsumed - data.caloriesBurned;
    const consumedProgress = (data.caloriesConsumed / data.caloriesGoal) * 100;

    if (consumedProgress >= 80 && consumedProgress <= 110) {
      insights.push('Sua alimentação está equilibrada hoje.');
      score += 25;
    } else if (consumedProgress < 80 && data.caloriesConsumed > 0) {
      insights.push('Você ainda pode comer mais para atingir sua meta calórica.');
      score += 15;
    } else if (consumedProgress > 110) {
      tips.push('Considere uma atividade física leve para equilibrar as calorias');
      score += 10;
    }

    if (data.caloriesBurned > 300) {
      insights.push(`Ótimo! Você queimou ${data.caloriesBurned.toLocaleString('pt-BR')} kcal em atividades.`);
      score += 5;
    }
  }

  // Análise de hidratação
  if (data.hydrationGoalMl > 0) {
    maxScore += 25;
    const hydrationProgress = (data.hydrationMl / data.hydrationGoalMl) * 100;

    if (hydrationProgress >= 100) {
      insights.push('Excelente! Você atingiu sua meta de hidratação.');
      score += 25;
    } else if (hydrationProgress >= 70) {
      insights.push(`Boa hidratação! Faltam ${Math.round((data.hydrationGoalMl - data.hydrationMl))}ml para a meta.`);
      score += 18;
    } else if (hydrationProgress >= 30) {
      tips.push('Lembre-se de beber água regularmente');
      score += 10;
    } else {
      tips.push('Sua hidratação está baixa. Beba um copo de água agora!');
      score += 5;
    }
  }

  // Análise de sono
  if (data.sleepGoalHours > 0 && data.sleepHours > 0) {
    maxScore += 25;
    const sleepProgress = (data.sleepHours / data.sleepGoalHours) * 100;

    if (sleepProgress >= 90 && sleepProgress <= 110) {
      insights.push(`Você dormiu ${data.sleepHours.toFixed(1)}h, dentro da meta ideal.`);
      score += 25;
    } else if (sleepProgress >= 70) {
      insights.push(`Você dormiu ${data.sleepHours.toFixed(1)}h na última noite.`);
      score += 18;
    } else if (sleepProgress < 70) {
      tips.push('Tente dormir mais cedo hoje para recuperar o sono');
      score += 10;
    }
  }

  // Determina o humor geral
  const scorePercentage = maxScore > 0 ? (score / maxScore) * 100 : 50;
  let mood: DailyAnalysisResponse['mood'];
  let summaryPrefix: string;

  if (scorePercentage >= 85) {
    mood = 'excellent';
    summaryPrefix = 'Dia excelente!';
  } else if (scorePercentage >= 65) {
    mood = 'good';
    summaryPrefix = 'Bom dia!';
  } else if (scorePercentage >= 40) {
    mood = 'moderate';
    summaryPrefix = 'Dia razoável.';
  } else {
    mood = 'needs_attention';
    summaryPrefix = 'Atenção!';
  }

  // Monta a análise final
  const analysisText = insights.length > 0
    ? `${summaryPrefix} ${insights.join(' ')}`
    : `${summaryPrefix} Continue acompanhando suas métricas para insights personalizados.`;

  // Adiciona dicas padrão se não houver
  if (tips.length === 0) {
    if (mood === 'excellent' || mood === 'good') {
      tips.push('Continue assim! Você está no caminho certo.');
    } else {
      tips.push('Pequenos passos levam a grandes mudanças');
    }
  }

  return {
    analysis: analysisText,
    mood,
    tips: tips.slice(0, 3), // Máximo 3 dicas
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Recupera análise em cache (válida por 4 horas)
 */
async function getCachedAnalysis(): Promise<DailyAnalysisResponse | null> {
  try {
    const [cachedDate, cachedAnalysis] = await Promise.all([
      AsyncStorage.getItem(DAILY_ANALYSIS_DATE_KEY),
      AsyncStorage.getItem(DAILY_ANALYSIS_CACHE_KEY),
    ]);

    if (!cachedDate || !cachedAnalysis) return null;

    const cacheTime = new Date(cachedDate).getTime();
    const now = Date.now();
    const fourHours = 4 * 60 * 60 * 1000;

    // Cache válido por 4 horas
    if (now - cacheTime < fourHours) {
      return JSON.parse(cachedAnalysis);
    }

    return null;
  } catch (error) {
    if (__DEV__) console.warn('[DAILY_ANALYSIS] Erro ao ler cache:', error);
    return null;
  }
}

/**
 * Salva análise em cache
 */
async function cacheAnalysis(analysis: DailyAnalysisResponse): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(DAILY_ANALYSIS_DATE_KEY, new Date().toISOString()),
      AsyncStorage.setItem(DAILY_ANALYSIS_CACHE_KEY, JSON.stringify(analysis)),
    ]);
  } catch (error) {
    if (__DEV__) console.warn('[DAILY_ANALYSIS] Erro ao salvar cache:', error);
  }
}

/**
 * Limpa o cache de análise (força nova geração)
 */
export async function clearAnalysisCache(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(DAILY_ANALYSIS_DATE_KEY),
      AsyncStorage.removeItem(DAILY_ANALYSIS_CACHE_KEY),
    ]);
    if (__DEV__) console.log('[DAILY_ANALYSIS] Cache limpo');
  } catch (error) {
    if (__DEV__) console.warn('[DAILY_ANALYSIS] Erro ao limpar cache:', error);
  }
}
