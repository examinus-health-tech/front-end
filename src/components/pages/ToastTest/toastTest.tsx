import { VStack, Text, ScrollView, Box } from 'native-base';
import { Button } from '@components/atoms';
import { useCustomToast } from 'src/hooks/useCustomToast';
import { useNavigation } from '@react-navigation/native';
import { HeaderTitle } from '@components/molecules';

export function ToastTest() {
  const navigation = useNavigation();
  const {
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
  } = useCustomToast();

  return (
    <ScrollView flex={1} bg="gray.50">
      <VStack py={16} px={6} space={4}>
        <HeaderTitle
          title="Teste de Toasts"
          withBackButton={() => navigation.goBack()}
        />

        <Text fontSize={18} fontWeight={700} mt={4} mb={2}>
          Tipos Básicos
        </Text>

        <Button
          variant="primary"
          size="full"
          title="Sucesso"
          onPress={() => showSuccess({
            title: 'Sucesso!',
            description: 'Operação realizada com sucesso.',
          })}
        />

        <Button
          variant="secondary"
          size="full"
          title="Erro"
          onPress={() => showError({
            title: 'Erro!',
            description: 'Algo deu errado. Tente novamente.',
          })}
        />

        <Button
          variant="secondary"
          size="full"
          title="Aviso"
          onPress={() => showWarning({
            title: 'Atenção!',
            description: 'Esta ação requer sua atenção.',
          })}
        />

        <Button
          variant="secondary"
          size="full"
          title="Informação"
          onPress={() => showInfo({
            title: 'Informação',
            description: 'Aqui está uma informação importante.',
          })}
        />

        <Button
          variant="secondary"
          size="full"
          title="Processando"
          onPress={() => showProcessing({
            title: 'Processando...',
            description: 'Aguarde enquanto processamos.',
          })}
        />

        <Text fontSize={18} fontWeight={700} mt={6} mb={2}>
          Toasts de Exames
        </Text>

        <Button
          variant="secondary"
          size="full"
          title="Erro de Extração"
          onPress={() => showExtractionError('Laboratório XYZ')}
        />

        <Button
          variant="secondary"
          size="full"
          title="Erro de Análise"
          onPress={() => showAnalysisError('Laboratório ABC')}
        />

        <Button
          variant="secondary"
          size="full"
          title="Exame em Processamento"
          onPress={() => showExamProcessing('Extraído')}
        />

        <Text fontSize={18} fontWeight={700} mt={6} mb={2}>
          Toasts de Filtros
        </Text>

        <Button
          variant="secondary"
          size="full"
          title="Filtros Aplicados"
          onPress={() => showFiltersApplied()}
        />

        <Button
          variant="secondary"
          size="full"
          title="Filtros Limpos"
          onPress={() => showFiltersCleared()}
        />

        <Box h={100} />
      </VStack>
    </ScrollView>
  );
}
