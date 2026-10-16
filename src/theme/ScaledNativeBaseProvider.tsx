import { ReactNode, useContext, useMemo } from 'react';
import { NativeBaseProvider } from 'native-base';

import { FontScaleContext } from '../contexts/FontScaleContext';
import { buildTheme } from './index';

// NativeBaseProvider com o tema reconstruído a partir da escala atual: trocar a
// preferência "Tamanho da fonte" atualiza todos os textos NativeBase na hora.
export function ScaledNativeBaseProvider({ children }: { children: ReactNode }) {
  const { fontScale } = useContext(FontScaleContext);
  const theme = useMemo(() => buildTheme(fontScale), [fontScale]);

  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
}
