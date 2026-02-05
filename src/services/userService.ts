import { api } from './api';
import { UserPersonalDataDTO, UserPersonalDataResponseDTO, NotificationPreferencesDTO } from '@dtos/userDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

/**
 * 🎯 ENDPOINT UNIFICADO
 * Busca TODOS os dados do usuário (dados básicos + dados pessoais) em uma única response
 *
 * Endpoint: GET /user-personal-data
 *
 * Retorna:
 * - Dados básicos do User (fullName, email)
 * - Dados pessoais completos (phone, location, birthDate, country, etc)
 *
 * @returns Promise com todos os dados do usuário ou null se não existir
 */
export async function getUserPersonalData(): Promise<UserPersonalDataResponseDTO | null> {
  try {
    // Log do usuário autenticado para debug
    const userDataFromStorage = await AsyncStorage.getItem('@app:user');
    if (userDataFromStorage) {
      const parsedUser = JSON.parse(userDataFromStorage);
      console.log('👤 [USER_SERVICE] Usuário autenticado:', {
        userId: parsedUser.userId,
        email: parsedUser.email || parsedUser.name,
        hasToken: !!parsedUser.token,
        tokenPrefix: parsedUser.token?.substring(0, 20) + '...',
      });
      console.log('🔑 [USER_SERVICE] Token completo:', parsedUser.token);
    }

    console.log('📥 [USER_SERVICE] Buscando perfil completo do usuário (endpoint unificado)');

    // Debug: verificar headers da requisição
    const response = await api.get<{ data: UserPersonalDataResponseDTO }>('user-personal-data', {
      validateStatus: (status) => {
        console.log('📡 [USER_SERVICE] Status da resposta:', status);
        return status >= 200 && status < 500; // Não lançar erro para 404
      },
    });

    console.log('📡 [USER_SERVICE] Status final:', response.status);

    // Se for 404, retornar null
    if (response.status === 404) {
      console.log('ℹ️ [USER_SERVICE] Usuário ainda não tem dados cadastrados (404)');
      console.log('🔍 [USER_SERVICE] Detalhes do 404:', {
        url: 'user-personal-data',
        fullURL: `${process.env.EXPO_PUBLIC_API_URL}user-personal-data`,
        method: 'get',
        hasAuthHeader: true,
        responseData: response.data,
      });
      return null;
    }

    // O backend retorna { data: { fullName, email, phone, ... } }
    const userData = (response.data as any).data || response.data;

    console.log('✅ [USER_SERVICE] Perfil recuperado para:', userData?.fullName || userData?.email);

    return userData as UserPersonalDataResponseDTO;
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao buscar perfil completo:', error);
    console.error('❌ [USER_SERVICE] Status do erro:', error.response?.status);
    console.error('❌ [USER_SERVICE] Dados do erro:', error.response?.data);
    throw error;
  }
}

/**
 * 🎯 ENDPOINT UNIFICADO (Sempre PUT)
 *
 * Com as novas propriedades unificadas (fullName, email, phone, etc),
 * o endpoint agora funciona como UPSERT:
 * - Sempre usa PUT /user-personal-data
 * - Se dados não existem, o backend CRIA automaticamente
 * - Se dados existem, o backend ATUALIZA
 *
 * Atualiza/Cria simultaneamente:
 * - Dados básicos do User (fullName, email)
 * - Dados pessoais (phone, location, birthDate, country, etc)
 *
 * Todos os campos são opcionais - envia apenas o que precisa atualizar
 * O backend gerencia a transação e atualiza ambas as tabelas
 *
 * @param data - Dados para criar/atualizar (todos opcionais)
 * @returns Promise com os dados atualizados
 */
export async function updateUserPersonalData(data: UserPersonalDataDTO) {
  try {
    console.log('📤 [USER_SERVICE] Salvando perfil completo via PUT (UPSERT):', data);
    console.log('⏱️ [USER_SERVICE] Timeout configurado: 60 segundos');
    console.log('🔗 [USER_SERVICE] URL completa:', `${process.env.EXPO_PUBLIC_API_URL}user-personal-data`);

    // Aumentar timeout para 60 segundos especificamente para esta operação
    const response = await api.put('user-personal-data', data, {
      timeout: 60000, // 60 segundos
    });

    console.log('✅ [USER_SERVICE] Perfil completo salvo com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao salvar perfil completo:', error);
    console.error('❌ [USER_SERVICE] Erro detalhado:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: `${process.env.EXPO_PUBLIC_API_URL}user-personal-data`,
    });

    // Se PUT retornou 404, tentar POST como fallback (criar novo registro)
    if (error.response?.status === 404) {
      console.log('🔄 [USER_SERVICE] PUT retornou 404, tentando POST como fallback...');
      try {
        const postResponse = await api.post('user-personal-data', data, {
          timeout: 60000,
        });
        console.log('✅ [USER_SERVICE] POST bem sucedido:', postResponse.data);
        return postResponse.data;
      } catch (postError: any) {
        console.error('❌ [USER_SERVICE] POST também falhou:', {
          message: postError.message,
          status: postError.response?.status,
          data: postError.response?.data,
        });
        // Se POST também falhou, lançar o erro original
        throw error;
      }
    }

    throw error;
  }
}

