import { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, StatusBar, Linking } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, Badge, Divider } from 'native-base';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Routes
import { AppNavigatorRoutesProps, AppRoutes } from '@routes/app.routes';

// Components
import { HeaderTitle } from '@components/molecules';
import { Button } from '@components/atoms';

// Services
import {
  MentalHealthAssessment,
  getAssessments,
  getColorByClassification,
  formatAssessmentDate,
  ClassificationLevel,
} from '@services/mentalHealthService';

// Assets
import { HeadHealthIcon, HeartIcon, EnergyIcon, WarningIcon, LightBulbIcon } from '@assets/icons';

type MentalHealthResultRouteProp = RouteProp<AppRoutes, 'mentalHealthResult'>;

// Componente para exibir um domínio
function DomainCard({
  title,
  score,
  classification,
  icon,
  description,
  delay,
}: {
  title: string;
  score: number;
  classification: ClassificationLevel;
  icon: React.ReactNode;
  description: string;
  delay: number;
}) {
  const colorInfo = getColorByClassification(classification);

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
      <Box bg="white" borderRadius={16} p={4} shadow={2} mb={4}>
        <HStack alignItems="center" justifyContent="space-between" mb={3}>
          <HStack alignItems="center" space={3}>
            <Box bg={colorInfo.bgColor} w={12} h={12} borderRadius={12} alignItems="center" justifyContent="center">
              {icon}
            </Box>
            <VStack>
              <Text fontSize={16} fontWeight={700} color="gray.800">
                {title}
              </Text>
            </VStack>
          </HStack>

          <Badge
            bg={colorInfo.bgColor}
            borderRadius={8}
            px={3}
            py={1}
            _text={{
              color: colorInfo.color,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {colorInfo.label}
          </Badge>
        </HStack>

        <Text fontSize={13} fontWeight={400} color="gray.600" lineHeight={20}>
          {description}
        </Text>
      </Box>
    </Animated.View>
  );
}

// Descrições por classificação
const getDepressionDescription = (classification: ClassificationLevel): string => {
  switch (classification) {
    case 'normal':
      return 'Seus indicadores de depressão estão dentro da faixa normal. Continue cuidando da sua saúde mental.';
    case 'leve':
      return 'Você apresenta sinais leves de depressão. Considere praticar atividades que te fazem bem e manter contato social.';
    case 'moderado':
      return 'Indicadores moderados de depressão foram identificados. Recomendamos buscar apoio profissional para acompanhamento.';
    case 'grave':
    case 'extremamente_grave':
      return 'Seus indicadores de depressão merecem atenção urgente. Por favor, procure um profissional de saúde mental o mais breve possível.';
    default:
      return '';
  }
};

const getAnxietyDescription = (classification: ClassificationLevel): string => {
  switch (classification) {
    case 'normal':
      return 'Seus níveis de ansiedade estão controlados. Mantenha práticas saudáveis de relaxamento.';
    case 'leve':
      return 'Você apresenta sinais leves de ansiedade. Técnicas de respiração e meditação podem ajudar.';
    case 'moderado':
      return 'Indicadores moderados de ansiedade foram identificados. Considere buscar orientação profissional.';
    case 'grave':
    case 'extremamente_grave':
      return 'Seus níveis de ansiedade estão elevados. Recomendamos fortemente procurar ajuda profissional.';
    default:
      return '';
  }
};

const getStressDescription = (classification: ClassificationLevel): string => {
  switch (classification) {
    case 'normal':
      return 'Seu nível de estresse está adequado. Continue mantendo um equilíbrio saudável entre trabalho e descanso.';
    case 'leve':
      return 'Você apresenta sinais leves de estresse. Atividades físicas e hobbies podem ajudar a aliviar.';
    case 'moderado':
      return 'Indicadores moderados de estresse foram identificados. Avalie suas fontes de estresse e busque formas de gerenciá-las.';
    case 'grave':
    case 'extremamente_grave':
      return 'Seus níveis de estresse estão muito elevados. É importante buscar apoio profissional e fazer mudanças no estilo de vida.';
    default:
      return '';
  }
};

export function MentalHealthResult() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute<MentalHealthResultRouteProp>();
  const [assessment, setAssessment] = useState<MentalHealthAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega a avaliação
  useEffect(() => {
    async function loadAssessment() {
      try {
        const assessments = await getAssessments();
        const assessmentId = route.params?.assessmentId;

        if (assessmentId) {
          const found = assessments.find((a) => a.id === assessmentId);
          setAssessment(found || assessments[0] || null);
        } else {
          setAssessment(assessments[0] || null);
        }
      } catch (error) {
        console.error('Erro ao carregar avaliação:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAssessment();
  }, [route.params?.assessmentId]);

  // Verifica se há alguma classificação preocupante
  const hasWarning = useCallback(() => {
    if (!assessment) return false;
    const { classifications } = assessment;
    return (
      ['grave', 'extremamente_grave'].includes(classifications.depression) ||
      ['grave', 'extremamente_grave'].includes(classifications.anxiety) ||
      ['grave', 'extremamente_grave'].includes(classifications.stress)
    );
  }, [assessment]);

  if (isLoading) {
    return (
      <VStack flex={1} bg="gray.50" alignItems="center" justifyContent="center">
        <Text>Carregando...</Text>
      </VStack>
    );
  }

  if (!assessment) {
    return (
      <VStack flex={1} bg="gray.50">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <VStack pt={16} flex={1}>
          <HeaderTitle title="Resultado" withBackButton={() => navigation.goBack()} />
          <VStack flex={1} alignItems="center" justifyContent="center" px={6}>
            <Text fontSize={16} fontWeight={600} color="gray.600" textAlign="center">
              Nenhuma avaliação encontrada.
            </Text>
            <Button
              title="Fazer Avaliação"
              variant="primary"
              size="lg"
              h={14}
              mt={4}
              onPress={() => navigation.navigate('mentalHealthForm')}
            />
          </VStack>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <VStack pt={16} flex={1}>
        <HeaderTitle title="Saúde Mental" withBackButton={() => navigation.goBack()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack mx={6} pb={32}>
            {/* Subtítulo e Data da avaliação */}
            <Animated.View entering={FadeInDown.duration(400).delay(0)}>
              <Box bg="blue.50" p={3} borderRadius={10} mb={4}>
                <Text fontSize={12} fontWeight={600} color="blue.800" textAlign="center">
                  Resultado DASS-21
                </Text>
                <Text fontSize={12} fontWeight={500} color="blue.600" textAlign="center" mt={1}>
                  Avaliação realizada em {formatAssessmentDate(assessment.date)}
                </Text>
              </Box>
            </Animated.View>

            {/* Alerta se necessário */}
            {hasWarning() && (
              <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <Box bg="red.50" borderRadius={12} p={4} mb={4} borderWidth={1} borderColor="red.200">
                  <HStack alignItems="flex-start" space={3}>
                    <WarningIcon size="24" color="#DC2626" />
                    <VStack flex={1}>
                      <Text fontSize={14} fontWeight={700} color="red.700" mb={1}>
                        Atenção Importante
                      </Text>
                      <Text fontSize={12} fontWeight={500} color="red.600" lineHeight={18}>
                        Seus resultados indicam que você pode estar enfrentando dificuldades significativas.
                        Recomendamos fortemente que procure ajuda profissional.
                      </Text>
                      <TouchableOpacity onPress={() => Linking.openURL('tel:188')} style={{ marginTop: 8 }}>
                        <Text fontSize={12} fontWeight={700} color="red.700">
                          CVV - Ligue 188 (24h)
                        </Text>
                      </TouchableOpacity>
                    </VStack>
                  </HStack>
                </Box>
              </Animated.View>
            )}

            {/* Cards dos domínios */}
            <DomainCard
              title="Depressão"
              score={assessment.scores.depression}
              classification={assessment.classifications.depression}
              icon={
                <HeadHealthIcon
                  size="24"
                  color={getColorByClassification(assessment.classifications.depression).color}
                />
              }
              description={getDepressionDescription(assessment.classifications.depression)}
              delay={200}
            />

            <DomainCard
              title="Ansiedade"
              score={assessment.scores.anxiety}
              classification={assessment.classifications.anxiety}
              icon={<HeartIcon size="24" color={getColorByClassification(assessment.classifications.anxiety).color} />}
              description={getAnxietyDescription(assessment.classifications.anxiety)}
              delay={300}
            />

            <DomainCard
              title="Estresse"
              score={assessment.scores.stress}
              classification={assessment.classifications.stress}
              icon={<EnergyIcon size="24" color={getColorByClassification(assessment.classifications.stress).color} />}
              description={getStressDescription(assessment.classifications.stress)}
              delay={400}
            />

            {/* Informações sobre o DASS-21 */}
            <Animated.View entering={FadeInDown.duration(400).delay(500)}>
              <Box bg="blue.50" borderRadius={12} p={4} mt={2}>
                <HStack alignItems="flex-start" space={3}>
                  <LightBulbIcon size="20" color="#3B82F6" />
                  <VStack flex={1}>
                    <Text fontSize={12} fontWeight={700} color="blue.700" mb={1}>
                      Sobre o DASS-21
                    </Text>
                    <Text fontSize={12} fontWeight={500} color="blue.600" lineHeight={16}>
                      O DASS-21 é um instrumento validado cientificamente para avaliação de sintomas de depressão,
                      ansiedade e estresse. Esta ferramenta não substitui uma avaliação profissional.
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Animated.View>

            {/* Botões de ação */}
            <Animated.View entering={FadeInDown.duration(400).delay(600)} style={{ width: '100%' }}>
              <VStack mt={6} space={3} w="100%">
                <Button
                  title="Refazer Avaliação"
                  variant="primary"
                  size="lg"
                  h={14}
                  w="100%"
                  onPress={() => navigation.navigate('mentalHealthForm')}
                />
                <Button
                  title="Voltar para Início"
                  variant="secondary"
                  size="lg"
                  h={14}
                  w="100%"
                  onPress={() => navigation.navigate('homepage')}
                />
              </VStack>
            </Animated.View>

            {/* Disclaimer */}
            <Animated.View entering={FadeInDown.duration(400).delay(700)}>
              <Box mt={4} px={3} py={2} bg="orange.50" borderRadius={8} borderWidth={1} borderColor="orange.200">
                <Text fontSize={12} fontWeight={500} color="gray.700" textAlign="center" lineHeight={14}>
                  Esta avaliação é apenas informativa e não substitui diagnóstico médico. Se você está enfrentando
                  dificuldades, procure ajuda profissional.
                </Text>
              </Box>
            </Animated.View>
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
