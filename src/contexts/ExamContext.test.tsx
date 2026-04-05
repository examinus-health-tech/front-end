import React, { useContext } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { ExamContext, ExamContextProvider } from './ExamContext';

// Mock da API
jest.mock('src/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { api } from 'src/services/api';

const mockApi = api as jest.Mocked<typeof api>;

function useExamContext() {
  return useContext(ExamContext);
}

const mockExam1 = {
  medicalExamId: 'exam-1',
  createdDate: '2024-01-15',
  generalScore: 85,
  generalScoreActionRecommendation: 'Manter habitos saudaveis',
  medicalExamGender: 'M',
  medicalExamStatus: 'Processed',
  medicalExamItems: [
    {
      examItemDescription: 'Hemoglobina',
      medicalExamItemReferenceValue: '14.5',
      medicalExamItemMeasureUnit: 'g/dL',
      medicalExamItemScore: 90,
      medicalExamItemWeightSummaryExplanation: 'Normal',
      medicalExamItemWeightActionRecommendation: 'Manter',
      medicalExamItemWeightColor: 'green',
      medicalExamItemWeightDescription: 'Adequado',
    },
  ],
  medicalExamOrganicSystemsScore: [
    {
      examOrganicSystemId: 'sys-1',
      examOrganicSystemDescription: 'Hematologico',
      organicSystemScore: 88,
      organicSystemScoreSummaryExplanation: 'Bom',
      organicSystemScoreActionRecommendation: 'Manter dieta rica em ferro',
    },
  ],
};

const mockExam2 = {
  medicalExamId: 'exam-2',
  createdDate: '2024-02-20',
  generalScore: 72,
  generalScoreActionRecommendation: 'Atentar-se a hidratacao',
  medicalExamGender: 'M',
  medicalExamStatus: 'Processed',
  medicalExamItems: [],
  medicalExamOrganicSystemsScore: [],
};

describe('ExamContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ExamContextProvider>{children}</ExamContextProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve iniciar com examData vazio', () => {
      const { result } = renderHook(() => useExamContext(), { wrapper });
      expect(result.current.examData).toEqual([]);
    });

    it('deve iniciar com examSelected vazio', () => {
      const { result } = renderHook(() => useExamContext(), { wrapper });
      expect(result.current.examSelected).toEqual({});
    });

    it('deve fornecer todas as funcoes esperadas', () => {
      const { result } = renderHook(() => useExamContext(), { wrapper });
      expect(typeof result.current.getExamList).toBe('function');
      expect(typeof result.current.setExamSelected).toBe('function');
      expect(typeof result.current.selectExamById).toBe('function');
      expect(typeof result.current.deleteExam).toBe('function');
      expect(typeof result.current.reprocessExam).toBe('function');
    });
  });

  describe('getExamList', () => {
    it('deve buscar e armazenar lista de exames com sucesso', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      expect(mockApi.get).toHaveBeenCalledWith('/medical-exam/get-all-exams-upload-by-logged-user');
      expect(result.current.examData).toHaveLength(2);
      expect(result.current.examData[0].medicalExamId).toBe('exam-1');
    });

    it('deve propagar erro ao falhar na busca de exames', async () => {
      const error = new Error('Network error');
      (mockApi.get as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await expect(
        act(async () => {
          await result.current.getExamList();
        })
      ).rejects.toThrow('Network error');
    });

    it('deve retornar lista vazia quando API retorna vazio', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [] },
      });

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      expect(result.current.examData).toEqual([]);
    });
  });

  describe('setExamSelected', () => {
    it('deve selecionar um exame', () => {
      const { result } = renderHook(() => useExamContext(), { wrapper });

      act(() => {
        result.current.setExamSelected(mockExam1 as any);
      });

      expect(result.current.examSelected.medicalExamId).toBe('exam-1');
    });

    it('deve substituir exame previamente selecionado', () => {
      const { result } = renderHook(() => useExamContext(), { wrapper });

      act(() => {
        result.current.setExamSelected(mockExam1 as any);
      });
      expect(result.current.examSelected.medicalExamId).toBe('exam-1');

      act(() => {
        result.current.setExamSelected(mockExam2 as any);
      });
      expect(result.current.examSelected.medicalExamId).toBe('exam-2');
    });
  });

  describe('selectExamById', () => {
    it('deve selecionar exame pelo ID quando exames ja estao carregados', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      let found: boolean = false;
      await act(async () => {
        found = await result.current.selectExamById('exam-2');
      });

      expect(found).toBe(true);
      expect(result.current.examSelected.medicalExamId).toBe('exam-2');
    });

    it('deve buscar exames do servidor quando lista esta vazia', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });

      const { result } = renderHook(() => useExamContext(), { wrapper });

      let found: boolean = false;
      await act(async () => {
        found = await result.current.selectExamById('exam-1');
      });

      expect(found).toBe(true);
      expect(mockApi.get).toHaveBeenCalledWith('/medical-exam/get-all-exams-upload-by-logged-user');
      expect(result.current.examSelected.medicalExamId).toBe('exam-1');
    });

    it('deve retornar false quando exame nao e encontrado', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1] },
      });

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      let found: boolean = true;
      await act(async () => {
        found = await result.current.selectExamById('exam-inexistente');
      });

      expect(found).toBe(false);
    });

    it('deve retornar false quando ocorre erro na busca', async () => {
      (mockApi.get as jest.Mock).mockRejectedValueOnce(new Error('Erro de rede'));

      const { result } = renderHook(() => useExamContext(), { wrapper });

      let found: boolean = true;
      await act(async () => {
        found = await result.current.selectExamById('exam-1');
      });

      expect(found).toBe(false);
    });
  });

  describe('deleteExam', () => {
    it('deve deletar exame com sucesso e remover da lista local', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });
      expect(result.current.examData).toHaveLength(2);

      let success: boolean = false;
      await act(async () => {
        success = await result.current.deleteExam('exam-1');
      });

      expect(success).toBe(true);
      expect(mockApi.delete).toHaveBeenCalledWith('/medical-exam/exam-1');
      expect(result.current.examData).toHaveLength(1);
      expect(result.current.examData[0].medicalExamId).toBe('exam-2');
    });

    it('deve limpar examSelected quando o exame deletado esta selecionado', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      act(() => {
        result.current.setExamSelected(mockExam1 as any);
      });
      expect(result.current.examSelected.medicalExamId).toBe('exam-1');

      await act(async () => {
        await result.current.deleteExam('exam-1');
      });

      expect(result.current.examSelected).toEqual({});
    });

    it('deve manter examSelected quando outro exame e deletado', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });
      (mockApi.delete as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      act(() => {
        result.current.setExamSelected(mockExam1 as any);
      });

      await act(async () => {
        await result.current.deleteExam('exam-2');
      });

      expect(result.current.examSelected.medicalExamId).toBe('exam-1');
    });

    it('deve propagar erro ao falhar na exclusao', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1] },
      });
      const error = new Error('Erro ao deletar');
      (mockApi.delete as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      await expect(
        act(async () => {
          await result.current.deleteExam('exam-1');
        })
      ).rejects.toThrow('Erro ao deletar');
    });
  });

  describe('reprocessExam', () => {
    it('deve reprocessar exame com sucesso e atualizar status local', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.reprocessExam('exam-1');
      });

      expect(success).toBe(true);
      expect(mockApi.post).toHaveBeenCalledWith('/medical-exam/exam-1/reprocess');
      expect(result.current.examData.find(e => e.medicalExamId === 'exam-1')?.medicalExamStatus).toBe('Received');
    });

    it('nao deve alterar status de outros exames ao reprocessar', async () => {
      (mockApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: [mockExam1, mockExam2] },
      });
      (mockApi.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await act(async () => {
        await result.current.getExamList();
      });

      await act(async () => {
        await result.current.reprocessExam('exam-1');
      });

      expect(result.current.examData.find(e => e.medicalExamId === 'exam-2')?.medicalExamStatus).toBe('Processed');
    });

    it('deve propagar erro ao falhar no reprocessamento', async () => {
      const error = new Error('Erro ao reprocessar');
      (mockApi.post as jest.Mock).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useExamContext(), { wrapper });

      await expect(
        act(async () => {
          await result.current.reprocessExam('exam-1');
        })
      ).rejects.toThrow('Erro ao reprocessar');
    });
  });
});
