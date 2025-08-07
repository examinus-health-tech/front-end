import { ReactNode, createContext, useState } from 'react';

import { api } from 'src/services/api';

type MedicalExamItemProps = {
  examItemDescription: string;
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
  medicalExamItems: MedicalExamItemProps[];
  medicalExamOrganicSystemsScore: MedicalExamOrganicSystemProps[];
};

export type ExamContextDataProps = {
  examData: ExamDataProps[];
  getExamList: () => void;
  examSelected: ExamDataProps;
  setExamSelected: (exam: ExamDataProps) => void;
};

type ExamContextProviderProps = {
  children: ReactNode;
};

export const ExamContext = createContext<ExamContextDataProps>({} as ExamContextDataProps);

export function ExamContextProvider({ children }: ExamContextProviderProps) {
  const [examData, setExamData] = useState<ExamDataProps[]>([]);
  const [examSelected, setExamSelected] = useState<MedicalExamItemProps>({} as MedicalExamItemProps);

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
        examSelected,
        setExamSelected,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}
