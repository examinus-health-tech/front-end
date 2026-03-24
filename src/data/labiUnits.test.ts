import { labiUnits, LabiUnit } from './labiUnits';

describe('labiUnits', () => {
  describe('estrutura geral dos dados', () => {
    it('deve exportar um array não vazio', () => {
      expect(Array.isArray(labiUnits)).toBe(true);
      expect(labiUnits.length).toBeGreaterThan(0);
    });

    it('deve conter exatamente 20 unidades', () => {
      expect(labiUnits).toHaveLength(20);
    });
  });

  describe('campos obrigatórios de cada unidade', () => {
    it.each(labiUnits.map((u) => [u.name, u]))('"%s" deve ter todos os campos obrigatórios', (_name, unit) => {
      const u = unit as LabiUnit;
      expect(u.unit_id).toBeDefined();
      expect(typeof u.unit_id).toBe('number');
      expect(u.name).toBeDefined();
      expect(typeof u.name).toBe('string');
      expect(u.name.length).toBeGreaterThan(0);
      expect(u.street).toBeDefined();
      expect(typeof u.street).toBe('string');
      expect(u.number).toBeDefined();
      expect(typeof u.number).toBe('string');
      expect(u.cep).toBeDefined();
      expect(u.cep).toMatch(/^\d{5}-\d{3}$/);
      expect(u.neighborhood).toBeDefined();
      expect(u.city).toBeDefined();
      expect(u.region).toBeDefined();
      expect(u.hours_weekday).toBeDefined();
      expect(u.hours_saturday).toBeDefined();
    });
  });

  describe('regiões', () => {
    it('deve conter apenas regiões válidas (Grande SP ou Grande ABCD)', () => {
      const validRegions = ['Grande SP', 'Grande ABCD'];
      labiUnits.forEach((unit) => {
        expect(validRegions).toContain(unit.region);
      });
    });

    it('deve conter 17 unidades da região Grande SP', () => {
      const grandeSP = labiUnits.filter((u) => u.region === 'Grande SP');
      expect(grandeSP).toHaveLength(17);
    });

    it('deve conter 3 unidades da região Grande ABCD', () => {
      const grandeABCD = labiUnits.filter((u) => u.region === 'Grande ABCD');
      expect(grandeABCD).toHaveLength(3);
    });
  });

  describe('IDs únicos', () => {
    it('todos os unit_id devem ser únicos', () => {
      const ids = labiUnits.map((u) => u.unit_id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('unidades específicas conhecidas', () => {
    it('deve conter a unidade Centro - São Paulo', () => {
      const centro = labiUnits.find((u) => u.name === 'Centro - São Paulo');
      expect(centro).toBeDefined();
      expect(centro?.unit_id).toBe(10);
      expect(centro?.city).toBe('São Paulo');
      expect(centro?.region).toBe('Grande SP');
    });

    it('deve conter a unidade Diadema', () => {
      const diadema = labiUnits.find((u) => u.name === 'Diadema');
      expect(diadema).toBeDefined();
      expect(diadema?.unit_id).toBe(19);
      expect(diadema?.city).toBe('Diadema');
      expect(diadema?.region).toBe('Grande ABCD');
    });

    it('deve conter a unidade Santo André', () => {
      const santoAndre = labiUnits.find((u) => u.name === 'Santo André');
      expect(santoAndre).toBeDefined();
      expect(santoAndre?.region).toBe('Grande ABCD');
    });

    it('deve conter a unidade São Bernardo do Campo', () => {
      const sbc = labiUnits.find((u) => u.name === 'São Bernardo do Campo');
      expect(sbc).toBeDefined();
      expect(sbc?.region).toBe('Grande ABCD');
    });

    it('deve conter a unidade Guarulhos', () => {
      const guarulhos = labiUnits.find((u) => u.name === 'Guarulhos');
      expect(guarulhos).toBeDefined();
      expect(guarulhos?.city).toBe('Guarulhos');
    });
  });

  describe('formato de CEP', () => {
    it('todos os CEPs devem seguir o formato XXXXX-XXX', () => {
      labiUnits.forEach((unit) => {
        expect(unit.cep).toMatch(/^\d{5}-\d{3}$/);
      });
    });
  });

  describe('horários de funcionamento', () => {
    it('todos devem ter horário durante a semana definido', () => {
      labiUnits.forEach((unit) => {
        expect(unit.hours_weekday.length).toBeGreaterThan(0);
        expect(unit.hours_weekday).toContain('Seg-Sex');
      });
    });

    it('todos devem ter horário de sábado definido', () => {
      labiUnits.forEach((unit) => {
        expect(unit.hours_saturday.length).toBeGreaterThan(0);
        expect(unit.hours_saturday).toContain('Sáb');
      });
    });
  });
});
