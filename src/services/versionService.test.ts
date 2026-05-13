/**
 * Testes unitários para versionService.ts
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

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.3.0',
    },
  },
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Linking: {
    canOpenURL: jest.fn(),
    openURL: jest.fn(),
  },
}));

import { api } from './api';
import { Platform, Linking } from 'react-native';
import {
  compareVersions,
  getCurrentAppVersion,
  checkForceUpdate,
  openAppStore,
} from './versionService';

const mockedApi = api as jest.Mocked<typeof api>;
const mockedLinking = Linking as jest.Mocked<typeof Linking>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('versionService', () => {
  // --------------------------------------------------------
  // compareVersions
  // --------------------------------------------------------
  describe('compareVersions', () => {
    it('deve retornar 0 quando versões são iguais', () => {
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
      expect(compareVersions('2.5.3', '2.5.3')).toBe(0);
    });

    it('deve retornar 1 quando version1 é maior que version2', () => {
      expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
      expect(compareVersions('1.1.0', '1.0.0')).toBe(1);
      expect(compareVersions('1.0.1', '1.0.0')).toBe(1);
    });

    it('deve retornar -1 quando version1 é menor que version2', () => {
      expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
      expect(compareVersions('1.0.0', '1.1.0')).toBe(-1);
      expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
    });

    it('deve comparar corretamente com números maiores', () => {
      expect(compareVersions('10.0.0', '9.0.0')).toBe(1);
      expect(compareVersions('1.10.0', '1.9.0')).toBe(1);
      expect(compareVersions('1.0.10', '1.0.9')).toBe(1);
    });

    it('deve tratar versões com menos de 3 partes', () => {
      expect(compareVersions('1.0', '1.0.0')).toBe(0);
      expect(compareVersions('1', '1.0.0')).toBe(0);
      expect(compareVersions('2', '1.0.0')).toBe(1);
      expect(compareVersions('1', '1.0.1')).toBe(-1);
    });
  });

  // --------------------------------------------------------
  // getCurrentAppVersion
  // --------------------------------------------------------
  describe('getCurrentAppVersion', () => {
    it('deve retornar a versão do expoConfig', () => {
      expect(getCurrentAppVersion()).toBe('1.3.0');
    });

    it('deve retornar "1.0.0" como fallback quando expoConfig não tem version', () => {
      const Constants = require('expo-constants').default;
      const originalConfig = Constants.expoConfig;
      Constants.expoConfig = {};

      expect(getCurrentAppVersion()).toBe('1.0.0');

      Constants.expoConfig = originalConfig;
    });

    it('deve retornar "1.0.0" como fallback quando expoConfig é null', () => {
      const Constants = require('expo-constants').default;
      const originalConfig = Constants.expoConfig;
      Constants.expoConfig = null;

      expect(getCurrentAppVersion()).toBe('1.0.0');

      Constants.expoConfig = originalConfig;
    });
  });

  // --------------------------------------------------------
  // checkForceUpdate
  // --------------------------------------------------------
  describe('checkForceUpdate', () => {
    it('deve chamar a API com path "app/version" (sem barra inicial) e query params platform+version', async () => {
      (Platform as any).OS = 'ios';
      mockedApi.get.mockResolvedValueOnce({
        data: { data: { mode: 'ok', latestVersion: '1.3.0' } },
      });

      await checkForceUpdate();

      expect(mockedApi.get).toHaveBeenCalledWith('app/version', {
        params: { platform: 'ios', version: '1.3.0' },
      });
    });

    it('deve retornar needsUpdate=false quando mode="ok"', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: { data: { mode: 'ok', latestVersion: '1.3.0' } },
      });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(false);
      expect(result.versionInfo!.mode).toBe('ok');
    });

    it('deve retornar needsUpdate=true quando mode="force"', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          data: {
            mode: 'force',
            latestVersion: '1.5.0',
            storeUrl: 'https://store/x',
            updateMessage: 'Atualize agora!',
          },
        },
      });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(true);
      expect(result.versionInfo!.latestVersion).toBe('1.5.0');
      expect(result.versionInfo!.storeUrl).toBe('https://store/x');
      expect(result.versionInfo!.updateMessage).toBe('Atualize agora!');
    });

    it('deve retornar needsUpdate=false e versionInfo=null quando API falha', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(false);
      expect(result.versionInfo).toBeNull();
    });

    it('deve usar defaults seguros quando resposta vier com data vazio', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: { data: {} } });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(false);
      expect(result.versionInfo!.mode).toBe('ok');
      expect(result.versionInfo!.latestVersion).toBe('');
    });

    it('deve lidar com data null sem crashar', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: { data: null } });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(false);
      expect(result.versionInfo!.mode).toBe('ok');
    });
  });

  // --------------------------------------------------------
  // openAppStore
  // --------------------------------------------------------
  describe('openAppStore', () => {
    it('deve usar storeUrl fornecido quando presente', async () => {
      (Platform as any).OS = 'android';
      mockedLinking.canOpenURL.mockResolvedValueOnce(true);
      mockedLinking.openURL.mockResolvedValueOnce(undefined as any);

      await openAppStore('https://play.google.com/store/apps/details?id=com.custom');

      expect(mockedLinking.canOpenURL).toHaveBeenCalledWith(
        'https://play.google.com/store/apps/details?id=com.custom'
      );
      expect(mockedLinking.openURL).toHaveBeenCalledWith(
        'https://play.google.com/store/apps/details?id=com.custom'
      );
    });

    it('deve cair pra App Store fallback no iOS quando storeUrl ausente', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockResolvedValueOnce(true);
      mockedLinking.openURL.mockResolvedValueOnce(undefined as any);

      await openAppStore();

      expect(mockedLinking.canOpenURL).toHaveBeenCalledWith(
        'https://apps.apple.com/br/app/examinus/id6754453015'
      );
    });

    it('deve cair pra Play Store fallback no Android quando storeUrl ausente', async () => {
      (Platform as any).OS = 'android';
      mockedLinking.canOpenURL.mockResolvedValueOnce(true);
      mockedLinking.openURL.mockResolvedValueOnce(undefined as any);

      await openAppStore();

      expect(mockedLinking.canOpenURL).toHaveBeenCalledWith(
        'https://play.google.com/store/apps/details?id=com.examinus.app'
      );
    });

    it('não deve abrir URL quando canOpenURL retorna false', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockResolvedValueOnce(false);

      await openAppStore();

      expect(mockedLinking.openURL).not.toHaveBeenCalled();
    });

    it('não deve lançar erro quando canOpenURL falha', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockRejectedValueOnce(new Error('Cannot open'));

      await expect(openAppStore()).resolves.toBeUndefined();
    });

    it('não deve lançar erro quando openURL falha', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockResolvedValueOnce(true);
      mockedLinking.openURL.mockRejectedValueOnce(new Error('Open URL failed'));

      await expect(openAppStore()).resolves.toBeUndefined();
    });
  });
});
