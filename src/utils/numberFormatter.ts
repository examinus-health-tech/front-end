/**
 * Formata valores de exames com casas decimais e pontos de milhar
 * Exemplos:
 * - 4330 -> 4.330
 * - 130 -> 130
 * - 13.2 -> 13,2
 * - 0.45 -> 0,45
 * - 0.9 -> 0,9
 * - .9 -> 0,9
 */
export function formatExamValue(value: number | string | null | undefined): string {
  // Se valor for null ou undefined, retornar string vazia
  if (value === null || value === undefined) {
    return '';
  }

  // Converter para string para análise
  const originalStr = String(value).trim();

  // Se string vazia, retornar
  if (originalStr === '') {
    return '';
  }

  // Tratar valores inválidos que são apenas pontos, vírgulas ou símbolos sem números
  // Ex: ".", "..", ",", etc. - são valores inválidos que devem ser tratados como vazios
  if (/^[.,\s]+$/.test(originalStr)) {
    console.warn(`[formatExamValue] Valor inválido detectado: "${originalStr}"`);
    return '--';
  }

  // Tratar valores que começam com ponto (ex: ".9" -> "0.9")
  const normalizedStr = originalStr.startsWith('.') ? `0${originalStr}` : originalStr;

  // Converter para numero
  const numValue = parseFloat(normalizedStr);

  // Se nao for numero valido, retornar como string original (pode ser qualitativo como "Negativo")
  if (isNaN(numValue)) {
    return originalStr;
  }

  // Se for numero inteiro >= 1000, adicionar separador de milhar
  if (Number.isInteger(numValue) && numValue >= 1000) {
    return numValue.toLocaleString('pt-BR');
  }

  // Determinar casas decimais baseado no valor normalizado
  const decimalPart = normalizedStr.includes('.') ? normalizedStr.split('.')[1] : '';
  const decimalPlaces = decimalPart.length;

  // Se o valor é decimal (tem ponto ou não é inteiro), preservar decimais
  if (decimalPlaces > 0 || !Number.isInteger(numValue)) {
    // Garantir pelo menos 1 casa decimal para valores decimais
    const minDecimals = Math.max(decimalPlaces, 1);
    return numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: Math.min(minDecimals, 2),
      maximumFractionDigits: 2,
    });
  }

  // Numero inteiro simples
  return numValue.toLocaleString('pt-BR');
}
