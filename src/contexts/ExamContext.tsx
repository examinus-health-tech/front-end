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
  // Campos de referência para cálculo de cores e preenchimento
  referenceMin?: number | null;
  referenceMax?: number | null;
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
  requestingDoctorName?: string;
  responsibleDoctorName?: string;
  laboratoryName?: string;
  healthInsuranceName?: string;
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
  deleteExam: (examId: string) => Promise<boolean>;
  reprocessExam: (examId: string) => Promise<boolean>;
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

      // Debug: ver estrutura dos dados retornados
      if (response.data.data?.length > 0) {
        const firstExam = response.data.data[0];
        console.log('📋 [ExamContext] Primeiro exame - campos disponíveis:', Object.keys(firstExam));
        console.log('📋 [ExamContext] Dados do médico:', {
          doctorName: firstExam.doctorName,
          doctor_name: firstExam.doctor_name,
          requestingDoctorName: firstExam.requestingDoctorName,
          responsibleDoctorName: firstExam.responsibleDoctorName,
        });

        // Debug: verificar itens com valores vazios ou zerados
        response.data.data.forEach((exam: ExamDataProps) => {
          if (exam.medicalExamItems?.length > 0) {
            const emptyValueItems = exam.medicalExamItems.filter(
              (item) =>
                !item.medicalExamItemReferenceValue ||
                item.medicalExamItemReferenceValue === '' ||
                item.medicalExamItemReferenceValue === '0'
            );
            if (emptyValueItems.length > 0) {
              console.warn('⚠️ [ExamContext] Exame com itens sem valor:', {
                examId: exam.medicalExamId,
                examDate: exam.createdDate,
                itemsVazios: emptyValueItems.map((i) => ({
                  nome: i.examItemDescription,
                  valor: i.medicalExamItemReferenceValue,
                })),
              });
            }
          }
        });
      }

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

  async function deleteExam(examId: string): Promise<boolean> {
    try {
      console.log(`[ExamContext] Excluindo exame: ${examId}`);
      await api.delete(`/medical-exam/${examId}`);

      // Remove o exame da lista local
      setExamData((prev) => prev.filter((exam) => exam.medicalExamId !== examId));

      // Limpa o exame selecionado se for o mesmo
      if (examSelected?.medicalExamId === examId) {
        setExamSelected({} as ExamDataProps);
      }

      console.log(`[ExamContext] Exame excluído com sucesso: ${examId}`);
      return true;
    } catch (error) {
      console.error('[ExamContext] Erro ao excluir exame:', error);
      throw error;
    }
  }

  async function reprocessExam(examId: string): Promise<boolean> {
    try {
      console.log(`[ExamContext] Reprocessando exame: ${examId}`);
      await api.post(`/medical-exam/${examId}/reprocess`);

      // Atualiza o status local para "Received" (reprocessando)
      setExamData((prev) =>
        prev.map((exam) =>
          exam.medicalExamId === examId
            ? { ...exam, medicalExamStatus: 'Received' }
            : exam
        )
      );

      console.log(`[ExamContext] Exame enviado para reprocessamento: ${examId}`);
      return true;
    } catch (error) {
      console.error('[ExamContext] Erro ao reprocessar exame:', error);
      throw error;
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
        deleteExam,
        reprocessExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}
