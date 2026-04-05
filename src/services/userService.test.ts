/**
 * Testes unitários para userService.ts
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

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { api } from './api';
import {
  getUserPersonalData,
  updateUserPersonalData,
  saveUserPersonalData,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getNotificationPreferences,
  updateNotificationPreferences,
  getOnboardingStatus,
  completeOnboarding,
} from './userService';

const ONBOARDING_CACHE_KEY = '@app:onboarding_completed';

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  // ============================================================
  // getUserPersonalData
  // ============================================================

  describe('getUserPersonalData', () => {
    it('deve retornar dados do usuário quando a API responde com sucesso', async () => {
      const userData = {
        fullName: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ userId: '1', email: 'joao@email.com', token: 'token123' })
      );
      (api.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: { data: userData },
      });

      const result = await getUserPersonalData();

      expect(result).toEqual(userData);
      expect(api.get).toHaveBeenCalledWith('user-personal-data', expect.any(Object));
    });

    it('deve retornar null quando a API responde com 404', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValue({
        status: 404,
        data: {},
      });

      const result = await getUserPersonalData();

      expect(result).toBeNull();
    });

    it('deve extrair dados quando response.data não tem propriedade data aninhada', async () => {
      const userData = { fullName: 'Maria', email: 'maria@email.com' };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: userData, // Sem wrapper { data: ... }
      });

      const result = await getUserPersonalData();

      expect(result).toEqual(userData);
    });

    it('deve lançar erro quando a API falha', async () => {
      const apiError = new Error('Network Error');
      (apiError as any).response = { status: 500, data: { message: 'Internal Server Error' } };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockRejectedValue(apiError);

      await expect(getUserPersonalData()).rejects.toThrow('Network Error');
    });

    it('deve funcionar quando não há dados de usuário no storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: { data: { fullName: 'Teste' } },
      });

      const result = await getUserPersonalData();

      expect(result).toEqual({ fullName: 'Teste' });
    });
  });

  // ============================================================
  // updateUserPersonalData
  // ============================================================

  describe('updateUserPersonalData', () => {
    it('deve atualizar dados com PUT e retornar resultado', async () => {
      const responseData = { success: true, data: { fullName: 'Atualizado' } };
      (api.put as jest.Mock).mockResolvedValue({ data: responseData });

      const result = await updateUserPersonalData({ fullName: 'Atualizado' } as any);

      expect(result).toEqual(responseData);
      expect(api.put).toHaveBeenCalledWith('user-personal-data', { fullName: 'Atualizado' }, { timeout: 60000 });
    });

    it('deve fazer fallback para POST quando PUT retorna 404', async () => {
      const putError = new Error('Not found');
      (putError as any).response = { status: 404, data: {} };

      const postResponse = { data: { success: true, data: { fullName: 'Criado via POST' } } };

      (api.put as jest.Mock).mockRejectedValue(putError);
      (api.post as jest.Mock).mockResolvedValue(postResponse);

      const result = await updateUserPersonalData({ fullName: 'Novo' } as any);

      expect(result).toEqual(postResponse.data);
      expect(api.post).toHaveBeenCalledWith('user-personal-data', { fullName: 'Novo' }, { timeout: 60000 });
    });

    it('deve lançar erro original quando PUT retorna 404 e POST também falha', async () => {
      const putError = new Error('Not found');
      (putError as any).response = { status: 404, data: {} };

      const postError = new Error('POST also failed');
      (postError as any).response = { status: 500, data: {} };

      (api.put as jest.Mock).mockRejectedValue(putError);
      (api.post as jest.Mock).mockRejectedValue(postError);

      await expect(updateUserPersonalData({ fullName: 'Novo' } as any)).rejects.toThrow('Not found');
    });

    it('deve lançar erro quando PUT retorna erro diferente de 404', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500, data: {} };

      (api.put as jest.Mock).mockRejectedValue(error);

      await expect(updateUserPersonalData({ fullName: 'Teste' } as any)).rejects.toThrow('Server Error');
      expect(api.post).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando PUT falha sem response (erro de rede)', async () => {
      const networkError = new Error('Network Error');

      (api.put as jest.Mock).mockRejectedValue(networkError);

      await expect(updateUserPersonalData({} as any)).rejects.toThrow('Network Error');
    });
  });

  // ============================================================
  // saveUserPersonalData
  // ============================================================

  describe('saveUserPersonalData', () => {
    it('deve fazer merge dos dados existentes com os novos dados', async () => {
      const existingData = { fullName: 'Existente', email: 'existente@email.com', phone: '123' };
      const newData = { fullName: 'Atualizado' } as any;

      // getUserPersonalData mock
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { data: existingData },
      });

      // updateUserPersonalData mock
      (api.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: { ...existingData, ...newData } },
      });

      const result = await saveUserPersonalData(newData);

      // Deve chamar PUT com dados merged
      expect(api.put).toHaveBeenCalledWith(
        'user-personal-data',
        expect.objectContaining({ fullName: 'Atualizado', email: 'existente@email.com', phone: '123' }),
        { timeout: 60000 }
      );
    });

    it('deve usar apenas dados novos quando não existem dados anteriores', async () => {
      const newData = { fullName: 'Novo Usuário' } as any;

      // getUserPersonalData retorna null (404)
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValueOnce({
        status: 404,
        data: {},
      });

      (api.put as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      await saveUserPersonalData(newData);

      expect(api.put).toHaveBeenCalledWith(
        'user-personal-data',
        { fullName: 'Novo Usuário' },
        { timeout: 60000 }
      );
    });

    it('deve verificar se dados foram salvos quando PUT retorna erro 500 com "não encontrado"', async () => {
      jest.useFakeTimers();

      const newData = { fullName: 'Teste' } as any;

      // getUserPersonalData para o merge - retorna null
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock)
        .mockResolvedValueOnce({ status: 404, data: {} }) // getUserPersonalData no merge
        .mockResolvedValueOnce({ status: 200, data: { data: { fullName: 'Teste' } } }); // Verificação posterior

      const putError = new Error('não encontrado');
      (putError as any).response = { status: 500, data: {} };
      (api.put as jest.Mock).mockRejectedValue(putError);

      const promise = saveUserPersonalData(newData);

      // Avançar o timer do setTimeout(1000) usando async version
      await jest.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(result).toEqual({ fullName: 'Teste' });

      jest.useRealTimers();
    });

    it('deve lançar erro quando PUT falha e dados não foram salvos', async () => {
      jest.useFakeTimers();

      const newData = { fullName: 'Teste' } as any;

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      // getUserPersonalData: primeiro para merge, segundo na verificação
      (api.get as jest.Mock)
        .mockResolvedValueOnce({ status: 404, data: {} })
        .mockResolvedValueOnce({ status: 404, data: {} }); // Dados não encontrados

      const putError = new Error('não encontrado');
      (putError as any).response = { status: 500, data: {} };
      (api.put as jest.Mock).mockRejectedValue(putError);

      // Attach rejection handler before advancing timers to avoid unhandled rejection
      const promise = saveUserPersonalData(newData);
      const rejectPromise = expect(promise).rejects.toThrow('não encontrado');

      await jest.advanceTimersByTimeAsync(1000);
      await rejectPromise;

      jest.useRealTimers();
    });

    it('deve lançar erro quando a atualização falha com erro não recuperável', async () => {
      const newData = { fullName: 'Teste' } as any;

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValueOnce({ status: 404, data: {} });

      const error = new Error('Timeout');
      (error as any).response = { status: 408, data: {} };
      (api.put as jest.Mock).mockRejectedValue(error);

      await expect(saveUserPersonalData(newData)).rejects.toThrow('Timeout');
    });

    it('deve tratar erro 404 no fallback verificando dados pessoais no AsyncStorage', async () => {
      jest.useFakeTimers();

      const newData = { fullName: 'Teste' } as any;

      // Mock AsyncStorage para retornar dados pessoais como fallback
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@app:personalData') {
          return Promise.resolve(JSON.stringify({ gender: 'M', weight: 70 }));
        }
        return Promise.resolve(null);
      });

      // GET retorna 404 no merge
      (api.get as jest.Mock)
        .mockResolvedValueOnce({ status: 404, data: {} }) // getUserPersonalData no merge
        .mockResolvedValueOnce({ status: 404, data: {} }); // checkData na verificação

      const putError = new Error('not found');
      (putError as any).response = { status: 404, data: {} };
      (api.put as jest.Mock).mockRejectedValue(putError);

      // O fallback para POST também precisa falhar
      (api.post as jest.Mock).mockRejectedValue(putError);

      // Attach rejection handler before advancing timers to avoid unhandled rejection
      const promise = saveUserPersonalData(newData);
      const rejectPromise = expect(promise).rejects.toThrow('not found');

      await jest.advanceTimersByTimeAsync(1000);
      await rejectPromise;

      jest.useRealTimers();
    });
  });

  // ============================================================
  // uploadProfilePhoto
  // ============================================================

  describe('uploadProfilePhoto', () => {
    it('deve fazer upload de uma foto jpeg com sucesso', async () => {
      const base64Content = 'base64ImageData';
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(base64Content);
      (api.put as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: { photoBase64: `data:image/jpeg;base64,${base64Content}` },
        },
      });

      const result = await uploadProfilePhoto('/path/to/image.jpeg');

      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('/path/to/image.jpeg', {
        encoding: FileSystem.EncodingType.Base64,
      });
      expect(api.put).toHaveBeenCalledWith(
        'user-personal-data/profile-photo',
        { photoBase64: `data:image/jpeg;base64,${base64Content}` },
        { timeout: 60000 }
      );
      expect(result).toBe(`data:image/jpeg;base64,${base64Content}`);
    });

    it('deve detectar tipo PNG pelo URI', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('pngData');
      (api.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: { photoBase64: 'data:image/png;base64,pngData' } },
      });

      await uploadProfilePhoto('/path/to/image.png');

      expect(api.put).toHaveBeenCalledWith(
        'user-personal-data/profile-photo',
        { photoBase64: 'data:image/png;base64,pngData' },
        { timeout: 60000 }
      );
    });

    it('deve usar jpeg como tipo padrão quando extensão não é reconhecida', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('data');
      (api.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: {} },
      });

      await uploadProfilePhoto('/path/to/image');

      expect(api.put).toHaveBeenCalledWith(
        'user-personal-data/profile-photo',
        expect.objectContaining({
          photoBase64: expect.stringContaining('data:image/jpeg;base64,'),
        }),
        { timeout: 60000 }
      );
    });

    it('deve lançar erro quando a imagem excede 5MB', async () => {
      // Criar uma string base64 grande o suficiente (~5MB+ antes do overhead base64)
      const largeBase64 = 'x'.repeat(7 * 1024 * 1024); // ~7MB em base64
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(largeBase64);

      await expect(uploadProfilePhoto('/path/to/large.jpeg')).rejects.toThrow(
        'A foto deve ter no máximo 5MB.'
      );
    });

    it('deve retornar photoBase64 da resposta do backend', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('data');
      (api.put as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: { photoBase64: 'backend-processed-photo' },
        },
      });

      const result = await uploadProfilePhoto('/path/to/image.jpeg');

      expect(result).toBe('backend-processed-photo');
    });

    it('deve retornar photoBase64 local quando backend não retorna na data', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('localData');
      (api.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: {} },
      });

      const result = await uploadProfilePhoto('/path/to/image.jpeg');

      expect(result).toBe('data:image/jpeg;base64,localData');
    });

    it('deve lançar mensagem específica do backend quando retorna 400', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('data');

      const error = new Error('Bad Request');
      (error as any).response = { status: 400, data: { message: 'Formato de imagem inválido' } };
      (api.put as jest.Mock).mockRejectedValue(error);

      await expect(uploadProfilePhoto('/path/to/image.jpeg')).rejects.toThrow('Formato de imagem inválido');
    });

    it('deve usar mensagem padrão quando backend retorna 400 sem mensagem', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('data');

      const error = new Error('Bad Request');
      (error as any).response = { status: 400, data: {} };
      (api.put as jest.Mock).mockRejectedValue(error);

      await expect(uploadProfilePhoto('/path/to/image.jpeg')).rejects.toThrow('Erro ao enviar foto');
    });

    it('deve propagar erro genérico quando não é 400', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('data');

      const error = new Error('Server Error');
      (error as any).response = { status: 500, data: {} };
      (api.put as jest.Mock).mockRejectedValue(error);

      await expect(uploadProfilePhoto('/path/to/image.jpeg')).rejects.toThrow('Server Error');
    });
  });

  // ============================================================
  // deleteProfilePhoto
  // ============================================================

  describe('deleteProfilePhoto', () => {
    it('deve remover foto de perfil com sucesso', async () => {
      (api.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

      await expect(deleteProfilePhoto()).resolves.toBeUndefined();
      expect(api.delete).toHaveBeenCalledWith('user-personal-data/profile-photo');
    });

    it('deve ignorar erro 400 quando usuário não possui foto', async () => {
      const error = new Error('Bad Request');
      (error as any).response = { status: 400, data: { message: 'Usuário não possui foto de perfil' } };

      (api.delete as jest.Mock).mockRejectedValue(error);

      await expect(deleteProfilePhoto()).resolves.toBeUndefined();
    });

    it('deve lançar erro quando a deleção falha com outro erro', async () => {
      const error = new Error('Server Error');
      (error as any).response = { status: 500, data: {} };

      (api.delete as jest.Mock).mockRejectedValue(error);

      await expect(deleteProfilePhoto()).rejects.toThrow('Server Error');
    });

    it('deve lançar erro quando resposta de erro 400 não menciona foto', async () => {
      const error = new Error('Bad Request');
      (error as any).response = { status: 400, data: { message: 'Outro erro qualquer' } };

      (api.delete as jest.Mock).mockRejectedValue(error);

      await expect(deleteProfilePhoto()).rejects.toThrow('Bad Request');
    });
  });

  // ============================================================
  // getNotificationPreferences
  // ============================================================

  describe('getNotificationPreferences', () => {
    it('deve retornar preferências de notificação', async () => {
      const prefs = { examReminders: true, medicationReminders: true, generalNotifications: false };
      (api.get as jest.Mock).mockResolvedValue({
        data: { success: true, data: prefs },
      });

      const result = await getNotificationPreferences();

      expect(result).toEqual(prefs);
      expect(api.get).toHaveBeenCalledWith('user-personal-data/notification-preferences');
    });

    it('deve lançar erro quando a API falha', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(getNotificationPreferences()).rejects.toThrow('API Error');
    });
  });

  // ============================================================
  // updateNotificationPreferences
  // ============================================================

  describe('updateNotificationPreferences', () => {
    it('deve atualizar preferências de notificação', async () => {
      const prefs = { examReminders: false, medicationReminders: true, generalNotifications: true } as any;
      (api.put as jest.Mock).mockResolvedValue({ data: { success: true } });

      await expect(updateNotificationPreferences(prefs)).resolves.toBeUndefined();

      expect(api.put).toHaveBeenCalledWith('user-personal-data/notification-preferences', prefs);
    });

    it('deve lançar erro quando a atualização falha', async () => {
      (api.put as jest.Mock).mockRejectedValue(new Error('Update failed'));

      await expect(updateNotificationPreferences({} as any)).rejects.toThrow('Update failed');
    });
  });

  // ============================================================
  // getOnboardingStatus
  // ============================================================

  describe('getOnboardingStatus', () => {
    it('deve retornar true imediatamente quando cache local indica onboarding completo', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === ONBOARDING_CACHE_KEY) return Promise.resolve('true');
        return Promise.resolve(null);
      });

      // Mock background update (que é fire-and-forget)
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { hasCompletedOnboarding: true } },
      });

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: true });
    });

    it('deve buscar do backend quando cache local não existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { hasCompletedOnboarding: true } },
      });

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: true });
      expect(api.get).toHaveBeenCalledWith('user-personal-data/onboarding-status', { timeout: 10000 });
    });

    it('deve salvar no cache quando backend confirma onboarding completo', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { hasCompletedOnboarding: true } },
      });

      await getOnboardingStatus();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(ONBOARDING_CACHE_KEY, 'true');
    });

    it('deve retornar false quando backend diz que onboarding não foi completado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { hasCompletedOnboarding: false } },
      });

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: false });
    });

    it('deve retornar false como padrão quando backend retorna null', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: null },
      });

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: false });
    });

    it('deve usar fallback do cache quando backend falha', async () => {
      let callIndex = 0;
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === ONBOARDING_CACHE_KEY) {
          callIndex++;
          // Primeira chamada: não encontrado; segunda chamada (fallback): encontrado
          return Promise.resolve(callIndex > 1 ? 'true' : null);
        }
        return Promise.resolve(null);
      });

      (api.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: true });
    });

    it('deve usar dados pessoais como indicador secundário de onboarding completo', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === ONBOARDING_CACHE_KEY) return Promise.resolve(null);
        if (key === '@app:personalData') {
          return Promise.resolve(JSON.stringify({ gender: 'M', weight: 75, height: 180 }));
        }
        return Promise.resolve(null);
      });

      (api.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: true });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(ONBOARDING_CACHE_KEY, 'true');
    });

    it('deve retornar false quando não há cache nem dados pessoais e backend falha', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (api.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: false });
    });

    it('deve tratar erro ao ler cache local no início da função', async () => {
      let firstCall = true;
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === ONBOARDING_CACHE_KEY && firstCall) {
          firstCall = false;
          return Promise.reject(new Error('Storage error'));
        }
        return Promise.resolve(null);
      });

      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { hasCompletedOnboarding: false } },
      });

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: false });
    });

    it('deve tratar erro no fallback de dados pessoais', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === ONBOARDING_CACHE_KEY) return Promise.resolve(null);
        if (key === '@app:personalData') return Promise.reject(new Error('Fallback error'));
        return Promise.resolve(null);
      });

      (api.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: false });
    });

    it('deve considerar dados pessoais sem campos obrigatórios como onboarding incompleto', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === ONBOARDING_CACHE_KEY) return Promise.resolve(null);
        if (key === '@app:personalData') {
          return Promise.resolve(JSON.stringify({ name: 'Teste' })); // Sem gender/weight/height
        }
        return Promise.resolve(null);
      });

      (api.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      const result = await getOnboardingStatus();

      expect(result).toEqual({ hasCompletedOnboarding: false });
    });
  });

  // ============================================================
  // completeOnboarding
  // ============================================================

  describe('completeOnboarding', () => {
    it('deve marcar onboarding como completo e salvar no cache', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      await completeOnboarding();

      expect(api.post).toHaveBeenCalledWith('user-personal-data/complete-onboarding');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(ONBOARDING_CACHE_KEY, 'true');
    });

    it('deve lançar erro quando a API falha', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(completeOnboarding()).rejects.toThrow('API Error');
    });
  });
});
