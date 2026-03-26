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

    it('deve comparar versões com partes patch diferentes', () => {
      expect(compareVersions('1.3.0', '1.3.1')).toBe(-1);
      expect(compareVersions('1.3.2', '1.3.1')).toBe(1);
    });

    it('deve comparar quando major é igual mas minor difere', () => {
      expect(compareVersions('1.2.0', '1.3.0')).toBe(-1);
      expect(compareVersions('1.4.0', '1.3.0')).toBe(1);
    });
  });

  // --------------------------------------------------------
  // getCurrentAppVersion
  // --------------------------------------------------------
  describe('getCurrentAppVersion', () => {
    it('deve retornar a versão do expoConfig', () => {
      const version = getCurrentAppVersion();
      expect(version).toBe('1.3.0');
    });

    it('deve retornar "1.0.0" como fallback quando expoConfig não tem version', () => {
      // Sobrescreve temporariamente o mock
      const Constants = require('expo-constants').default;
      const originalConfig = Constants.expoConfig;
      Constants.expoConfig = {};

      const version = getCurrentAppVersion();
      expect(version).toBe('1.0.0');

      // Restaura
      Constants.expoConfig = originalConfig;
    });

    it('deve retornar "1.0.0" como fallback quando expoConfig é null', () => {
      const Constants = require('expo-constants').default;
      const originalConfig = Constants.expoConfig;
      Constants.expoConfig = null;

      const version = getCurrentAppVersion();
      expect(version).toBe('1.0.0');

      Constants.expoConfig = originalConfig;
    });
  });

  // --------------------------------------------------------
  // checkForceUpdate
  // --------------------------------------------------------
  describe('checkForceUpdate', () => {
    it('deve retornar needsUpdate=false quando versão atual é igual ou maior que minVersion', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          data: {
            minVersion: '1.0.0',
            latestVersion: '1.3.0',
            forceUpdate: false,
          },
        },
      });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(false);
      expect(result.versionInfo).not.toBeNull();
      expect(result.versionInfo!.minVersion).toBe('1.0.0');
    });

    it('deve retornar needsUpdate=true quando versão atual é menor que minVersion', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          data: {
            minVersion: '2.0.0',
            latestVersion: '2.1.0',
            forceUpdate: false,
          },
        },
      });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(true);
    });

    it('deve retornar needsUpdate=true quando forceUpdate é true', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          data: {
            minVersion: '1.0.0',
            latestVersion: '1.5.0',
            forceUpdate: true,
          },
        },
      });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(true);
      expect(result.versionInfo!.forceUpdate).toBe(true);
    });

    it('deve retornar needsUpdate=false e versionInfo=null quando API falha', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(false);
      expect(result.versionInfo).toBeNull();
    });

    it('deve lidar com resposta da API com dados parciais', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          data: {},
        },
      });

      const result = await checkForceUpdate();
      // Usa valores padrão: minVersion='1.0.0', forceUpdate=false
      expect(result.needsUpdate).toBe(false);
      expect(result.versionInfo!.minVersion).toBe('1.0.0');
      expect(result.versionInfo!.forceUpdate).toBe(false);
    });

    it('deve lidar com resposta da API com data null', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: { data: null },
      });

      const result = await checkForceUpdate();
      expect(result.needsUpdate).toBe(false);
    });

    it('deve incluir updateMessage quando presente', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          data: {
            minVersion: '2.0.0',
            latestVersion: '2.0.0',
            forceUpdate: true,
            updateMessage: 'Atualize agora!',
          },
        },
      });

      const result = await checkForceUpdate();
      expect(result.versionInfo!.updateMessage).toBe('Atualize agora!');
    });

    it('deve chamar a API com o path correto', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: { data: { minVersion: '1.0.0', latestVersion: '1.0.0', forceUpdate: false } },
      });

      await checkForceUpdate();
      expect(mockedApi.get).toHaveBeenCalledWith('/app/version');
    });
  });

  // --------------------------------------------------------
  // openAppStore
  // --------------------------------------------------------
  describe('openAppStore', () => {
    it('deve abrir a App Store no iOS', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockResolvedValueOnce(true);
      mockedLinking.openURL.mockResolvedValueOnce(undefined as any);

      await openAppStore();

      expect(mockedLinking.canOpenURL).toHaveBeenCalledWith(
        'https://apps.apple.com/br/app/examinus/id6754453015'
      );
      expect(mockedLinking.openURL).toHaveBeenCalledWith(
        'https://apps.apple.com/br/app/examinus/id6754453015'
      );
    });

    it('deve abrir a Play Store no Android', async () => {
      (Platform as any).OS = 'android';
      mockedLinking.canOpenURL.mockResolvedValueOnce(true);
      mockedLinking.openURL.mockResolvedValueOnce(undefined as any);

      await openAppStore();

      expect(mockedLinking.canOpenURL).toHaveBeenCalledWith(
        'https://play.google.com/store/apps/details?id=com.examinus.app'
      );
      expect(mockedLinking.openURL).toHaveBeenCalledWith(
        'https://play.google.com/store/apps/details?id=com.examinus.app'
      );
    });

    it('deve não abrir URL quando canOpenURL retorna false', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockResolvedValueOnce(false);

      await openAppStore();

      expect(mockedLinking.openURL).not.toHaveBeenCalled();
    });

    it('deve não lançar erro quando canOpenURL falha', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockRejectedValueOnce(new Error('Cannot open'));

      await expect(openAppStore()).resolves.toBeUndefined();
    });

    it('deve não lançar erro quando openURL falha', async () => {
      (Platform as any).OS = 'ios';
      mockedLinking.canOpenURL.mockResolvedValueOnce(true);
      mockedLinking.openURL.mockRejectedValueOnce(new Error('Open URL failed'));

      await expect(openAppStore()).resolves.toBeUndefined();
    });
  });
});
