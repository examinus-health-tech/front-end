import { ReactNode, createContext, useEffect, useState, useMemo, useCallback } from 'react';
import { DocumentPickerAsset } from 'expo-document-picker';
import { api } from 'src/services/api';
import { AppError } from '@utils/AppErrors';

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

  const handleUploadFile = useCallback(async ({ name, mimeType, uri, file, size }: DocumentPickerAsset) => {
    setIsLoading(true);
    console.log('📤 Iniciando upload:', {
      name,
      mimeType,
      uri,
      size: size ? `${(size / 1024 / 1024).toFixed(2)} MB` : 'Desconhecido',
      file
    });

    try {
      // Detectar tipo do arquivo baseado na extensão se mimeType não estiver presente
      let detectedType = mimeType || file?.type;

      if (!detectedType && name) {
        const extension = name.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') {
          detectedType = 'application/pdf';
        } else if (['jpg', 'jpeg'].includes(extension || '')) {
          detectedType = 'image/jpeg';
        } else if (extension === 'png') {
          detectedType = 'image/png';
        }
      }

      // Fallback final baseado no nome do arquivo
      const finalType = detectedType || (name?.includes('.pdf') ? 'application/pdf' : 'image/jpeg');
      const finalName = name || (finalType === 'application/pdf' ? 'upload.pdf' : 'upload.jpg');

      const uploadFile = {
        name: finalName,
        type: finalType,
        uri: uri,
      } as any;

      console.log('📋 Arquivo preparado para upload:', uploadFile);

      const bodyFormData = new FormData();
      bodyFormData.append('File', uploadFile);

      console.log('🚀 Enviando para API...');

      try {
        const response = await api.post('medical-exam/form', bodyFormData, {
          headers: {
            'Content-type': 'multipart/form-data',
            Accept: 'application/octet-stream',
          },
          timeout: 120000, // 2 minutos para upload de arquivos
          validateStatus: () => true, // Aceitar qualquer status para capturar erro 500
        });

        console.log('📡 Resposta recebida da API');
        console.log('📊 Status:', response.status);
        console.log('📦 Dados:', JSON.stringify(response.data, null, 2));
        console.log('🔖 Headers:', JSON.stringify(response.headers, null, 2));

        // Verificar se foi sucesso (2xx)
        if (response.status >= 200 && response.status < 300) {
          console.log('✅ Upload bem-sucedido!');
          setFile(uploadFile);
          setWithSuccess(true);
          setWithError(false);
        } else {
          // Erro do servidor (4xx, 5xx)
          console.error('❌ Erro na resposta da API');
          console.error('📛 Status HTTP:', response.status);
          console.error('💬 Mensagem do servidor:', response.data?.message || response.data?.error || 'Sem mensagem');
          console.error('📄 Resposta completa:', JSON.stringify(response.data, null, 2));

          setWithSuccess(false);
          setWithError(true);
          throw new Error(response.data?.message || `Erro ${response.status} no servidor`);
        }
      } catch (apiError: any) {
        // Erro de rede ou timeout
        console.error('❌ Erro na comunicação com API');
        console.error('📛 Tipo:', apiError?.constructor?.name);
        console.error('💬 Mensagem:', apiError?.message);
        console.error('🔍 Code:', apiError?.code);

        if (apiError?.response) {
          console.error('📡 Response recebido:');
          console.error('   - Status:', apiError.response.status);
          console.error('   - Data:', JSON.stringify(apiError.response.data, null, 2));
        }

        setWithSuccess(false);
        setWithError(true);
        throw apiError;
      }
    } catch (error: any) {
      console.error('❌ Erro geral no upload!');
      console.error('📛 Tipo do erro:', error?.constructor?.name);
      console.error('💬 Mensagem:', error?.message);
      console.error('🔍 Stack trace:', error?.stack);

      setWithSuccess(false);
      setWithError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleManualUploadFile = useCallback(async (payload: {
    email: string;
    doctor_name: string;
    labor_name: string;
    exame_date: string;
    detail: { exam_id: number; code_exam: string; value: string; reference_unit: string };
  }) => {
    setIsLoading(true);

    console.log('📝 Iniciando upload manual:', JSON.stringify(payload, null, 2));

    try {
      console.log('🚀 Enviando para API /exam-maintenance...');
      const response = await api.post('/exam-maintenance', payload);

      console.log('✅ Upload manual bem-sucedido!');
      console.log('📊 Status:', response.status);
      console.log('📦 Resposta completa:', JSON.stringify(response.data, null, 2));

      const data = response.data.data;

      if (data) {
        console.log('✅ Dados processados com sucesso');
        setIsLoading(false);
        setWithError(false);
        setScoreWarning(true);
        setWithSuccess(true);
      } else {
        console.warn('⚠️ Resposta da API não contém dados');
      }
    } catch (error: any) {
      console.error('❌ Erro no upload manual!');
      console.error('📛 Tipo do erro:', error?.constructor?.name);
      console.error('💬 Mensagem:', error?.message);

      if (error?.response) {
        console.error('📡 Resposta da API:');
        console.error('   - Status:', error.response.status);
        console.error('   - Status Text:', error.response.statusText);
        console.error('   - Data:', JSON.stringify(error.response.data, null, 2));
      } else if (error?.request) {
        console.error('📤 Request enviado mas sem resposta');
      }

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
      console.error('❌ Erro ao consultar lista de exames:', error);
      // Erro será tratado pelo componente que chama
      throw error;
    }
  }, []);

  // Não usar useMemo aqui - o objeto precisa ser recriado quando as props mudarem
  // mas as funções useCallback garantem estabilidade
  const contextValue = {
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
  };

  console.log('🔧 UploadContext renderizando, contextValue:', {
    hasHandleUploadFile: !!contextValue.handleUploadFile,
    handleUploadFileType: typeof contextValue.handleUploadFile,
  });

  return (
    <UploadContext.Provider value={contextValue}>
      {children}
    </UploadContext.Provider>
  );
}
