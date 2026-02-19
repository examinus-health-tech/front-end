import axios from 'axios';

const CAMPAIGN_API_URL = 'https://campanhaapp-c7gdd2fyarecb5ck.canadacentral-01.azurewebsites.net/api/Campanha';

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
    console.log('📢 [CAMPANHA] Usando cache do voucher');
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

    console.log('📢 [CAMPANHA] Resposta da API:', response.data);

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
      console.log('📢 [CAMPANHA] Email não está na campanha:', email);
      return { success: false };
    }

    console.log('📢 [CAMPANHA] Erro ao verificar campanha:', error?.message);
    // Não bloquear o fluxo em caso de erro - apenas logar
    return { success: false };
  }
}
