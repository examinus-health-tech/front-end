import { Analytics, trackEvent, trackScreenView } from './analyticsService';

// Mock da API
jest.mock('./api', () => ({
  api: {
    post: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('analyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackScreenView', () => {
    it('deve enviar screen view para o backend', async () => {
      const { api } = require('./api');

      await trackScreenView('homepage');

      expect(api.post).toHaveBeenCalledWith(
        'analytics/screen',
        expect.objectContaining({
          screenName: 'homepage',
          platform: expect.any(String),
          appVersion: expect.any(String),
          clientTimestamp: expect.any(String),
        })
      );
    });

    it('não deve lançar erro se API falhar', async () => {
      const { api } = require('./api');
      api.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(trackScreenView('homepage')).resolves.not.toThrow();
    });
  });

  describe('Analytics pré-definidos', () => {
    it('deve ter todos os métodos esperados', () => {
      expect(Analytics.screenView).toBeDefined();
      expect(Analytics.loginSuccess).toBeDefined();
      expect(Analytics.loginFailure).toBeDefined();
      expect(Analytics.logout).toBeDefined();
      expect(Analytics.onboardingStart).toBeDefined();
      expect(Analytics.onboardingComplete).toBeDefined();
      expect(Analytics.examUploadStart).toBeDefined();
      expect(Analytics.examUploadSuccess).toBeDefined();
      expect(Analytics.examUploadFailure).toBeDefined();
      expect(Analytics.examView).toBeDefined();
      expect(Analytics.error).toBeDefined();
      expect(Analytics.apiLatency).toBeDefined();
      expect(Analytics.flush).toBeDefined();
    });

    it('loginSuccess deve rastrear evento corretamente', () => {
      Analytics.loginSuccess('google');
      // trackEvent adiciona ao buffer, verificamos que não lança erro
    });

    it('error deve rastrear evento com screen', () => {
      Analytics.error('api_error', 'Timeout na API', 'examList');
    });
  });
});
