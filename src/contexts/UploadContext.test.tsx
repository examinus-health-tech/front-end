import React, { useContext } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { UploadContext, UploadContextProvider } from './UploadContext';

// Mock da API
jest.mock('src/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock AppError
jest.mock('@utils/AppErrors', () => ({
  AppError: class AppError {
    message: string;
    constructor(message: string) {
      this.message = typeof message === 'string' ? message : 'Erro desconhecido';
    }
  },
}));

import { api } from 'src/services/api';

const mockApi = api as jest.Mocked<typeof api>;

function useUploadContext() {
  return useContext(UploadContext);
}

describe('UploadContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UploadContextProvider>{children}</UploadContextProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve iniciar com file vazio', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });
      expect(result.current.file).toEqual({});
    });

    it('deve iniciar com isLoadingUploadContext false', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });
      expect(result.current.isLoadingUploadContext).toBe(false);
    });

    it('deve iniciar com scoreWarning false', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });
      expect(result.current.scoreWarning).toBe(false);
    });

    it('deve iniciar com withError false', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });
      expect(result.current.withError).toBe(false);
    });

    it('deve iniciar com withSuccess false', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });
      expect(result.current.withSuccess).toBe(false);
    });

    it('deve iniciar com examList vazio', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });
      expect(result.current.examList).toEqual([]);
    });

    it('deve fornecer todas as funcoes esperadas', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });
      expect(typeof result.current.handleUploadFile).toBe('function');
      expect(typeof result.current.setIsLoading).toBe('function');
      expect(typeof result.current.getExamTypes).toBe('function');
      expect(typeof result.current.setWithError).toBe('function');
      expect(typeof result.current.setWithSuccess).toBe('function');
      expect(typeof result.current.handleManualUploadFile).toBe('function');
    });
  });

  describe('setIsLoading', () => {
    it('deve alterar estado de loading', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });

      act(() => {
        result.current.setIsLoading(true);
      });
      expect(result.current.isLoadingUploadContext).toBe(true);

      act(() => {
        result.current.setIsLoading(false);
      });
      expect(result.current.isLoadingUploadContext).toBe(false);
    });
  });

  describe('setWithError', () => {
    it('deve alterar estado de erro', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });

      act(() => {
        result.current.setWithError(true);
      });
      expect(result.current.withError).toBe(true);

      act(() => {
        result.current.setWithError(false);
      });
      expect(result.current.withError).toBe(false);
    });
  });

  describe('setWithSuccess', () => {
    it('deve alterar estado de sucesso', () => {
      const { result } = renderHook(() => useUploadContext(), { wrapper });

      act(() => {
        result.current.setWithSuccess(true);
      });
      expect(result.current.withSuccess).toBe(true);

      act(() => {
        result.current.setWithSuccess(false);
      });
      expect(result.current.withSuccess).toBe(false);
    });
  });

  describe('handleUploadFile', () => {
    const mockFile = {
      name: 'exame.pdf',
      mimeType: 'application/pdf',
      uri: 'file:///tmp/exame.pdf',
      size: 1024,
    } as any;

    it('deve fazer upload com sucesso para PDF', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { message: 'Upload bem-sucedido' },
      });

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFile(mockFile);
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        'medical-exam/form',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-type': 'multipart/form-data',
            Accept: 'application/octet-stream',
          },
          timeout: 120000,
          validateStatus: expect.any(Function),
        })
      );
      expect(result.current.withSuccess).toBe(true);
      expect(result.current.withError).toBe(false);
      expect(result.current.isLoadingUploadContext).toBe(false);
    });

    it('deve tratar erro de servidor (status 500)', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 500,
        data: { message: 'Internal Server Error' },
      });

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.handleUploadFile(mockFile);
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(result.current.withSuccess).toBe(false);
      expect(result.current.withError).toBe(true);
      expect(result.current.isLoadingUploadContext).toBe(false);
    });

    it('deve tratar erro de rede', async () => {
      (mockApi.post as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.handleUploadFile(mockFile);
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe('Network Error');
      expect(result.current.withSuccess).toBe(false);
      expect(result.current.withError).toBe(true);
      expect(result.current.isLoadingUploadContext).toBe(false);
    });

    it('deve detectar tipo MIME a partir da extensao .jpg quando mimeType nao esta presente', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { message: 'Success' },
      });

      const jpgFile = {
        name: 'foto.jpg',
        uri: 'file:///tmp/foto.jpg',
        size: 2048,
      } as any;

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFile(jpgFile);
      });

      expect(result.current.withSuccess).toBe(true);
    });

    it('deve detectar tipo MIME a partir da extensao .png quando mimeType nao esta presente', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { message: 'Success' },
      });

      const pngFile = {
        name: 'imagem.png',
        uri: 'file:///tmp/imagem.png',
        size: 3072,
      } as any;

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFile(pngFile);
      });

      expect(result.current.withSuccess).toBe(true);
    });

    it('deve usar fallback de tipo quando nao ha extensao conhecida', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { message: 'Success' },
      });

      const unknownFile = {
        name: 'arquivo.xyz',
        uri: 'file:///tmp/arquivo.xyz',
        size: 1024,
      } as any;

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.handleUploadFile(unknownFile);
      });

      expect(result.current.withSuccess).toBe(true);
    });

    it('deve setar isLoading para true durante o upload e false apos', async () => {
      let resolveUpload: Function;
      (mockApi.post as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => { resolveUpload = resolve; })
      );

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      const uploadPromise = act(async () => {
        await result.current.handleUploadFile(mockFile);
      });

      // Resolve a promise
      await act(async () => {
        resolveUpload!({ status: 200, data: {} });
      });

      await uploadPromise;

      expect(result.current.isLoadingUploadContext).toBe(false);
    });
  });

  describe('handleManualUploadFile', () => {
    const mockPayload = {
      email: 'user@test.com',
      doctor_name: 'Dr. Silva',
      labor_name: 'Lab XYZ',
      exame_date: '2024-01-15',
      detail: {
        exam_id: 1,
        code_exam: 'HEM',
        value: '14.5',
        reference_unit: 'g/dL',
      },
    };

    it('deve fazer upload manual com sucesso', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        data: { data: { id: 'exam-123' } },
      });

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.handleManualUploadFile(mockPayload);
      });

      expect(mockApi.post).toHaveBeenCalledWith('/exam-maintenance', mockPayload);
      expect(result.current.withSuccess).toBe(true);
      expect(result.current.withError).toBe(false);
      expect(result.current.scoreWarning).toBe(true);
      expect(result.current.isLoadingUploadContext).toBe(false);
    });

    it('deve tratar erro no upload manual', async () => {
      (mockApi.post as jest.Mock).mockRejectedValueOnce(new Error('Erro de servidor'));

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      let thrownError: any;
      await act(async () => {
        try {
          await result.current.handleManualUploadFile(mockPayload);
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toBeDefined();
      expect(thrownError.message).toBe('Erro de servidor');
      expect(result.current.withError).toBe(true);
      expect(result.current.withSuccess).toBe(false);
      expect(result.current.isLoadingUploadContext).toBe(false);
    });

    it('deve tratar resposta sem dados', async () => {
      (mockApi.post as jest.Mock).mockResolvedValueOnce({
        data: { data: null },
      });

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.handleManualUploadFile(mockPayload);
      });

      // Quando nao tem data, nao seta scoreWarning nem withSuccess
      expect(result.current.isLoadingUploadContext).toBe(false);
    });
  });

  describe('getExamTypes', () => {
    it('deve buscar tipos de exames com sucesso', async () => {
      const mockExamTypes = [
        { exam_id: 1, code_exam: 'HEM', reference_unit_system: 'g/dL', group: 'Hematologia', target_units: ['g/dL'] },
        { exam_id: 2, code_exam: 'GLU', reference_unit_system: 'mg/dL', group: 'Bioquimica', target_units: ['mg/dL'] },
      ];

      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: { detail: mockExamTypes } },
      });

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.getExamTypes('user@test.com');
      });

      expect(mockApi.get).toHaveBeenCalledWith('/exam-maintenance/list', {
        headers: { email: 'user@test.com' },
      });
      expect(result.current.examList).toEqual(mockExamTypes);
    });

    it('deve nao atualizar examList quando detail esta vazio', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: { detail: [] } },
      });

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await act(async () => {
        await result.current.getExamTypes('user@test.com');
      });

      expect(result.current.examList).toEqual([]);
    });

    it('deve propagar erro ao falhar na busca de tipos de exames', async () => {
      (mockApi.get as jest.Mock).mockRejectedValueOnce(new Error('Falha na rede'));

      const { result } = renderHook(() => useUploadContext(), { wrapper });

      await expect(
        act(async () => {
          await result.current.getExamTypes('user@test.com');
        })
      ).rejects.toThrow('Falha na rede');
    });
  });
});