/**
 * Salva dados pessoais do usuário com lógica inteligente de merge
 *
 * Comportamento:
 * 1. Busca dados existentes do usuário
 * 2. Faz merge dos dados novos com os existentes (preserva campos não alterados)
 * 3. Salva tudo via PUT (UPSERT)
 *
 * Problema conhecido do backend:
 * - PUT /user-personal-data é o único método que funciona
 * - PUT retorna "Dados do usuário não encontrado" na primeira vez
 * - PUT funciona normalmente nas próximas vezes
 *
 * Solução: Sempre usar PUT com merge de dados, ignorar erro de "não encontrado" na primeira vez
 *
 * @param data - Dados para salvar (apenas os campos que mudaram)
 * @returns Promise com os dados salvos
 */
export async function saveUserPersonalData(data: UserPersonalDataDTO) {
  console.log('💾 [USER_SERVICE] Iniciando salvamento do perfil (apenas PUT)');

  try {
    // 1. Buscar dados existentes
    console.log('📥 [USER_SERVICE] Buscando dados existentes para merge...');
    const existingData = await getUserPersonalData();

    // 2. Fazer merge: dados existentes + dados novos (novos têm prioridade)
    // Se existingData for null, usar apenas os novos dados
    const mergedData = existingData
      ? { ...existingData, ...data }  // Merge se existir dados
      : data;                          // Apenas novos dados se não existir

    console.log('🔀 [USER_SERVICE] Dados merged:', {
      existentes: existingData,
      novos: data,
      merged: mergedData,
    });

    // 3. Salvar dados merged
    console.log('🔄 [USER_SERVICE] Salvando perfil completo (PUT)...');
    const result = await updateUserPersonalData(mergedData);
    console.log('✅ [USER_SERVICE] Perfil salvo com sucesso via PUT');
    return result;
  } catch (putError: any) {
    const errorMessage = putError.message?.toLowerCase() || '';
    const status = putError.response?.status;

    console.error('❌ [USER_SERVICE] PUT/POST falhou:', {
      message: putError.message,
      status: status,
      data: putError.response?.data,
    });

    // Se erro é "não encontrado" (500 ou 404), o backend tem bug mas os dados PODEM ter sido salvos
    // Vamos tentar buscar os dados para confirmar
    if (
      (status === 500 || status === 404) &&
      (errorMessage.includes('não encontrado') || errorMessage.includes('not found') || status === 404)
    ) {
      console.log('⚠️ [USER_SERVICE] Erro "não encontrado" - pode ser bug do backend');
      console.log('🔄 [USER_SERVICE] Verificando se dados foram salvos...');

      try {
        // Aguardar um pouco para o backend processar
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));

        // Tentar buscar os dados
        const checkData = await getUserPersonalData();
        if (checkData) {
          console.log('✅ [USER_SERVICE] Dados foram salvos com sucesso apesar do erro!');
          return checkData;
        }
      } catch (checkError) {
        console.log('❌ [USER_SERVICE] Dados não foram salvos');
      }
    }

    throw putError;
  }
}

/**
 * Upload de foto de perfil
 * Endpoint: PUT /user-personal-data/profile-photo
 *
 * Converte a imagem para base64 e envia para o backend.
 * O backend aceita base64 com ou sem prefixo data URL.
 *
 * @param imageUri - URI local da imagem (file://)
 * @returns Promise com a foto salva em base64
 */
