import { useMemo } from 'react';
import { Box, Text, VStack, HStack } from 'native-base';

// assets
import {
  ShieldIcon,
  WarningIcon,
  ExclamationMarkSquareIcon,
} from '@assets/icons';

type MedicalExamItem = {
  examItemDescription: string;
  medicalExamItemReferenceValue: string;
  medicalExamItemMeasureUnit: string;
  medicalExamItemScore: number;
  medicalExamItemWeightSummaryExplanation: string;
  medicalExamItemWeightActionRecommendation: string;
  medicalExamItemWeightColor: string;
  medicalExamItemWeightDescription: string;
};

type OrganicSystemScore = {
  examOrganicSystemId: string;
  examOrganicSystemDescription: string;
  organicSystemScore: number;
  organicSystemScoreSummaryExplanation: string;
  organicSystemScoreActionRecommendation: string;
};

type HomeData = {
  medicalExamItems?: MedicalExamItem[];
  medicalExamOrganicSystemsScore?: OrganicSystemScore[];
};

type SystemInsightsProps = {
  homeData: HomeData;
  currentSystem: {
    sistema: string;
    nivel: string;
  };
};

// Mapeamento de biomarcadores por sistema orgânico
const SYSTEM_BIOMARKERS: Record<string, string[]> = {
  coração: ['colesterol', 'ldl', 'hdl', 'triglicerídeos', 'triglicerideos', 'pressão', 'cardíaco', 'cardiaco'],
  fígado: ['tgo', 'tgp', 'ast', 'alt', 'bilirrubina', 'gama gt', 'ggt', 'fosfatase alcalina', 'hepático', 'hepatico', 'albumina'],
  rins: ['creatinina', 'ureia', 'uréia', 'ácido úrico', 'acido urico', 'tfg', 'filtração', 'renal'],
  sangue: ['hemoglobina', 'hematócrito', 'hematocrito', 'hemácias', 'hemacias', 'leucócitos', 'leucocitos', 'plaquetas', 'vcm', 'hcm', 'rdw', 'hemograma'],
  intestino: ['vitamina b12', 'ferritina', 'ferro', 'folato', 'ácido fólico', 'acido folico'],
  pâncreas: ['glicose', 'glicemia', 'hemoglobina glicada', 'hba1c', 'insulina', 'diabetes'],
  imunidade: ['pcr', 'vhs', 'leucócitos', 'leucocitos', 'linfócitos', 'linfocitos', 'neutrófilos', 'neutrofilos'],
  urina: ['proteína', 'proteina', 'leucócitos', 'leucocitos', 'hemácias', 'hemacias', 'ph', 'densidade', 'nitrito', 'urina'],
};

// Gera insights personalizados baseados nos biomarcadores
function generateInsights(
  items: MedicalExamItem[],
  systemScore: OrganicSystemScore | undefined,
  systemName: string
): { text: string; status: 'good' | 'attention' | 'critical' }[] {
  const insights: { text: string; status: 'good' | 'attention' | 'critical' }[] = [];

  // Agrupa biomarcadores por status
  const goodItems = items.filter(item =>
    item.medicalExamItemWeightColor?.toLowerCase() === 'green' ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('normal') ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('adequado')
  );

  const attentionItems = items.filter(item =>
    item.medicalExamItemWeightColor?.toLowerCase() === 'yellow' ||
    item.medicalExamItemWeightColor?.toLowerCase() === 'orange' ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('atenção') ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('atencao') ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('elevado') ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('baixo')
  );

  const criticalItems = items.filter(item =>
    item.medicalExamItemWeightColor?.toLowerCase() === 'red' ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('crítico') ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('critico') ||
    item.medicalExamItemWeightDescription?.toLowerCase().includes('alto risco')
  );

  // Adiciona insight geral do sistema se disponível
  if (systemScore) {
    const score = systemScore.organicSystemScore;
    if (score >= 80) {
      insights.push({
        text: `Seu ${systemName.toLowerCase()} está em excelente condição! Continue mantendo seus hábitos saudáveis.`,
        status: 'good',
      });
    } else if (score >= 60) {
      insights.push({
        text: `Seu ${systemName.toLowerCase()} está em condição moderada. Algumas melhorias podem ajudar.`,
        status: 'attention',
      });
    } else {
      insights.push({
        text: `Seu ${systemName.toLowerCase()} precisa de atenção. Consulte um médico para orientações.`,
        status: 'critical',
      });
    }
  }

  // Adiciona insights específicos por biomarcador
  if (criticalItems.length > 0) {
    const criticalNames = criticalItems.slice(0, 2).map(item => item.examItemDescription).join(' e ');
    insights.push({
      text: `${criticalNames} ${criticalItems.length === 1 ? 'está' : 'estão'} em níveis que requerem atenção médica.`,
      status: 'critical',
    });
  }

  if (attentionItems.length > 0) {
    const attentionNames = attentionItems.slice(0, 2).map(item => item.examItemDescription).join(' e ');
    insights.push({
      text: `${attentionNames} ${attentionItems.length === 1 ? 'apresenta' : 'apresentam'} valores fora do ideal. Monitore com atenção.`,
      status: 'attention',
    });
  }

  if (goodItems.length > 0 && criticalItems.length === 0 && attentionItems.length === 0) {
    const goodNames = goodItems.slice(0, 2).map(item => item.examItemDescription).join(' e ');
    insights.push({
      text: `${goodNames} ${goodItems.length === 1 ? 'está' : 'estão'} em níveis saudáveis!`,
      status: 'good',
    });
  } else if (goodItems.length > 0) {
    insights.push({
      text: `${goodItems.length} ${goodItems.length === 1 ? 'biomarcador está' : 'biomarcadores estão'} em níveis normais.`,
      status: 'good',
    });
  }

  // Limita a 4 insights
  return insights.slice(0, 4);
}

