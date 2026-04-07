import * as SecureStore from 'expo-secure-store';

import { storageAuthToken, storageAuthTokenGet, storageAuthTokenRemove } from './storageAuthToken';
import { AUTH_STORAGE } from '@storage/storageConfig';

beforeEach(() => {
  (SecureStore as any).__resetStore();
  jest.clearAllMocks();
});

describe('storageAuthToken', () => {
  it('deve salvar o token no SecureStore', async () => {
    await storageAuthToken({ token: 'meu-token-123' });

    const stored = await SecureStore.getItemAsync(AUTH_STORAGE);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.token).toBe('meu-token-123');
  });

  it('deve sobrescrever token existente', async () => {
    await storageAuthToken({ token: 'token-antigo' });
    await storageAuthToken({ token: 'token-novo' });

    const stored = await SecureStore.getItemAsync(AUTH_STORAGE);
    const parsed = JSON.parse(stored!);
    expect(parsed.token).toBe('token-novo');
  });
});

describe('storageAuthTokenGet', () => {
  it('deve retornar o token armazenado', async () => {
    await SecureStore.setItemAsync(AUTH_STORAGE, JSON.stringify({ token: 'meu-token' }));

    const result = await storageAuthTokenGet();
    expect(result.token).toBe('meu-token');
  });

  it('deve retornar token undefined quando não há dados armazenados', async () => {
    const result = await storageAuthTokenGet();
    expect(result.token).toBeUndefined();
  });

  it('deve retornar token undefined e limpar storage quando JSON é inválido', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    await SecureStore.setItemAsync(AUTH_STORAGE, 'json-invalido{{{');

    const result = await storageAuthTokenGet();

    expect(result.token).toBeUndefined();
    const stored = await SecureStore.getItemAsync(AUTH_STORAGE);
    expect(stored).toBeNull();
    errorSpy.mockRestore();
  });
});

describe('storageAuthTokenRemove', () => {
  it('deve remover o token do SecureStore', async () => {
    await SecureStore.setItemAsync(AUTH_STORAGE, JSON.stringify({ token: 'token-para-remover' }));

    await storageAuthTokenRemove();

    const stored = await SecureStore.getItemAsync(AUTH_STORAGE);
    expect(stored).toBeNull();
  });

  it('não deve lançar erro ao remover quando não existe token', async () => {
    await expect(storageAuthTokenRemove()).resolves.toBeUndefined();
  });
});
