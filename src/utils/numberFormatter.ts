/**
 * Formata valores de exames com casas decimais e pontos de milhar
 * Exemplos:
 * - 4330 -> 4.330
 * - 130 -> 130
 * - 13.2 -> 13,2
 * - 0.45 -> 0,45
 */
export function formatExamValue(value: number | string): string {
  // Converter para numero se for string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Se nao for numero valido, retornar como string
  if (isNaN(numValue)) {
    return value.toString();
  }

  // Se for numero inteiro >= 1000, adicionar separador de milhar
  if (Number.isInteger(numValue) && numValue >= 1000) {
    return numValue.toLocaleString('pt-BR');
  }

  // Se tiver decimais, formatar com virgula
  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