export function SystemInsights({ homeData, currentSystem }: SystemInsightsProps) {
  // Filtra biomarcadores do sistema atual
  const systemBiomarkers = useMemo(() => {
    if (!homeData?.medicalExamItems || !currentSystem?.sistema) return [];

    const systemKey = currentSystem.sistema.toLowerCase();
    const keywords = SYSTEM_BIOMARKERS[systemKey] || [];

    if (keywords.length === 0) return homeData.medicalExamItems.slice(0, 5);

    return homeData.medicalExamItems.filter(item => {
      const itemName = item.examItemDescription.toLowerCase();
      return keywords.some(keyword => itemName.includes(keyword));
    });
  }, [homeData?.medicalExamItems, currentSystem?.sistema]);

  // Obtém o score do sistema atual
  const systemScore = useMemo(() => {
    if (!homeData?.medicalExamOrganicSystemsScore || !currentSystem?.sistema) return undefined;

    return homeData.medicalExamOrganicSystemsScore.find(
      score => score.examOrganicSystemDescription.toLowerCase() === currentSystem.sistema.toLowerCase()
    );
  }, [homeData?.medicalExamOrganicSystemsScore, currentSystem?.sistema]);

  // Gera insights personalizados
  const insights = useMemo(() => {
    if (systemBiomarkers.length === 0 && !systemScore) return [];
    return generateInsights(systemBiomarkers, systemScore, currentSystem?.sistema || 'Sistema');
  }, [systemBiomarkers, systemScore, currentSystem?.sistema]);

  // Não renderiza se não houver dados
  if (insights.length === 0) {
    return null;
  }

  const getStatusIcon = (status: 'good' | 'attention' | 'critical') => {
    switch (status) {
      case 'good':
        return <ShieldIcon size="20" color="#0CC1AF" variant="solid" />;
      case 'attention':
        return <WarningIcon size="20" color="#D97706" />;
      case 'critical':
        return <ExclamationMarkSquareIcon size="20" color="#DC2626" />;
    }
  };

  const getStatusColors = (status: 'good' | 'attention' | 'critical') => {
    switch (status) {
      case 'good':
        return { bg: '#DDF4F2', border: '#6FD3C6', text: '#005841' };
      case 'attention':
        return { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E' };
      case 'critical':
        return { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B' };
    }
  };

  return (
    <VStack mt={4}>
      <Text fontSize={18} fontWeight={700} letterSpacing={-0.18} color="gray.900" mb={3}>
        Resumo do seu {currentSystem?.sistema}
      </Text>

      <VStack space={2}>
        {insights.map((insight, index) => {
          const colors = getStatusColors(insight.status);
          return (
            <Box
              key={index}
              bg={colors.bg}
              px={3}
              py={2.5}
              borderRadius={10}
              borderWidth={1}
              borderColor={colors.border}
            >
              <HStack space={2} alignItems="flex-start">
                <Box mt={0.5}>
                  {getStatusIcon(insight.status)}
                </Box>
                <Text
                  flex={1}
                  fontSize={12}
                  fontWeight={500}
                  color={colors.text}
                  lineHeight={16}
                >
                  {insight.text}
                </Text>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </VStack>
  );
}
