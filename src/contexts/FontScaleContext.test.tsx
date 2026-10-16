import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FONT_SCALE_KEY, FontScaleProvider, loadStoredFontScale } from './FontScaleContext';
import { useFontScale } from '../hooks/useFontScale';

function Probe({ onReady }: { onReady: (v: ReturnType<typeof useFontScale>) => void }) {
  const value = useFontScale();
  onReady(value);
  return <Text testID="scale">{String(value.fontScale)}</Text>;
}

describe('FontScaleContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('loadStoredFontScale', () => {
    it('retorna o valor salvo', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('1.15');
      await expect(loadStoredFontScale()).resolves.toBe(1.15);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(FONT_SCALE_KEY);
    });

    it('sem valor salvo usa o padrão', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      await expect(loadStoredFontScale()).resolves.toBe(1);
    });

    it('limita valores fora da faixa', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('3');
      await expect(loadStoredFontScale()).resolves.toBe(1.3);
    });

    it('erro no storage volta ao padrão', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('boom'));
      await expect(loadStoredFontScale()).resolves.toBe(1);
    });
  });

  describe('FontScaleProvider', () => {
    it('expõe a escala inicial', () => {
      const { getByTestId } = render(
        <FontScaleProvider initialScale={1.15}>
          <Probe onReady={() => {}} />
        </FontScaleProvider>,
      );
      expect(getByTestId('scale').props.children).toBe('1.15');
    });

    it('setFontScale atualiza, limita e persiste', async () => {
      let api: ReturnType<typeof useFontScale> | undefined;
      const { getByTestId } = render(
        <FontScaleProvider>
          <Probe onReady={(v) => (api = v)} />
        </FontScaleProvider>,
      );

      await act(async () => {
        await api!.setFontScale(9);
      });

      expect(getByTestId('scale').props.children).toBe('1.3');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(FONT_SCALE_KEY, '1.3');
    });

    it('scaleFont do hook usa a escala atual', () => {
      let api: ReturnType<typeof useFontScale> | undefined;
      render(
        <FontScaleProvider initialScale={1.3}>
          <Probe onReady={(v) => (api = v)} />
        </FontScaleProvider>,
      );
      expect(api!.scaleFont(15)).toBe(19.5);
    });
  });

  it('sem provider o hook usa o padrão (componentes testados isolados não quebram)', () => {
    let api: ReturnType<typeof useFontScale> | undefined;
    render(<Probe onReady={(v) => (api = v)} />);
    expect(api!.fontScale).toBe(1);
    expect(api!.scaleFont(15)).toBe(15);
  });
});
