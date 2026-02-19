import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_REVIEWED_KEY = '@examinus:has_reviewed';
const APP_OPEN_COUNT_KEY = '@examinus:app_open_count';
const LAST_REVIEW_PROMPT_KEY = '@examinus:last_review_prompt';

const MIN_OPENS_FOR_REVIEW = 5;
const MIN_DAYS_BETWEEN_PROMPTS = 7; // Não mostrar novamente por 7 dias se o usuário recusar

/**
 * Verifica se o usuário já avaliou o app
 */
export async function hasUserReviewed(): Promise<boolean> {
  try {
    const reviewed = await AsyncStorage.getItem(HAS_REVIEWED_KEY);
    return reviewed === 'true';
  } catch (error) {
    console.error('[REVIEW] Erro ao verificar avaliação:', error);
    return false;
  }
}

/**
 * Marca que o usuário avaliou o app
 */
export async function markAsReviewed(): Promise<void> {
  try {
    await AsyncStorage.setItem(HAS_REVIEWED_KEY, 'true');
    console.log('[REVIEW] Marcado como avaliado');
  } catch (error) {
    console.error('[REVIEW] Erro ao marcar como avaliado:', error);
  }
}

/**
 * Incrementa o contador de aberturas do app
 */
export async function incrementAppOpenCount(): Promise<number> {
  try {
    const countStr = await AsyncStorage.getItem(APP_OPEN_COUNT_KEY);
    const count = countStr ? parseInt(countStr, 10) + 1 : 1;
    await AsyncStorage.setItem(APP_OPEN_COUNT_KEY, count.toString());
    console.log('[REVIEW] App aberto', count, 'vezes');
    return count;
  } catch (error) {
    console.error('[REVIEW] Erro ao incrementar contador:', error);
    return 0;
  }
}

/**
 * Verifica se deve mostrar o prompt de avaliação baseado no número de aberturas
 */
export async function shouldShowReviewPromptOnOpen(): Promise<boolean> {
  try {
    // Já avaliou? Não mostrar
    const reviewed = await hasUserReviewed();
    if (reviewed) {
      return false;
    }

    // Verificar contador de aberturas
    const countStr = await AsyncStorage.getItem(APP_OPEN_COUNT_KEY);
    const count = countStr ? parseInt(countStr, 10) : 0;

    // Mostrar na 5ª abertura, depois a cada 10 aberturas
    if (count === MIN_OPENS_FOR_REVIEW || (count > MIN_OPENS_FOR_REVIEW && count % 10 === 0)) {
      // Verificar se já mostramos recentemente
      const lastPromptStr = await AsyncStorage.getItem(LAST_REVIEW_PROMPT_KEY);
      if (lastPromptStr) {
        const lastPrompt = new Date(lastPromptStr);
        const daysSinceLastPrompt = (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastPrompt < MIN_DAYS_BETWEEN_PROMPTS) {
          return false;
        }
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('[REVIEW] Erro ao verificar prompt:', error);
    return false;
  }
}

/**
 * Verifica se deve mostrar o prompt após uma ação positiva (ex: ver resultado de exame)
 */
export async function shouldShowReviewPromptOnPositiveAction(): Promise<boolean> {
  try {
    // Já avaliou? Não mostrar
    const reviewed = await hasUserReviewed();
    if (reviewed) {
      return false;
    }

    // Verificar se já mostramos recentemente
    const lastPromptStr = await AsyncStorage.getItem(LAST_REVIEW_PROMPT_KEY);
    if (lastPromptStr) {
      const lastPrompt = new Date(lastPromptStr);
      const daysSinceLastPrompt = (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPrompt < MIN_DAYS_BETWEEN_PROMPTS) {
        return false;
      }
    }

    // Verificar se já abriu o app pelo menos 3 vezes (para não incomodar usuários novos)
    const countStr = await AsyncStorage.getItem(APP_OPEN_COUNT_KEY);
    const count = countStr ? parseInt(countStr, 10) : 0;
    if (count < 3) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[REVIEW] Erro ao verificar prompt:', error);
    return false;
  }
}

/**
 * Marca que o prompt foi mostrado (para não mostrar novamente por um tempo)
 */
export async function markReviewPromptShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_REVIEW_PROMPT_KEY, new Date().toISOString());
    console.log('[REVIEW] Prompt de avaliação marcado como mostrado');
  } catch (error) {
    console.error('[REVIEW] Erro ao marcar prompt:', error);
  }
}
