import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { UploadBottomSheetProvider, useUploadBottomSheet } from './UploadBottomSheetContext';

describe('UploadBottomSheetContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UploadBottomSheetProvider>{children}</UploadBottomSheetProvider>
  );

  describe('Estado inicial', () => {
    it('deve iniciar com o bottom sheet fechado', () => {
      const { result } = renderHook(() => useUploadBottomSheet(), { wrapper });
      expect(result.current.isBottomSheetOpen).toBe(false);
    });

    it('deve fornecer funcoes openBottomSheet e closeBottomSheet', () => {
      const { result } = renderHook(() => useUploadBottomSheet(), { wrapper });
      expect(typeof result.current.openBottomSheet).toBe('function');
      expect(typeof result.current.closeBottomSheet).toBe('function');
    });
  });

  describe('openBottomSheet', () => {
    it('deve abrir o bottom sheet', () => {
      const { result } = renderHook(() => useUploadBottomSheet(), { wrapper });

      act(() => {
        result.current.openBottomSheet();
      });

      expect(result.current.isBottomSheetOpen).toBe(true);
    });

    it('deve manter aberto ao chamar openBottomSheet duas vezes', () => {
      const { result } = renderHook(() => useUploadBottomSheet(), { wrapper });

      act(() => {
        result.current.openBottomSheet();
      });
      act(() => {
        result.current.openBottomSheet();
      });

      expect(result.current.isBottomSheetOpen).toBe(true);
    });
  });

  describe('closeBottomSheet', () => {
    it('deve fechar o bottom sheet', () => {
      const { result } = renderHook(() => useUploadBottomSheet(), { wrapper });

      act(() => {
        result.current.openBottomSheet();
      });
      expect(result.current.isBottomSheetOpen).toBe(true);

      act(() => {
        result.current.closeBottomSheet();
      });
      expect(result.current.isBottomSheetOpen).toBe(false);
    });

    it('deve manter fechado ao chamar closeBottomSheet quando ja esta fechado', () => {
      const { result } = renderHook(() => useUploadBottomSheet(), { wrapper });

      act(() => {
        result.current.closeBottomSheet();
      });

      expect(result.current.isBottomSheetOpen).toBe(false);
    });
  });

  describe('Alternancia de estados', () => {
    it('deve alternar corretamente entre abrir e fechar', () => {
      const { result } = renderHook(() => useUploadBottomSheet(), { wrapper });

      expect(result.current.isBottomSheetOpen).toBe(false);

      act(() => {
        result.current.openBottomSheet();
      });
      expect(result.current.isBottomSheetOpen).toBe(true);

      act(() => {
        result.current.closeBottomSheet();
      });
      expect(result.current.isBottomSheetOpen).toBe(false);

      act(() => {
        result.current.openBottomSheet();
      });
      expect(result.current.isBottomSheetOpen).toBe(true);
    });
  });

  describe('useUploadBottomSheet fora do provider', () => {
    it('deve retornar contexto vazio quando usado fora do provider (objeto vazio como default)', () => {
      // O contexto default e um objeto vazio, entao nao lanca erro
      // mas as funcoes nao estarao disponiveis
      const { result } = renderHook(() => useUploadBottomSheet());
      // O context retorna {} as default, entao isBottomSheetOpen sera undefined
      expect(result.current.isBottomSheetOpen).toBeUndefined();
    });
  });
});
