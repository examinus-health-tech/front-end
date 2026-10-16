import { useCallback, useContext } from 'react';
import { FontScaleContext } from '../contexts/FontScaleContext';
import { scaleStyleFontSize } from '../theme/fontScale';

export function useFontScale() {
  const context = useContext(FontScaleContext);

  // Textos NativeBase escalam sozinhos pelo tema. Use `scaleFont` só em
  // style={{ fontSize }} / StyleSheet (RN puro), que não passam pelo tema.
  const scaleFont = useCallback(
    (size: number) => scaleStyleFontSize(size, context.fontScale),
    [context.fontScale],
  );

  return { ...context, scaleFont };
}
