import { decodeJwtPayload, getAppleClaims, JwtPayload } from './jwt';

// Helper: codifica string para base64 com suporte a UTF-8
function utf8ToBase64(str: string): string {
  // Converte string para bytes UTF-8, depois para base64
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: cria um JWT falso com payload específico
function createFakeJwt(payload: Record<string, any>): string {
  const header = utf8ToBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = utf8ToBase64(JSON.stringify(payload));
  const signature = 'fake-signature';
  // Converter para URL-safe base64
  const urlSafeHeader = header.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const urlSafeBody = body.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${urlSafeHeader}.${urlSafeBody}.${signature}`;
}

describe('decodeJwtPayload', () => {
  describe('tokens válidos', () => {
    it('deve decodificar payload de um JWT válido', () => {
      const payload = { sub: '12345', name: 'Test User', iat: 1516239022 };
      const token = createFakeJwt(payload);
      const result = decodeJwtPayload(token);
      expect(result).toEqual(payload);
    });

    it('deve decodificar payload com email', () => {
      const payload = { email: 'user@example.com', sub: 'abc123' };
      const token = createFakeJwt(payload);
      const result = decodeJwtPayload(token);
      expect(result?.email).toBe('user@example.com');
      expect(result?.sub).toBe('abc123');
    });

    it('deve decodificar payload com campos numéricos', () => {
      const payload = { exp: 1700000000, iat: 1699999000 };
      const token = createFakeJwt(payload);
      const result = decodeJwtPayload(token);
      expect(result?.exp).toBe(1700000000);
      expect(result?.iat).toBe(1699999000);
    });

    it('deve decodificar payload com caracteres especiais', () => {
      const payload = { name: 'José da Silva', city: 'São Paulo' };
      const token = createFakeJwt(payload);
      const result = decodeJwtPayload(token);
      expect(result?.name).toBe('José da Silva');
      expect(result?.city).toBe('São Paulo');
    });
  });

  describe('tokens inválidos', () => {
    it('deve retornar null para string vazia', () => {
      expect(decodeJwtPayload('')).toBeNull();
    });

    it('deve retornar null para null (cast)', () => {
      expect(decodeJwtPayload(null as any)).toBeNull();
    });

    it('deve retornar null para undefined (cast)', () => {
      expect(decodeJwtPayload(undefined as any)).toBeNull();
    });

    it('deve retornar null para número (tipo errado)', () => {
      expect(decodeJwtPayload(123 as any)).toBeNull();
    });

    it('deve retornar null para token sem 3 partes', () => {
      expect(decodeJwtPayload('parte1.parte2')).toBeNull();
    });

    it('deve retornar null para token com 4 partes', () => {
      expect(decodeJwtPayload('a.b.c.d')).toBeNull();
    });

    it('deve retornar null para token com payload não-JSON', () => {
      // Payload que não é JSON válido
      const header = btoa('{"alg":"HS256"}');
      const body = btoa('isto não é json{{{');
      expect(decodeJwtPayload(`${header}.${body}.sig`)).toBeNull();
    });
  });

  describe('base64url encoding', () => {
    it('deve tratar caracteres URL-safe base64 (- e _)', () => {
      const payload = { id: 'test_value+special/chars' };
      const token = createFakeJwt(payload);
      const result = decodeJwtPayload(token);
      expect(result?.id).toBe('test_value+special/chars');
    });
  });
});

describe('getAppleClaims', () => {
  it('deve extrair email e appleUserId (sub) do token', () => {
    const payload = {
      email: 'apple@privaterelay.appleid.com',
      sub: 'apple-user-id-123',
    };
    const token = createFakeJwt(payload);
    const result = getAppleClaims(token);
    expect(result.email).toBe('apple@privaterelay.appleid.com');
    expect(result.appleUserId).toBe('apple-user-id-123');
  });

  it('deve usar user_id como fallback quando sub não existe', () => {
    const payload = {
      email: 'user@example.com',
      user_id: 'user-id-456',
    };
    const token = createFakeJwt(payload);
    const result = getAppleClaims(token);
    expect(result.appleUserId).toBe('user-id-456');
  });

  it('deve usar uid como fallback quando sub e user_id não existem', () => {
    const payload = {
      email: 'user@example.com',
      uid: 'uid-789',
    };
    const token = createFakeJwt(payload);
    const result = getAppleClaims(token);
    expect(result.appleUserId).toBe('uid-789');
  });

  it('deve retornar undefined quando nenhum campo de ID existe', () => {
    const payload = { email: 'user@example.com' };
    const token = createFakeJwt(payload);
    const result = getAppleClaims(token);
    expect(result.email).toBe('user@example.com');
    expect(result.appleUserId).toBeUndefined();
  });

  it('deve retornar email undefined quando token não tem email', () => {
    const payload = { sub: 'some-id' };
    const token = createFakeJwt(payload);
    const result = getAppleClaims(token);
    expect(result.email).toBeUndefined();
    expect(result.appleUserId).toBe('some-id');
  });

  it('deve lidar com token inválido retornando undefined para ambos', () => {
    const result = getAppleClaims('token-invalido');
    expect(result.email).toBeUndefined();
    expect(result.appleUserId).toBeUndefined();
  });
});
