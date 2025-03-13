import { ReactNode, createContext, useState } from 'react';

import { api } from 'src/services/api';

type ExamDataProps = {
  identifier: string;
  doctor_name: string;
  labor_name: string;
  exam_date: string;
};

export type ExamContextDataProps = {
  examData: ExamDataProps[];
  getExamList: (email: string) => Promise<void>;
};

type ExamContextProviderProps = {
  children: ReactNode;
};

export const ExamContext = createContext<ExamContextDataProps>({} as ExamContextDataProps);

export function ExamContextProvider({ children }: ExamContextProviderProps) {
  const [examData, setExamData] = useState<ExamDataProps[]>([]);

  async function getExamList(email: string) {
    try {
      const response = await api.get('/exam-results/list', {
        headers: { email },
      });

      setExamData(response.data.data.detail);

      return response.data.data.detail;
    } catch (error) {
      throw error;
    } finally {
    }
  }

  return (
    <ExamContext.Provider
      value={{
        getExamList,
        examData,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}
