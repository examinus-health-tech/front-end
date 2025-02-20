import { useContext } from 'react';
import { ExamContext } from '@contexts/ExamContext';

export function useExam() {
  const context = useContext(ExamContext);

  return context;
}
