import { AppError } from './AppErrors';

describe('AppError', () => {
  it('deve criar erro a partir de string', () => {
    const error = new AppError('Erro de teste');
    expect(error.message).toBe('Erro de teste');
    expect(error.response).toBeUndefined();
  });

  it('deve criar erro a partir de objeto de resposta', () => {
    const response = {
      data: {
        data: null,
        message: ['Campo obrigatório', 'Email inválido'],
        success: false,
      },
    };
    const error = new AppError(response);
    expect(error.message).toBe('Campo obrigatório, Email inválido');
    expect(error.response).toEqual(response);
  });

  it('deve retornar mensagem padrão quando message array está vazio', () => {
    const response = {
      data: {
        data: null,
        message: [] as string[],
        success: false,
      },
    };
    const error = new AppError(response);
    expect(error.message).toBe('Erro desconhecido');
  });
});
