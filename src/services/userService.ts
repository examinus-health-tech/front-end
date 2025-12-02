import { api } from './api';
import { UserPersonalDataDTO, UserPersonalDataResponseDTO } from '@dtos/userDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    console.log('📦 [USER_SERVICE] Response completo:', JSON.stringify(response.data, null, 2));

    // O backend retorna { data: { fullName, email, phone, ... } }
    const userData = (response.data as any).data || response.data;

    console.log('✅ [USER_SERVICE] Perfil completo recuperado:', userData);
    console.log('📊 [USER_SERVICE] Campos extraídos:', {
      fullName: userData?.fullName,
      email: userData?.email,
      gender: userData?.gender,
      weight: userData?.weight,
      height: userData?.height,
    });

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
    });
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
    console.log('📊 [USER_SERVICE] Payload final sendo enviado:', JSON.stringify(mergedData, null, 2));
    const result = await updateUserPersonalData(mergedData);
    console.log('✅ [USER_SERVICE] Perfil salvo com sucesso via PUT');
    return result;
  } catch (putError: any) {
    const errorMessage = putError.message?.toLowerCase() || '';
    const status = putError.response?.status;

    console.error('❌ [USER_SERVICE] PUT falhou:', {
      message: putError.message,
      status: status,
      data: putError.response?.data,
    });

    // Se erro é "não encontrado", o backend tem bug mas os dados PODEM ter sido salvos
    // Vamos tentar buscar os dados para confirmar
    if (
      status === 500 &&
      (errorMessage.includes('não encontrado') || errorMessage.includes('not found'))
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
