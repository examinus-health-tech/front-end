import axios from 'axios';

const CAMPAIGN_API_URL = 'https://campanhaapp-c7gdd2fyarecb5ck.canadacentral-01.azurewebsites.net/api/Campanha';

export interface CampaignVoucherResponse {
  success: boolean;
  voucher?: string;
  message?: string;
}

/**
 * Verifica se o email está em uma campanha e retorna o voucher se existir
 * Esta função é chamada após o cadastro para verificar se o usuário
 * veio através de uma campanha promocional
 */
export async function checkCampaignVoucher(email: string): Promise<CampaignVoucherResponse> {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await axios.get(`${CAMPAIGN_API_URL}/obter-voucher/${encodedEmail}`, {
      headers: {
        'accept': '*/*',
      },
      timeout: 10000, // 10 segundos de timeout
    });

    console.log('📢 [CAMPANHA] Resposta da API:', response.data);

    // A API pode retornar diferentes formatos, vamos tratar
    if (response.data) {
      return {
        success: true,
        voucher: response.data.voucher || response.data.code || response.data,
        message: response.data.message,
      };
    }

    return { success: false };
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
