import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useUpload } from './useUpload';
import { UploadContext } from '../contexts/UploadContext';

describe('useUpload', () => {
  const mockHandleUploadFile = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockGetExamTypes = jest.fn();
  const mockSetWithError = jest.fn();
  const mockSetWithSuccess = jest.fn();
  const mockHandleManualUploadFile = jest.fn();

  const mockFile = {
    name: 'exame.pdf',
    mimeType: 'application/pdf',
    uri: 'file:///path/to/exame.pdf',
    size: 1024000,
  };

  const mockExamList = [
    { id: '1', name: 'Hemograma' },
    { id: '2', name: 'Glicemia' },
  ];

  const mockContextValue = {
    file: mockFile,
    handleUploadFile: mockHandleUploadFile,
    isLoadingUploadContext: false,
    setIsLoading: mockSetIsLoading,
    examList: mockExamList,
    getExamTypes: mockGetExamTypes,
    scoreWarning: false,
    withError: false,
    setWithError: mockSetWithError,
    withSuccess: false,
    setWithSuccess: mockSetWithSuccess,
    handleManualUploadFile: mockHandleManualUploadFile,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UploadContext.Provider value={mockContextValue as any}>
      {children}
    </UploadContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quando usado dentro do UploadContextProvider', () => {
    it('deve retornar o contexto de upload', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('deve retornar dados do arquivo', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(result.current.file).toEqual(mockFile);
    });

    it('deve retornar estado de carregamento', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(result.current.isLoadingUploadContext).toBe(false);
    });

    it('deve retornar lista de tipos de exame', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(result.current.examList).toEqual(mockExamList);
      expect(result.current.examList).toHaveLength(2);
    });

    it('deve retornar estado de scoreWarning', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(result.current.scoreWarning).toBe(false);
    });

    it('deve retornar estado de withError', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(result.current.withError).toBe(false);
    });

    it('deve retornar estado de withSuccess', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(result.current.withSuccess).toBe(false);
    });

    it('deve retornar funcao handleUploadFile', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(typeof result.current.handleUploadFile).toBe('function');
    });

    it('deve retornar funcao setIsLoading', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(typeof result.current.setIsLoading).toBe('function');
    });

    it('deve retornar funcao getExamTypes', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(typeof result.current.getExamTypes).toBe('function');
    });

    it('deve retornar funcao setWithError', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(typeof result.current.setWithError).toBe('function');
    });

    it('deve retornar funcao setWithSuccess', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(typeof result.current.setWithSuccess).toBe('function');
    });

    it('deve retornar funcao handleManualUploadFile', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      expect(typeof result.current.handleManualUploadFile).toBe('function');
    });

    it('deve chamar handleUploadFile com arquivo correto', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      const file = { name: 'novo-exame.pdf', mimeType: 'application/pdf', uri: 'file:///test' };
      result.current.handleUploadFile(file as any);

      expect(mockHandleUploadFile).toHaveBeenCalledWith(file);
    });

    it('deve chamar setIsLoading com valor correto', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      result.current.setIsLoading(true);

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });

    it('deve chamar getExamTypes com email correto', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      result.current.getExamTypes('user@test.com');

      expect(mockGetExamTypes).toHaveBeenCalledWith('user@test.com');
    });

    it('deve chamar setWithError com valor correto', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      result.current.setWithError(true);

      expect(mockSetWithError).toHaveBeenCalledWith(true);
    });

    it('deve chamar setWithSuccess com valor correto', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      result.current.setWithSuccess(true);

      expect(mockSetWithSuccess).toHaveBeenCalledWith(true);
    });

    it('deve chamar handleManualUploadFile com payload correto', () => {
      const { result } = renderHook(() => useUpload(), { wrapper });

      const payload = {
        email: 'user@test.com',
        doctor_name: 'Dr. Silva',
        labor_name: 'Lab ABC',
      };
      result.current.handleManualUploadFile(payload as any);

      expect(mockHandleManualUploadFile).toHaveBeenCalledWith(payload);
    });
  });

  describe('quando usado fora do UploadContextProvider', () => {
    it('deve retornar contexto padrao vazio quando usado fora do UploadContextProvider', () => {
      // O UploadContext e criado com {} como valor padrao, entao nao lanca erro
      // mas retorna um objeto vazio sem as propriedades esperadas
      // Suprime console.log do useUpload
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const { result } = renderHook(() => useUpload());

      expect(result.current).toBeDefined();
      expect(result.current.file).toBeUndefined();

      logSpy.mockRestore();
    });
  });

  describe('com diferentes estados de contexto', () => {
    it('deve retornar isLoadingUploadContext true durante upload', () => {
      const loadingContext = {
        ...mockContextValue,
        isLoadingUploadContext: true,
      };

      const loadingWrapper = ({ children }: { children: React.ReactNode }) => (
        <UploadContext.Provider value={loadingContext as any}>
          {children}
        </UploadContext.Provider>
      );

      const { result } = renderHook(() => useUpload(), { wrapper: loadingWrapper });

      expect(result.current.isLoadingUploadContext).toBe(true);
    });

    it('deve retornar withError true quando ha erro', () => {
      const errorContext = {
        ...mockContextValue,
        withError: true,
      };

      const errorWrapper = ({ children }: { children: React.ReactNode }) => (
        <UploadContext.Provider value={errorContext as any}>
          {children}
        </UploadContext.Provider>
      );

      const { result } = renderHook(() => useUpload(), { wrapper: errorWrapper });

      expect(result.current.withError).toBe(true);
    });

    it('deve retornar withSuccess true quando upload bem sucedido', () => {
      const successContext = {
        ...mockContextValue,
        withSuccess: true,
      };

      const successWrapper = ({ children }: { children: React.ReactNode }) => (
        <UploadContext.Provider value={successContext as any}>
          {children}
        </UploadContext.Provider>
      );

      const { result } = renderHook(() => useUpload(), { wrapper: successWrapper });

      expect(result.current.withSuccess).toBe(true);
    });

    it('deve retornar scoreWarning true quando aviso ativo', () => {
      const warningContext = {
        ...mockContextValue,
        scoreWarning: true,
      };

      const warningWrapper = ({ children }: { children: React.ReactNode }) => (
        <UploadContext.Provider value={warningContext as any}>
          {children}
        </UploadContext.Provider>
      );

      const { result } = renderHook(() => useUpload(), { wrapper: warningWrapper });

      expect(result.current.scoreWarning).toBe(true);
    });

    it('deve retornar lista vazia de examList quando nao ha tipos', () => {
      const emptyContext = {
        ...mockContextValue,
        examList: [],
      };

      const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
        <UploadContext.Provider value={emptyContext as any}>
          {children}
        </UploadContext.Provider>
      );

      const { result } = renderHook(() => useUpload(), { wrapper: emptyWrapper });

      expect(result.current.examList).toEqual([]);
    });

    it('deve retornar arquivo vazio como objeto vazio', () => {
      const noFileContext = {
        ...mockContextValue,
        file: {} as any,
      };

      const noFileWrapper = ({ children }: { children: React.ReactNode }) => (
        <UploadContext.Provider value={noFileContext as any}>
          {children}
        </UploadContext.Provider>
      );

      const { result } = renderHook(() => useUpload(), { wrapper: noFileWrapper });

      expect(result.current.file).toEqual({});
    });
  });
});
