import axios from 'axios';

const CAMPAIGN_BASE_URL = 'https://campanhaapp-c7gdd2fyarecb5ck.canadacentral-01.azurewebsites.net/api';
const CAMPAIGN_API_URL = `${CAMPAIGN_BASE_URL}/Campanha`;

export interface CampaignVoucherResponse {
  success: boolean;
  voucher?: string;
  message?: string;
  validade?: string;
  status?: string;
}

// Cache do voucher para evitar chamadas repetidas à API (que disparam e-mails)
let cachedVoucher: { email: string; response: CampaignVoucherResponse; timestamp: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

/**
 * Verifica se o email está em uma campanha e retorna o voucher se existir
 * Esta função é chamada após o cadastro para verificar se o usuário
 * veio através de uma campanha promocional
 */
export async function checkCampaignVoucher(email: string, enviarNotificacao = false): Promise<CampaignVoucherResponse> {
  // Retorna cache se ainda for válido para o mesmo email
  if (
    cachedVoucher &&
    cachedVoucher.email === email &&
    Date.now() - cachedVoucher.timestamp < CACHE_TTL
  ) {
    if (__DEV__) console.log('📢 [CAMPANHA] Usando cache do voucher');
    return cachedVoucher.response;
  }

  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await axios.get(`${CAMPAIGN_API_URL}/obter-voucher/${encodedEmail}`, {
      headers: {
        'accept': '*/*',
      },
      params: { enviarNotificacao },
      timeout: 10000, // 10 segundos de timeout
    });

    if (__DEV__) console.log('[CAMPANHA] Resposta da API recebida, status:', response.status);

    // A API pode retornar diferentes formatos, vamos tratar
    if (response.data) {
      // Garantir que o voucher seja sempre uma string
      // A API retorna "codigo" como nome do campo
      let voucherCode = response.data.codigo || response.data.voucher || response.data.code;

      // Se não encontrou nas propriedades, verificar se response.data é uma string
      if (!voucherCode && typeof response.data === 'string') {
        voucherCode = response.data;
      }

      if (voucherCode) {
        const result: CampaignVoucherResponse = {
          success: true,
          voucher: String(voucherCode),
          message: response.data.message,
          validade: response.data.validade,
          status: response.data.status,
        };
        cachedVoucher = { email, response: result, timestamp: Date.now() };
        return result;
      }
    }

    const noVoucher: CampaignVoucherResponse = { success: false };
    cachedVoucher = { email, response: noVoucher, timestamp: Date.now() };
    return noVoucher;
  } catch (error: any) {
    // 404 significa que o email não está na campanha - não é um erro
    if (error?.response?.status === 404) {
      if (__DEV__) console.log('[CAMPANHA] Email não está na campanha');
      return { success: false };
    }

    if (__DEV__) console.log('📢 [CAMPANHA] Erro ao verificar campanha:', error?.message);
    // Não bloquear o fluxo em caso de erro - apenas logar
    return { success: false };
  }
}

/**
 * Busca o leadId pelo email na API de admin
 */
async function getLeadIdByEmail(email: string): Promise<number | null> {
  try {
    const response = await axios.get(`${CAMPAIGN_BASE_URL}/Admin/leads`, {
      params: { page: 1, pageSize: 300 },
      headers: { accept: '*/*' },
      timeout: 10000,
    });

    const leads = response.data?.data || [];
    const lead = leads.find((l: any) => l.email?.toLowerCase() === email.toLowerCase());
    return lead?.id ?? null;
  } catch (error: any) {
    if (__DEV__) console.log('📢 [CAMPANHA] Erro ao buscar leadId:', error?.message);
    return null;
  }
}

/**
 * Solicita renovação do voucher expirado
 * Busca o leadId pelo email e chama PUT /renovar-voucher/{leadId}
 * Invalida o cache para forçar recarga dos dados
 */
export async function renewVoucher(email: string): Promise<CampaignVoucherResponse> {
  try {
    const leadId = await getLeadIdByEmail(email);
    if (!leadId) {
      return { success: false, message: 'Não foi possível identificar seu cadastro na campanha.' };
    }

    const response = await axios.put(`${CAMPAIGN_API_URL}/renovar-voucher/${leadId}`, null, {
      headers: { accept: '*/*' },
      timeout: 15000,
    });

    // Invalidar cache para forçar recarga
    cachedVoucher = null;

    if (response.data) {
      // Após renovar, buscar dados atualizados do voucher
      const updated = await checkCampaignVoucher(email);
      if (updated.success) {
        return updated;
      }

      return {
        success: true,
        message: response.data.mensagem || 'Voucher renovado com sucesso!',
        validade: response.data.novaValidade,
      };
    }

    return { success: false, message: 'Não foi possível renovar o voucher.' };
  } catch (error: any) {
    if (__DEV__) console.log('📢 [CAMPANHA] Erro ao renovar voucher:', error?.message);
    const message = error?.response?.data?.message || 'Não foi possível renovar o voucher. Tente novamente mais tarde.';
    return { success: false, message };
  }
}
