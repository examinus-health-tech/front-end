import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, IScrollViewProps, View, Image, Badge, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import ContentLoader, { Rect } from 'react-content-loader/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BellIcon, CalendarIcon, ChevronRightIcon, MoreIcon } from '@assets/icons';
import Vector from '@assets/png/vector-22.png';
import Vector2 from '@assets/png/vector-30.png';
import Vector3 from '@assets/png/vector-39.png';
import Vector4 from '@assets/png/vector-32.png';
import Vector5 from '@assets/png/vector-37b.png';
import Vector6 from '@assets/png/vector-38.png';
import Vector7 from '@assets/png/vector-39.png';
import Vector8 from '@assets/png/vector-40.png';

// components
import { StatusCards } from '@components/molecules';
import { useAuth } from 'src/hooks/useAuth';
import { useHome } from 'src/hooks/useHome';

export function Homepage() {
  const [withNotification, setWithNotification] = useState<boolean>(false);
  const [userWithoutData, setUserWithoutData] = useState<boolean>(true);
  const [userTrackerData, setUserTrackerData] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user, getUserInfo, isLoading } = useAuth();
  const { getHomeData, homeData, trackerData, isLoadingHomeContext } = useHome();
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
    getUserInfo();
    getHomeData();
    console.log('🚀 Homepage useEffect', user);
  }, []);

  function renderCardSystems() {
    if (homeData.medicalExamOrganicSystemsScore?.length) {
      const systems = homeData.medicalExamOrganicSystemsScore;

      const getColorByScore = (score: number) => {
        if (score >= 0 && score <= 333) {
          return { title: 'risco alto', bgColor: 'red.100', icon: Vector4 };
        } else if (score > 333 && score <= 666) {
          return { title: 'risco normal', bgColor: 'dark_blue.200', icon: Vector3 };
        } else if (score > 666 && score <= 1000) {
          return { title: 'excelente', bgColor: 'ciano.300', icon: Vector2 };
        }
        return { title: 'risco normal', bgColor: 'dark_blue.200', icon: Vector3 };
      };

      return systems.map((system, index) => {
        if (index <= 2) {
          const colorStyle = getColorByScore(system.organicSystemScore);

          return (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('healthWallet')}>
              <Box bg={colorStyle.bgColor} rounded="2xl" w={160} shadow={4} p={4}>
                <VStack space={4}>
                  <Text color="white" fontSize={16} fontWeight={600} letterSpacing={-0.16}>
                    {system.examOrganicSystemDescription}
                  </Text>

                  <Center>
                    <Image source={colorStyle.icon} alt="Vetor" resizeMode="contain" size={16} />
                  </Center>

                  <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16} textTransform="uppercase">
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
  }

  return (
    <View>
      {isLoading || isLoadingHomeContext ? (
        <ContentLoader viewBox={`0 0 ${width} ${height}`} backgroundColor="#d5d5d5" foregroundColor="#ebebeb">
          <Rect x="24" y="92" rx="8" ry="8" width={140} height={20} />
          <Rect x="24" y="130" rx="8" ry="8" width={220} height={50} />
          <Rect x="24" y="190" rx="8" ry="8" width={160} height={20} />
          <Rect x="24" y="214" rx="8" ry="8" width={140} height={20} />
          <Rect x="320" y="120" rx="16" ry="16" width={65} height={65} />
          <Rect x="36" y="280" rx="12" ry="12" width={340} height={120} />
          <Rect x="24" y="430" rx="8" ry="8" width={100} height={20} />
          <Rect x="24" y="475" rx="16" ry="16" width={170} height={200} />
          <Rect x="208" y="475" rx="16" ry="16" width={170} height={200} />
          <Rect x="392" y="475" rx="16" ry="16" width={170} height={200} />
          <Rect x="24" y="720" rx="8" ry="8" width={120} height={20} />
          <Rect x="24" y="760" rx="8" ry="8" width={360} height={100} />
          <Rect x="24" y="870" rx="8" ry="8" width={360} height={100} />
        </ContentLoader>
      ) : (
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <VStack flex={1} py={24} mx={6} mb={16}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <VStack>
                <HStack alignItems={'center'} mb={4}>
                  <CalendarIcon />
                  <Text fontSize={12} fontWeight={600} letterSpacing={-0.12} color={'gray.400'} ml={2}>
                    {`${weekday}, ${date}`}
                  </Text>
                </HStack>
                <Text fontSize={30} fontWeight={800} letterSpacing={-1.2} lineHeight={38} color={'gray.900'} mb={2}>
                  {`Olá, ${user?.fullName?.split(' ')[0]}! 👋`}
                </Text>

                <Text fontSize={12} fontWeight={400} letterSpacing={-0.12} color={'gray.400'}>
                  Hoje é um belo dia para{'\n'}
                  cuidar da sua saúde! :)
                </Text>
              </VStack>

              {/* <TouchableOpacity onPress={() => navigation.navigate('notifications')}>
                {withNotification && (
                  <Box
                    bg={'red.500'}
                    w={6}
                    h={6}
                    borderRadius={6}
                    alignItems={'center'}
                    justifyContent={'center'}
                    position={'absolute'}
                    zIndex={1}
                    right={4}
                    top={4}
                  >
                    <Text color={'white'} fontSize={16} fontWeight={800}>
                      2
                    </Text>
                  </Box>
                )}
                <Box size={16} bg={'white'} borderRadius={16} alignItems={'center'} justifyContent={'center'}>
                  <BellIcon size={'40'} />
                </Box>
              </TouchableOpacity> */}
            </HStack>

            <Box w="100%" h="auto" bg={'white'} px={4} py={5} mt={12} borderRadius={12}>
              <HStack space={4} alignItems={'center'}>
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

                  <Text color={'white'} fontSize={44} fontWeight={800} letterSpacing={-1.44} lineHeight={44}>
                    {homeData.generalScore || '?'}
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
                      <Text fontSize={12} fontWeight={500} lineHeight={18} mt={2}>
                        {homeData.generalScoreActionRecommendation?.replace('\r\n', ' ')}
                      </Text>

                      <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={1} color="purple.700">
                        Monitorar saúde {'>'}
                      </Text>

                      <Text fontSize={9} fontWeight={400} color="gray.500" mt={2} lineHeight={12}>
                        ⚠️ Apenas informativo. Consulte seu médico.
                      </Text>
                    </View>
                  )}
                </VStack>
              </HStack>
            </Box>

            <HStack mt={6} justifyContent={'space-between'}>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Health Wallet
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate('healthWallet')}>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            <HStack h={265}>
              <ScrollView horizontal ref={scrollRef} mx={-6} showsHorizontalScrollIndicator={false}>
                {userWithoutData ? (
                  <HStack space={3} mx={6} alignItems="center">
                    <Box bg={'gray.300'} rounded="2xl" w={170} shadow={4} p={4}>
                      <VStack space={4}>
                        <Text color="white" fontSize={16} fontWeight={600} letterSpacing={-0.16}>
                          Hormônios
                        </Text>

                        <Image source={Vector6} alt="Vetor" resizeMode="contain" size={24} ml={4} mb={4} />
                      </VStack>
                    </Box>

                    <Box bg={'gray.300'} rounded="2xl" w={170} shadow={4} p={4}>
                      <VStack space={4}>
                        <Text color="white" fontSize={16} fontWeight={600} letterSpacing={-0.16}>
                          Imunidade
                        </Text>

                        <Image source={Vector7} alt="Vetor" resizeMode="contain" size={24} ml={4} mb={4} />
                      </VStack>
                    </Box>

                    <Box bg={'gray.300'} rounded="2xl" w={170} shadow={4} p={4}>
                      <VStack space={4}>
                        <Text color="white" fontSize={16} fontWeight={600} letterSpacing={-0.16}>
                          Coração
                        </Text>

                        <Image source={Vector8} alt="Vetor" resizeMode="contain" size={24} ml={4} mb={4} />
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

            <HStack mt={4} justifyContent={'space-between'}>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Rastreador Fitness
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate('tracker')}>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            {<StatusCards userTrackerData={userTrackerData} />}

            <HStack mt={8} justifyContent={'space-between'}>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Fale com o Doutor X
              </Text>

              <TouchableOpacity>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            <Box w="100%" h="auto" bg={'white'} borderRadius={12} mt={4}>
              <HStack justifyItems="space-between" width="100%">
                <VStack py={6} px={4} width={200}>
                  <Badge
                    width={24}
                    bg="gray.400"
                    borderRadius={6}
                    _text={{
                      color: 'white',
                    }}
                  >
                    EM BREVE
                  </Badge>

                  <Text fontSize={16} fontWeight={500} lineHeight={19.2} mt={8}>
                    Chatbot sobre Saúde Conversations
                  </Text>
                </VStack>

                <Image source={Vector5} defaultSource={Vector5} alt="Vetor" resizeMode="cover" h={150} w={163} />
              </HStack>
            </Box>
          </VStack>
        </ScrollView>
      )}
    </View>
  );
}
