// Mock debugLogger antes de importar o módulo
jest.mock('./debugLogger', () => ({
  logger: {
    network: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('../services/api', () => ({
  api: {},
}));

import { NetworkDiagnosticsHelper, NetworkDiagnostics } from './networkDiagnostics';
import { logger } from './debugLogger';

// Mock global fetch
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

// Mock __DEV__
(global as any).__DEV__ = true;

// Mock process.env
const originalEnv = process.env;
beforeAll(() => {
  process.env = { ...originalEnv, EXPO_PUBLIC_API_URL: 'https://api.example.com/' };
});
afterAll(() => {
  process.env = originalEnv;
});

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockReset();
});

describe('NetworkDiagnosticsHelper', () => {
  describe('runDiagnostics', () => {
    it('deve retornar isConnected=true e apiReachable=true quando tudo funciona', async () => {
      // Google retorna OK
      mockFetch
        .mockResolvedValueOnce({ ok: true }) // google.com
        .mockResolvedValueOnce({ status: 200 }); // API

      const result = await NetworkDiagnosticsHelper.runDiagnostics();

      expect(result.isConnected).toBe(true);
      expect(result.apiReachable).toBe(true);
      expect(result.latency).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.error).toBeUndefined();
    });

    it('deve retornar isConnected=false quando google não responde', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network failed')) // google.com
        .mockResolvedValueOnce({ status: 200 }); // API

      const result = await NetworkDiagnosticsHelper.runDiagnostics();

      expect(result.isConnected).toBe(false);
      expect(result.apiReachable).toBe(true);
    });

    it('deve retornar apiReachable=false quando API não responde', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true }) // google.com
        .mockRejectedValueOnce(new Error('API down')); // API

      const result = await NetworkDiagnosticsHelper.runDiagnostics();

      expect(result.isConnected).toBe(true);
      expect(result.apiReachable).toBe(false);
      expect(result.error).toBe('API down');
    });

    it('deve considerar apiReachable=true quando API retorna 405', async () => {
      const error405: any = new Error('Method Not Allowed');
      error405.status = 405;

      mockFetch
        .mockResolvedValueOnce({ ok: true }) // google.com
        .mockRejectedValueOnce(error405); // API retorna 405

      const result = await NetworkDiagnosticsHelper.runDiagnostics();

      expect(result.isConnected).toBe(true);
      expect(result.apiReachable).toBe(true);
      expect(result.latency).toBeDefined();
    });

    it('deve considerar apiReachable=true quando API error.response.status é 405', async () => {
      const error405: any = new Error('Method Not Allowed');
      error405.response = { status: 405 };

      mockFetch
        .mockResolvedValueOnce({ ok: true }) // google.com
        .mockRejectedValueOnce(error405); // API retorna 405 via response

      const result = await NetworkDiagnosticsHelper.runDiagnostics();

      expect(result.apiReachable).toBe(true);
    });

    it('deve retornar ambos false quando nenhuma conexão funciona', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('No internet')) // google.com
        .mockRejectedValueOnce(new Error('No internet')); // API

      const result = await NetworkDiagnosticsHelper.runDiagnostics();

      expect(result.isConnected).toBe(false);
      expect(result.apiReachable).toBe(false);
    });

    it('deve registrar logs de diagnóstico', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ status: 200 });

      await NetworkDiagnosticsHelper.runDiagnostics();

      expect(logger.network).toHaveBeenCalledWith('Running network diagnostics');
      expect(logger.network).toHaveBeenCalledWith('Basic connectivity: OK');
      expect(logger.network).toHaveBeenCalledWith(
        'API connectivity: OK',
        expect.objectContaining({ latency: expect.any(Number) })
      );
      expect(logger.network).toHaveBeenCalledWith(
        'Network diagnostics completed',
        expect.objectContaining({
          totalTime: expect.any(Number),
          isConnected: true,
          apiReachable: true,
        })
      );
    });

    it('deve capturar erro geral e retornar resultado parcial', async () => {
      // Simula erro no bloco try externo: mockando logger.network para lançar na primeira chamada
      const originalNetwork = (logger.network as jest.Mock).getMockImplementation();
      (logger.network as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      const result = await NetworkDiagnosticsHelper.runDiagnostics();

      expect(result.error).toBe('Unexpected error');
      expect(logger.error).toHaveBeenCalledWith(
        'Network diagnostics failed',
        expect.objectContaining({ error: expect.any(Error) })
      );
    });
  });

  describe('testAPIHealth', () => {
    it('deve retornar true quando API está saudável', async () => {
      mockFetch.mockResolvedValueOnce({ status: 200 });

      const result = await NetworkDiagnosticsHelper.testAPIHealth();

      expect(result).toBe(true);
      expect(logger.network).toHaveBeenCalledWith('Testing API health');
    });

    it('deve retornar true quando API retorna 405 (esperado)', async () => {
      const error405: any = new Error('Method Not Allowed');
      error405.status = 405;

      mockFetch.mockRejectedValueOnce(error405);

      const result = await NetworkDiagnosticsHelper.testAPIHealth();

      expect(result).toBe(true);
    });

    it('deve retornar true quando error.response.status é 405', async () => {
      const error405: any = new Error('Method Not Allowed');
      error405.response = { status: 405 };

      mockFetch.mockRejectedValueOnce(error405);

      const result = await NetworkDiagnosticsHelper.testAPIHealth();

      expect(result).toBe(true);
    });

    it('deve retornar false quando API não responde', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await NetworkDiagnosticsHelper.testAPIHealth();

      expect(result).toBe(false);
      expect(logger.network).toHaveBeenCalledWith(
        'API health check: FAILED',
        expect.objectContaining({ error: 'Connection refused' })
      );
    });
  });

  describe('logEnvironmentInfo', () => {
    it('deve logar informações do ambiente', () => {
      NetworkDiagnosticsHelper.logEnvironmentInfo();

      expect(logger.info).toHaveBeenCalledWith('Environment info', {
        apiUrl: process.env.EXPO_PUBLIC_API_URL,
        isDev: true,
      });
    });
  });
});
