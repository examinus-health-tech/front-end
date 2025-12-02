import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, IScrollViewProps, View, Image, Badge, Center } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api } from 'src/services/api';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useCallback } from 'react';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BellIcon, CalendarIcon, ChevronRightIcon, MoreIcon } from '@assets/icons';
import Vector from '@assets/png/vector-22.png';
import Vector2 from '@assets/png/vector-30.png';
import Vector3 from '@assets/png/vector-39.png';
import Vector4 from '@assets/png/vector-32.png';
import Vector5 from '@assets/png/vector-37b.png';
import ChatHealthImage from '@assets/png/chat-health.png';
import Vector6 from '@assets/png/vector-38.png';
import Vector7 from '@assets/png/vector-39.png';
import Vector8 from '@assets/png/vector-40.png';
import Vector9 from '@assets/png/vector-44.png';
import Vector10 from '@assets/png/vector-45.png';

// components
import { StatusCards } from '@components/molecules';
import { useAuth } from 'src/hooks/useAuth';
import { useHome } from 'src/hooks/useHome';

// Função helper para determinar o texto baseado no score
function getScoreText(score: number): string {
  if (score <= 500) {
    return 'Xiii, deu ruim! O seu score de saúde tá ruim. Você precisa dar uma olhada nisso. Procure um médico e atualize os seus exames periodicamente, a revisão precisa ser mais frequente!';
  } else if (score > 500 && score <= 800) {
    return 'Seu score de saúde tá mais ou menos. É hora de ajustar algumas coisinhas aí por dentro do seu corpo. Nada de pânico, mas bora dar uma atenção a mais pra não deixar isso virar um problemão.';
  } else {
    return 'Tá mandando muito bem! O seu score de saúde tá acima da média, e isso mostra que você tá cuidando bem do seu corpo. Parabéns e continue assim!';
  }
}

