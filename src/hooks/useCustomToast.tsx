import { useToast, Box, Text, VStack, Pressable } from 'native-base';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOAST_WIDTH = SCREEN_WIDTH - 32; // 16px de margem em cada lado

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'processing';

interface ToastConfig {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// Configurações visuais por tipo de toast
const toastStyles: Record<ToastType, { bg: string; borderColor: string; iconColor: string }> = {
  success: {
    bg: 'green.50',
    borderColor: 'green.500',
    iconColor: '#22C55E',
  },
  error: {
    bg: 'red.50',
    borderColor: 'red.500',
    iconColor: '#EF4444',
  },
  warning: {
    bg: 'orange.50',
    borderColor: 'orange.500',
    iconColor: '#F97316',
  },
  info: {
    bg: 'blue.50',
    borderColor: 'blue.500',
    iconColor: '#3B82F6',
  },
  processing: {
    bg: 'blue.50',
    borderColor: 'blue.400',
    iconColor: '#60A5FA',
  },
};


export function useCustomToast() {
  const toast = useToast();

  const showToast = (type: ToastType, config: ToastConfig) => {
    const style = toastStyles[type];

    toast.show({
      placement: 'top',
      duration: config.duration || 4000,
      render: ({ id }) => (
        <Pressable onPress={() => toast.close(id)}>
          <Box
            w={TOAST_WIDTH}
            bg={style.bg}
            borderWidth={1}
            borderColor={style.borderColor}
            borderRadius={12}
            px={4}
            py={3}
            mx={4}
            mt={2}
            shadow={3}
          >
            <VStack space={1}>
              <Text fontSize={15} fontWeight="700" color="gray.800" letterSpacing={-0.3}>
                {config.title}
              </Text>
              {config.description && (
                <Text fontSize={13} fontWeight="400" color="gray.600" lineHeight={18}>
                  {config.description}
                </Text>
              )}
              {config.action && (
                <Pressable onPress={config.action.onPress} mt={2}>
                  <Text fontSize={13} fontWeight="600" color={style.borderColor} underline>
                    {config.action.label}
                  </Text>
                </Pressable>
              )}
            </VStack>
          </Box>
        </Pressable>
      ),
    });
  };

  // Funções específicas para cada tipo
  const showSuccess = (config: ToastConfig) => showToast('success', config);
  const showError = (config: ToastConfig) => showToast('error', config);
  const showWarning = (config: ToastConfig) => showToast('warning', config);
  const showInfo = (config: ToastConfig) => showToast('info', config);
  const showProcessing = (config: ToastConfig) => showToast('processing', config);

  // Toast específico para erro de extração de exame
  const showExtractionError = (laboratoryName?: string) => {
    showToast('error', {
      title: 'Erro na extração do exame',
      description: `Não foi possível processar ${laboratoryName ? `o exame de "${laboratoryName}"` : 'este exame'}. Verifique se a imagem está nítida e tente fazer um novo upload.`,
      duration: 6000,
    });
  };

  // Toast específico para erro de análise
  const showAnalysisError = (laboratoryName?: string) => {
    showToast('error', {
      title: 'Erro na análise do exame',
      description: `O exame ${laboratoryName ? `de "${laboratoryName}"` : ''} não pôde ser analisado. Entre em contato com o suporte se o problema persistir.`,
      duration: 6000,
    });
  };

  // Toast específico para exame em processamento
  const showExamProcessing = (statusMessage: string) => {
    showToast('processing', {
      title: 'Exame em processamento',
      description: `Status atual: ${statusMessage}. Aguarde a conclusão do processamento para visualizar os resultados.`,
      duration: 4000,
    });
  };

  // Toast para filtros aplicados
  const showFiltersApplied = () => {
    showToast('success', {
      title: 'Filtros aplicados',
      description: 'Lista de exames atualizada',
      duration: 2500,
    });
  };

  // Toast para filtros limpos
  const showFiltersCleared = () => {
    showToast('info', {
      title: 'Filtros limpos',
      description: 'Exibindo todos os exames',
      duration: 2500,
    });
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showProcessing,
    showExtractionError,
    showAnalysisError,
    showExamProcessing,
    showFiltersApplied,
    showFiltersCleared,
  };
}
