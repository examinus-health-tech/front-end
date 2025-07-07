export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export function parseApiError(error: any): string {
  // Estrutura de erro padrão da API
  if (error?.response?.data) {
    const data = error.response.data;

    // Erro com mensagem específica
    if (data.message) {
      return data.message;
    }

    // Erro de validação com múltiplos campos
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map((err: ApiError) => err.message).join(', ');
    }

    // Erro de validação com campo específico
    if (data.field && data.message) {
      return `${data.field}: ${data.message}`;
    }
  }

  // Erro de rede
  if (error?.code === 'NETWORK_ERROR') {
    return 'Erro de conexão. Verifique sua internet.';
  }

  // Erro de timeout
  if (error?.code === 'TIMEOUT') {
    return 'Tempo limite excedido. Tente novamente.';
  }

  // Status HTTP específicos
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Dados inválidos enviados';
      case 401:
        return 'Credenciais inválidas';
      case 403:
        return 'Acesso negado';
      case 404:
        return 'Recurso não encontrado';
      case 422:
        return 'Dados de entrada inválidos';
      case 429:
        return 'Muitas tentativas. Tente novamente mais tarde';
      case 500:
        return 'Erro interno do servidor';
      case 503:
        return 'Serviço temporariamente indisponível';
      default:
        return `Erro ${error.response.status}: ${error.response.statusText || 'Erro desconhecido'}`;
    }
  }

  // Erro JavaScript padrão
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return 'Erro desconhecido. Tente novamente.';
}

export function getErrorSeverity(error: any): 'error' | 'warning' | 'info' {
  if (error?.response?.status) {
    const status = error.response.status;
    if (status >= 500) return 'error';
    if (status >= 400) return 'warning';
  }
  return 'error';
}
