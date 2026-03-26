import { formatDateToBrazilian, formatDateToBrazilianNoTime } from './dateFormatter';

describe('formatDateToBrazilian', () => {
  describe('datas válidas', () => {
    it('deve formatar data ISO com hora corretamente', () => {
      // Usando uma data com timezone UTC para previsibilidade
      const result = formatDateToBrazilian('2024-01-15T10:30:00');
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} - \d{2}h\d{2}$/);
    });

    it('deve incluir zeros à esquerda no dia e mês', () => {
      const result = formatDateToBrazilian('2024-03-05T08:05:00');
      expect(result).toContain('05');
      expect(result).toContain('03');
    });

    it('deve formatar data com meia-noite', () => {
      const result = formatDateToBrazilian('2024-06-01T00:00:00');
      expect(result).toMatch(/01\/06\/2024 - 00h00/);
    });

    it('deve formatar data com horário 23:59', () => {
      const result = formatDateToBrazilian('2024-12-31T23:59:00');
      expect(result).toContain('23h59');
    });

    it('deve aceitar formato de data simples', () => {
      const result = formatDateToBrazilian('2024-01-15');
      expect(result).toMatch(/\d{2}\/01\/2024/);
    });
  });

  describe('datas inválidas', () => {
    it('deve retornar "Data inválida" para string vazia', () => {
      expect(formatDateToBrazilian('')).toBe('Data inválida');
    });

    it('deve retornar "Data inválida" para string inválida', () => {
      expect(formatDateToBrazilian('não é uma data')).toBe('Data inválida');
    });

    it('deve retornar "Data inválida" para formato incorreto', () => {
      expect(formatDateToBrazilian('abc-def-ghi')).toBe('Data inválida');
    });
  });

  describe('formato de saída', () => {
    it('deve seguir o formato DD/MM/YYYY - HHhMM', () => {
      const result = formatDateToBrazilian('2024-07-20T14:30:00');
      // O formato esperado é DD/MM/YYYY - HHhMM
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} - \d{2}h\d{2}$/);
    });
  });
});

describe('formatDateToBrazilianNoTime', () => {
  describe('datas válidas', () => {
    it('deve formatar data sem horário', () => {
      const result = formatDateToBrazilianNoTime('2024-01-15T10:30:00');
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('deve incluir zeros à esquerda no dia', () => {
      const result = formatDateToBrazilianNoTime('2024-03-05T08:05:00');
      expect(result).toContain('05');
    });

    it('deve formatar mês corretamente', () => {
      const result = formatDateToBrazilianNoTime('2024-12-25');
      expect(result).toContain('12');
      expect(result).toContain('2024');
    });

    it('deve não incluir horário na formatação', () => {
      const result = formatDateToBrazilianNoTime('2024-01-15T10:30:00');
      expect(result).not.toContain('h');
      expect(result).not.toContain('-');
    });
  });

  describe('datas inválidas', () => {
    it('deve retornar "Data inválida" para string vazia', () => {
      expect(formatDateToBrazilianNoTime('')).toBe('Data inválida');
    });

    it('deve retornar "Data inválida" para string inválida', () => {
      expect(formatDateToBrazilianNoTime('texto qualquer')).toBe('Data inválida');
    });

    it('deve retornar "Data inválida" para formato totalmente errado', () => {
      expect(formatDateToBrazilianNoTime('xyz')).toBe('Data inválida');
    });
  });

  describe('formato de saída', () => {
    it('deve seguir o formato DD/MM/YYYY', () => {
      const result = formatDateToBrazilianNoTime('2024-07-20T14:30:00');
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });
});
