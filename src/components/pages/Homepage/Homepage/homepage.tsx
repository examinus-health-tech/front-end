import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { TouchableOpacity, useWindowDimensions, StatusBar, Platform } from 'react-native';
import { CustomRefreshControl } from '@components/atoms';
import { VStack, Text, Box, HStack, ScrollView, View, Image, Badge, Center, Avatar, useDisclose } from 'native-base';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, interpolate } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from 'src/services/api';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  HeadHealthIcon,
  EnergyIcon,
  HormonioIcon,
  TireoideIcon,
  StarIcon,
  ChevronRightSmIcon,
  PillIcon,
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
import { StatusCards, FeatureBanner } from '@components/molecules';
import { BarbellIcon } from '@assets/icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from 'src/hooks/useAuth';
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

// services
import {
  MentalHealthAssessment,
  getLatestAssessment,
  getColorByClassification,
  formatAssessmentDate,
} from '@services/mentalHealthService';
import { getUserPersonalData } from '@services/userService';
import { setFitnessEnabled } from '@services/fitnessService';
import { checkCampaignVoucher } from '@services/campaignService';
import { incrementAppOpenCount, shouldShowReviewPromptOnOpen } from '@services/reviewService';
import { ReviewBottomSheet } from '@components/molecules';

const DISABLE_FITNESS_FEATURE = false;

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

// Função helper para obter cor baseada no score (alinhado com backend)
function getScoreColor(score: number): string {
  if (score >= 0 && score <= 333) {
    return '#FA4D5E'; // Vermelho - risco alto
  } else if (score > 333 && score <= 666) {
    return '#F59E0B'; // Amarelo - atenção
  } else if (score > 666 && score <= 1000) {
    return '#0CC1AF'; // Verde - excelente
  }
  return '#F59E0B';
}