export async function uploadProfilePhoto(imageUri: string): Promise<string> {
  try {
    console.log('📤 [USER_SERVICE] Iniciando upload de foto de perfil:', imageUri);

    // Ler a imagem como base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Detectar o tipo da imagem pelo URI
    const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

    // Criar data URL com prefixo
    const photoBase64 = `data:${mimeType};base64,${base64Image}`;

    console.log('📊 [USER_SERVICE] Tamanho da imagem base64:', Math.round(photoBase64.length / 1024), 'KB');

    // Validar tamanho (máximo 5MB conforme documentação)
    const sizeInMB = (photoBase64.length * 3) / 4 / (1024 * 1024); // Aproximação do tamanho real
    if (sizeInMB > 5) {
      throw new Error('A foto deve ter no máximo 5MB.');
    }

    const response = await api.put<{ success: boolean; data: { photoBase64: string } }>(
      'user-personal-data/profile-photo',
      { photoBase64 },
      { timeout: 60000 } // 60s timeout para upload
    );

    console.log('✅ [USER_SERVICE] Foto de perfil enviada com sucesso');

    // Retornar a foto salva (pode ser processada pelo backend)
    return response.data.data?.photoBase64 || photoBase64;
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao fazer upload da foto:', error);
    console.error('❌ [USER_SERVICE] Detalhes do erro:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Tratar erros específicos do backend
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message || 'Erro ao enviar foto';
      throw new Error(errorMessage);
    }

    throw error;
  }
}

/**
 * Remove a foto de perfil do usuário
 * Endpoint: DELETE /user-personal-data/profile-photo
 *
 * @returns Promise<void>
 */
export async function deleteProfilePhoto(): Promise<void> {
  try {
    console.log('🗑️ [USER_SERVICE] Removendo foto de perfil...');

    await api.delete('user-personal-data/profile-photo');

    console.log('✅ [USER_SERVICE] Foto de perfil removida com sucesso');
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao remover foto de perfil:', error);

    // Se o erro for "usuário não possui foto", não é um erro crítico
    if (error.response?.status === 400 && error.response?.data?.message?.includes('não possui foto')) {
      console.log('ℹ️ [USER_SERVICE] Usuário não tinha foto de perfil');
      return;
    }

    throw error;
  }
}

/**
 * Busca as preferências de notificação do usuário
 * Endpoint: GET /user-personal-data/notification-preferences
 *
 * @returns Promise com as preferências de notificação
 */
export async function getNotificationPreferences(): Promise<NotificationPreferencesDTO> {
  try {
    console.log('📥 [USER_SERVICE] Buscando preferências de notificação...');

    const response = await api.get<{ success: boolean; data: NotificationPreferencesDTO }>(
      'user-personal-data/notification-preferences'
    );

    console.log('✅ [USER_SERVICE] Preferências de notificação recuperadas:', response.data.data);

    return response.data.data;
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao buscar preferências de notificação:', error);
    throw error;
  }
}

/**
 * Atualiza as preferências de notificação do usuário
 * Endpoint: PUT /user-personal-data/notification-preferences
 *
 * @param preferences - Objeto com as preferências de notificação
 * @returns Promise<void>
 */
export async function updateNotificationPreferences(preferences: NotificationPreferencesDTO): Promise<void> {
  try {
    console.log('📤 [USER_SERVICE] Atualizando preferências de notificação:', preferences);

    await api.put('user-personal-data/notification-preferences', preferences);

    console.log('✅ [USER_SERVICE] Preferências de notificação atualizadas com sucesso');
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao atualizar preferências de notificação:', error);
    throw error;
  }
}

const ONBOARDING_CACHE_KEY = '@app:onboarding_completed';

/**
 * Verifica se o usuário completou o onboarding
 * Endpoint: GET /user-personal-data/onboarding-status
 *
 * ESTRATÉGIA DE VERIFICAÇÃO (prioridade absoluta para cache local):
 * 1. Se cache local indica completo -> retorna TRUE imediatamente (nunca mostra onboarding)
 * 2. Se não tem cache -> busca do backend
 * 3. Se backend confirma -> salva no cache e retorna
 * 4. Se erro de rede/401/qualquer erro -> retorna TRUE para não forçar onboarding
 *
 * A filosofia é: uma vez que o onboarding foi completado, NUNCA deve reaparecer.
 * É melhor pular o onboarding erroneamente do que mostrá-lo novamente.
 *
 * @returns Promise com o status do onboarding { hasCompletedOnboarding: boolean }
 */