export function Homepage() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userWithoutData, setUserWithoutData] = useState<boolean>(true);
  const [userTrackerData, setUserTrackerData] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user, getUserInfo, isLoading } = useAuth();
  const { getHomeData, homeData, trackerData, isLoadingHomeContext } = useHome();

  async function onRefresh() {
    setIsRefreshing(true);
    try {
      await getHomeData();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setIsRefreshing(false);
    }
  }

  // Busca contagem de notificações não lidas
  async function fetchUnreadCount() {
    try {
      const response = await api.get('/notifications');
      const notifications = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const count = notifications.filter((n: any) => !n.read).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  }
  const { width, height } = useWindowDimensions();

  const weekday = new Date().toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  const date = new Date()
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/de/g, '')
    .replace('.', '');

  async function handleGetHeathData() {
    await getHomeData();
  }

  useEffect(() => {
    const hasNoGeneralScore = !homeData.generalScore;
    const hasNoSystemsScore = !homeData.medicalExamOrganicSystemsScore?.length;

    setUserWithoutData(hasNoGeneralScore && hasNoSystemsScore);
  }, [homeData.generalScore, homeData.medicalExamOrganicSystemsScore?.length]);

  useEffect(() => {
    if (
      !trackerData.kcal ||
      !trackerData.step ||
      !trackerData.weight ||
      !trackerData.hydration ||
      !trackerData.nutrition ||
      !trackerData.sleep
    ) {
      setUserTrackerData(true);
    } else setUserTrackerData(false);
  }, [trackerData]);

  useEffect(() => {
    // getUserInfo(); // Comentado: endpoint não aceita Bearer token, dados já vêm do JWT
    getHomeData();
    console.log('🚀 Homepage useEffect', user);
  }, []);

  // Rola para o topo e recarrega dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo?.({ x: 0, y: 0, animated: false });
      // getUserInfo(); // Comentado: endpoint não aceita Bearer token
      getHomeData();
      fetchUnreadCount();
      console.log('🔄 Homepage recarregada ao ganhar foco');
    }, [])
  );

  function renderCardSystems() {
    const systems = homeData.medicalExamOrganicSystemsScore;

    // Validação segura do array
    if (!systems || !Array.isArray(systems) || systems.length === 0) {
      return null;
    }

    // Array de ícones disponíveis (excluindo Vector10 que é reservado para Coração)
    const availableIcons = [Vector9, Vector3, Vector4, Vector5, Vector6, Vector7, Vector8];
    let availableIconIndex = 0;

    const getColorByScore = (score: number) => {
      if (score >= 0 && score <= 333) {
        return { title: 'alto', bgColor: 'red.400' };
      } else if (score > 333 && score <= 666) {
        return { title: 'normal', bgColor: 'dark_blue.200' };
      } else if (score > 666 && score <= 1000) {
        return { title: 'excelente', bgColor: 'ciano.300' };
      }
      return { title: 'risco normal', bgColor: 'dark_blue.200' };
    };

    return systems.map((system, index) => {
      if (index <= 2) {
        const colorStyle = getColorByScore(system.organicSystemScore);

        // Determinar o ícone baseado na descrição do sistema
        let icon;
        if (system.examOrganicSystemDescription?.toLowerCase().includes('coração')) {
          icon = Vector10;
        } else {
          icon = availableIcons[availableIconIndex] || Vector3;
          availableIconIndex++;
        }

        return (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('healthWallet')}>
            <Box bg={colorStyle.bgColor} rounded="2xl" w={144} h={144} shadow={4} px={4} justifyContent="center">
              <VStack space={2}>
                <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                  {system.examOrganicSystemDescription}
                </Text>

                <Center>
                  <Image source={icon} alt="Vetor" resizeMode="contain" size={14} />
                </Center>

                <Text color="white" fontSize={12} fontWeight={600} letterSpacing={-0.16} textTransform="uppercase">
                  Risco: {colorStyle.title}
                </Text>
              </VStack>
            </Box>
          </TouchableOpacity>
        );
      }
      return null;
    });
  }

  return (
    <View>
      {isLoading || isLoadingHomeContext ? (
        <ContentLoader viewBox={`0 0 ${width} ${height}`} backgroundColor="#d5d5d5" foregroundColor="#ebebeb">
          {/* Ícone de Notificação */}
          <Rect x={width - 24 - 72} y={100} rx="14" ry="14" width={60} height={60} />

          {/* Data e Calendário */}
          <Rect x="24" y="96" rx="8" ry="8" width={120} height={16} />

          {/* Nome do usuário */}
          <Rect x="24" y="128" rx="8" ry="8" width={200} height={32} />

          {/* Subtítulo */}
          <Rect x="24" y="170" rx="8" ry="8" width={180} height={14} />
          <Rect x="24" y="190" rx="8" ry="8" width={150} height={14} />

          {/* Card Score X */}
          <Rect x="24" y="230" rx="12" ry="12" width={width - 48} height={120} />

          {/* Título Health Wallet */}
          <Rect x="24" y="374" rx="8" ry="8" width={120} height={20} />

          {/* Cards Health Wallet - 3 cards lado a lado */}
          <Rect x="24" y="404" rx="16" ry="16" width={144} height={144} />
          <Rect x="180" y="404" rx="16" ry="16" width={144} height={144} />
          <Rect x="336" y="404" rx="16" ry="16" width={144} height={144} />

          {/* Título Rastreador Fitness */}
          <Rect x="24" y="564" rx="8" ry="8" width={150} height={20} />

          {/* Cards Rastreador - 2 linhas com 2 cards cada */}
          <Rect x="24" y="594" rx="12" ry="12" width={(width - 60) / 2} height={100} />
          <Rect x={24 + (width - 60) / 2 + 12} y="594" rx="12" ry="12" width={(width - 60) / 2} height={100} />
          <Rect x="24" y="706" rx="12" ry="12" width={(width - 60) / 2} height={100} />
          <Rect x={24 + (width - 60) / 2 + 12} y="706" rx="12" ry="12" width={(width - 60) / 2} height={100} />

          {/* Título Fale com Doutor X */}
          <Rect x="24" y="826" rx="8" ry="8" width={180} height={20} />

          {/* Card Chatbot */}
          <Rect x="24" y="856" rx="12" ry="12" width={width - 48} height={150} />
        </ContentLoader>
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0CC1AF" colors={['#0CC1AF']} />
          }
        >
          <VStack flex={1} pb={24} pt={20} mx={6} mb={16}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <VStack>
                <HStack alignItems={'center'} mb={4}>
                  <CalendarIcon />
                  <Text fontSize={12} fontWeight={600} letterSpacing={-0.12} color={'gray.400'} ml={2}>
                    {`${weekday}, ${date}`}
                  </Text>
                </HStack>
                <Text fontSize={30} fontWeight={800} letterSpacing={-1.2} lineHeight={38} color={'gray.900'} mb={2}>
                  {`Olá, ${(() => {
                    // Se fullName contém @ (é email), usar o campo name
                    if (user?.fullName?.includes('@')) {
                      return user?.name?.split(' ')?.[0] ?? 'Usuário';
                    }
                    // Caso contrário, usar fullName normalmente
                    return user?.fullName?.split(' ')?.[0] ?? user?.name?.split(' ')?.[0] ?? 'Usuário';
                  })()}! 👋`}
                </Text>

                <Text fontSize={12} fontWeight={400} letterSpacing={-0.12} color={'gray.400'}>
                  Hoje é um belo dia para{'\n'}
                  cuidar da sua saúde! :)
                </Text>
              </VStack>

              <TouchableOpacity onPress={() => navigation.navigate('notifications')}>
                <Box w={14} h={14} bg={'white'} borderRadius={14} alignItems={'center'} justifyContent={'center'}>
                  {unreadCount > 0 && (
                    <Box
                      bg={'#FA4D5E'}
                      minW={5}
                      h={5}
                      px={unreadCount > 9 ? 1 : 0}
                      borderRadius={10}
                      alignItems={'center'}
                      justifyContent={'center'}
                      position={'absolute'}
                      zIndex={1}
                      right={3}
                      top={3}
                    >
                      <Text color={'white'} fontSize={10} fontWeight={800}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </Box>
                  )}
                  <BellIcon size={'32'} color={'#1E293B'} />
                </Box>
              </TouchableOpacity>
            </HStack>

            <TouchableOpacity
              onPress={() => !userWithoutData && navigation.navigate('healthWallet')}
              disabled={userWithoutData}
              activeOpacity={userWithoutData ? 1 : 0.7}
            >
              <Box w="100%" h="auto" bg={'white'} px={4} py={4} mt={8} borderRadius={12}>
                <HStack space={4} alignItems={'flex-start'}>
                  <Box
                    size={24}
                    bg={userWithoutData ? 'gray.300' : 'purple.600'}
                    borderRadius={14}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <Image
                      source={Vector}
                      defaultSource={Vector}
                      alt="Vetor"
                      resizeMode="cover"
                      size={24}
                      opacity={70}
                      borderRadius={12}
                      position="absolute"
                    />

                    <Text color={'white'} fontSize={36} fontWeight={800} letterSpacing={-1.2} lineHeight={36}>
                      {homeData.generalScore ? Math.round(homeData.generalScore) : '?'}
                    </Text>
                  </Box>

                  <VStack flex={1}>
                    <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                      Score X
                    </Text>

                    {userWithoutData ? (
                      <View>
                        <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={3}>
                          Você não possui dados de exames{'\n'}a serem analisados.
                        </Text>

                        <Text
                          fontSize={12}
                          fontWeight={500}
                          lineHeight={19.2}
                          mt={1}
                          color="ciano.400"
                          onPress={() => navigation.navigate('upload')}
                        >
                          Clique aqui e importe seu exame {'>'}
                        </Text>
                      </View>
                    ) : (
                      <View flex={1} display="flex">
                        <Text fontSize={12} fontWeight={500} lineHeight={16} mt={2}>
                          {getScoreText(homeData.generalScore || 0)}

                          {/* {homeData.generalScoreActionRecommendation?.replace('\r\n', ' ')} */}
                        </Text>

                        <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={1} color="purple.700">
                          Monitorar saúde {'>'}
                        </Text>

                        <Text fontSize={10} fontWeight={400} color="gray.500" mt={2} lineHeight={12}>
                          Apenas informativo. Consulte seu médico.
                        </Text>
                      </View>
                    )}
                  </VStack>
                </HStack>
              </Box>
            </TouchableOpacity>

            <HStack mt={6} justifyContent={'space-between'}>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Health Wallet
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate('healthWallet')}>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            <HStack h={165}>
              <ScrollView horizontal ref={scrollRef} mx={-6} showsHorizontalScrollIndicator={false}>
                {userWithoutData ? (
                  <HStack space={3} mx={6} alignItems="center">
                    <Box bg={'gray.300'} rounded="2xl" w={144} h={144} shadow={4} px={4} justifyContent="center">
                      <VStack space={2}>
                        <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                          Hormônios
                        </Text>

                        <Center>
                          <Image source={Vector6} alt="Vetor" resizeMode="contain" size={14} />
                        </Center>

                        <Text
                          color="white"
                          fontSize={12}
                          fontWeight={600}
                          letterSpacing={-0.16}
                          textTransform="uppercase"
                        >
                          Risco:
                        </Text>
                      </VStack>
                    </Box>

                    <Box bg={'gray.300'} rounded="2xl" w={144} h={144} shadow={4} px={4} justifyContent="center">
                      <VStack space={2}>
                        <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                          Imunidade
                        </Text>

                        <Center>
                          <Image source={Vector7} alt="Vetor" resizeMode="contain" size={14} />
                        </Center>

                        <Text
                          color="white"
                          fontSize={12}
                          fontWeight={600}
                          letterSpacing={-0.16}
                          textTransform="uppercase"
                        >
                          Risco:
                        </Text>
                      </VStack>
                    </Box>

                    <Box bg={'gray.300'} rounded="2xl" w={144} h={144} shadow={4} px={4} justifyContent="center">
                      <VStack space={2}>
                        <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                          Coração
                        </Text>

                        <Center>
                          <Image source={Vector10} alt="Vetor" resizeMode="contain" size={14} />
                        </Center>

                        <Text
                          color="white"
                          fontSize={12}
                          fontWeight={600}
                          letterSpacing={-0.16}
                          textTransform="uppercase"
                        >
                          Risco:
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                ) : (
                  <HStack space={3} mx={6} alignItems="center">
                    {renderCardSystems()}
                  </HStack>
                )}

                {homeData?.medicalExamOrganicSystemsScore?.length > 3 && (
                  <VStack alignItems="center" justifyContent="center" marginRight={6}>
                    <TouchableOpacity onPress={() => navigation.navigate('healthWallet')}>
                      <Center>
                        <Text fontSize={16} fontWeight={500} letterSpacing={-0.16}>
                          ver mais
                        </Text>
                        <ChevronRightIcon size="32" color="#0CC1AF" />
                      </Center>
                    </TouchableOpacity>
                  </VStack>
                )}
              </ScrollView>
            </HStack>

            <HStack mt={4} justifyContent={'space-between'} alignItems={'center'}>
              <HStack alignItems={'center'} space={2}>
                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                  Rastreador Fitness
                </Text>
                <Badge bg="gray.400" borderRadius={6} _text={{ color: 'white', fontSize: 10 }}>
                  EM BREVE
                </Badge>
              </HStack>

              <TouchableOpacity onPress={() => navigation.navigate('tracker')}>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            {<StatusCards userTrackerData={userTrackerData} />}

            <HStack mt={8} justifyContent={'space-between'} alignItems={'center'}>
              <HStack alignItems={'center'} space={2}>
                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                  Fale com o Doutor X
                </Text>
                <Badge bg="gray.400" borderRadius={6} _text={{ color: 'white', fontSize: 10 }}>
                  EM BREVE
                </Badge>
              </HStack>

              <TouchableOpacity>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            <Box w="100%" bg={'white'} borderRadius={12} mt={4} overflow="hidden" position="relative" h={170}>
              <VStack py={4} px={4} position="absolute" left={0} top={0} zIndex={1} space={1}>
                <Badge
                  bg="gray.100"
                  borderRadius={4}
                  px={2}
                  py={0.5}
                  _text={{ color: 'gray.400', fontSize: 10, fontWeight: 600 }}
                >
                  BÁSICO
                </Badge>
                <HStack alignItems="baseline" space={1}>
                  <Text fontSize={32} fontWeight={800} color="gray.900">
                    192
                  </Text>
                  <Text fontSize={14} fontWeight={500} color="gray.500">
                    Total
                  </Text>
                </HStack>
                <Text fontSize={14} fontWeight={600} lineHeight={18} color="gray.800">
                  Bate-papo sobre{'\n'}Saúde e bem estar
                </Text>
              </VStack>

              <Image
                source={ChatHealthImage}
                alt="Chat Health"
                resizeMode="cover"
                position="absolute"
                right={-1}
                bottom={0}
                top={0}
                w={180}
                h={170}
                borderTopRightRadius={12}
                borderBottomRightRadius={12}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </View>
  );
}
