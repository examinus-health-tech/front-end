import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { storageAuthToken, storageAuthTokenGet, storageAuthTokenRemove } from './storageAuthToken';
import { AUTH_STORAGE } from '@storage/storageConfig';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('storageAuthToken', () => {
  it('deve salvar o token no AsyncStorage', async () => {
    await storageAuthToken({ token: 'meu-token-123' });

    const stored = await AsyncStorage.getItem(AUTH_STORAGE);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.token).toBe('meu-token-123');
  });

  it('deve sobrescrever token existente', async () => {
    await storageAuthToken({ token: 'token-antigo' });
    await storageAuthToken({ token: 'token-novo' });

    const stored = await AsyncStorage.getItem(AUTH_STORAGE);
    const parsed = JSON.parse(stored!);
    expect(parsed.token).toBe('token-novo');
  });
});

describe('storageAuthTokenGet', () => {
  it('deve retornar o token armazenado', async () => {
    await AsyncStorage.setItem(AUTH_STORAGE, JSON.stringify({ token: 'meu-token' }));

    const result = await storageAuthTokenGet();
    expect(result.token).toBe('meu-token');
  });

  it('deve retornar token undefined quando não há dados armazenados', async () => {
    const result = await storageAuthTokenGet();
    expect(result.token).toBeUndefined();
  });

  it('deve retornar token undefined e limpar storage quando JSON é inválido', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    await AsyncStorage.setItem(AUTH_STORAGE, 'json-invalido{{{');

    const result = await storageAuthTokenGet();

    expect(result.token).toBeUndefined();
    // Deve ter removido o item corrompido
    const stored = await AsyncStorage.getItem(AUTH_STORAGE);
    expect(stored).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('storageAuthTokenRemove', () => {
  it('deve remover o token do AsyncStorage', async () => {
    await AsyncStorage.setItem(AUTH_STORAGE, JSON.stringify({ token: 'token-para-remover' }));

    await storageAuthTokenRemove();

    const stored = await AsyncStorage.getItem(AUTH_STORAGE);
    expect(stored).toBeNull();
  });

  it('não deve lançar erro ao remover quando não existe token', async () => {
    await expect(storageAuthTokenRemove()).resolves.toBeUndefined();
  });
});
