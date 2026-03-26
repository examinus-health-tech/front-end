/**
 * Testes unitários para mentalHealthService.ts
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  calculateScores,
  getAssessments,
  getLatestAssessment,
  saveAssessment,
  deleteAssessment,
  getColorByClassification,
  formatAssessmentDate,
  MENTAL_HEALTH_KEY,
  DASS21_QUESTIONS,
  RESPONSE_OPTIONS,
  MentalHealthAssessment,
  ClassificationLevel,
} from './mentalHealthService';

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
});

describe('mentalHealthService', () => {
  // --------------------------------------------------------
  // Constantes exportadas
  // --------------------------------------------------------
  describe('constantes exportadas', () => {
    it('deve ter 21 perguntas do DASS-21', () => {
      expect(DASS21_QUESTIONS).toHaveLength(21);
    });

    it('deve ter 4 opções de resposta (0-3)', () => {
      expect(RESPONSE_OPTIONS).toHaveLength(4);
      expect(RESPONSE_OPTIONS[0].value).toBe(0);
      expect(RESPONSE_OPTIONS[3].value).toBe(3);
    });

    it('deve ter a chave de storage correta', () => {
      expect(MENTAL_HEALTH_KEY).toBe('@examinus:mental_health_assessments');
    });
  });

  // --------------------------------------------------------
  // calculateScores
  // --------------------------------------------------------
  describe('calculateScores', () => {
    it('deve calcular scores zerados quando todas respostas são 0', () => {
      const answers = new Array(21).fill(0);
      const result = calculateScores(answers);

      expect(result.scores.depression).toBe(0);
      expect(result.scores.anxiety).toBe(0);
      expect(result.scores.stress).toBe(0);
      expect(result.classifications.depression).toBe('normal');
      expect(result.classifications.anxiety).toBe('normal');
      expect(result.classifications.stress).toBe('normal');
    });

    it('deve calcular scores máximos quando todas respostas são 3', () => {
      const answers = new Array(21).fill(3);
      const result = calculateScores(answers);

      // Cada domínio tem 7 perguntas, score = soma * 2
      // Máximo por domínio = 7 * 3 * 2 = 42
      expect(result.scores.depression).toBe(42);
      expect(result.scores.anxiety).toBe(42);
      expect(result.scores.stress).toBe(42);
      expect(result.classifications.depression).toBe('extremamente_grave');
      expect(result.classifications.anxiety).toBe('extremamente_grave');
      expect(result.classifications.stress).toBe('extremamente_grave');
    });

    it('deve classificar depressão corretamente nos limites', () => {
      // Depressão indices: [2, 4, 9, 12, 15, 16, 20]
      // Para score 10 (leve): precisamos soma = 5, * 2 = 10
      const answers = new Array(21).fill(0);
      // Colocar 1 em 5 das 7 posições de depressão para soma = 5, score = 10
      answers[2] = 1;
      answers[4] = 1;
      answers[9] = 1;
      answers[12] = 1;
      answers[15] = 1;

      const result = calculateScores(answers);
      expect(result.scores.depression).toBe(10);
      expect(result.classifications.depression).toBe('leve');
    });

    it('deve classificar depressão como moderado para score 14-20', () => {
      const answers = new Array(21).fill(0);
      // Para score 14: soma = 7, * 2 = 14
      answers[2] = 1;
      answers[4] = 1;
      answers[9] = 1;
      answers[12] = 1;
      answers[15] = 1;
      answers[16] = 1;
      answers[20] = 1;

      const result = calculateScores(answers);
      expect(result.scores.depression).toBe(14);
      expect(result.classifications.depression).toBe('moderado');
    });

    it('deve classificar depressão como grave para score 21-27', () => {
      const answers = new Array(21).fill(0);
      // Para score 22: soma = 11
      // 7 indices: 3+2+2+1+1+1+1 = 11 * 2 = 22
      answers[2] = 3;
      answers[4] = 2;
      answers[9] = 2;
      answers[12] = 1;
      answers[15] = 1;
      answers[16] = 1;
      answers[20] = 1;

      const result = calculateScores(answers);
      expect(result.scores.depression).toBe(22);
      expect(result.classifications.depression).toBe('grave');
    });

    it('deve classificar ansiedade corretamente nos limites', () => {
      // Ansiedade indices: [1, 3, 6, 8, 14, 18, 19]
      const answers = new Array(21).fill(0);
      // Para score 8 (leve): soma = 4, * 2 = 8
      answers[1] = 1;
      answers[3] = 1;
      answers[6] = 1;
      answers[8] = 1;

      const result = calculateScores(answers);
      expect(result.scores.anxiety).toBe(8);
      expect(result.classifications.anxiety).toBe('leve');
    });

    it('deve classificar ansiedade como moderado para score 10-14', () => {
      const answers = new Array(21).fill(0);
      // Para score 10: soma = 5, * 2 = 10
      answers[1] = 1;
      answers[3] = 1;
      answers[6] = 1;
      answers[8] = 1;
      answers[14] = 1;

      const result = calculateScores(answers);
      expect(result.scores.anxiety).toBe(10);
      expect(result.classifications.anxiety).toBe('moderado');
    });

    it('deve classificar ansiedade como grave para score 15-19', () => {
      const answers = new Array(21).fill(0);
      // Para score 16: soma = 8 * 2 = 16
      answers[1] = 2;
      answers[3] = 1;
      answers[6] = 1;
      answers[8] = 1;
      answers[14] = 1;
      answers[18] = 1;
      answers[19] = 1;

      const result = calculateScores(answers);
      expect(result.scores.anxiety).toBe(16);
      expect(result.classifications.anxiety).toBe('grave');
    });

    it('deve classificar estresse corretamente nos limites', () => {
      // Estresse indices: [0, 5, 7, 10, 11, 13, 17]
      const answers = new Array(21).fill(0);
      // Para score 16 (leve): soma = 8, * 2 = 16
      answers[0] = 2;
      answers[5] = 1;
      answers[7] = 1;
      answers[10] = 1;
      answers[11] = 1;
      answers[13] = 1;
      answers[17] = 1;

      const result = calculateScores(answers);
      expect(result.scores.stress).toBe(16);
      expect(result.classifications.stress).toBe('leve');
    });

    it('deve classificar estresse como moderado para score 19-25', () => {
      const answers = new Array(21).fill(0);
      // Para score 20: soma = 10, * 2 = 20
      answers[0] = 2;
      answers[5] = 2;
      answers[7] = 2;
      answers[10] = 1;
      answers[11] = 1;
      answers[13] = 1;
      answers[17] = 1;

      const result = calculateScores(answers);
      expect(result.scores.stress).toBe(20);
      expect(result.classifications.stress).toBe('moderado');
    });

    it('deve classificar estresse como grave para score 26-33', () => {
      const answers = new Array(21).fill(0);
      // Para score 28: soma = 14, * 2 = 28
      answers[0] = 2;
      answers[5] = 2;
      answers[7] = 2;
      answers[10] = 2;
      answers[11] = 2;
      answers[13] = 2;
      answers[17] = 2;

      const result = calculateScores(answers);
      expect(result.scores.stress).toBe(28);
      expect(result.classifications.stress).toBe('grave');
    });

    it('deve lidar com array de respostas vazio', () => {
      const result = calculateScores([]);
      expect(result.scores.depression).toBe(0);
      expect(result.scores.anxiety).toBe(0);
      expect(result.scores.stress).toBe(0);
    });

    it('deve lidar com array parcial de respostas', () => {
      const answers = [1, 2, 3]; // Só 3 respostas
      const result = calculateScores(answers);
      // Deve calcular com o que tem, outros índices retornam 0
      expect(result.scores).toBeDefined();
      expect(result.classifications).toBeDefined();
    });
  });

  // --------------------------------------------------------
  // getAssessments
  // --------------------------------------------------------
  describe('getAssessments', () => {
    it('deve retornar array vazio quando não há avaliações salvas', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await getAssessments();
      expect(result).toEqual([]);
    });

    it('deve retornar avaliações salvas no AsyncStorage', async () => {
      const mockAssessments: MentalHealthAssessment[] = [
        {
          id: 'test-1',
          date: '2025-03-10T10:00:00Z',
          answers: new Array(21).fill(1),
          scores: { depression: 14, anxiety: 14, stress: 14 },
          classifications: { depression: 'moderado', anxiety: 'moderado', stress: 'normal' },
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockAssessments));

      const result = await getAssessments();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test-1');
    });

    it('deve retornar array vazio quando AsyncStorage lança erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage corrupted'));
      const result = await getAssessments();
      expect(result).toEqual([]);
    });
  });

  // --------------------------------------------------------
  // getLatestAssessment
  // --------------------------------------------------------
  describe('getLatestAssessment', () => {
    it('deve retornar null quando não há avaliações', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await getLatestAssessment();
      expect(result).toBeNull();
    });

    it('deve retornar a avaliação mais recente', async () => {
      const mockAssessments: MentalHealthAssessment[] = [
        {
          id: 'old',
          date: '2025-01-01T10:00:00Z',
          answers: new Array(21).fill(0),
          scores: { depression: 0, anxiety: 0, stress: 0 },
          classifications: { depression: 'normal', anxiety: 'normal', stress: 'normal' },
        },
        {
          id: 'newest',
          date: '2025-03-10T10:00:00Z',
          answers: new Array(21).fill(1),
          scores: { depression: 14, anxiety: 14, stress: 14 },
          classifications: { depression: 'moderado', anxiety: 'moderado', stress: 'normal' },
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockAssessments));

      const result = await getLatestAssessment();
      expect(result).not.toBeNull();
      expect(result!.id).toBe('newest');
    });

    it('deve retornar null quando getAssessments falha', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Error'));
      const result = await getLatestAssessment();
      expect(result).toBeNull();
    });
  });

  // --------------------------------------------------------
  // saveAssessment
  // --------------------------------------------------------
  describe('saveAssessment', () => {
    it('deve salvar uma nova avaliação e retorná-la', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const answers = new Array(21).fill(1);
      const result = await saveAssessment(answers);

      expect(result.id).toBeTruthy();
      expect(result.date).toBeTruthy();
      expect(result.answers).toEqual(answers);
      expect(result.scores).toBeDefined();
      expect(result.classifications).toBeDefined();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        MENTAL_HEALTH_KEY,
        expect.any(String)
      );
    });

    it('deve adicionar a nova avaliação no início do array existente', async () => {
      const existing: MentalHealthAssessment[] = [
        {
          id: 'existing-1',
          date: '2025-01-01T10:00:00Z',
          answers: new Array(21).fill(0),
          scores: { depression: 0, anxiety: 0, stress: 0 },
          classifications: { depression: 'normal', anxiety: 'normal', stress: 'normal' },
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(existing));

      const answers = new Array(21).fill(2);
      const result = await saveAssessment(answers);

      const savedCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(savedCall[1]);
      expect(savedData).toHaveLength(2);
      expect(savedData[0].id).toBe(result.id); // Nova no início
      expect(savedData[1].id).toBe('existing-1'); // Existente após
    });

    it('deve lançar erro quando AsyncStorage falha ao salvar', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage full'));

      const answers = new Array(21).fill(0);
      await expect(saveAssessment(answers)).rejects.toThrow('Storage full');
    });

    it('deve calcular scores corretamente ao salvar', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const answers = new Array(21).fill(3);
      const result = await saveAssessment(answers);

      expect(result.scores.depression).toBe(42);
      expect(result.scores.anxiety).toBe(42);
      expect(result.scores.stress).toBe(42);
    });
  });

  // --------------------------------------------------------
  // deleteAssessment
  // --------------------------------------------------------
  describe('deleteAssessment', () => {
    it('deve remover avaliação pelo ID', async () => {
      const assessments: MentalHealthAssessment[] = [
        {
          id: 'to-delete',
          date: '2025-03-01T10:00:00Z',
          answers: new Array(21).fill(0),
          scores: { depression: 0, anxiety: 0, stress: 0 },
          classifications: { depression: 'normal', anxiety: 'normal', stress: 'normal' },
        },
        {
          id: 'to-keep',
          date: '2025-03-02T10:00:00Z',
          answers: new Array(21).fill(1),
          scores: { depression: 14, anxiety: 14, stress: 14 },
          classifications: { depression: 'moderado', anxiety: 'moderado', stress: 'normal' },
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(assessments));

      await deleteAssessment('to-delete');

      const savedCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedData = JSON.parse(savedCall[1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('to-keep');
    });

    it('deve não lançar erro quando ID não existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      await expect(deleteAssessment('nonexistent')).resolves.toBeUndefined();
    });

    it('deve não lançar erro quando AsyncStorage.getItem falha (getAssessments trata o erro internamente)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      // getAssessments() captura o erro e retorna [], então deleteAssessment não lança
      await expect(deleteAssessment('any-id')).resolves.toBeUndefined();
    });
  });

  // --------------------------------------------------------
  // getColorByClassification
  // --------------------------------------------------------
  describe('getColorByClassification', () => {
    it('deve retornar cor verde para classificação normal', () => {
      const result = getColorByClassification('normal');
      expect(result.color).toBe('#0CC1AF');
      expect(result.bgColor).toBe('green.50');
      expect(result.label).toBe('Normal');
    });

    it('deve retornar cor amarela para classificação leve', () => {
      const result = getColorByClassification('leve');
      expect(result.color).toBe('#F59E0B');
      expect(result.label).toBe('Leve');
    });

    it('deve retornar cor laranja para classificação moderado', () => {
      const result = getColorByClassification('moderado');
      expect(result.color).toBe('#F97316');
      expect(result.label).toBe('Moderado');
    });

    it('deve retornar cor vermelha para classificação grave', () => {
      const result = getColorByClassification('grave');
      expect(result.color).toBe('#EF4444');
      expect(result.label).toBe('Grave');
    });

    it('deve retornar cor vermelha escura para classificação extremamente_grave', () => {
      const result = getColorByClassification('extremamente_grave');
      expect(result.color).toBe('#DC2626');
      expect(result.label).toBe('Extremamente Grave');
    });

    it('deve retornar cor cinza para classificação desconhecida', () => {
      const result = getColorByClassification('desconhecido' as ClassificationLevel);
      expect(result.color).toBe('#6B7280');
      expect(result.label).toBe('Desconhecido');
    });
  });

  // --------------------------------------------------------
  // formatAssessmentDate
  // --------------------------------------------------------
  describe('formatAssessmentDate', () => {
    it('deve formatar data corretamente em português', () => {
      const result = formatAssessmentDate('2025-03-10T10:00:00Z');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // Deve conter dia, mês e ano
      expect(result).toMatch(/\d{2}/); // Dia com 2 dígitos
      expect(result).toMatch(/2025/); // Ano
    });

    it('deve lidar com diferentes formatos de data', () => {
      const result1 = formatAssessmentDate('2025-01-15T00:00:00Z');
      expect(result1).toBeTruthy();

      const result2 = formatAssessmentDate('2024-12-25T23:59:59Z');
      expect(result2).toBeTruthy();
    });
  });
});
