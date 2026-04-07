import { USER_STORAGE, AUTH_STORAGE } from './storageConfig';

describe('storageConfig', () => {
  describe('constantes de storage', () => {
    it('deve exportar USER_STORAGE com valor correto', () => {
      expect(USER_STORAGE).toBe('examinus.user');
    });

    it('deve exportar AUTH_STORAGE com valor correto', () => {
      expect(AUTH_STORAGE).toBe('examinus.token');
    });

    it('USER_STORAGE deve conter apenas caracteres válidos para SecureStore', () => {
      expect(USER_STORAGE).toMatch(/^[a-zA-Z0-9._-]+$/);
    });

    it('AUTH_STORAGE deve conter apenas caracteres válidos para SecureStore', () => {
      expect(AUTH_STORAGE).toMatch(/^[a-zA-Z0-9._-]+$/);
    });

    it('USER_STORAGE e AUTH_STORAGE devem ser diferentes', () => {
      expect(USER_STORAGE).not.toBe(AUTH_STORAGE);
    });

    it('USER_STORAGE deve ser uma string não vazia', () => {
      expect(typeof USER_STORAGE).toBe('string');
      expect(USER_STORAGE.length).toBeGreaterThan(0);
    });

    it('AUTH_STORAGE deve ser uma string não vazia', () => {
      expect(typeof AUTH_STORAGE).toBe('string');
      expect(AUTH_STORAGE.length).toBeGreaterThan(0);
    });
  });
});
