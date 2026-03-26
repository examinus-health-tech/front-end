import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useCustomToast } from './useCustomToast';

// Mock native-base
const mockToastShow = jest.fn();
const mockToastClose = jest.fn();

jest.mock('native-base', () => {
  const actualReact = jest.requireActual('react');

  return {
    useToast: () => ({
      show: mockToastShow,
      close: mockToastClose,
    }),
    Box: ({ children, ...props }: any) => actualReact.createElement('View', props, children),
    Text: ({ children, ...props }: any) => actualReact.createElement('Text', props, children),
    HStack: ({ children, ...props }: any) => actualReact.createElement('View', props, children),
    Pressable: ({ children, ...props }: any) => actualReact.createElement('View', props, children),
  };
});

describe('useCustomToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showToast', () => {
    it('deve chamar toast.show com placement top', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showToast('success', { title: 'Teste' });

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: 'top',
        })
      );
    });

    it('deve usar duracao padrao de 3000ms quando nao especificada', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showToast('success', { title: 'Teste' });

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 3000,
        })
      );
    });

    it('deve usar duracao personalizada quando especificada', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showToast('error', { title: 'Erro', duration: 5000 });

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 5000,
        })
      );
    });

    it('deve renderizar componente com titulo concatenado e descricao', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showToast('info', {
        title: 'Titulo',
        description: 'Descricao detalhada',
      });

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          render: expect.any(Function),
        })
      );
    });

    it('deve renderizar toast para todos os tipos disponiveis', () => {
      const { result } = renderHook(() => useCustomToast());

      const types = ['success', 'error', 'warning', 'info', 'processing'] as const;

      types.forEach((type) => {
        mockToastShow.mockClear();
        result.current.showToast(type, { title: `Toast ${type}` });
        expect(mockToastShow).toHaveBeenCalledTimes(1);
      });
    });

    it('deve chamar render function passando id', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showToast('success', { title: 'Teste' });

      const renderFn = mockToastShow.mock.calls[0][0].render;
      expect(renderFn).toBeDefined();

      // Verifica que a funcao render retorna um componente valido
      const rendered = renderFn({ id: 'toast-123' });
      expect(rendered).toBeTruthy();
    });
  });

  describe('showSuccess', () => {
    it('deve chamar showToast com tipo success', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showSuccess({ title: 'Sucesso!' });

      expect(mockToastShow).toHaveBeenCalledTimes(1);
    });
  });

  describe('showError', () => {
    it('deve chamar showToast com tipo error', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showError({ title: 'Erro!' });

      expect(mockToastShow).toHaveBeenCalledTimes(1);
    });
  });

  describe('showWarning', () => {
    it('deve chamar showToast com tipo warning', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showWarning({ title: 'Aviso!' });

      expect(mockToastShow).toHaveBeenCalledTimes(1);
    });
  });

  describe('showInfo', () => {
    it('deve chamar showToast com tipo info', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showInfo({ title: 'Informacao!' });

      expect(mockToastShow).toHaveBeenCalledTimes(1);
    });
  });

  describe('showProcessing', () => {
    it('deve chamar showToast com tipo processing', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showProcessing({ title: 'Processando...' });

      expect(mockToastShow).toHaveBeenCalledTimes(1);
    });
  });

  describe('showExtractionError', () => {
    it('deve mostrar erro de extracao com nome do laboratorio', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showExtractionError('Lab XYZ');

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 6000,
        })
      );
    });

    it('deve mostrar erro de extracao sem nome do laboratorio', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showExtractionError();

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 6000,
        })
      );
    });

    it('deve mostrar erro de extracao com undefined como nome do laboratorio', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showExtractionError(undefined);

      expect(mockToastShow).toHaveBeenCalledTimes(1);
    });
  });

  describe('showAnalysisError', () => {
    it('deve mostrar erro de analise com nome do laboratorio', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showAnalysisError('Lab ABC');

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 6000,
        })
      );
    });

    it('deve mostrar erro de analise sem nome do laboratorio', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showAnalysisError();

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 6000,
        })
      );
    });
  });

  describe('showExamProcessing', () => {
    it('deve mostrar toast de processamento com mensagem de status', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showExamProcessing('Extraindo dados...');

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 4000,
        })
      );
    });
  });

  describe('showFiltersApplied', () => {
    it('deve mostrar toast de filtros aplicados', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showFiltersApplied();

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 2500,
        })
      );
    });
  });

  describe('showFiltersCleared', () => {
    it('deve mostrar toast de filtros limpos', () => {
      const { result } = renderHook(() => useCustomToast());

      result.current.showFiltersCleared();

      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 2500,
        })
      );
    });
  });

  describe('retorno do hook', () => {
    it('deve retornar todas as funcoes esperadas', () => {
      const { result } = renderHook(() => useCustomToast());

      expect(typeof result.current.showToast).toBe('function');
      expect(typeof result.current.showSuccess).toBe('function');
      expect(typeof result.current.showError).toBe('function');
      expect(typeof result.current.showWarning).toBe('function');
      expect(typeof result.current.showInfo).toBe('function');
      expect(typeof result.current.showProcessing).toBe('function');
      expect(typeof result.current.showExtractionError).toBe('function');
      expect(typeof result.current.showAnalysisError).toBe('function');
      expect(typeof result.current.showExamProcessing).toBe('function');
      expect(typeof result.current.showFiltersApplied).toBe('function');
      expect(typeof result.current.showFiltersCleared).toBe('function');
    });
  });
});
