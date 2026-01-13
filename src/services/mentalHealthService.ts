import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key para avaliações de saúde mental
export const MENTAL_HEALTH_KEY = '@examinus:mental_health_assessments';

// Tipos de classificação
export type ClassificationLevel = 'normal' | 'leve' | 'moderado' | 'grave' | 'extremamente_grave';

// Interface para uma avaliação de saúde mental
export interface MentalHealthAssessment {
  id: string;
  date: string;
  answers: number[]; // 21 respostas (0-3)
  scores: {
    depression: number;
    anxiety: number;
    stress: number;
  };
  classifications: {
    depression: ClassificationLevel;
    anxiety: ClassificationLevel;
    stress: ClassificationLevel;
  };
}

// Perguntas do DASS-21 em português
export const DASS21_QUESTIONS = [
  'Achei difícil me acalmar', // 1 - Estresse
  'Senti minha boca seca', // 2 - Ansiedade
  'Não consegui vivenciar nenhum sentimento positivo', // 3 - Depressão
  'Tive dificuldade em respirar em alguns momentos (ex. respiração ofegante, falta de ar, sem ter feito nenhum esforço físico)', // 4 - Ansiedade
  'Achei difícil ter iniciativa para fazer as coisas', // 5 - Depressão
  'Tive a tendência de reagir de forma exagerada às situações', // 6 - Estresse
  'Senti tremores (ex. nas mãos)', // 7 - Ansiedade
  'Senti que estava sempre nervoso', // 8 - Estresse
  'Preocupei-me com situações em que eu pudesse entrar em pânico e parecesse ridículo(a)', // 9 - Ansiedade
  'Senti que não tinha nada a desejar', // 10 - Depressão
  'Senti-me agitado', // 11 - Estresse
  'Achei difícil relaxar', // 12 - Estresse
  'Senti-me depressivo(a) e sem ânimo', // 13 - Depressão
  'Fui intolerante com as coisas que me impediam de continuar o que eu estava fazendo', // 14 - Estresse
  'Senti que ia entrar em pânico', // 15 - Ansiedade
  'Não consegui me entusiasmar com nada', // 16 - Depressão
  'Senti que não tinha valor como pessoa', // 17 - Depressão
  'Senti que estava um pouco emotivo/sensível demais', // 18 - Estresse
  'Sabia que meu coração estava alterado mesmo não tendo feito nenhum esforço físico (ex. aumento da frequência cardíaca, disritmia cardíaca)', // 19 - Ansiedade
  'Senti medo sem motivo', // 20 - Ansiedade
  'Senti que a vida não tinha sentido', // 21 - Depressão
];

// Opções de resposta
export const RESPONSE_OPTIONS = [
  { value: 0, label: 'Não se aplicou de maneira alguma' },
  { value: 1, label: 'Aplicou-se em algum grau, ou por pouco tempo' },
  { value: 2, label: 'Aplicou-se em um grau considerável, ou por uma boa parte do tempo' },
  { value: 3, label: 'Aplicou-se muito, ou na maioria do tempo' },
];

// Índices das perguntas por domínio (base 0)
const DEPRESSION_INDICES = [2, 4, 9, 12, 15, 16, 20]; // Perguntas 3, 5, 10, 13, 16, 17, 21
const ANXIETY_INDICES = [1, 3, 6, 8, 14, 18, 19]; // Perguntas 2, 4, 7, 9, 15, 19, 20
const STRESS_INDICES = [0, 5, 7, 10, 11, 13, 17]; // Perguntas 1, 6, 8, 11, 12, 14, 18

/**
 * Calcula o score de um domínio específico
 */
function calculateDomainScore(answers: number[], indices: number[]): number {
  const sum = indices.reduce((acc, index) => acc + (answers[index] || 0), 0);
  return sum * 2; // Multiplicar por 2 conforme DASS-21
}

/**
 * Classifica o score de depressão
 */
function classifyDepression(score: number): ClassificationLevel {
  if (score <= 9) return 'normal';
  if (score <= 13) return 'leve';
  if (score <= 20) return 'moderado';
  if (score <= 27) return 'grave';
  return 'extremamente_grave';
}

/**
 * Classifica o score de ansiedade
 */
function classifyAnxiety(score: number): ClassificationLevel {
  if (score <= 7) return 'normal';
  if (score <= 9) return 'leve';
  if (score <= 14) return 'moderado';
  if (score <= 19) return 'grave';
  return 'extremamente_grave';
}