export function Homepage() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userTrackerData, setUserTrackerData] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [dataLoadedForCurrentFocus, setDataLoadedForCurrentFocus] = useState<boolean>(false);

  const isFocused = useIsFocused();
  const [mentalHealthAssessment, setMentalHealthAssessment] = useState<MentalHealthAssessment | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const scrollRef = useRef<any>(null);
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclose();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user, getUserInfo, isLoading, updateUserPhoto } = useAuth();
  const { getHomeData, homeData, trackerData, isLoadingHomeContext, hasProcessingExams, fitnessEnabled, refreshFitnessData } = useHome();
  const { showTabBar } = useTabBar();

  // Pulse animation para shadow do card em análise
  const pulseValue = useSharedValue(0);
  useEffect(() => {
    if (hasProcessingExams) {
      pulseValue.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    }
  }, [hasProcessingExams]);
  const pulseCardStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      shadowOpacity: interpolate(pulseValue.value, [0, 1], [0.35, 0.55]),
      shadowRadius: interpolate(pulseValue.value, [0, 1], [10, 20]),
      elevation: interpolate(pulseValue.value, [0, 1], [4, 24]),
    };
  });

  // Calcula userWithoutData de forma síncrona (durante o render) para evitar flicker
  const userWithoutData = useMemo(() => {
    const hasNoGeneralScore = !homeData.generalScore;
    const hasNoSystemsScore = !homeData.medicalExamOrganicSystemsScore?.length;
    return hasNoGeneralScore && hasNoSystemsScore;
  }, [homeData.generalScore, homeData.medicalExamOrganicSystemsScore?.length]);

  // Busca a última avaliação de saúde mental
  async function fetchMentalHealthAssessment() {
    try {
      const assessment = await getLatestAssessment();
      setMentalHealthAssessment(assessment);
    } catch (error) {
      if (__DEV__) console.error('Erro ao buscar avaliação de saúde mental:', error);
    }
  }

  // Busca voucher da campanha
  async function fetchVoucher() {
    if (!user?.email) return;
    try {
      const result = await checkCampaignVoucher(user.email);
      if (result.success && result.voucher) {
        setVoucherCode(result.voucher);
      } else {
        setVoucherCode(null);
      }
    } catch (error) {
      if (__DEV__) console.log('📢 [HOME] Erro ao buscar voucher:', error);
      setVoucherCode(null);
    }
  }

  async function onRefresh() {
    if (__DEV__) console.log('🔄 onRefresh chamado na homepage');
    setIsRefreshing(true);
    try {
      await getHomeData();
      await fetchUnreadCount();
      await refreshFitnessData();
      await fetchMentalHealthAssessment();
      await fetchVoucher();
    } catch (error) {
      if (__DEV__) console.error('Erro ao atualizar:', error);
    } finally {
      setIsRefreshing(false);
    }
  }

  // Busca contagem de notificações não lidas
  async function fetchUnreadCount() {
    try {
      // Timestamp para forçar bypass de cache no iOS
      // withCredentials: false para não enviar cookies antigos
      const response = await api.get(`notifications?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        withCredentials: false,
      });
      const notifications = Array.isArray(response.data) ? response.data : response.data?.data || [];
      const count = notifications.filter((n: any) => !n.read).length;
      if (__DEV__) console.log('🔔 Notificações não lidas:', count, 'para userId:', user?.userId);
      setUnreadCount(count);
    } catch (error) {
      if (__DEV__) console.error('Erro ao buscar notificações:', error);
      setUnreadCount(0);
    }
  }
  const { width, height } = useWindowDimensions();

  const today = new Date();
  const weekday = format(today, 'EEE', { locale: ptBR }).slice(0, 3);
  const date = format(today, "d MMM yyyy", { locale: ptBR });

  async function handleGetHeathData() {
    await getHomeData();
  }

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

  // Função para carregar foto de perfil
  async function loadProfilePhoto() {
    if (user?.profilePhotoBase64) return; // Já tem foto

    try {
      const profileData = await getUserPersonalData();
      if (profileData?.profilePhotoBase64) {
        updateUserPhoto(profileData.profilePhotoBase64);
      }
    } catch (error) {
      if (__DEV__) console.log('⚠️ [HOMEPAGE] Erro ao buscar foto de perfil:', error);
    }
  }

  // Reset de estados quando o usuário mudar (login/logout/troca de conta)
  useEffect(() => {
    if (__DEV__) console.log('🔄 Usuário mudou, resetando estados da homepage:', user?.userId);
    setUnreadCount(0);
    setMentalHealthAssessment(null);
    setHasAnimated(false);
    setVoucherCode(null);

    if (user?.userId) {
      getHomeData();
      fetchUnreadCount();
      fetchMentalHealthAssessment();
      fetchVoucher();
      loadProfilePhoto();
    }
  }, [user?.userId]);

  // Incrementa contador de aberturas e verifica se deve mostrar prompt de review
  useEffect(() => {
    async function checkReviewPrompt() {
      if (!user?.userId) return;

      await incrementAppOpenCount();
      const shouldShow = await shouldShowReviewPromptOnOpen();

      if (shouldShow) {
        // Pequeno delay para não mostrar imediatamente ao abrir
        setTimeout(() => {
          onReviewOpen();
        }, 2000);
      }
    }

    checkReviewPrompt();
  }, [user?.userId]);

  // Reset do estado de dados carregados quando perde foco
  useEffect(() => {
    if (!isFocused) {
      setDataLoadedForCurrentFocus(false);
      setHasAnimated(false);
    }
  }, [isFocused]);

  // Rola para o topo e recarrega dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      // Só busca dados se tiver usuário logado
      if (!user?.userId) return;

      // Forçar StatusBar dark-content com pequeno delay para garantir
      // que execute após qualquer modal/actionsheet fechar
      const timer = setTimeout(() => {
        StatusBar.setBarStyle('dark-content');
      }, 100);

      scrollRef.current?.scrollTo?.({ x: 0, y: 0, animated: false });
      showTabBar();
      getHomeData();
      fetchUnreadCount();
      fetchMentalHealthAssessment();
      fetchVoucher();

      // Busca foto de perfil se não tiver
      loadProfilePhoto();

      return () => {
        clearTimeout(timer);
      };
    }, [user?.userId, user?.profilePhotoBase64])
  );

  // Marca dados como carregados quando o loading terminar
  useEffect(() => {
    if (!isLoadingHomeContext && isFocused) {
      setDataLoadedForCurrentFocus(true);
    }
  }, [isLoadingHomeContext, isFocused]);

  function renderCardSystems() {
    const systems = homeData.medicalExamOrganicSystemsScore;

    // Validação segura do array
    if (!systems || !Array.isArray(systems) || systems.length === 0) {
      return null;
    }

    const getColorByScore = (score: number) => {
      if (score >= 0 && score <= 333) {
        return { title: 'risco alto', bgColor: 'red.400' };
      } else if (score > 333 && score <= 666) {
        return { title: 'normal', bgColor: 'yellow.500' };
      } else if (score > 666 && score <= 1000) {
        return { title: 'excelente', bgColor: 'ciano.400' };
      }
      return { title: 'normal', bgColor: 'yellow.500' };
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
      if (system?.includes('urina') || system?.includes('urinário'))
        return <UrinaIcon size={iconSize} color={iconColor} />;
      if (system?.includes('hormônio') || system?.includes('hormonio'))
        return <HormonioIcon size={iconSize} color={iconColor} />;
      if (system?.includes('tireóide') || system?.includes('tireoide'))
        return <TireoideIcon size={iconSize} color={iconColor} />;

      // Ícone padrão para sistemas não mapeados
      return <FlaskIcon size={iconSize} color={iconColor} />;
    }

    return systems.map((system, index) => {
      if (index <= 2) {
        const colorStyle = getColorByScore(system.organicSystemScore);

        return (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('healthWallet')}>
            <Box bg={colorStyle.bgColor} rounded="2xl" w={144} h={144} shadow={4} px={4} py={3}>
              <VStack flex={1} justifyContent="space-between">
                {/* Título no topo */}
                <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                  {system.examOrganicSystemDescription}
                </Text>

                {/* Ícone centralizado */}
                <Center>{renderIcon(system.examOrganicSystemDescription)}</Center>

                {/* Risco embaixo */}
                <Text color="white" fontSize={12} fontWeight={600} letterSpacing={-0.16} textTransform="uppercase">
                  {colorStyle.title}
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
    <View testID="screen-homepage" flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {isLoading || isLoadingHomeContext || !dataLoadedForCurrentFocus ? (
        <ContentLoader viewBox={`0 0 ${width} ${height}`} backgroundColor="#E8E8E8" foregroundColor="#F5F5F5">
          {/* Ícone de Notificação */}
          <Rect x={width - 82} y={106} rx="16" ry="16" width={64} height={64} />

          {/* Data e Calendário */}
          <Rect x="24" y="96" rx="6" ry="6" width={100} height={12} />

          {/* Nome do usuário */}
          <Rect x="24" y="118" rx="8" ry="8" width={220} height={28} />

          {/* Subtítulo */}
          <Rect x="24" y="158" rx="6" ry="6" width={180} height={24} />

          {/* Card Score X - fundo branco */}
          <Rect x="24" y="200" rx="12" ry="12" width={width - 48} height={260} />

          {/* Título Carteira de Saúde */}
          <Rect x="24" y="484" rx="6" ry="6" width={140} height={18} />

          {/* Cards Carteira de Saúde - 3 cards lado a lado */}
          <Rect x="24" y="514" rx="16" ry="16" width={140} height={140} />
          <Rect x="172" y="514" rx="16" ry="16" width={140} height={140} />
          <Rect x="320" y="514" rx="16" ry="16" width={140} height={140} />

          {/* Título Saúde Mental */}
          <Rect x="24" y="678" rx="6" ry="6" width={120} height={18} />

          {/* Card Saúde Mental */}
          <Rect x="24" y="708" rx="12" ry="12" width={width - 48} height={100} />

          {/* Título Rastreador Fitness */}
          <Rect x="24" y="832" rx="6" ry="6" width={150} height={18} />

          {/* Cards Rastreador */}
          <Rect x="24" y="862" rx="12" ry="12" width={width - 48} height={90} />
          <Rect x="24" y="964" rx="12" ry="12" width={width - 48} height={90} />
          <Rect x="24" y="1066" rx="12" ry="12" width={width - 48} height={90} />
        </ContentLoader>
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          refreshControl={<CustomRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
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

                  <Text fontSize={14} fontWeight={500} letterSpacing={-0.14} color={'gray.500'}>
                    Hoje é um belo dia para{'\n'}
                    cuidar da sua saúde! :)
                  </Text>
                </VStack>

                <TouchableOpacity testID="btn-notifications" onPress={() => navigation.navigate('notifications')}>
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
                        <Text color={'white'} fontSize={12} fontWeight={800}>
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
            <Animated.View
              entering={!hasAnimated ? FadeInDown.duration(400).delay(100) : undefined}
              style={hasProcessingExams ? [{ marginTop: 32, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 } }, pulseCardStyle] : undefined}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate(userWithoutData ? 'upload' : 'healthWallet')}
                activeOpacity={0.7}
              >
                {/* Faixa superior "Score em análise" */}
                {hasProcessingExams && (
                  <Box borderTopLeftRadius={12} borderTopRightRadius={12} overflow="hidden">
                    <LinearGradient
                      colors={['#00856D', '#00A38B', '#0CC1AF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 34 }}
                    >
                      <Text fontSize={16} fontWeight={800} color="white" textAlign="center">
                        Score em análise
                      </Text>
                    </LinearGradient>
                  </Box>
                )}
                <Box
                  w="100%"
                  h="auto"
                  bg={'white'}
                  px={4}
                  py={5}
                  mt={hasProcessingExams ? -8 : 8}
                  borderRadius={12}
                  borderWidth={hasProcessingExams ? 1.5 : 0}
                  borderTopWidth={0}
                  borderColor="ciano.600"
                  shadow={hasProcessingExams ? 0 : 2}
                >
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
                          {!(user?.profilePhotoBase64 || user?.photoUrl) &&
                            (user?.fullName ? (
                              user.fullName
                                .split(' ')
                                .filter(Boolean)
                                .map((name) => name[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()
                            ) : (
                              <UserIcon color="#6B7280" size="24" />
                            ))}
                        </Avatar>
                      )}
                    </AnimatedCircularProgress>

                    <Text
                      mt={-12}
                      fontSize={40}
                      fontWeight={800}
                      letterSpacing={-1.44}
                      lineHeight={44}
                      color={userWithoutData ? 'gray.900' : getScoreColor(homeData.generalScore || 0)}
                    >
                      {homeData.generalScore ? Math.round(homeData.generalScore) : '?'}
                    </Text>

                    <Text mt={-2} fontSize={24} fontWeight={800} letterSpacing={-0.16}>
                      Score X
                    </Text>

                    {userWithoutData ? (
                      <VStack alignItems="center" mt={2}>
                        <Text fontSize={14} fontWeight={500} lineHeight={20} textAlign="center" color="gray.600">
                          Você não possui dados de exames a serem analisados.
                        </Text>
                        <Text fontSize={14} fontWeight={500} lineHeight={20} mt={1} color="ciano.400">
                          Toque para importar seu exame {'>'}
                        </Text>
                      </VStack>
                    ) : (
                      <VStack alignItems="center" mt={2}>
                        <Text color="gray.600" fontSize={14} fontWeight={500} lineHeight={20} textAlign="center">
                          {homeData.generalScoreActionRecommendation
                            ?.replace('\r\n', '')
                            ?.replace(/acimada/gi, 'acima da') ||
                            getScoreText(homeData.generalScore || 0)}
                        </Text>

                        <Box
                          mt={2}
                          px={3}
                          py={2}
                          bg="orange.50"
                          borderRadius={8}
                          borderWidth={1}
                          borderColor="orange.200"
                        >
                          <Text fontSize={12} fontWeight={500} color="gray.700" textAlign="center" lineHeight={14}>
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
              <HStack mt={6} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                  Carteira de Saúde
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate('healthWallet')}>
                  <Text fontSize={12} fontWeight={600} color={'ciano.400'}>
                    Ver tudo
                  </Text>
                </TouchableOpacity>
              </HStack>

              <HStack h={165}>
                <ScrollView horizontal ref={scrollRef} mx={-6} showsHorizontalScrollIndicator={false}>
                  {userWithoutData ? (
                    <HStack space={3} mx={6} alignItems="center">
                      <Box bg={'gray.300'} rounded="2xl" w={144} h={144} shadow={4} px={4} py={3}>
                        <VStack flex={1} justifyContent="space-between">
                          <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                            Hormônios
                          </Text>
                          <Center>
                            <Image source={Vector6} alt="Vetor" resizeMode="contain" size={12} />
                          </Center>
                          <Text
                            color="white"
                            fontSize={12}
                            fontWeight={600}
                            letterSpacing={-0.16}
                            textTransform="uppercase"
                          >
                            -
                          </Text>
                        </VStack>
                      </Box>

                      <Box bg={'gray.300'} rounded="2xl" w={144} h={144} shadow={4} px={4} py={3}>
                        <VStack flex={1} justifyContent="space-between">
                          <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                            Imunidade
                          </Text>
                          <Center>
                            <Image source={Vector7} alt="Vetor" resizeMode="contain" size={12} />
                          </Center>
                          <Text
                            color="white"
                            fontSize={12}
                            fontWeight={600}
                            letterSpacing={-0.16}
                            textTransform="uppercase"
                          >
                            -
                          </Text>
                        </VStack>
                      </Box>

                      <Box bg={'gray.300'} rounded="2xl" w={144} h={144} shadow={4} px={4} py={3}>
                        <VStack flex={1} justifyContent="space-between">
                          <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16}>
                            Coração
                          </Text>
                          <Center>
                            <Image source={Vector10} alt="Vetor" resizeMode="contain" size={12} />
                          </Center>
                          <Text
                            color="white"
                            fontSize={12}
                            fontWeight={600}
                            letterSpacing={-0.16}
                            textTransform="uppercase"
                          >
                            -
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

            {/* Card Voucher - só aparece se tiver voucher */}
            {voucherCode && (
              <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(220) : undefined}>
                <TouchableOpacity onPress={() => navigation.navigate('bonus')} activeOpacity={0.8}>
                  <Box
                    mt={6}
                    bg="#7B2E8E"
                    borderRadius={16}
                    p={4}
                    shadow={3}
                  >
                    <HStack alignItems="center" justifyContent="space-between">
                      <HStack alignItems="center" space={3} flex={1}>
                        <Box bg="white" p={2} borderRadius={12}>
                          <StarIcon size="24" color="#7B2E8E" />
                        </Box>
                        <VStack flex={1}>
                          <Text fontSize={14} fontWeight={700} color="white">
                            Você tem um voucher!
                          </Text>
                          <Text fontSize={12} fontWeight={500} color="white" opacity={0.9}>
                            Hemograma gratuito disponível
                          </Text>
                        </VStack>
                      </HStack>
                      <HStack alignItems="center" space={1}>
                        <Text fontSize={12} fontWeight={600} color="white">
                          Ver
                        </Text>
                        <ChevronRightSmIcon size="16" color="white" />
                      </HStack>
                    </HStack>
                  </Box>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Saúde Mental - animação 3.5 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(250) : undefined}>
              <HStack mt={6} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                  Saúde Mental
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate('mentalHealthResult')}>
                  <MoreIcon />
                </TouchableOpacity>
              </HStack>

              {mentalHealthAssessment ? (
                <TouchableOpacity onPress={() => navigation.navigate('mentalHealthResult')}>
                  <Box bg="white" borderRadius={12} p={4} mt={4} shadow={2}>
                    <HStack justifyContent="space-between" alignItems="center" mb={3}>
                      <Text fontSize={12} fontWeight={500} color="gray.500">
                        Última avaliação: {formatAssessmentDate(mentalHealthAssessment.date)}
                      </Text>
                      <ChevronRightIcon size="20" color="#0CC1AF" />
                    </HStack>

                    <HStack justifyContent="space-between" space={2}>
                      {/* Depressão */}
                      <Box
                        flex={1}
                        bg={getColorByClassification(mentalHealthAssessment.classifications.depression).bgColor}
                        borderRadius={10}
                        p={3}
                        alignItems="center"
                      >
                        <HeadHealthIcon
                          size="24"
                          color={getColorByClassification(mentalHealthAssessment.classifications.depression).color}
                        />
                        <Text fontSize={12} fontWeight={600} color="gray.700" mt={1}>
                          Depressão
                        </Text>
                        <Text
                          fontSize={12}
                          fontWeight={700}
                          color={getColorByClassification(mentalHealthAssessment.classifications.depression).color}
                        >
                          {getColorByClassification(mentalHealthAssessment.classifications.depression).label}
                        </Text>
                      </Box>

                      {/* Ansiedade */}
                      <Box
                        flex={1}
                        bg={getColorByClassification(mentalHealthAssessment.classifications.anxiety).bgColor}
                        borderRadius={10}
                        p={3}
                        alignItems="center"
                      >
                        <HeartIcon
                          size="24"
                          color={getColorByClassification(mentalHealthAssessment.classifications.anxiety).color}
                        />
                        <Text fontSize={12} fontWeight={600} color="gray.700" mt={1}>
                          Ansiedade
                        </Text>
                        <Text
                          fontSize={12}
                          fontWeight={700}
                          color={getColorByClassification(mentalHealthAssessment.classifications.anxiety).color}
                        >
                          {getColorByClassification(mentalHealthAssessment.classifications.anxiety).label}
                        </Text>
                      </Box>

                      {/* Estresse */}
                      <Box
                        flex={1}
                        bg={getColorByClassification(mentalHealthAssessment.classifications.stress).bgColor}
                        borderRadius={10}
                        p={3}
                        alignItems="center"
                      >
                        <EnergyIcon
                          size="24"
                          color={getColorByClassification(mentalHealthAssessment.classifications.stress).color}
                        />
                        <Text fontSize={12} fontWeight={600} color="gray.700" mt={1}>
                          Estresse
                        </Text>
                        <Text
                          fontSize={12}
                          fontWeight={700}
                          color={getColorByClassification(mentalHealthAssessment.classifications.stress).color}
                        >
                          {getColorByClassification(mentalHealthAssessment.classifications.stress).label}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('mentalHealthForm')}>
                  <Box bg="white" borderRadius={12} p={4} mt={4} shadow={2}>
                    <HStack alignItems="center" space={3}>
                      <Box bg="purple.50" w={12} h={12} borderRadius={12} alignItems="center" justifyContent="center">
                        <HeadHealthIcon size="24" color="#8B5CF6" />
                      </Box>
                      <VStack flex={1}>
                        <Text fontSize={14} fontWeight={700} color="gray.800">
                          Avalie sua saúde mental
                        </Text>
                        <Text fontSize={12} fontWeight={400} color="gray.500" lineHeight={16}>
                          Responda ao questionário DASS-21 e descubra como você está.
                        </Text>
                      </VStack>
                      <ChevronRightIcon size="24" color="#8B5CF6" />
                    </HStack>
                  </Box>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Medicamentos - animação 3.7 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(300) : undefined}>
              <HStack mt={6} justifyContent={'space-between'} alignItems={'center'}>
                <HStack alignItems="center" space={2}>
                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                    Medicamentos
                  </Text>
                </HStack>
                <TouchableOpacity onPress={() => navigation.navigate('medicationTimeline')}>
                  <Text fontSize={12} fontWeight={600} color={'#10B981'}>
                    Ver todos
                  </Text>
                </TouchableOpacity>
              </HStack>

              <TouchableOpacity testID="card-medication" onPress={() => navigation.navigate('medicationTimeline')}>
                <Box bg="white" borderRadius={12} p={4} mt={4} shadow={2}>
                  <HStack alignItems="center" space={3}>
                    <Box bg="emerald.100" w={12} h={12} borderRadius={12} alignItems="center" justifyContent="center">
                      <PillIcon size="24" color="#10B981" />
                    </Box>
                    <VStack flex={1}>
                      <Text fontSize={14} fontWeight={700} color="gray.800">
                        Gerencie seus medicamentos
                      </Text>
                      <Text fontSize={12} fontWeight={400} color="gray.500" lineHeight={16}>
                        Cadastre remédios, receba lembretes e acompanhe sua adesão.
                      </Text>
                    </VStack>
                    <ChevronRightIcon size="24" color="#10B981" />
                  </HStack>
                </Box>
              </TouchableOpacity>
            </Animated.View>

            {/* Rastreador Fitness - animação 4 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(350) : undefined}>
              <HStack mt={6} justifyContent={'space-between'} alignItems={'center'}>
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

              {!fitnessEnabled && !DISABLE_FITNESS_FEATURE && (
                <Box mt={4}>
                  <FeatureBanner
                    id="fitness-tracker-enable"
                    icon={<BarbellIcon size="24" color="#0CC1AF" />}
                    title="Habilite o Rastreador Fitness"
                    description="Acompanhe suas calorias, passos, sono e hidratação conectando com o Apple Health ou Health Connect."
                    actionText="Habilitar agora"
                    onAction={async () => {
                      try {
                        await setFitnessEnabled(true);
                        await refreshFitnessData();
                      } catch (error) {
                        if (__DEV__) console.warn('⚠️ [HOMEPAGE] Erro ao habilitar fitness:', error);
                        // Mesmo com erro no Health Connect, mantém habilitado para usar dados do backend
                      }
                    }}
                    bgColor="ciano.50"
                    iconBgColor="ciano.100"
                    actionColor="ciano.600"
                  />
                </Box>
              )}

              {<StatusCards userTrackerData={!fitnessEnabled} />}
            </Animated.View>

            {/* Fale com Doutor X - animação 5 */}
            <Animated.View
              entering={!hasAnimated ? FadeInDown.duration(400).delay(450) : undefined}
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
                  <Text fontSize={14} fontWeight={600} lineHeight={18} color="gray.800" mt={2}>
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

      {/* Bottom Sheet de Avaliação */}
      <ReviewBottomSheet isOpen={isReviewOpen} onClose={onReviewClose} />
    </View>
  );
}