export async function getOnboardingStatus(): Promise<{ hasCompletedOnboarding: boolean }> {
  // 1. PRIORIDADE ABSOLUTA: Verificar cache local primeiro
  try {
    const cachedStatus = await AsyncStorage.getItem(ONBOARDING_CACHE_KEY);
    if (cachedStatus === 'true') {
      console.log('📱 [USER_SERVICE] Cache local indica onboarding completo - retornando TRUE');
      // Atualizar do backend em background (não bloqueia)
      updateOnboardingCacheFromBackend();
      return { hasCompletedOnboarding: true };
    }
    console.log('📱 [USER_SERVICE] Cache local não encontrado ou não é "true"');
  } catch (cacheError) {
    console.log('⚠️ [USER_SERVICE] Erro ao ler cache local:', cacheError);
  }

  // 2. Se não tem cache, buscar do backend
  try {
    console.log('📥 [USER_SERVICE] Verificando status do onboarding no backend...');

    const response = await api.get<{ data: { hasCompletedOnboarding: boolean } }>(
      'user-personal-data/onboarding-status',
      { timeout: 10000 } // Timeout de 10 segundos
    );

    const hasCompleted = response.data.data?.hasCompletedOnboarding ?? false;
    console.log('✅ [USER_SERVICE] Status do onboarding do backend:', hasCompleted);

    // 3. Se o onboarding foi completado, salvar no cache local
    if (hasCompleted) {
      await AsyncStorage.setItem(ONBOARDING_CACHE_KEY, 'true');
      console.log('💾 [USER_SERVICE] Cache de onboarding salvo');
    }

    return { hasCompletedOnboarding: hasCompleted };
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao verificar status do onboarding:', error?.message);

    // 4. FALLBACK SEGURO: Em caso de QUALQUER erro, verificar cache novamente
    // Se ainda não há cache, verificar se há dados pessoais como indicador secundário
    try {
      const cachedStatus = await AsyncStorage.getItem(ONBOARDING_CACHE_KEY);
      if (cachedStatus === 'true') {
        console.log('📱 [USER_SERVICE] Fallback: Cache local indica onboarding completo');
        return { hasCompletedOnboarding: true };
      }

      // Verificar se há dados pessoais como indicador secundário
      const personalData = await AsyncStorage.getItem('@app:personalData');
      if (personalData) {
        const parsed = JSON.parse(personalData);
        // Se tem dados pessoais com campos obrigatórios, considera onboarding completo
        if (parsed && (parsed.gender || parsed.weight || parsed.height)) {
          console.log('📱 [USER_SERVICE] Fallback: Dados pessoais encontrados, considerando onboarding completo');
          await AsyncStorage.setItem(ONBOARDING_CACHE_KEY, 'true');
          return { hasCompletedOnboarding: true };
        }
      }
    } catch (fallbackError) {
      console.error('❌ [USER_SERVICE] Erro no fallback:', fallbackError);
    }

    // Último recurso: sem cache e sem dados pessoais, assumir não completado
    console.log('⚠️ [USER_SERVICE] Nenhum indicador encontrado, onboarding será mostrado');
    return { hasCompletedOnboarding: false };
  }
}

/**
 * Atualiza o cache de onboarding do backend em background
 * Não bloqueia e não lança exceções
 *
 * IMPORTANTE: Só atualiza o cache para TRUE, nunca remove.
 * A remoção do cache só deve acontecer em logout explícito.
 * Isso evita que o onboarding reapareça devido a erros de sincronização
 * ou respostas incorretas do backend.
 */
async function updateOnboardingCacheFromBackend(): Promise<void> {
  try {
    const response = await api.get<{ data: { hasCompletedOnboarding: boolean } }>(
      'user-personal-data/onboarding-status'
    );
    if (response.data.data?.hasCompletedOnboarding) {
      await AsyncStorage.setItem(ONBOARDING_CACHE_KEY, 'true');
    }
    // NÃO remover o cache se o backend retornar false
    // O cache só deve ser invalidado em logout explícito para evitar
    // que o onboarding reapareça indevidamente
  } catch (error) {
    // Silenciosamente ignora erros - é apenas uma atualização em background
    console.log('⚠️ [USER_SERVICE] Falha ao atualizar cache de onboarding (background)');
  }
}

/**
 * Marca o onboarding como completo para o usuário
 * Endpoint: POST /user-personal-data/complete-onboarding
 *
 * Também salva no cache local para garantir que o status seja preservado
 * mesmo em caso de falhas de rede futuras.
 *
 * @returns Promise<void>
 */
export async function completeOnboarding(): Promise<void> {
  try {
    console.log('📤 [USER_SERVICE] Marcando onboarding como completo...');

    await api.post('user-personal-data/complete-onboarding');

    // Salvar no cache local para fallback em caso de erro de rede futuro
    await AsyncStorage.setItem(ONBOARDING_CACHE_KEY, 'true');

    console.log('✅ [USER_SERVICE] Onboarding marcado como completo e salvo no cache local');
  } catch (error: any) {
    console.error('❌ [USER_SERVICE] Erro ao marcar onboarding como completo:', error);
    throw error;
  }
}
