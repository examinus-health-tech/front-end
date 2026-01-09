import { useEffect, useRef, useState, useCallback } from 'react';
import { TouchableOpacity, useWindowDimensions, StatusBar } from 'react-native';
import { CustomRefreshControl } from '@components/atoms';
import { VStack, Text, Box, HStack, ScrollView, View, Image, Badge, Center, Avatar } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { api } from 'src/services/api';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
  MoreIcon,
  UserIcon,
  FigIcon,
  ImuIcon,
  PanIcon,
  RinIcon,
  SanIcon,
  HeartIcon,
  IntestineIcon,
  UrinaIcon,
  FlaskIcon,
} from '@assets/icons';
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
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from 'src/hooks/useAuth';
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

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

// Função helper para obter cor baseada no score (consistente com Health Wallet)
function getScoreColor(score: number): string {
  if (score >= 0 && score <= 333) {
    return '#FA4D5E'; // Vermelho - risco alto
  } else if (score > 333 && score <= 666) {
    return '#0CC1AF'; // Verde/Ciano - normal
  } else if (score > 666 && score <= 1000) {
    return '#8A3FFC'; // Roxo - excelente
  }
  return '#0CC1AF';
}

export function Homepage() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userWithoutData, setUserWithoutData] = useState<boolean>(true);
  const [userTrackerData, setUserTrackerData] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const scrollRef = useRef<any>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user, getUserInfo, isLoading } = useAuth();
  const { getHomeData, homeData, trackerData, isLoadingHomeContext, fitnessEnabled, refreshFitnessData } = useHome();
  const { showTabBar } = useTabBar();


  async function onRefresh() {
    console.log('🔄 onRefresh chamado na homepage');
    setIsRefreshing(true);
    try {
      await getHomeData();
      await fetchUnreadCount();
      await refreshFitnessData();
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
    .replace(/ de /g, ' ')
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
      // Forçar StatusBar dark-content com pequeno delay para garantir
      // que execute após qualquer modal/actionsheet fechar
      const timer = setTimeout(() => {
        StatusBar.setBarStyle('dark-content');
      }, 100);

      scrollRef.current?.scrollTo?.({ x: 0, y: 0, animated: false });
      showTabBar();
      getHomeData();
      fetchUnreadCount();

      return () => clearTimeout(timer);
    }, [])
  );

  function renderCardSystems() {
    const systems = homeData.medicalExamOrganicSystemsScore;

    // Validação segura do array
    if (!systems || !Array.isArray(systems) || systems.length === 0) {
      return null;
    }

    const getColorByScore = (score: number) => {
      if (score >= 0 && score <= 333) {
        return { title: 'alto', bgColor: 'red.400' };
      } else if (score > 333 && score <= 666) {
        return { title: 'normal', bgColor: 'ciano.300' };
      } else if (score > 666 && score <= 1000) {
        return { title: 'excelente', bgColor: 'purple.600' };
      }
      return { title: 'risco normal', bgColor: 'ciano.300' };
    };

    // Mapeamento de ícones SVG por sistema (igual ao Health Wallet)
    function renderIcon(systemDescription: string) {
      const system = systemDescription?.toLowerCase();
      const iconColor = 'white';
      const iconSize = '48';

      if (system?.includes('fígado')) return <FigIcon size={iconSize} color={iconColor} />;
      if (system?.includes('imunidade')) return <ImuIcon size={iconSize} color={iconColor} />;
      if (system?.includes('pâncreas')) return <PanIcon size={iconSize} color={iconColor} />;
      if (system?.includes('rins') || system?.includes('rim')) return <RinIcon size={iconSize} color={iconColor} />;
      if (system?.includes('sangue')) return <SanIcon size={iconSize} color={iconColor} />;
      if (system?.includes('coração')) return <HeartIcon size={iconSize} color={iconColor} />;
      if (system?.includes('intestino')) return <IntestineIcon size={iconSize} color={iconColor} />;
      if (system?.includes('urina') || system?.includes('urinário')) return <UrinaIcon size={iconSize} color={iconColor} />;

      // Ícone padrão para sistemas não mapeados
      return <FlaskIcon size={iconSize} color={iconColor} />;
    }

    return systems.map((system, index) => {
      if (index <= 2) {
        const colorStyle = getColorByScore(system.organicSystemScore);

        return (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('healthWallet')}>
            <Box bg={colorStyle.bgColor} rounded="2xl" w={144} h={144} shadow={4} px={4} justifyContent="center">
              <VStack space={2}>
                <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                  {system.examOrganicSystemDescription}
                </Text>

                <Center>
                  {renderIcon(system.examOrganicSystemDescription)}
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
    <View flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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

          {/* Card Score X - layout centralizado igual Health Wallet */}
          <Rect x="24" y="230" rx="12" ry="12" width={width - 48} height={260} />
          {/* Círculo do Score dentro do card */}
          <Circle cx={width / 2} cy={310} r={60} />

          {/* Título Health Wallet */}
          <Rect x="24" y="514" rx="8" ry="8" width={120} height={20} />

          {/* Cards Health Wallet - 3 cards lado a lado */}
          <Rect x="24" y="544" rx="16" ry="16" width={144} height={144} />
          <Rect x="180" y="544" rx="16" ry="16" width={144} height={144} />
          <Rect x="336" y="544" rx="16" ry="16" width={144} height={144} />

          {/* Título Rastreador Fitness */}
          <Rect x="24" y="704" rx="8" ry="8" width={150} height={20} />

          {/* Cards Rastreador - 2 linhas com 2 cards cada */}
          <Rect x="24" y="734" rx="12" ry="12" width={(width - 60) / 2} height={100} />
          <Rect x={24 + (width - 60) / 2 + 12} y="734" rx="12" ry="12" width={(width - 60) / 2} height={100} />
          <Rect x="24" y="846" rx="12" ry="12" width={(width - 60) / 2} height={100} />
          <Rect x={24 + (width - 60) / 2 + 12} y="846" rx="12" ry="12" width={(width - 60) / 2} height={100} />

          {/* Título Fale com Doutor X */}
          <Rect x="24" y="966" rx="8" ry="8" width={180} height={20} />

          {/* Card Chatbot */}
          <Rect x="24" y="996" rx="12" ry="12" width={width - 48} height={150} />
        </ContentLoader>
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <CustomRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <VStack flex={1} pb={24} pt={20} mx={6} mb={16}>
            {/* Header com saudação - animação 1 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(0) : undefined}>
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
            </Animated.View>

            {/* Score X - animação 2 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(100) : undefined}>
              <TouchableOpacity
                onPress={() => navigation.navigate(userWithoutData ? 'upload' : 'healthWallet')}
                activeOpacity={0.7}
              >
                <Box w="100%" h="auto" bg={'white'} px={4} py={5} mt={8} borderRadius={12} shadow={2}>
                  <VStack alignItems={'center'}>
                    <AnimatedCircularProgress
                      size={150}
                      lineCap="round"
                      width={18}
                      fill={userWithoutData ? 0 : Math.round((homeData.generalScore || 0) / 10)}
                      rotation={270}
                      tintColor={userWithoutData ? '#D1D5DB' : getScoreColor(homeData.generalScore || 0)}
                      backgroundColor="#DCE1E8"
                      arcSweepAngle={180}
                    >
                      {() => (
                        <Avatar
                          size="50px"
                          mt={-4}
                          bg="gray.300"
                          source={
                            user?.profilePhotoBase64 || user?.photoUrl
                              ? { uri: user?.profilePhotoBase64 || user?.photoUrl }
                              : undefined
                          }
                        >
                          {!(user?.profilePhotoBase64 || user?.photoUrl) && (
                            user?.fullName ? (
                              user.fullName
                                .split(' ')
                                .filter(Boolean)
                                .map((name) => name[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()
                            ) : (
                              <UserIcon color="#6B7280" size="24" />
                            )
                          )}
                        </Avatar>
                      )}
                    </AnimatedCircularProgress>

                    <Text mt={-12} fontSize={40} fontWeight={800} letterSpacing={-1.44} lineHeight={44}>
                      {homeData.generalScore ? Math.round(homeData.generalScore) : '?'}
                    </Text>

                    <Text mt={-2} fontSize={24} fontWeight={800} letterSpacing={-0.16}>
                      Score X
                    </Text>

                    {userWithoutData ? (
                      <VStack alignItems="center" mt={2}>
                        <Text fontSize={12} fontWeight={500} lineHeight={19.2} textAlign="center" color="gray.600">
                          Você não possui dados de exames a serem analisados.
                        </Text>
                        <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={1} color="ciano.400">
                          Toque para importar seu exame {'>'}
                        </Text>
                      </VStack>
                    ) : (
                      <VStack alignItems="center" mt={2}>
                        <Text color="gray.600" fontSize={12} fontWeight={500} lineHeight={19.2} textAlign="center">
                          {homeData.generalScoreActionRecommendation?.replace('\r\n', '') || getScoreText(homeData.generalScore || 0)}
                        </Text>

                        <Box mt={2} px={3} py={2} bg="orange.50" borderRadius={8} borderWidth={1} borderColor="orange.200">
                          <Text fontSize={10} fontWeight={500} color="gray.700" textAlign="center" lineHeight={14}>
                            ⚠️ Aviso: Esta análise é apenas informativa e não substitui consulta médica.
                          </Text>
                        </Box>
                      </VStack>
                    )}
                  </VStack>
                </Box>
              </TouchableOpacity>
            </Animated.View>

            {/* Health Wallet - animação 3 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(200) : undefined}>
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
            </Animated.View>

            {/* Rastreador Fitness - animação 4 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(300) : undefined}>
              <HStack mt={4} justifyContent={'space-between'} alignItems={'center'}>
                <HStack alignItems={'center'} space={2}>
                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                    Rastreador Fitness
                  </Text>
                  {!fitnessEnabled && (
                    <Badge bg="gray.400" borderRadius={6} _text={{ color: 'white', fontSize: 10 }}>
                      DESABILITADO
                    </Badge>
                  )}
                </HStack>

                <TouchableOpacity onPress={() => navigation.navigate('tracker')}>
                  <MoreIcon />
                </TouchableOpacity>
              </HStack>

              {<StatusCards userTrackerData={!fitnessEnabled} />}
            </Animated.View>

            {/* Fale com Doutor X - animação 5 */}
            <Animated.View
              entering={!hasAnimated ? FadeInDown.duration(400).delay(400) : undefined}
              onLayout={() => !hasAnimated && setHasAnimated(true)}
            >
              <HStack mt={8} alignItems={'center'} space={2}>
                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                  Fale com o Doutor X
                </Text>
                <Badge bg="gray.400" borderRadius={6} _text={{ color: 'white', fontSize: 10 }}>
                  EM BREVE
                </Badge>
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
            </Animated.View>
          </VStack>
        </ScrollView>
      )}
    </View>
  );
}
