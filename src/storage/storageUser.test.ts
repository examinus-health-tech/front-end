import * as SecureStore from 'expo-secure-store';

import { storageUserSave, storageUserRemove, storageUserGet } from './storageUser';
import { USER_STORAGE } from '@storage/storageConfig';
import { UserDTO } from 'src/dtos/userDTO';

const mockUser: UserDTO = {
  email: 'usuario@teste.com',
  userId: 'user-123',
  photoUrl: 'https://example.com/photo.jpg',
};

const mockUserMinimal: UserDTO = {
  email: 'minimal@teste.com',
  userId: 'user-456',
};

beforeEach(() => {
  (SecureStore as any).__resetStore();
  jest.clearAllMocks();
});

describe('storageUserSave', () => {
  it('deve salvar os dados do usuário no SecureStore', async () => {
    await storageUserSave(mockUser);

    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.email).toBe('usuario@teste.com');
    expect(parsed.userId).toBe('user-123');
    expect(parsed.photoUrl).toBe('https://example.com/photo.jpg');
  });

  it('deve salvar usuário sem photoUrl', async () => {
    await storageUserSave(mockUserMinimal);

    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    const parsed = JSON.parse(stored!);
    expect(parsed.email).toBe('minimal@teste.com');
    expect(parsed.photoUrl).toBeUndefined();
  });

  it('deve sobrescrever dados existentes do usuário', async () => {
    await storageUserSave(mockUser);
    await storageUserSave(mockUserMinimal);

    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    const parsed = JSON.parse(stored!);
    expect(parsed.email).toBe('minimal@teste.com');
    expect(parsed.userId).toBe('user-456');
  });
});

describe('storageUserRemove', () => {
  it('deve remover os dados do usuário do SecureStore', async () => {
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify(mockUser));

    await storageUserRemove();

    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).toBeNull();
  });

  it('não deve lançar erro ao remover quando não existem dados', async () => {
    await expect(storageUserRemove()).resolves.toBeUndefined();
  });
});

describe('storageUserGet', () => {
  it('deve retornar os dados do usuário armazenado', async () => {
    await SecureStore.setItemAsync(USER_STORAGE, JSON.stringify(mockUser));

    const result = await storageUserGet();

    expect(result.email).toBe('usuario@teste.com');
    expect(result.userId).toBe('user-123');
    expect(result.photoUrl).toBe('https://example.com/photo.jpg');
  });

  it('deve retornar objeto vazio quando não há dados armazenados', async () => {
    const result = await storageUserGet();
    expect(result).toEqual({});
  });

  it('deve retornar objeto vazio e limpar storage quando JSON é inválido', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    await SecureStore.setItemAsync(USER_STORAGE, 'dados-corrompidos!!!');

    const result = await storageUserGet();

    expect(result).toEqual({});
    const stored = await SecureStore.getItemAsync(USER_STORAGE);
    expect(stored).toBeNull();
    errorSpy.mockRestore();
  });

  it('deve retornar objeto vazio e limpar storage quando ocorre erro no parse', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    await SecureStore.setItemAsync(USER_STORAGE, '{json invalido');

    const result = await storageUserGet();

    expect(result).toEqual({});
    errorSpy.mockRestore();
  });
});
