import * as SecureStore from 'expo-secure-store';
import { api } from 'src/services/api';

// Decodifica o payload do JWT (base64)
function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Base64 decode (com tratamento para URL-safe base64)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    if (__DEV__) console.error('[TokenValidation] Erro ao decodificar JWT:', error);
    return null;
  }
}

// Verifica se o token JWT expirou
function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.exp) {
      if (__DEV__) console.warn('[TokenValidation] Token sem campo exp');
      return false; // Se não tem exp, assume que não expira (será validado pelo backend)
    }

    const expirationTime = payload.exp * 1000; // exp está em segundos, converter para ms
    const now = Date.now();
    const isExpired = now >= expirationTime;

    if (isExpired) {
      if (__DEV__) console.log('[TokenValidation] Token expirado:', {
        expiration: new Date(expirationTime).toISOString(),
        now: new Date(now).toISOString(),
      });
    } else {
      const hoursUntilExpiry = Math.round((expirationTime - now) / (1000 * 60 * 60));
      if (__DEV__) console.log('[TokenValidation] Token válido, expira em:', hoursUntilExpiry, 'horas');
    }

    return isExpired;
  } catch (error) {
    if (__DEV__) console.error('[TokenValidation] Erro ao verificar expiração:', error);
    return false; // Em caso de erro, deixa o backend validar
  }
}

export async function validateStoredToken(): Promise<boolean> {
  try {
    if (__DEV__) console.log('[TokenValidation] Iniciando validação do token...');

    const storedUser = await SecureStore.getItemAsync('@app:user');

    if (!storedUser) {
      if (__DEV__) console.log('[TokenValidation] Nenhum usuário armazenado');
      return false;
    }

    let userData;
    try {
      userData = JSON.parse(storedUser);
    } catch (parseError) {
      if (__DEV__) console.error('[TokenValidation] Erro ao parsear dados do usuário:', parseError);
      await SecureStore.deleteItemAsync('@app:user');
      return false;
    }

    // Check if token exists
    if (!userData.token) {
      if (__DEV__) console.log('[TokenValidation] Token não existe nos dados do usuário');
      return false;
    }

    // Basic token structure validation
    const tokenParts = userData.token.split('.');
    if (tokenParts.length !== 3) {
      if (__DEV__) console.log('[TokenValidation] Token com estrutura inválida');
      await SecureStore.deleteItemAsync('@app:user');
      return false;
    }

    // Verificar se o token expirou localmente
    if (isTokenExpired(userData.token)) {
      if (__DEV__) console.log('[TokenValidation] Token expirado - limpando dados');
      await SecureStore.deleteItemAsync('@app:user');
      return false;
    }

    if (__DEV__) console.log('[TokenValidation] Token válido localmente');
    return true;
  } catch (error) {
    if (__DEV__) console.error('[TokenValidation] Erro na validação:', error);
    await SecureStore.deleteItemAsync('@app:user');
    return false;
  }
}

// Valida o token fazendo uma chamada ao backend (para usar após o app iniciar)
export async function validateTokenWithBackend(): Promise<boolean> {
  try {
    if (__DEV__) console.log('[TokenValidation] Validando token com backend...');

    const storedUser = await SecureStore.getItemAsync('@app:user');
    if (!storedUser) return false;

    const userData = JSON.parse(storedUser);
    if (!userData.token || !userData.userId) return false;

    // Faz uma chamada leve ao backend para validar o token
    // Usa a rota de user-personal-data que é rápida
    const response = await api.get('user-personal-data', {
      timeout: 10000, // 10 segundos timeout
      validateStatus: (status) => status < 500, // Aceita 2xx, 3xx e 4xx
    });

    // Se retornou 401, token inválido
    if (response.status === 401) {
      if (__DEV__) console.log('[TokenValidation] Backend retornou 401 - token inválido');
      await SecureStore.deleteItemAsync('@app:user');
      return false;
    }

    // Qualquer outro status (200, 404, etc) significa que o token é aceito
    if (__DEV__) console.log('[TokenValidation] Token validado pelo backend, status:', response.status);
    return true;
  } catch (error: any) {
    // Se for erro de rede, não invalida o token (pode ser problema de conexão)
    if (!error.response) {
      if (__DEV__) console.warn('[TokenValidation] Erro de rede ao validar token, mantendo sessão');
      return true; // Mantém a sessão em caso de problema de rede
    }

    // Se for 401, token inválido
    if (error.response?.status === 401) {
      if (__DEV__) console.log('[TokenValidation] Backend retornou 401 - token inválido');
      await SecureStore.deleteItemAsync('@app:user');
      return false;
    }

    // Outros erros, mantém a sessão
    if (__DEV__) console.warn('[TokenValidation] Erro ao validar com backend:', error.message);
    return true;
  }
}

export async function clearStoredToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('@app:user');
  } catch (error) {
    // Silent fail
  }
}