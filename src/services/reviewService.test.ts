/**
 * Testes unitários para reviewService.ts
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasUserReviewed,
  markAsReviewed,
  incrementAppOpenCount,
  shouldShowReviewPromptOnOpen,
  shouldShowReviewPromptOnPositiveAction,
  markReviewPromptShown,
} from './reviewService';

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
});

describe('reviewService', () => {
  // --------------------------------------------------------
  // hasUserReviewed
  // --------------------------------------------------------
  describe('hasUserReviewed', () => {
    it('deve retornar true quando o usuário já avaliou', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('true');
      const result = await hasUserReviewed();
      expect(result).toBe(true);
    });

    it('deve retornar false quando o usuário não avaliou', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await hasUserReviewed();
      expect(result).toBe(false);
    });

    it('deve retornar false quando o valor é diferente de "true"', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('false');
      const result = await hasUserReviewed();
      expect(result).toBe(false);
    });

    it('deve retornar false quando AsyncStorage lança erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      const result = await hasUserReviewed();
      expect(result).toBe(false);
    });
  });

  // --------------------------------------------------------
  // markAsReviewed
  // --------------------------------------------------------
  describe('markAsReviewed', () => {
    it('deve salvar "true" no AsyncStorage', async () => {
      await markAsReviewed();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@examinus:has_reviewed', 'true');
    });

    it('deve não lançar erro quando AsyncStorage falha', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      await expect(markAsReviewed()).resolves.toBeUndefined();
    });
  });

  // --------------------------------------------------------
  // incrementAppOpenCount
  // --------------------------------------------------------
  describe('incrementAppOpenCount', () => {
    it('deve retornar 1 na primeira abertura', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const count = await incrementAppOpenCount();
      expect(count).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@examinus:app_open_count', '1');
    });

    it('deve incrementar o contador existente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('5');
      const count = await incrementAppOpenCount();
      expect(count).toBe(6);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@examinus:app_open_count', '6');
    });

    it('deve retornar 0 quando AsyncStorage falha', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Error'));
      const count = await incrementAppOpenCount();
      expect(count).toBe(0);
    });

    it('deve incrementar corretamente de valores altos', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('99');
      const count = await incrementAppOpenCount();
      expect(count).toBe(100);
    });
  });

  // --------------------------------------------------------
  // shouldShowReviewPromptOnOpen
  // --------------------------------------------------------
  describe('shouldShowReviewPromptOnOpen', () => {
    it('deve retornar false quando o usuário já avaliou', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve('true');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(false);
    });

    it('deve retornar true na 5ª abertura quando não avaliou e sem prompt recente', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('5');
        if (key === '@examinus:last_review_prompt') return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(true);
    });

    it('deve retornar false antes da 5ª abertura', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('3');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(false);
    });

    it('deve retornar true a cada 10 aberturas após a 5ª', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('20'); // 20 % 10 === 0
        if (key === '@examinus:last_review_prompt') return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(true);
    });

    it('deve retornar false na 6ª abertura (não é múltiplo de 10)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('6');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(false);
    });

    it('deve retornar false quando prompt foi mostrado recentemente (< 7 dias)', async () => {
      const recentDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 dias atrás

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('5');
        if (key === '@examinus:last_review_prompt') return Promise.resolve(recentDate);
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(false);
    });

    it('deve retornar true quando prompt foi mostrado há mais de 7 dias', async () => {
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(); // 10 dias atrás

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('10'); // múltiplo de 10
        if (key === '@examinus:last_review_prompt') return Promise.resolve(oldDate);
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(true);
    });

    it('deve retornar false quando AsyncStorage lança erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Error'));
      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(false);
    });

    it('deve retornar false quando contagem é 0', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnOpen();
      expect(result).toBe(false);
    });
  });

  // --------------------------------------------------------
  // shouldShowReviewPromptOnPositiveAction
  // --------------------------------------------------------
  describe('shouldShowReviewPromptOnPositiveAction', () => {
    it('deve retornar false quando o usuário já avaliou', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve('true');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnPositiveAction();
      expect(result).toBe(false);
    });

    it('deve retornar true quando condições são atendidas (>= 3 aberturas, sem prompt recente)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:last_review_prompt') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('5');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnPositiveAction();
      expect(result).toBe(true);
    });

    it('deve retornar false quando app foi aberto menos de 3 vezes', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:last_review_prompt') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve('2');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnPositiveAction();
      expect(result).toBe(false);
    });

    it('deve retornar false quando prompt foi mostrado recentemente', async () => {
      const recentDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 dias atrás

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:last_review_prompt') return Promise.resolve(recentDate);
        if (key === '@examinus:app_open_count') return Promise.resolve('10');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnPositiveAction();
      expect(result).toBe(false);
    });

    it('deve retornar true quando prompt foi mostrado há mais de 7 dias e >= 3 aberturas', async () => {
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:last_review_prompt') return Promise.resolve(oldDate);
        if (key === '@examinus:app_open_count') return Promise.resolve('5');
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnPositiveAction();
      expect(result).toBe(true);
    });

    it('deve retornar false quando AsyncStorage lança erro', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Error'));
      const result = await shouldShowReviewPromptOnPositiveAction();
      expect(result).toBe(false);
    });

    it('deve retornar false quando contagem de aberturas é null (tratado como 0)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@examinus:has_reviewed') return Promise.resolve(null);
        if (key === '@examinus:last_review_prompt') return Promise.resolve(null);
        if (key === '@examinus:app_open_count') return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const result = await shouldShowReviewPromptOnPositiveAction();
      expect(result).toBe(false);
    });
  });

  // --------------------------------------------------------
  // markReviewPromptShown
  // --------------------------------------------------------
  describe('markReviewPromptShown', () => {
    it('deve salvar data atual no AsyncStorage', async () => {
      const beforeCall = Date.now();
      await markReviewPromptShown();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@examinus:last_review_prompt',
        expect.any(String)
      );

      const savedDate = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const savedTime = new Date(savedDate).getTime();
      expect(savedTime).toBeGreaterThanOrEqual(beforeCall);
      expect(savedTime).toBeLessThanOrEqual(Date.now());
    });

    it('deve não lançar erro quando AsyncStorage falha', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Error'));
      await expect(markReviewPromptShown()).resolves.toBeUndefined();
    });
  });
});