/**
 * Classifica o score de estresse
 */
function classifyStress(score: number): ClassificationLevel {
  if (score <= 14) return 'normal';
  if (score <= 18) return 'leve';
  if (score <= 25) return 'moderado';
  if (score <= 33) return 'grave';
  return 'extremamente_grave';
}

/**
 * Calcula os scores e classificações a partir das respostas
 */
export function calculateScores(answers: number[]): {
  scores: MentalHealthAssessment['scores'];
  classifications: MentalHealthAssessment['classifications'];
} {
  const depressionScore = calculateDomainScore(answers, DEPRESSION_INDICES);
  const anxietyScore = calculateDomainScore(answers, ANXIETY_INDICES);
  const stressScore = calculateDomainScore(answers, STRESS_INDICES);

  return {
    scores: {
      depression: depressionScore,
      anxiety: anxietyScore,
      stress: stressScore,
    },
    classifications: {
      depression: classifyDepression(depressionScore),
      anxiety: classifyAnxiety(anxietyScore),
      stress: classifyStress(stressScore),
    },
  };
}

/**
 * Gera um ID único
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Busca todas as avaliações salvas
 */
export async function getAssessments(): Promise<MentalHealthAssessment[]> {
  try {
    const data = await AsyncStorage.getItem(MENTAL_HEALTH_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('[MENTAL_HEALTH_SERVICE] Erro ao buscar avaliações:', error);
    return [];
  }
}

/**
 * Busca a avaliação mais recente
 */
export async function getLatestAssessment(): Promise<MentalHealthAssessment | null> {
  try {
    const assessments = await getAssessments();
    if (assessments.length === 0) return null;

    // Ordenar por data decrescente e retornar a primeira
    const sorted = assessments.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0];
  } catch (error) {
    console.error('[MENTAL_HEALTH_SERVICE] Erro ao buscar última avaliação:', error);
    return null;
  }
}

/**
 * Salva uma nova avaliação
 */
export async function saveAssessment(answers: number[]): Promise<MentalHealthAssessment> {
  try {
    const { scores, classifications } = calculateScores(answers);

    const assessment: MentalHealthAssessment = {
      id: generateId(),
      date: new Date().toISOString(),
      answers,
      scores,
      classifications,
    };

    const existingAssessments = await getAssessments();
    const updatedAssessments = [assessment, ...existingAssessments];

    await AsyncStorage.setItem(MENTAL_HEALTH_KEY, JSON.stringify(updatedAssessments));

    console.log('[MENTAL_HEALTH_SERVICE] Avaliação salva com sucesso:', assessment.id);
    return assessment;
  } catch (error) {
    console.error('[MENTAL_HEALTH_SERVICE] Erro ao salvar avaliação:', error);
    throw error;
  }
}

/**
 * Deleta uma avaliação pelo ID
 */
export async function deleteAssessment(id: string): Promise<void> {
  try {
    const assessments = await getAssessments();
    const filtered = assessments.filter((a) => a.id !== id);
    await AsyncStorage.setItem(MENTAL_HEALTH_KEY, JSON.stringify(filtered));
    console.log('[MENTAL_HEALTH_SERVICE] Avaliação deletada:', id);
  } catch (error) {
    console.error('[MENTAL_HEALTH_SERVICE] Erro ao deletar avaliação:', error);
    throw error;
  }
}

/**
 * Retorna a cor baseada na classificação
 */
export function getColorByClassification(classification: ClassificationLevel): {
  color: string;
  bgColor: string;
  label: string;
} {
  switch (classification) {
    case 'normal':
      return { color: '#0CC1AF', bgColor: 'green.50', label: 'Normal' };
    case 'leve':
      return { color: '#F59E0B', bgColor: 'yellow.50', label: 'Leve' };
    case 'moderado':
      return { color: '#F97316', bgColor: 'orange.50', label: 'Moderado' };
    case 'grave':
      return { color: '#EF4444', bgColor: 'red.50', label: 'Grave' };
    case 'extremamente_grave':
      return { color: '#DC2626', bgColor: 'red.100', label: 'Extremamente Grave' };
    default:
      return { color: '#6B7280', bgColor: 'gray.50', label: 'Desconhecido' };
  }
}

/**
 * Formata a data para exibição
 */
export function formatAssessmentDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
