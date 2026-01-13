/**
 * Service para cálculo de metas inteligentes baseadas no perfil do usuário
 */

// Tipos
export interface GoalSuggestion {
  type: 'hydration' | 'calories' | 'steps';
  currentGoal: number;
  suggestedGoal: number;
  reason: string;
  unit: string;
  icon: 'water' | 'fire' | 'steps';
}

export interface UserProfile {
  weight?: number;      // kg
  height?: number;      // metros
  age?: number;
  gender?: 'M' | 'F';
  workoutLevel?: number; // 1-5
}

export type WeightGoalType = 'lose' | 'maintain' | 'gain';

// Fatores de atividade baseados no workoutLevel
const ACTIVITY_FACTORS: Record<number, number> = {
  1: 1.2,    // Sedentário
  2: 1.375,  // Levemente ativo
  3: 1.55,   // Moderadamente ativo
  4: 1.725,  // Muito ativo
  5: 1.9,    // Extremamente ativo
};

/**
 * Calcula a meta de hidratação baseada no peso
 * Fórmula: 35ml × peso(kg)
 */
export function calculateHydrationGoal(weightKg: number): number {
  if (!weightKg || weightKg <= 0) return 2000; // Valor padrão
  return Math.round(35 * weightKg);
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor
 * Homem: 88.36 + (13.4 × peso) + (4.8 × altura_cm) - (5.7 × idade)
 * Mulher: 447.6 + (9.2 × peso) + (3.1 × altura_cm) - (4.3 × idade)
 */
export function calculateTMB(
  gender: 'M' | 'F',
  weightKg: number,
  heightMeters: number,
  age: number
): number {
  const heightCm = heightMeters * 100;

  if (gender === 'M') {
    return Math.round(88.36 + (13.4 * weightKg) + (4.8 * heightCm) - (5.7 * age));
  } else {
    return Math.round(447.6 + (9.2 * weightKg) + (3.1 * heightCm) - (4.3 * age));
  }
}

/**
 * Calcula a meta de calorias diárias
 * @param tmb - Taxa Metabólica Basal
 * @param activityLevel - Nível de atividade (1-5)
 * @param goalType - Tipo de objetivo (perder, manter, ganhar)
 */
export function calculateCaloriesGoal(
  tmb: number,
  activityLevel: number,
  goalType: WeightGoalType = 'maintain'
): number {
  const factor = ACTIVITY_FACTORS[activityLevel] || ACTIVITY_FACTORS[3];
  const maintenance = Math.round(tmb * factor);

  switch (goalType) {
    case 'lose':
      return maintenance - 500; // Déficit de ~0.5kg por semana
    case 'gain':
      return maintenance + 300; // Superávit moderado
    case 'maintain':
    default:
      return maintenance;
  }
}

/**
 * Calcula a meta de passos diários
 * Padrão OMS: 10.000 passos
 * Pode ajustar baseado no nível de atividade
 */
export function calculateStepsGoal(activityLevel: number = 3): number {
  const baseSteps = 10000;

  switch (activityLevel) {
    case 1:
      return 6000;  // Meta mais acessível para sedentários
    case 2:
      return 8000;
    case 3:
      return 10000;
    case 4:
      return 12000;
    case 5:
      return 15000;
    default:
      return baseSteps;
  }
}

/**
 * Gera sugestões de metas baseadas no perfil do usuário
 */
export function generateSuggestions(
  profile: UserProfile,
  currentGoals: {
    hydration?: number;
    calories?: number;
    steps?: number;
  },
  weightGoalType: WeightGoalType = 'maintain'
): GoalSuggestion[] {
  const suggestions: GoalSuggestion[] = [];

  // Sugestão de hidratação
  if (profile.weight && profile.weight > 0) {
    const suggestedHydration = calculateHydrationGoal(profile.weight);
    const currentHydration = currentGoals.hydration || 2000;

    // Só sugere se a diferença for significativa (> 10%)
    if (Math.abs(suggestedHydration - currentHydration) > currentHydration * 0.1) {
      suggestions.push({
        type: 'hydration',
        currentGoal: currentHydration,
        suggestedGoal: suggestedHydration,
        reason: `Baseado no seu peso de ${profile.weight}kg`,
        unit: 'ml',
        icon: 'water',
      });
    }
  }

  // Sugestão de calorias (usa valores padrão se alguns dados estiverem faltando)
  if (profile.weight) {
    const gender = profile.gender || 'M';
    const height = profile.height || 1.70; // 1.70m padrão
    const age = profile.age || 30; // 30 anos padrão

    const tmb = calculateTMB(
      gender,
      profile.weight,
      height,
      age
    );
    const activityLevel = profile.workoutLevel || 3;
    const suggestedCalories = calculateCaloriesGoal(tmb, activityLevel, weightGoalType);
    const currentCalories = currentGoals.calories || 2000;

    // Só sugere se a diferença for significativa (> 10%)
    if (Math.abs(suggestedCalories - currentCalories) > currentCalories * 0.1) {
      const goalTypeText = weightGoalType === 'lose'
        ? 'para perder peso'
        : weightGoalType === 'gain'
          ? 'para ganhar peso'
          : 'para manter peso';

      suggestions.push({
        type: 'calories',
        currentGoal: currentCalories,
        suggestedGoal: suggestedCalories,
        reason: `${goalTypeText}, ${getActivityLevelText(activityLevel)}`,
        unit: 'kcal',
        icon: 'fire',
      });
    }
  }

  // Sugestão de passos
  const activityLevel = profile.workoutLevel || 3;
  const suggestedSteps = calculateStepsGoal(activityLevel);
  const currentSteps = currentGoals.steps || 10000;

  if (Math.abs(suggestedSteps - currentSteps) > currentSteps * 0.1) {
    suggestions.push({
      type: 'steps',
      currentGoal: currentSteps,
      suggestedGoal: suggestedSteps,
      reason: `Baseado no seu nível de atividade`,
      unit: 'passos',
      icon: 'steps',
    });
  }

  return suggestions;
}

/**
 * Retorna texto descritivo do nível de atividade
 */
export function getActivityLevelText(level: number): string {
  switch (level) {
    case 1:
      return 'sedentário';
    case 2:
      return 'levemente ativo';
    case 3:
      return 'moderadamente ativo';
    case 4:
      return 'muito ativo';
    case 5:
      return 'extremamente ativo';
    default:
      return 'moderadamente ativo';
  }
}

/**
 * Formata valor de meta para exibição
 */
export function formatGoalValue(value: number, type: 'hydration' | 'calories' | 'steps'): string {
  if (type === 'hydration') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}L`;
    }
    return `${value}ml`;
  }

  return value.toLocaleString('pt-BR');
}
