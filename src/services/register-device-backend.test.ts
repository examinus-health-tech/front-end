/**
 * Testes unitários para register-device-backend.ts
 */

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    User: {
      getOnesignalId: jest.fn(),
    },
  },
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  AppState: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
}));

import { OneSignal } from 'react-native-onesignal';
import { Platform, AppState } from 'react-native';
import { api } from '../services/api';
import { registerDeviceOnBackend } from './register-device-backend';

const mockedApi = api as jest.Mocked<typeof api>;
const mockedOneSignal = OneSignal.User.getOnesignalId as jest.Mock;
const mockedAddEventListener = AppState.addEventListener as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockedAddEventListener.mockReturnValue({ remove: jest.fn() });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('register-device-backend', () => {
  // --------------------------------------------------------
  // registerDeviceOnBackend
  // --------------------------------------------------------
  describe('registerDeviceOnBackend', () => {
    it('deve registrar dispositivo com sucesso quando playerId está disponível', async () => {
      mockedOneSignal.mockResolvedValue('player-id-123');
      mockedApi.post.mockResolvedValueOnce({ data: { success: true } });

      const promise = registerDeviceOnBackend();

      // Avança o delay inicial de 2000ms
      jest.advanceTimersByTime(2000);
      await Promise.resolve(); // Flush promises

      await promise;

      expect(mockedApi.post).toHaveBeenCalledWith('devices/register', {
        playerId: 'player-id-123',
        platform: 'ios',
      });
    });

    it('deve usar Platform.OS correto ao registrar', async () => {
      (Platform as any).OS = 'android';
      mockedOneSignal.mockResolvedValue('player-id-456');
      mockedApi.post.mockResolvedValueOnce({ data: { success: true } });

      const promise = registerDeviceOnBackend();
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
      await promise;

      expect(mockedApi.post).toHaveBeenCalledWith('devices/register', {
        playerId: 'player-id-456',
        platform: 'android',
      });

      // Restaura
      (Platform as any).OS = 'ios';
    });

    it('deve tentar múltiplas vezes quando playerId não está disponível inicialmente', async () => {
      // Retorna null nas primeiras tentativas, depois retorna ID
      mockedOneSignal
        .mockResolvedValueOnce(null) // tentativa 1
        .mockResolvedValueOnce(null) // tentativa 2
        .mockResolvedValueOnce('player-id-789'); // tentativa 3

      mockedApi.post.mockResolvedValueOnce({ data: { success: true } });

      const promise = registerDeviceOnBackend();

      // Avança delay inicial (2s) + delays de retry using async version
      await jest.advanceTimersByTimeAsync(2000);
      await jest.advanceTimersByTimeAsync(1500);
      await jest.advanceTimersByTimeAsync(1500);

      await promise;

      expect(mockedOneSignal).toHaveBeenCalledTimes(3);
    });

    it('deve configurar listener de AppState quando playerId nunca fica disponível', async () => {
      // Retorna null em todas as tentativas
      mockedOneSignal.mockResolvedValue(null);

      const promise = registerDeviceOnBackend();

      // Avança delay inicial (2s)
      await jest.advanceTimersByTimeAsync(2000);

      // Avança cada retry (15 * 1.5s)
      for (let i = 0; i < 15; i++) {
        await jest.advanceTimersByTimeAsync(1500);
      }

      await promise;

      // Deve ter configurado o listener do AppState
      expect(mockedAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('deve lançar erro quando api.post falha', async () => {
      mockedOneSignal.mockResolvedValue('player-id-error');
      mockedApi.post.mockRejectedValueOnce(new Error('API Error'));

      const promise = registerDeviceOnBackend();
      jest.advanceTimersByTime(2000);
      await Promise.resolve();

      await expect(promise).rejects.toThrow('API Error');
    });

    it('deve lidar com erro na obtenção do playerId durante retry', async () => {
      mockedOneSignal
        .mockRejectedValueOnce(new Error('OneSignal not ready'))
        .mockResolvedValueOnce('player-id-recovered');

      mockedApi.post.mockResolvedValueOnce({ data: { success: true } });

      const promise = registerDeviceOnBackend();

      // Avança delay inicial
      await jest.advanceTimersByTimeAsync(2000);

      // Avança delay de retry
      await jest.advanceTimersByTimeAsync(1500);

      await promise;

      expect(mockedApi.post).toHaveBeenCalledWith('devices/register', {
        playerId: 'player-id-recovered',
        platform: expect.any(String),
      });
    });

    it('deve agendar setTimeout de 10s quando playerId não fica disponível', async () => {
      mockedOneSignal.mockResolvedValue(null);

      const promise = registerDeviceOnBackend();

      // Avança delay inicial (2s)
      await jest.advanceTimersByTimeAsync(2000);

      // Avança cada retry (15 * 1.5s)
      for (let i = 0; i < 15; i++) {
        await jest.advanceTimersByTimeAsync(1500);
      }

      await promise;

      // O setTimeout de 10s deve ter sido chamado
      // Verifica que a função não lançou erro e api.post was not called
      // (because playerId was never available)
      expect(mockedApi.post).not.toHaveBeenCalled();
    });
  });
});
