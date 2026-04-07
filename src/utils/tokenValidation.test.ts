import * as SecureStore from 'expo-secure-store';
import { USER_STORAGE } from '@storage/storageConfig';

jest.mock('src/services/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

import { validateStoredToken, validateTokenWithBackend, clearStoredToken } from './tokenValidation';
import { api } from 'src/services/api';

const mockedApi = api as jest.Mocked<typeof api>;

// Helper: cria um JWT fake com exp
function createTokenWithExp(expSeconds: number): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ exp: expSeconds, sub: 'user-123' })).toString('base64');
  return `${header}.${payload}.signature`;
}

function createTokenWithoutExp(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ sub: 'user-123' })).toString('base64');
  return `${header}.${payload}.signature`;
}

beforeEach(() => {
  (SecureStore as any).__resetStore();
  jest.clearAllMocks();
});

describe('validateStoredToken', () => {
  it('deve retornar false quando não há usuário armazenado', async () => {
    const result = await validateStoredToken();
    expect(result).toBe(false);
  });

  it('deve retornar false quando dados do usuário não são JSON válido', async () => {
    await SecureStore.setItemAsync(USER_STORAGE, 'isto não é json');
    const result = await validateStoredToken();
    expect(result).toBe(false);
    // Deve limpar dados corrompidos
    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).toBeNull();
  });

  it('deve retornar false quando token não existe nos dados', async () => {
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify({ userId: '123' }));
    const result = await validateStoredToken();
    expect(result).toBe(false);
  });

  it('deve retornar false quando token tem estrutura inválida (menos de 3 partes)', async () => {
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify({ token: 'parte1.parte2' }));
    const result = await validateStoredToken();
    expect(result).toBe(false);
    // Deve limpar dados com token inválido
    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).toBeNull();
  });

  it('deve retornar false quando token está expirado', async () => {
    // Token expirado (exp no passado)
    const expiredToken = createTokenWithExp(Math.floor(Date.now() / 1000) - 3600);
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify({ token: expiredToken }));
    const result = await validateStoredToken();
    expect(result).toBe(false);
    // Deve limpar dados com token expirado
    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).toBeNull();
  });

  it('deve retornar true quando token é válido e não expirou', async () => {
    // Token válido (exp no futuro)
    const validToken = createTokenWithExp(Math.floor(Date.now() / 1000) + 3600);
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify({ token: validToken }));
    const result = await validateStoredToken();
    expect(result).toBe(true);
  });

  it('deve retornar true quando token não tem campo exp (assume válido)', async () => {
    const tokenNoExp = createTokenWithoutExp();
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify({ token: tokenNoExp }));
    const result = await validateStoredToken();
    expect(result).toBe(true);
  });

  it('deve retornar false e limpar storage quando ocorre erro inesperado', async () => {
    // Simular erro no SecureStore.getItemAsync
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
    const result = await validateStoredToken();
    expect(result).toBe(false);
  });
});

describe('validateTokenWithBackend', () => {
  it('deve retornar false quando não há usuário armazenado', async () => {
    const result = await validateTokenWithBackend();
    expect(result).toBe(false);
  });

  it('deve retornar false quando userData não tem token', async () => {
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify({ userId: '123' }));
    const result = await validateTokenWithBackend();
    expect(result).toBe(false);
  });

  it('deve retornar false quando userData não tem userId', async () => {
    await SecureStore.setItemAsync(
      USER_STORAGE,
      JSON.stringify({ token: 'a.b.c' })
    );
    const result = await validateTokenWithBackend();
    expect(result).toBe(false);
  });

  it('deve retornar false quando backend retorna 401', async () => {
    await SecureStore.setItemAsync(
      USER_STORAGE,
      JSON.stringify({ token: 'a.b.c', userId: '123' })
    );
    (mockedApi.get as jest.Mock).mockResolvedValueOnce({ status: 401 });
    const result = await validateTokenWithBackend();
    expect(result).toBe(false);
    // Deve limpar dados
    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).toBeNull();
  });

  it('deve retornar true quando backend retorna 200', async () => {
    await SecureStore.setItemAsync(
      USER_STORAGE,
      JSON.stringify({ token: 'a.b.c', userId: '123' })
    );
    (mockedApi.get as jest.Mock).mockResolvedValueOnce({ status: 200 });
    const result = await validateTokenWithBackend();
    expect(result).toBe(true);
  });

  it('deve retornar true quando backend retorna 404 (token aceito)', async () => {
    await SecureStore.setItemAsync(
      USER_STORAGE,
      JSON.stringify({ token: 'a.b.c', userId: '123' })
    );
    (mockedApi.get as jest.Mock).mockResolvedValueOnce({ status: 404 });
    const result = await validateTokenWithBackend();
    expect(result).toBe(true);
  });

  it('deve retornar true em erro de rede (sem response)', async () => {
    await SecureStore.setItemAsync(
      USER_STORAGE,
      JSON.stringify({ token: 'a.b.c', userId: '123' })
    );
    (mockedApi.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    const result = await validateTokenWithBackend();
    expect(result).toBe(true);
  });

  it('deve retornar false quando erro tem response 401', async () => {
    await SecureStore.setItemAsync(
      USER_STORAGE,
      JSON.stringify({ token: 'a.b.c', userId: '123' })
    );
    const error: any = new Error('Unauthorized');
    error.response = { status: 401 };
    (mockedApi.get as jest.Mock).mockRejectedValueOnce(error);
    const result = await validateTokenWithBackend();
    expect(result).toBe(false);
  });

  it('deve retornar true quando erro tem response com status diferente de 401', async () => {
    await SecureStore.setItemAsync(
      USER_STORAGE,
      JSON.stringify({ token: 'a.b.c', userId: '123' })
    );
    const error: any = new Error('Internal Server Error');
    error.response = { status: 500 };
    (mockedApi.get as jest.Mock).mockRejectedValueOnce(error);
    const result = await validateTokenWithBackend();
    expect(result).toBe(true);
  });
});

describe('clearStoredToken', () => {
  it('deve remover o token do SecureStore', async () => {
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify({ token: 'abc' }));
    await clearStoredToken();
    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).toBeNull();
  });

  it('não deve lançar erro quando deleteItemAsync falha', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Fail'));
    await expect(clearStoredToken()).resolves.toBeUndefined();
  });
});
