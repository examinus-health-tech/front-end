import {
  FONT_SCALE_OPTIONS,
  MAX_FONT_SCALE,
  buildFontSizes,
  buildLineHeights,
  clampFontScale,
  fontScaleWeight,
  scaleFontSize,
  scaleLineHeight,
  scaleStyleFontSize,
} from './fontScale';

describe('fontScale', () => {
  describe('fontScaleWeight', () => {
    it('texto de leitura (<= 20) escala 100%', () => {
      expect(fontScaleWeight(12)).toBe(1);
      expect(fontScaleWeight(20)).toBe(1);
    });

    it('títulos entre 20 e 40 escalam parcialmente', () => {
      expect(fontScaleWeight(30)).toBe(0.5);
    });

    it('displays grandes (>= 40) não escalam', () => {
      expect(fontScaleWeight(40)).toBe(0);
      expect(fontScaleWeight(80)).toBe(0);
    });
  });

  describe('scaleFontSize', () => {
    it('escala 1 é identidade', () => {
      expect(scaleFontSize(14, 1)).toBe(14);
    });

    it('aplica o fator inteiro em texto de leitura e arredonda em 0.5', () => {
      expect(scaleFontSize(14, 1.3)).toBe(18 /* 18.2 → 18 */);
      expect(scaleFontSize(12, 1.15)).toBe(14 /* 13.8 → 14 */);
    });

    it('mantém fixos os displays grandes (score do gauge)', () => {
      expect(scaleFontSize(64, 1.3)).toBe(64);
    });
  });

  describe('scaleLineHeight', () => {
    it('acompanha o fontSize que costuma acompanhar', () => {
      expect(scaleLineHeight(18, 1)).toBe(18);
      expect(scaleLineHeight(18, 1.3)).toBe(23.5 /* 23.4 → 23.5 */);
    });

    it('lineHeights de displays grandes ficam fixos', () => {
      expect(scaleLineHeight(80, 1.3)).toBe(80);
    });
  });

  describe('buildFontSizes / buildLineHeights', () => {
    it('na escala 1 as chaves numéricas mapeiam para si mesmas', () => {
      const sizes = buildFontSizes(1);
      expect(sizes['14']).toBe(14);
      expect(sizes['19.2']).toBe(19.2);
      expect(sizes.md).toBe(16);
    });

    it('escala chaves numéricas e tokens do NativeBase', () => {
      const sizes = buildFontSizes(1.3);
      expect(sizes['12']).toBe(15.5 /* 15.6 → 15.5 */);
      expect(sizes.sm).toBe(18);
      expect(sizes['72']).toBe(72);
    });

    it('gera lineHeights numéricos escalados (inclui decimais usados no app)', () => {
      const heights = buildLineHeights(1.3);
      expect(heights['16']).toBe(21 /* 20.8 → 21 */);
      expect(heights['25.6']).toBeGreaterThan(25.6);
    });
  });

  describe('clampFontScale', () => {
    it('limita entre 1 e o máximo', () => {
      expect(clampFontScale(0.5)).toBe(1);
      expect(clampFontScale(5)).toBe(MAX_FONT_SCALE);
      expect(clampFontScale(1.15)).toBe(1.15);
    });

    it('valor inválido volta ao padrão', () => {
      expect(clampFontScale(NaN)).toBe(1);
    });
  });

  it('scaleStyleFontSize aplica o clamp', () => {
    expect(scaleStyleFontSize(15, 9)).toBe(scaleFontSize(15, MAX_FONT_SCALE));
  });

  it('as opções oferecidas começam no padrão e respeitam o máximo', () => {
    expect(FONT_SCALE_OPTIONS[0].scale).toBe(1);
    FONT_SCALE_OPTIONS.forEach((o) => expect(o.scale).toBeLessThanOrEqual(MAX_FONT_SCALE));
  });
});
