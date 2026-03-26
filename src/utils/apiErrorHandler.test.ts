import { parseApiError, getErrorSeverity } from './apiErrorHandler';

describe('parseApiError', () => {
  // ---- Erro com mensagem na resposta da API ----
  describe('erro com mensagem na resposta da API', () => {
    it('deve retornar a mensagem do data.message', () => {
      const error = {
        response: {
          data: { message: 'Email já cadastrado' },
        },
      };
      expect(parseApiError(error)).toBe('Email já cadastrado');
    });
  });

  // ---- Erro de validação com array de erros ----
  describe('erro de validação com array de erros', () => {
    it('deve concatenar mensagens de múltiplos erros', () => {
      const error = {
        response: {
          data: {
            errors: [
              { message: 'Nome é obrigatório' },
              { message: 'Email inválido' },
            ],
          },
        },
      };
      expect(parseApiError(error)).toBe('Nome é obrigatório, Email inválido');
    });

    it('deve retornar mensagem única quando há apenas um erro', () => {
      const error = {
        response: {
          data: {
            errors: [{ message: 'Campo obrigatório' }],
          },
        },
      };
      expect(parseApiError(error)).toBe('Campo obrigatório');
    });
  });

  // ---- Erro de rede ----
  describe('erro de rede', () => {
    it('deve retornar mensagem de erro de conexão para NETWORK_ERROR', () => {
      const error = { code: 'NETWORK_ERROR' };
      expect(parseApiError(error)).toBe('Erro de conexão. Verifique sua internet.');
    });
  });

  // ---- Erro de timeout ----
  describe('erro de timeout', () => {
    it('deve retornar mensagem de timeout para TIMEOUT', () => {
      const error = { code: 'TIMEOUT' };
      expect(parseApiError(error)).toBe('Tempo limite excedido. Tente novamente.');
    });
  });

  // ---- Erros HTTP específicos ----
  describe('erros HTTP por status code', () => {
    it('deve retornar mensagem para status 400', () => {
      const error = { response: { status: 400, data: {} } };
      expect(parseApiError(error)).toBe('Dados inválidos enviados');
    });

    it('deve retornar mensagem para status 401', () => {
      const error = { response: { status: 401, data: {} } };
      expect(parseApiError(error)).toBe('Credenciais inválidas');
    });

    it('deve retornar mensagem para status 403', () => {
      const error = { response: { status: 403, data: {} } };
      expect(parseApiError(error)).toBe('Acesso negado');
    });

    it('deve retornar mensagem para status 404', () => {
      const error = { response: { status: 404, data: {} } };
      expect(parseApiError(error)).toBe('Recurso não encontrado');
    });

    it('deve retornar mensagem para status 422', () => {
      const error = { response: { status: 422, data: {} } };
      expect(parseApiError(error)).toBe('Dados de entrada inválidos');
    });

    it('deve retornar mensagem para status 429', () => {
      const error = { response: { status: 429, data: {} } };
      expect(parseApiError(error)).toBe('Muitas tentativas. Tente novamente mais tarde');
    });

    it('deve retornar mensagem para status 500', () => {
      const error = { response: { status: 500, data: {} } };
      expect(parseApiError(error)).toBe('Erro interno do servidor');
    });

    it('deve retornar mensagem para status 503', () => {
      const error = { response: { status: 503, data: {} } };
      expect(parseApiError(error)).toBe('Serviço temporariamente indisponível');
    });

    it('deve retornar mensagem genérica para status desconhecido', () => {
      const error = { response: { status: 418, statusText: 'I\'m a teapot', data: {} } };
      expect(parseApiError(error)).toBe("Erro 418: I'm a teapot");
    });

    it('deve retornar "Erro desconhecido" quando statusText é vazio', () => {
      const error = { response: { status: 418, statusText: '', data: {} } };
      expect(parseApiError(error)).toBe('Erro 418: Erro desconhecido');
    });
  });

  // ---- Erro JavaScript padrão ----
  describe('erro JavaScript padrão', () => {
    it('deve retornar message de um Error nativo', () => {
      const error = new Error('Algo deu errado');
      expect(parseApiError(error)).toBe('Algo deu errado');
    });

    it('deve retornar message de TypeError', () => {
      const error = new TypeError('Cannot read property x');
      expect(parseApiError(error)).toBe('Cannot read property x');
    });
  });

  // ---- Fallback ----
  describe('fallback para erro desconhecido', () => {
    it('deve retornar mensagem padrão para null', () => {
      expect(parseApiError(null)).toBe('Erro desconhecido. Tente novamente.');
    });

    it('deve retornar mensagem padrão para undefined', () => {
      expect(parseApiError(undefined)).toBe('Erro desconhecido. Tente novamente.');
    });

    it('deve retornar mensagem padrão para string', () => {
      expect(parseApiError('algum erro')).toBe('Erro desconhecido. Tente novamente.');
    });

    it('deve retornar mensagem padrão para número', () => {
      expect(parseApiError(42)).toBe('Erro desconhecido. Tente novamente.');
    });

    it('deve retornar mensagem padrão para objeto vazio', () => {
      expect(parseApiError({})).toBe('Erro desconhecido. Tente novamente.');
    });
  });

  // ---- Prioridade: data.message deve vir antes de status code ----
  describe('prioridade de mensagem', () => {
    it('deve priorizar data.message sobre status code', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Mensagem customizada do backend' },
        },
      };
      expect(parseApiError(error)).toBe('Mensagem customizada do backend');
    });
  });
});

describe('getErrorSeverity', () => {
  it('deve retornar "error" para status >= 500', () => {
    expect(getErrorSeverity({ response: { status: 500 } })).toBe('error');
    expect(getErrorSeverity({ response: { status: 503 } })).toBe('error');
    expect(getErrorSeverity({ response: { status: 502 } })).toBe('error');
  });

  it('deve retornar "warning" para status >= 400 e < 500', () => {
    expect(getErrorSeverity({ response: { status: 400 } })).toBe('warning');
    expect(getErrorSeverity({ response: { status: 401 } })).toBe('warning');
    expect(getErrorSeverity({ response: { status: 403 } })).toBe('warning');
    expect(getErrorSeverity({ response: { status: 404 } })).toBe('warning');
    expect(getErrorSeverity({ response: { status: 422 } })).toBe('warning');
    expect(getErrorSeverity({ response: { status: 429 } })).toBe('warning');
    expect(getErrorSeverity({ response: { status: 499 } })).toBe('warning');
  });

  it('deve retornar "error" quando não há status (erro genérico)', () => {
    expect(getErrorSeverity({})).toBe('error');
    expect(getErrorSeverity(null)).toBe('error');
    expect(getErrorSeverity(undefined)).toBe('error');
    expect(getErrorSeverity(new Error('Erro'))).toBe('error');
  });

  it('deve retornar "error" para status < 400 (sem tratamento especial)', () => {
    // Status < 400 não entra em nenhum branch de status, cai no default
    expect(getErrorSeverity({ response: { status: 200 } })).toBe('error');
    expect(getErrorSeverity({ response: { status: 301 } })).toBe('error');
  });
});
