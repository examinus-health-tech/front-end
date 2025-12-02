import { ReactNode, createContext, useState } from 'react';

import { api } from 'src/services/api';

type MedicalExamItemProps = {
  examItemDescription: string;
  examItemExplanation?: string;
  medicalExamItemReferenceValue: string;
  medicalExamItemMeasureUnit: string;
  medicalExamItemScore: number;
  medicalExamItemWeightSummaryExplanation: string;
  medicalExamItemWeightActionRecommendation: string;
  medicalExamItemWeightColor: string;
  medicalExamItemWeightDescription: string;
};

type MedicalExamOrganicSystemProps = {
  examOrganicSystemId: string;
  examOrganicSystemDescription: string;
  organicSystemScore: number;
  organicSystemScoreSummaryExplanation: string;
  organicSystemScoreActionRecommendation: string;
};

type ExamDataProps = {
  medicalExamId: string;
  createdDate: string;
  generalScore: number;
  generalScoreActionRecommendation: string;
  medicalExamGender: string;
  medicalExamStatus: string;
  // Metadados extraídos do exame
  doctorName?: string;
  laboratoryName?: string;
  examDate?: string;
  medicalExamItems: MedicalExamItemProps[];
  medicalExamOrganicSystemsScore: MedicalExamOrganicSystemProps[];
};

export type ExamContextDataProps = {
  examData: ExamDataProps[];
  getExamList: () => void;
  examSelected: ExamDataProps;
  setExamSelected: (exam: ExamDataProps) => void;
  selectExamById: (examId: string) => Promise<boolean>;
};

type ExamContextProviderProps = {
  children: ReactNode;
};

export const ExamContext = createContext<ExamContextDataProps>({} as ExamContextDataProps);

export function ExamContextProvider({ children }: ExamContextProviderProps) {
  const [examData, setExamData] = useState<ExamDataProps[]>([]);
  const [examSelected, setExamSelected] = useState<ExamDataProps>({} as ExamDataProps);

  async function getExamList() {
    try {
      const response = await api.get('/medical-exam/get-all-exams-upload-by-logged-user');

      setExamData(response.data.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async function selectExamById(examId: string): Promise<boolean> {
    try {
      // Primeiro tenta encontrar nos exames já carregados
      let exams = examData;

      // Se não tiver exames carregados, busca do servidor
      if (!exams || exams.length === 0) {
        exams = await getExamList();
      }

      // Procura o exame pelo ID
      const exam = exams?.find((e: ExamDataProps) => e.medicalExamId === examId);

      if (exam) {
        setExamSelected(exam);
        return true;
      }

      console.warn(`[ExamContext] Exame não encontrado: ${examId}`);
      return false;
    } catch (error) {
      console.error('[ExamContext] Erro ao selecionar exame por ID:', error);
      return false;
    }
  }

  return (
    <ExamContext.Provider
      value={{
        getExamList,
        examData,
        examSelected,
        setExamSelected,
        selectExamById,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}
