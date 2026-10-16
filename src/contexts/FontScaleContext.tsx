import { ReactNode, createContext, useCallback, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_FONT_SCALE, clampFontScale } from '../theme/fontScale';

// Preferência do APARELHO (acessibilidade), não do usuário: vale também na tela de
// login e por isso NÃO entra na limpeza do signOut.
//
// Este arquivo não importa nada do NativeBase de propósito: componentes que usam
// useFontScale continuam testáveis com `jest.mock('native-base')`. O provider que
// aplica o tema fica em src/theme/ScaledNativeBaseProvider.tsx.
export const FONT_SCALE_KEY = '@examinus:font_scale';

export async function loadStoredFontScale(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(FONT_SCALE_KEY);
    return raw ? clampFontScale(parseFloat(raw)) : DEFAULT_FONT_SCALE;
  } catch {
    return DEFAULT_FONT_SCALE;
  }
}

export type FontScaleContextDataProps = {
  fontScale: number;
  setFontScale: (scale: number) => Promise<void>;
};

export const FontScaleContext = createContext<FontScaleContextDataProps>({
  fontScale: DEFAULT_FONT_SCALE,
  setFontScale: async () => {},
});

type FontScaleProviderProps = {
  initialScale?: number;
  children: ReactNode;
};

export function FontScaleProvider({ initialScale = DEFAULT_FONT_SCALE, children }: FontScaleProviderProps) {
  const [fontScale, setFontScaleState] = useState(() => clampFontScale(initialScale));

  const setFontScale = useCallback(async (scale: number) => {
    const next = clampFontScale(scale);
    setFontScaleState(next);
    try {
      await AsyncStorage.setItem(FONT_SCALE_KEY, String(next));
    } catch (error) {
      if (__DEV__) console.warn('[FontScale] Erro ao salvar escala de fonte:', error);
    }
  }, []);

  const value = useMemo(() => ({ fontScale, setFontScale }), [fontScale, setFontScale]);

  return <FontScaleContext.Provider value={value}>{children}</FontScaleContext.Provider>;
}
