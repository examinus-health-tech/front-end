import { ReactNode, createContext, useEffect, useState, useMemo, useCallback } from 'react';
import { DocumentPickerAsset } from 'expo-document-picker';
import { api } from 'src/services/api';
import { AppError } from '@utils/AppErrors';
import { useToast } from 'native-base';

type ExamProps = {
  exam_id: number;
  code_exam: string;
  reference_unit_system: string;
  group: string;
  target_units: string[];
};

export type UploadContextDataProps = {
  file: DocumentPickerAsset;
  handleUploadFile: (file: DocumentPickerAsset) => Promise<void>;
  isLoadingUploadContext: boolean;
  setIsLoading: (state: boolean) => void;
  examList: ExamProps[];
  getExamTypes: (email: string) => void;
  scoreWarning: boolean;
  withError: boolean;
  setWithError: (state: boolean) => void;
  withSuccess: boolean;
  setWithSuccess: (state: boolean) => void;
  handleManualUploadFile: (payload: {
    email: string;
    doctor_name: string;
    labor_name: string;
    exame_date: string;
    detail: { exam_id: number; code_exam: string; value: string; reference_unit: string };
  }) => void;
};

type UploadContextProviderProps = {
  children: ReactNode;
};

export const UploadContext = createContext<UploadContextDataProps>({} as UploadContextDataProps);

export function UploadContextProvider({ children }: UploadContextProviderProps) {
  const [file, setFile] = useState<DocumentPickerAsset>({} as DocumentPickerAsset);
  const [withError, setWithError] = useState<boolean>(false);
  const [withSuccess, setWithSuccess] = useState<boolean>(false);
  const [isLoadingUploadContext, setIsLoading] = useState<boolean>(false);
  const [scoreWarning, setScoreWarning] = useState<boolean>(false);
  const [examList, setExamList] = useState([]);
  const toast = useToast();

  async function handleUploadFile({ name, mimeType, uri, file }: DocumentPickerAsset) {
    setIsLoading(true);
    console.log('📤 Iniciando upload:', { name, mimeType, uri });
    
    try {
      const uploadFile = {
        name: name || 'upload.jpg',
        type: mimeType || (file?.type) || 'image/jpeg',
        uri: uri,
      } as any;

      console.log('📋 Arquivo preparado para upload:', uploadFile);

      const bodyFormData = new FormData();
      bodyFormData.append('File', uploadFile);

      console.log('🚀 Enviando para API...');
      const response = await api.post('medical-exam/form', bodyFormData, {
        headers: {
          'Content-type': 'multipart/form-data',
          Accept: 'application/octet-stream',
        },
      });

      console.log('✅ Upload bem-sucedido:', response.data);

      setFile(uploadFile);
      setWithSuccess(true);
      setWithError(false);
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      setWithSuccess(false);
      setWithError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const handleManualUploadFile = useCallback(async (payload: {
    email: string;
    doctor_name: string;
    labor_name: string;
    exame_date: string;
    detail: { exam_id: number; code_exam: string; value: string; reference_unit: string };
  }) => {
    setIsLoading(true);

    try {
      const response = await api.post('/exam-maintenance', payload);

      const data = response.data.data;

      if (data) {
        setIsLoading(false);
        setWithError(false);
        setScoreWarning(true);
        setWithSuccess(true);
      }
    } catch (error) {
      setWithError(true);
      setWithSuccess(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getExamTypes = useCallback(async (email: string) => {
    try {
      const response = await api.get('/exam-maintenance/list', {
        headers: { email },
      });

      const data = response.data.data;

      if (data.detail.length) {
        setExamList(data.detail);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? 'Não foi possível consultar lista de exames.'
        : 'Não foi possível consultar lista de exames.\nTente novamente mais tarde.';
      const description = isAppError && error.message;

      toast.show({
        borderRadius: '12',
        title,
        description,
        _title: {
          textAlign: 'center',
          mx: '4',
        },
        _description: {
          textAlign: 'center',
          mx: '4',
        },
        placement: 'top',
        color: 'gray.900',
        bgColor: 'red.500',
      });
    }
  }, [toast]);

  const contextValue = useMemo(() => ({
    file,
    handleUploadFile,
    isLoadingUploadContext,
    setIsLoading,
    examList,
    getExamTypes,
    scoreWarning,
    withError,
    setWithError,
    withSuccess,
    setWithSuccess,
    handleManualUploadFile,
  }), [
    file,
    isLoadingUploadContext,
    examList,
    scoreWarning,
    withError,
    withSuccess,
  ]);

  return (
    <UploadContext.Provider value={contextValue}>
      {children}
    </UploadContext.Provider>
  );
}
