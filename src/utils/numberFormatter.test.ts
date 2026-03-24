import { formatExamValue } from './numberFormatter';

describe('formatExamValue', () => {
  // ---- Valores nulos e undefined ----
  describe('valores nulos e undefined', () => {
    it('deve retornar string vazia para null', () => {
      expect(formatExamValue(null)).toBe('');
    });

    it('deve retornar string vazia para undefined', () => {
      expect(formatExamValue(undefined)).toBe('');
    });

    it('deve retornar string vazia para string vazia', () => {
      expect(formatExamValue('')).toBe('');
    });

    it('deve retornar string vazia para string com espaços', () => {
      expect(formatExamValue('   ')).toBe('');
    });
  });

  // ---- Valores inválidos (apenas pontos, vírgulas) ----
  describe('valores inválidos com apenas pontos e vírgulas', () => {
    it('deve retornar "--" para um único ponto', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(formatExamValue('.')).toBe('--');
      warnSpy.mockRestore();
    });

    it('deve retornar "--" para pontos duplos', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(formatExamValue('..')).toBe('--');
      warnSpy.mockRestore();
    });

    it('deve retornar "--" para vírgula', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(formatExamValue(',')).toBe('--');
      warnSpy.mockRestore();
    });

    it('deve retornar "--" para combinação de pontos e vírgulas', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      expect(formatExamValue('.,.')).toBe('--');
      warnSpy.mockRestore();
    });

    it('deve emitir console.warn para valores inválidos', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      formatExamValue('.');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[formatExamValue] Valor inválido detectado')
      );
      warnSpy.mockRestore();
    });
  });

  // ---- Valores que começam com ponto ----
  describe('valores que começam com ponto', () => {
    it('deve formatar ".9" como "0,9"', () => {
      expect(formatExamValue('.9')).toBe('0,9');
    });

    it('deve formatar ".45" como "0,45"', () => {
      expect(formatExamValue('.45')).toBe('0,45');
    });
  });

  // ---- Números inteiros simples ----
  describe('números inteiros simples', () => {
    it('deve formatar 130 como "130"', () => {
      expect(formatExamValue(130)).toBe('130');
    });

    it('deve formatar 0 como "0"', () => {
      expect(formatExamValue(0)).toBe('0');
    });

    it('deve formatar 42 como "42"', () => {
      expect(formatExamValue(42)).toBe('42');
    });

    it('deve formatar 999 como "999"', () => {
      expect(formatExamValue(999)).toBe('999');
    });
  });

  // ---- Números inteiros >= 1000 (separador de milhar) ----
  describe('números inteiros com separador de milhar', () => {
    it('deve formatar 4330 com ponto de milhar', () => {
      const result = formatExamValue(4330);
      // pt-BR usa ponto como separador de milhar
      expect(result).toBe('4.330');
    });

    it('deve formatar 1000 com ponto de milhar', () => {
      expect(formatExamValue(1000)).toBe('1.000');
    });

    it('deve formatar 1000000 com pontos de milhar', () => {
      expect(formatExamValue(1000000)).toBe('1.000.000');
    });
  });

  // ---- Números decimais ----
  describe('números decimais', () => {
    it('deve formatar 13.2 com vírgula', () => {
      expect(formatExamValue(13.2)).toBe('13,2');
    });

    it('deve formatar 0.45 com vírgula', () => {
      expect(formatExamValue(0.45)).toBe('0,45');
    });

    it('deve formatar 0.9 com vírgula', () => {
      expect(formatExamValue(0.9)).toBe('0,9');
    });

    it('deve formatar "13.2" (string) com vírgula', () => {
      expect(formatExamValue('13.2')).toBe('13,2');
    });

    it('deve formatar "0.45" (string) com vírgula', () => {
      expect(formatExamValue('0.45')).toBe('0,45');
    });
  });

  // ---- Valores não numéricos (qualitativos) ----
  describe('valores não numéricos (qualitativos)', () => {
    it('deve retornar "Negativo" para string qualitativa', () => {
      expect(formatExamValue('Negativo')).toBe('Negativo');
    });

    it('deve retornar "Positivo" para string qualitativa', () => {
      expect(formatExamValue('Positivo')).toBe('Positivo');
    });

    it('deve retornar "Reativo" para string qualitativa', () => {
      expect(formatExamValue('Reativo')).toBe('Reativo');
    });

    it('deve retornar texto original para strings não numéricas', () => {
      expect(formatExamValue('abc')).toBe('abc');
    });
  });

  // ---- Valores numéricos como string ----
  describe('valores numéricos como string', () => {
    it('deve formatar string "4330" com ponto de milhar', () => {
      expect(formatExamValue('4330')).toBe('4.330');
    });

    it('deve formatar string "130" como "130"', () => {
      expect(formatExamValue('130')).toBe('130');
    });

    it('deve formatar string "0" como "0"', () => {
      expect(formatExamValue('0')).toBe('0');
    });
  });

  // ---- Limitar casas decimais a 2 ----
  describe('limitação de casas decimais', () => {
    it('deve limitar a 2 casas decimais para valores com mais casas', () => {
      const result = formatExamValue('3.14159');
      // Deve formatar com no máximo 2 casas decimais
      expect(result).toBe('3,14');
    });

    it('deve manter 1 casa decimal mínima para valores decimais', () => {
      expect(formatExamValue('5.0')).toBe('5,0');
    });
  });
});
