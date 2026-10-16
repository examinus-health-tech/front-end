// Escala global de fonte do app.
//
// O NativeBase resolve `fontSize={14}` / `lineHeight={18}` consultando
// `theme.fontSizes[14]` / `theme.lineHeights[18]` (lodash.get) e só usa o número
// cru quando a chave não existe. Por isso basta gerar o tema com chaves numéricas
// já escaladas para que TODO texto NativeBase acompanhe a preferência do usuário,
// sem alterar os componentes.

export type FontScaleOption = {
  id: string;
  label: string;
  scale: number;
};

export const FONT_SCALE_OPTIONS: FontScaleOption[] = [
  { id: 'default', label: 'Padrão', scale: 1 },
  { id: 'large', label: 'Grande', scale: 1.15 },
  { id: 'xlarge', label: 'Muito grande', scale: 1.3 },
];

export const DEFAULT_FONT_SCALE = 1;
export const MAX_FONT_SCALE = 1.3;

// Quanto do aumento aplicar conforme o tamanho: texto de leitura escala 100%,
// títulos grandes escalam parcialmente e números de destaque (gauge, displays)
// ficam fixos para não estourar o layout.
export function fontScaleWeight(size: number): number {
  if (size <= 20) return 1;
  if (size >= 40) return 0;
  return (40 - size) / 20;
}

function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function scaleFontSize(size: number, scale: number): number {
  if (scale === 1) return size;
  return roundHalf(size * (1 + (scale - 1) * fontScaleWeight(size)));
}

// lineHeight acompanha o peso do fontSize que ele costuma acompanhar (~1.3x),
// senão o texto aumentado fica cortado.
export function scaleLineHeight(lineHeight: number, scale: number): number {
  if (scale === 1) return lineHeight;
  return roundHalf(lineHeight * (1 + (scale - 1) * fontScaleWeight(lineHeight / 1.3)));
}

// Tokens do NativeBase (defaults + overrides do tema).
const FONT_SIZE_TOKENS: Record<string, number> = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
};

// Valores numéricos usados no código que não são inteiros.
const EXTRA_NUMERIC_VALUES = [19.2, 22.4, 25.6];

function numericKeys(): number[] {
  const keys: number[] = [];
  for (let n = 6; n <= 200; n++) keys.push(n);
  return keys.concat(EXTRA_NUMERIC_VALUES);
}

export function buildFontSizes(scale: number): Record<string, number> {
  const sizes: Record<string, number> = {};
  for (const [token, value] of Object.entries(FONT_SIZE_TOKENS)) {
    sizes[token] = scaleFontSize(value, scale);
  }
  for (const n of numericKeys()) {
    sizes[String(n)] = scaleFontSize(n, scale);
  }
  return sizes;
}

// Os tokens de lineHeight do NativeBase são em `em` e já escalam junto com o
// fontSize resolvido; aqui só entram as chaves numéricas.
export function buildLineHeights(scale: number): Record<string, number> {
  const heights: Record<string, number> = {};
  for (const n of numericKeys()) {
    heights[String(n)] = scaleLineHeight(n, scale);
  }
  return heights;
}

export function clampFontScale(scale: number): number {
  if (!Number.isFinite(scale)) return DEFAULT_FONT_SCALE;
  return Math.min(Math.max(scale, 1), MAX_FONT_SCALE);
}

// Para os poucos textos fora do NativeBase (StyleSheet / style={{ fontSize }}).
export function scaleStyleFontSize(size: number, scale: number): number {
  return scaleFontSize(size, clampFontScale(scale));
}
