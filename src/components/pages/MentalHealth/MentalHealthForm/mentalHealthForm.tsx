import { useState, useRef, useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// Components
import { HeaderTitle } from '@components/molecules';
import { Button } from '@components/atoms';

// Services
import { DASS21_QUESTIONS, RESPONSE_OPTIONS, saveAssessment } from '@services/mentalHealthService';

// Hooks
import { useCustomToast } from 'src/hooks/useCustomToast';

export function MentalHealthForm() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const scrollRef = useRef<any>(null);
  const progressScrollRef = useRef<any>(null);
  const { showSuccess, showError } = useCustomToast();

  // Estado das respostas (21 perguntas, inicialmente undefined)
  const [answers, setAnswers] = useState<(number | undefined)[]>(new Array(21).fill(undefined));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcula o progresso
  const answeredCount = answers.filter((a) => a !== undefined).length;

  // Scroll automático do carrossel de progresso
  useEffect(() => {
    // Cada item tem largura de 36 (w={9} = 36px) + espaço de 8px entre eles
    const itemWidth = 44; // 36 + 8
    const scrollPosition = Math.max(0, (currentQuestion - 2) * itemWidth);
    progressScrollRef.current?.scrollTo({ x: scrollPosition, animated: true });
  }, [currentQuestion]);

  // Seleciona uma resposta
  const handleSelectAnswer = useCallback((questionIndex: number, value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });

    // Avança para a próxima pergunta após um breve delay
    if (questionIndex < 20) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 300);
    }
  }, []);

  // Navega para uma pergunta específica
  const handleGoToQuestion = useCallback((index: number) => {
    setCurrentQuestion(index);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  // Submete o formulário
  const handleSubmit = useCallback(async () => {
    // Verifica se todas as perguntas foram respondidas
    const unansweredIndex = answers.findIndex((a) => a === undefined);
    if (unansweredIndex !== -1) {
      showError({
        title: 'Formulário incompleto',
        description: `Por favor, responda a pergunta ${unansweredIndex + 1}`,
      });
      setCurrentQuestion(unansweredIndex);
      return;
    }

    setIsSubmitting(true);
    try {
      const assessment = await saveAssessment(answers as number[]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      showSuccess({
        title: 'Avaliação concluída!',
        description: 'Seus resultados estão prontos.',
      });

      // Navega para a tela de resultado
      navigation.navigate('mentalHealthResult', { assessmentId: assessment.id });
    } catch (error) {
      showError({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a avaliação. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, navigation, showError, showSuccess]);

  return (
    <VStack flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <VStack pt={16} flex={1}>
        <HeaderTitle title="Saúde Mental" withBackButton={() => navigation.goBack()} />

        {/* Instrução e referência DASS-21 */}
        <Box mx={6} mb={3} bg="purple.50" px={4} py={3} borderRadius={10}>
          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1}>
              <Text fontSize={12} fontWeight={700} color="purple.800">
                Bora cuidar da mente?
              </Text>
              <Text fontSize={12} fontWeight={500} color="purple.600" mt={0.5}>
                Um teste rápido pra entender como você está por dentro.
              </Text>
            </VStack>
            <Box bg="purple.100" px={3} py={1.5} borderRadius={8}>
              <Text fontSize={13} fontWeight={800} color="purple.700">
                {answeredCount}/21
              </Text>
            </Box>
          </HStack>
        </Box>

        {/* Navegação por perguntas */}
        <Box h={12} mb={3}>
          <ScrollView
            ref={progressScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, alignItems: 'center' }}
          >
            <HStack space={2} alignItems="center">
              {answers.map((answer, index) => (
                <Pressable key={index} onPress={() => handleGoToQuestion(index)}>
                  <Box
                    w={9}
                    h={9}
                    borderRadius={10}
                    bg={currentQuestion === index ? 'purple.400' : answer !== undefined ? 'purple.100' : 'gray.200'}
                    alignItems="center"
                    justifyContent="center"
                    borderWidth={currentQuestion === index ? 2 : 0}
                    borderColor="purple.600"
                  >
                    <Text
                      fontSize={13}
                      fontWeight={700}
                      color={currentQuestion === index ? 'white' : answer !== undefined ? 'purple.600' : 'gray.500'}
                    >
                      {index + 1}
                    </Text>
                  </Box>
                </Pressable>
              ))}
            </HStack>
          </ScrollView>
        </Box>

        {/* Conteúdo da pergunta atual */}
        <ScrollView ref={scrollRef} flex={1} showsVerticalScrollIndicator={false}>
          <Animated.View key={currentQuestion} entering={FadeInRight.duration(300)}>
            <VStack mx={6} mb={4}>
              {/* Número e pergunta */}
              <HStack alignItems="center" space={3} mb={4}>
                <Box
                  bg="purple.500"
                  w={9}
                  h={9}
                  borderRadius={9}
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Text fontSize={15} fontWeight={800} color="white">
                    {currentQuestion + 1}
                  </Text>
                </Box>
                <Text flex={1} fontSize={15} fontWeight={600} color="gray.800" lineHeight={22}>
                  {DASS21_QUESTIONS[currentQuestion]}
                </Text>
              </HStack>

              {/* Opções de resposta */}
              <VStack space={3}>
                {RESPONSE_OPTIONS.map((option) => {
                  const isSelected = answers[currentQuestion] === option.value;
                  return (
                    <Pressable key={option.value} onPress={() => handleSelectAnswer(currentQuestion, option.value)}>
                      <Box
                        bg={isSelected ? 'violet.50' : 'white'}
                        borderWidth={2}
                        borderColor={isSelected ? 'violet.400' : 'gray.200'}
                        borderRadius={12}
                        p={4}
                        shadow={isSelected ? 2 : 0}
                      >
                        <HStack alignItems="center" space={3}>
                          <Box
                            w={6}
                            h={6}
                            borderRadius={12}
                            borderWidth={2}
                            borderColor={isSelected ? 'violet.400' : 'gray.300'}
                            bg={isSelected ? 'violet.400' : 'transparent'}
                            alignItems="center"
                            justifyContent="center"
                          >
                            {isSelected && <Box w={2} h={2} borderRadius={4} bg="white" />}
                          </Box>
                          <VStack flex={1}>
                            <Text
                              fontSize={14}
                              fontWeight={isSelected ? 700 : 500}
                              color={isSelected ? 'violet.700' : 'gray.700'}
                            >
                              {option.label}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    </Pressable>
                  );
                })}
              </VStack>
            </VStack>
          </Animated.View>

          {/* Navegação entre perguntas */}
          <HStack mx={6} mb={4} justifyContent="space-between" space={3}>
            <Button
              title="Anterior"
              variant="secondary"
              size="md"
              flex={1}
              bg="purple.100"
              textColor="purple.600"
              _pressed={{ bg: 'purple.200' }}
              isDisabled={currentQuestion === 0}
              onPress={() => handleGoToQuestion(currentQuestion - 1)}
            />
            {currentQuestion === 20 ? (
              <Button
                title={isSubmitting ? 'Salvando...' : 'Concluir'}
                variant="primary"
                size="md"
                flex={1}
                bg="purple.500"
                _pressed={{ bg: 'purple.600' }}
                isLoading={isSubmitting}
                isDisabled={answers[currentQuestion] === undefined}
                onPress={handleSubmit}
              />
            ) : (
              <Button
                bg="purple.500"
                _pressed={{ bg: 'purple.600' }}
                title="Próxima"
                variant="primary"
                size="md"
                flex={1}
                isDisabled={answers[currentQuestion] === undefined}
                onPress={() => handleGoToQuestion(currentQuestion + 1)}
              />
            )}
          </HStack>

          {/* Espaço extra no final */}
          <Box h={40} />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
