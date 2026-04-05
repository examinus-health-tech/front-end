// Mock react-native Platform
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

// Precisamos reimportar para cada teste para testar cenários diferentes de __DEV__
// Porém o módulo exporta uma instância singleton, então testamos com __DEV__ = true (padrão do jest)

import { logger } from './debugLogger';

beforeEach(() => {
  // Limpar logs entre testes
  logger.clearLogs();
  jest.clearAllMocks();
});

describe('DebugLogger', () => {
  describe('info', () => {
    it('deve adicionar log de nível INFO', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Mensagem informativa');

      const logs = logger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('[INFO]');
      expect(logs[0]).toContain('Mensagem informativa');
      consoleSpy.mockRestore();
    });

    it('deve incluir contexto na mensagem', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Login realizado', { userId: '123', screen: 'Home' });

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('Context:');
      expect(logs[0]).toContain('"userId":"123"');
      consoleSpy.mockRestore();
    });

    it('deve chamar console.log em modo dev', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Test message');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('warn', () => {
    it('deve adicionar log de nível WARN', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      logger.warn('Alerta importante');

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('[WARN]');
      expect(logs[0]).toContain('Alerta importante');
      consoleSpy.mockRestore();
    });

    it('deve chamar console.warn em modo dev', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      logger.warn('Warning message');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('deve adicionar log de nível ERROR', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('Erro crítico');

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('[ERROR]');
      expect(logs[0]).toContain('Erro crítico');
      consoleSpy.mockRestore();
    });

    it('deve chamar console.error em modo dev', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('Error message');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('deve incluir informação de erro no contexto', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('Falha na API', { error: new Error('timeout') });

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('Context:');
      consoleSpy.mockRestore();
    });
  });

  describe('debug', () => {
    it('deve adicionar log de nível DEBUG', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.debug('Informação de debug');

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('[DEBUG]');
      expect(logs[0]).toContain('Informação de debug');
      consoleSpy.mockRestore();
    });
  });

  describe('network', () => {
    it('deve adicionar log de nível NETWORK', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.network('Requisição enviada', { latency: 200 });

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('[NETWORK]');
      expect(logs[0]).toContain('Requisição enviada');
      consoleSpy.mockRestore();
    });
  });

  describe('auth', () => {
    it('deve adicionar log de nível AUTH', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.auth('Token validado', { isValidToken: true });

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('[AUTH]');
      expect(logs[0]).toContain('Token validado');
      consoleSpy.mockRestore();
    });
  });

  describe('formatação da mensagem', () => {
    it('deve incluir timestamp ISO no log', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Teste timestamp');

      const logs = logger.getRecentLogs(1);
      // ISO timestamp format: YYYY-MM-DDTHH:MM:SS
      expect(logs[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
      consoleSpy.mockRestore();
    });

    it('deve incluir plataforma no log', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Teste plataforma');

      const logs = logger.getRecentLogs(1);
      expect(logs[0]).toContain('[ios]');
      consoleSpy.mockRestore();
    });
  });

  describe('getRecentLogs', () => {
    it('deve retornar os N logs mais recentes', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.info('Log 1');
      logger.info('Log 2');
      logger.info('Log 3');
      logger.warn('Log 4');

      const logs = logger.getRecentLogs(2);
      expect(logs).toHaveLength(2);
      expect(logs[0]).toContain('Log 3');
      expect(logs[1]).toContain('Log 4');

      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('deve usar padrão de 20 quando count não é fornecido', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      for (let i = 0; i < 25; i++) {
        logger.info(`Log ${i}`);
      }

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(20);

      consoleSpy.mockRestore();
    });

    it('deve retornar array vazio quando não há logs', () => {
      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(0);
    });
  });

  describe('clearLogs', () => {
    it('deve limpar todos os logs', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.info('Log 1');
      logger.info('Log 2');

      logger.clearLogs();

      const logs = logger.getRecentLogs();
      expect(logs).toHaveLength(0);
      consoleSpy.mockRestore();
    });
  });

  describe('exportLogs', () => {
    it('deve exportar todos os logs como string separada por newlines', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      logger.info('Primeira mensagem');
      logger.warn('Segunda mensagem');

      const exported = logger.exportLogs();
      expect(exported).toContain('Primeira mensagem');
      expect(exported).toContain('Segunda mensagem');
      expect(exported).toContain('\n');

      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('deve retornar string vazia quando não há logs', () => {
      expect(logger.exportLogs()).toBe('');
    });
  });

  describe('limite máximo de logs', () => {
    it('deve manter no máximo 100 logs (remover os mais antigos)', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Adicionar 105 logs
      for (let i = 0; i < 105; i++) {
        logger.info(`Log número ${i}`);
      }

      // Deve ter apenas 100
      const logs = logger.getRecentLogs(200);
      expect(logs).toHaveLength(100);

      // O primeiro log deve ser o 5 (0-4 foram removidos)
      expect(logs[0]).toContain('Log número 5');
      // O último deve ser o 104
      expect(logs[99]).toContain('Log número 104');

      consoleSpy.mockRestore();
    });
  });
});
