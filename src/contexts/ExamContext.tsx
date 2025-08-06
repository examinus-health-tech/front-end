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
  getExamList: () => void;
};

type ExamContextProviderProps = {
  children: ReactNode;
};

export const ExamContext = createContext<ExamContextDataProps>({} as ExamContextDataProps);

export function ExamContextProvider({ children }: ExamContextProviderProps) {
  const [examData, setExamData] = useState<ExamDataProps[]>([]);

  async function getExamList() {
    try {
      const response = await api.get('/medical-exam/get-all-exams-upload-by-logged-user');

      setExamData(response.data.data);
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
