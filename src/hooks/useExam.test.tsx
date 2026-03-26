import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useExam } from './useExam';
import { ExamContext } from '@contexts/ExamContext';

describe('useExam', () => {
  const mockGetExamList = jest.fn();
  const mockSetExamSelected = jest.fn();
  const mockSelectExamById = jest.fn();
  const mockDeleteExam = jest.fn();
  const mockReprocessExam = jest.fn();

  const mockExamData = [
    {
      medicalExamId: 'exam-1',
      createdDate: '2026-03-15',
      generalScore: 78,
      medicalExamStatus: 'completed',
    },
    {
      medicalExamId: 'exam-2',
      createdDate: '2026-03-10',
      generalScore: 92,
      medicalExamStatus: 'completed',
    },
  ];

  const mockExamSelected = {
    medicalExamId: 'exam-1',
    createdDate: '2026-03-15',
    generalScore: 78,
    medicalExamStatus: 'completed',
  };

  const mockContextValue = {
    examData: mockExamData,
    getExamList: mockGetExamList,
    examSelected: mockExamSelected,
    setExamSelected: mockSetExamSelected,
    selectExamById: mockSelectExamById,
    deleteExam: mockDeleteExam,
    reprocessExam: mockReprocessExam,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ExamContext.Provider value={mockContextValue as any}>
      {children}
    </ExamContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quando usado dentro do ExamContextProvider', () => {
    it('deve retornar o contexto de exames', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('deve retornar lista de exames', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(result.current.examData).toEqual(mockExamData);
      expect(result.current.examData).toHaveLength(2);
    });

    it('deve retornar exame selecionado', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(result.current.examSelected).toEqual(mockExamSelected);
    });

    it('deve retornar funcao getExamList', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(typeof result.current.getExamList).toBe('function');
    });

    it('deve retornar funcao setExamSelected', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(typeof result.current.setExamSelected).toBe('function');
    });

    it('deve retornar funcao selectExamById', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(typeof result.current.selectExamById).toBe('function');
    });

    it('deve retornar funcao deleteExam', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(typeof result.current.deleteExam).toBe('function');
    });

    it('deve retornar funcao reprocessExam', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      expect(typeof result.current.reprocessExam).toBe('function');
    });

    it('deve chamar getExamList corretamente', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      result.current.getExamList();

      expect(mockGetExamList).toHaveBeenCalledTimes(1);
    });

    it('deve chamar setExamSelected com exame correto', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      const exam = { medicalExamId: 'exam-2' };
      result.current.setExamSelected(exam as any);

      expect(mockSetExamSelected).toHaveBeenCalledWith(exam);
    });

    it('deve chamar selectExamById com id correto', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      result.current.selectExamById('exam-123');

      expect(mockSelectExamById).toHaveBeenCalledWith('exam-123');
    });

    it('deve chamar deleteExam com id correto', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      result.current.deleteExam('exam-to-delete');

      expect(mockDeleteExam).toHaveBeenCalledWith('exam-to-delete');
    });

    it('deve chamar reprocessExam com id correto', () => {
      const { result } = renderHook(() => useExam(), { wrapper });

      result.current.reprocessExam('exam-to-reprocess');

      expect(mockReprocessExam).toHaveBeenCalledWith('exam-to-reprocess');
    });
  });

  describe('quando usado fora do ExamContextProvider', () => {
    it('deve retornar contexto vazio sem lancar erro', () => {
      // useExam nao lanca erro quando fora do provider, retorna contexto vazio
      const { result } = renderHook(() => useExam());

      expect(result.current).toBeDefined();
    });
  });

  describe('com diferentes estados de contexto', () => {
    it('deve retornar lista vazia quando nao ha exames', () => {
      const emptyContext = {
        ...mockContextValue,
        examData: [],
        examSelected: {} as any,
      };

      const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
        <ExamContext.Provider value={emptyContext as any}>
          {children}
        </ExamContext.Provider>
      );

      const { result } = renderHook(() => useExam(), { wrapper: emptyWrapper });

      expect(result.current.examData).toEqual([]);
    });

    it('deve retornar exame com status diferente', () => {
      const processingContext = {
        ...mockContextValue,
        examSelected: {
          ...mockExamSelected,
          medicalExamStatus: 'processing',
        },
      };

      const processingWrapper = ({ children }: { children: React.ReactNode }) => (
        <ExamContext.Provider value={processingContext as any}>
          {children}
        </ExamContext.Provider>
      );

      const { result } = renderHook(() => useExam(), { wrapper: processingWrapper });

      expect(result.current.examSelected.medicalExamStatus).toBe('processing');
    });
  });
});
