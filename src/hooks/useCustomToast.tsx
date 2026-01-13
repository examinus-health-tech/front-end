import { useToast, Box, Text, HStack, Pressable } from 'native-base';

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

// Configurações visuais iOS style
const toastStyles: Record<ToastType, { color: string; symbol: string }> = {
  success: {
    color: '#22C55E',
    symbol: '✓',
  },
  error: {
    color: '#EF4444',
    symbol: '✕',
  },
  warning: {
    color: '#F97316',
    symbol: '!',
  },
  info: {
    color: '#3B82F6',
    symbol: 'i',
  },
  processing: {
    color: '#60A5FA',
    symbol: '↻',
  },
};

export function useCustomToast() {
  const toast = useToast();

  const showToast = (type: ToastType, config: ToastConfig) => {
    const style = toastStyles[type];

    // Texto compacto: se tem descrição curta, concatena com título
    const displayText = config.description
      ? `${config.title} · ${config.description}`
      : config.title;

    toast.show({
      placement: 'top',
      duration: config.duration || 3000,
      render: ({ id }) => (
        <Box alignItems="center" mt={2} w="100%" px={5}>
          <Pressable onPress={() => toast.close(id)} style={{ maxWidth: '100%' }}>
            <HStack
              bg="rgba(30, 30, 30, 0.9)"
              borderRadius={20}
              px={3}
              py={1.5}
              space={2}
              alignItems="center"
              shadow={3}
            >
              {/* Ícone circular com símbolo */}
              <Box
                w={5}
                h={5}
                borderRadius={10}
                bg={style.color}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text fontSize={12} fontWeight="800" color="white">
                  {style.symbol}
                </Text>
              </Box>
              <Text
                fontSize={13}
                fontWeight="600"
                color="white"
                letterSpacing={-0.2}
                flexShrink={1}
              >
                {displayText}
              </Text>
            </HStack>
          </Pressable>
        </Box>
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
