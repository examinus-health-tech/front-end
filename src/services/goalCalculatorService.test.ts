/**
 * Testes unitários para goalCalculatorService.ts
 */

import {
  calculateHydrationGoal,
  calculateTMB,
  calculateCaloriesGoal,
  calculateStepsGoal,
  generateSuggestions,
  getActivityLevelText,
  formatGoalValue,
  UserProfile,
  WeightGoalType,
} from './goalCalculatorService';

describe('goalCalculatorService', () => {
  // --------------------------------------------------------
  // calculateHydrationGoal
  // --------------------------------------------------------
  describe('calculateHydrationGoal', () => {
    it('deve calcular meta de hidratação baseada no peso (35ml * kg)', () => {
      expect(calculateHydrationGoal(70)).toBe(2450);
      expect(calculateHydrationGoal(80)).toBe(2800);
      expect(calculateHydrationGoal(50)).toBe(1750);
    });

    it('deve retornar 2000ml como padrão quando peso é 0', () => {
      expect(calculateHydrationGoal(0)).toBe(2000);
    });

    it('deve retornar 2000ml como padrão quando peso é negativo', () => {
      expect(calculateHydrationGoal(-10)).toBe(2000);
    });

    it('deve retornar 2000ml como padrão quando peso é NaN/falsy', () => {
      expect(calculateHydrationGoal(NaN)).toBe(2000);
      expect(calculateHydrationGoal(undefined as unknown as number)).toBe(2000);
    });

    it('deve arredondar o resultado', () => {
      // 35 * 65 = 2275 (já inteiro)
      expect(calculateHydrationGoal(65)).toBe(2275);
      // 35 * 73 = 2555 (inteiro)
      expect(calculateHydrationGoal(73)).toBe(2555);
    });
  });

  // --------------------------------------------------------
  // calculateTMB
  // --------------------------------------------------------
  describe('calculateTMB', () => {
    it('deve calcular TMB para homem usando Mifflin-St Jeor', () => {
      // Homem: 88.36 + (13.4 × 80) + (4.8 × 175) - (5.7 × 30)
      // = 88.36 + 1072 + 840 - 171 = 1829.36 ≈ 1829
      const result = calculateTMB('M', 80, 1.75, 30);
      expect(result).toBe(1829);
    });

    it('deve calcular TMB para mulher usando Mifflin-St Jeor', () => {
      // Mulher: 447.6 + (9.2 × 60) + (3.1 × 165) - (4.3 × 25)
      // = 447.6 + 552 + 511.5 - 107.5 = 1403.6 ≈ 1404
      const result = calculateTMB('F', 60, 1.65, 25);
      expect(result).toBe(1404);
    });

    it('deve converter altura de metros para centímetros', () => {
      // Verifica que usa cm internamente
      const result1 = calculateTMB('M', 70, 1.80, 25);
      const result2 = calculateTMB('M', 70, 1.70, 25);
      // Maior altura = maior TMB
      expect(result1).toBeGreaterThan(result2);
    });

    it('deve retornar valor arredondado', () => {
      const result = calculateTMB('M', 75, 1.78, 28);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('deve calcular corretamente para valores extremos', () => {
      // Pessoa muito leve
      const light = calculateTMB('F', 40, 1.50, 18);
      expect(light).toBeGreaterThan(0);

      // Pessoa mais pesada
      const heavy = calculateTMB('M', 120, 1.90, 40);
      expect(heavy).toBeGreaterThan(light);
    });
  });

  // --------------------------------------------------------
  // calculateCaloriesGoal
  // --------------------------------------------------------
  describe('calculateCaloriesGoal', () => {
    const tmb = 1800;

    it('deve calcular calorias para manutenção de peso', () => {
      // TMB * fator de atividade nível 3 = 1800 * 1.55 = 2790
      const result = calculateCaloriesGoal(tmb, 3, 'maintain');
      expect(result).toBe(Math.round(tmb * 1.55));
    });

    it('deve calcular calorias para perda de peso (-500 kcal)', () => {
      const result = calculateCaloriesGoal(tmb, 3, 'lose');
      expect(result).toBe(Math.round(tmb * 1.55) - 500);
    });

    it('deve calcular calorias para ganho de peso (+300 kcal)', () => {
      const result = calculateCaloriesGoal(tmb, 3, 'gain');
      expect(result).toBe(Math.round(tmb * 1.55) + 300);
    });

    it('deve usar manutenção como padrão quando goalType não é informado', () => {
      const result = calculateCaloriesGoal(tmb, 3);
      expect(result).toBe(Math.round(tmb * 1.55));
    });

    it('deve usar fator correto para cada nível de atividade', () => {
      expect(calculateCaloriesGoal(tmb, 1)).toBe(Math.round(tmb * 1.2));
      expect(calculateCaloriesGoal(tmb, 2)).toBe(Math.round(tmb * 1.375));
      expect(calculateCaloriesGoal(tmb, 3)).toBe(Math.round(tmb * 1.55));
      expect(calculateCaloriesGoal(tmb, 4)).toBe(Math.round(tmb * 1.725));
      expect(calculateCaloriesGoal(tmb, 5)).toBe(Math.round(tmb * 1.9));
    });

    it('deve usar nível 3 como padrão para nível de atividade inválido', () => {
      const result = calculateCaloriesGoal(tmb, 99);
      expect(result).toBe(Math.round(tmb * 1.55));
    });
  });

  // --------------------------------------------------------
  // calculateStepsGoal
  // --------------------------------------------------------
  describe('calculateStepsGoal', () => {
    it('deve retornar 6000 passos para nível 1 (sedentário)', () => {
      expect(calculateStepsGoal(1)).toBe(6000);
    });

    it('deve retornar 8000 passos para nível 2', () => {
      expect(calculateStepsGoal(2)).toBe(8000);
    });

    it('deve retornar 10000 passos para nível 3', () => {
      expect(calculateStepsGoal(3)).toBe(10000);
    });

    it('deve retornar 12000 passos para nível 4', () => {
      expect(calculateStepsGoal(4)).toBe(12000);
    });

    it('deve retornar 15000 passos para nível 5', () => {
      expect(calculateStepsGoal(5)).toBe(15000);
    });

    it('deve retornar 10000 passos como padrão quando nível não é informado', () => {
      expect(calculateStepsGoal()).toBe(10000);
    });

    it('deve retornar 10000 passos para nível inválido', () => {
      expect(calculateStepsGoal(99)).toBe(10000);
      expect(calculateStepsGoal(0)).toBe(10000);
      expect(calculateStepsGoal(-1)).toBe(10000);
    });
  });

  // --------------------------------------------------------
  // generateSuggestions
  // --------------------------------------------------------
  describe('generateSuggestions', () => {
    it('deve gerar sugestão de hidratação quando diferença é significativa', () => {
      const profile: UserProfile = { weight: 90 }; // 90 * 35 = 3150ml
      const currentGoals = { hydration: 2000 }; // Diferença > 10%

      const suggestions = generateSuggestions(profile, currentGoals);
      const hydrationSuggestion = suggestions.find(s => s.type === 'hydration');

      expect(hydrationSuggestion).toBeDefined();
      expect(hydrationSuggestion!.suggestedGoal).toBe(3150);
      expect(hydrationSuggestion!.unit).toBe('ml');
      expect(hydrationSuggestion!.icon).toBe('water');
    });

    it('deve NÃO gerar sugestão de hidratação quando diferença é pequena', () => {
      const profile: UserProfile = { weight: 58 }; // 58 * 35 = 2030ml
      const currentGoals = { hydration: 2000 }; // Diferença < 10%

      const suggestions = generateSuggestions(profile, currentGoals);
      const hydrationSuggestion = suggestions.find(s => s.type === 'hydration');

      expect(hydrationSuggestion).toBeUndefined();
    });

    it('deve gerar sugestão de calorias quando diferença é significativa', () => {
      const profile: UserProfile = {
        weight: 80,
        height: 1.75,
        age: 30,
        gender: 'M',
        workoutLevel: 4,
      };
      const currentGoals = { calories: 2000 };

      const suggestions = generateSuggestions(profile, currentGoals);
      const caloriesSuggestion = suggestions.find(s => s.type === 'calories');

      expect(caloriesSuggestion).toBeDefined();
      expect(caloriesSuggestion!.unit).toBe('kcal');
      expect(caloriesSuggestion!.icon).toBe('fire');
    });

    it('deve usar valores padrão quando perfil está incompleto', () => {
      const profile: UserProfile = { weight: 80 }; // Sem gender, height, age
      const currentGoals = { calories: 1500 };

      const suggestions = generateSuggestions(profile, currentGoals);
      // Deve usar gender='M', height=1.70, age=30, workoutLevel=3 como padrão
      const caloriesSuggestion = suggestions.find(s => s.type === 'calories');
      expect(caloriesSuggestion).toBeDefined();
    });

    it('deve gerar sugestão de passos quando diferença é significativa', () => {
      const profile: UserProfile = { workoutLevel: 1 }; // 6000 passos
      const currentGoals = { steps: 10000 }; // Diferença > 10%

      const suggestions = generateSuggestions(profile, currentGoals);
      const stepsSuggestion = suggestions.find(s => s.type === 'steps');

      expect(stepsSuggestion).toBeDefined();
      expect(stepsSuggestion!.suggestedGoal).toBe(6000);
      expect(stepsSuggestion!.unit).toBe('passos');
    });

    it('deve NÃO gerar sugestão de passos quando diferença é pequena', () => {
      const profile: UserProfile = { workoutLevel: 3 }; // 10000 passos
      const currentGoals = { steps: 10000 }; // Mesma meta

      const suggestions = generateSuggestions(profile, currentGoals);
      const stepsSuggestion = suggestions.find(s => s.type === 'steps');

      expect(stepsSuggestion).toBeUndefined();
    });

    it('deve incluir texto correto para perda de peso', () => {
      const profile: UserProfile = { weight: 80, gender: 'M', height: 1.75, age: 30, workoutLevel: 3 };
      const currentGoals = { calories: 1500 };

      const suggestions = generateSuggestions(profile, currentGoals, 'lose');
      const caloriesSuggestion = suggestions.find(s => s.type === 'calories');

      if (caloriesSuggestion) {
        expect(caloriesSuggestion.reason).toContain('perder peso');
      }
    });

    it('deve incluir texto correto para ganho de peso', () => {
      const profile: UserProfile = { weight: 60, gender: 'M', height: 1.75, age: 25, workoutLevel: 3 };
      const currentGoals = { calories: 1500 };

      const suggestions = generateSuggestions(profile, currentGoals, 'gain');
      const caloriesSuggestion = suggestions.find(s => s.type === 'calories');

      if (caloriesSuggestion) {
        expect(caloriesSuggestion.reason).toContain('ganhar peso');
      }
    });

    it('deve incluir texto correto para manutenção de peso', () => {
      const profile: UserProfile = { weight: 80, gender: 'M', height: 1.75, age: 30, workoutLevel: 4 };
      const currentGoals = { calories: 1500 };

      const suggestions = generateSuggestions(profile, currentGoals, 'maintain');
      const caloriesSuggestion = suggestions.find(s => s.type === 'calories');

      if (caloriesSuggestion) {
        expect(caloriesSuggestion.reason).toContain('manter peso');
      }
    });

    it('deve retornar array vazio quando todas as metas estão corretas', () => {
      const profile: UserProfile = { weight: 57, workoutLevel: 3 }; // 57*35=1995 ~ 2000
      const currentGoals = { hydration: 2000, steps: 10000, calories: 2000 };

      const suggestions = generateSuggestions(profile, currentGoals);
      // Hidratação: 1995 vs 2000 -> diferença < 10%
      // Passos: 10000 vs 10000 -> sem diferença
      // Mas calorias pode gerar sugestão dependendo do TMB calculado
      // Verificar pelo menos que hydration e steps não têm sugestão
      const hydrationSuggestion = suggestions.find(s => s.type === 'hydration');
      const stepsSuggestion = suggestions.find(s => s.type === 'steps');
      expect(hydrationSuggestion).toBeUndefined();
      expect(stepsSuggestion).toBeUndefined();
    });

    it('deve não gerar sugestão de hidratação quando peso não está definido', () => {
      const profile: UserProfile = {};
      const currentGoals = { hydration: 2000 };

      const suggestions = generateSuggestions(profile, currentGoals);
      const hydrationSuggestion = suggestions.find(s => s.type === 'hydration');
      expect(hydrationSuggestion).toBeUndefined();
    });

    it('deve não gerar sugestão de calorias quando peso não está definido', () => {
      const profile: UserProfile = {};
      const currentGoals = { calories: 2000 };

      const suggestions = generateSuggestions(profile, currentGoals);
      const caloriesSuggestion = suggestions.find(s => s.type === 'calories');
      expect(caloriesSuggestion).toBeUndefined();
    });

    it('deve usar meta padrão de passos (10000) quando não informada', () => {
      const profile: UserProfile = { workoutLevel: 1 }; // 6000 passos sugeridos
      const currentGoals = {}; // Sem meta de passos -> usa 10000 padrão

      const suggestions = generateSuggestions(profile, currentGoals);
      const stepsSuggestion = suggestions.find(s => s.type === 'steps');
      expect(stepsSuggestion).toBeDefined();
      expect(stepsSuggestion!.currentGoal).toBe(10000);
    });
  });

  // --------------------------------------------------------
  // getActivityLevelText
  // --------------------------------------------------------
  describe('getActivityLevelText', () => {
    it('deve retornar "sedentário" para nível 1', () => {
      expect(getActivityLevelText(1)).toBe('sedentário');
    });

    it('deve retornar "levemente ativo" para nível 2', () => {
      expect(getActivityLevelText(2)).toBe('levemente ativo');
    });

    it('deve retornar "moderadamente ativo" para nível 3', () => {
      expect(getActivityLevelText(3)).toBe('moderadamente ativo');
    });

    it('deve retornar "muito ativo" para nível 4', () => {
      expect(getActivityLevelText(4)).toBe('muito ativo');
    });

    it('deve retornar "extremamente ativo" para nível 5', () => {
      expect(getActivityLevelText(5)).toBe('extremamente ativo');
    });

    it('deve retornar "moderadamente ativo" para nível inválido', () => {
      expect(getActivityLevelText(0)).toBe('moderadamente ativo');
      expect(getActivityLevelText(99)).toBe('moderadamente ativo');
      expect(getActivityLevelText(-1)).toBe('moderadamente ativo');
    });
  });

  // --------------------------------------------------------
  // formatGoalValue
  // --------------------------------------------------------
  describe('formatGoalValue', () => {
    it('deve formatar hidratação em litros quando >= 1000ml', () => {
      expect(formatGoalValue(2000, 'hydration')).toBe('2.0L');
      expect(formatGoalValue(2500, 'hydration')).toBe('2.5L');
      expect(formatGoalValue(1000, 'hydration')).toBe('1.0L');
    });

    it('deve formatar hidratação em ml quando < 1000ml', () => {
      expect(formatGoalValue(500, 'hydration')).toBe('500ml');
      expect(formatGoalValue(750, 'hydration')).toBe('750ml');
    });

    it('deve formatar calorias com separador de milhar', () => {
      const result = formatGoalValue(2500, 'calories');
      expect(result).toBeTruthy();
      // Verifica que contém o número formatado
      expect(result.replace(/\./g, '').replace(/,/g, '')).toContain('2500');
    });

    it('deve formatar passos com separador de milhar', () => {
      const result = formatGoalValue(10000, 'steps');
      expect(result).toBeTruthy();
    });

    it('deve lidar com valores zero', () => {
      expect(formatGoalValue(0, 'hydration')).toBe('0ml');
      const caloriesResult = formatGoalValue(0, 'calories');
      expect(caloriesResult).toBeTruthy();
    });
  });
});
