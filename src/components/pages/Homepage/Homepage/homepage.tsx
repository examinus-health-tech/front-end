import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, useWindowDimensions, TouchableHighlight } from 'react-native';
import { VStack, Text, useDisclose, Box, HStack, ScrollView, IScrollViewProps, View, Image, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BellIcon, CalendarIcon, MoreIcon } from '@assets/icons';
import Vector from '@assets/png/vector-22.png';
import Vector2 from '@assets/png/vector-30.png';
import Vector3 from '@assets/png/vector-31.png';
import Vector4 from '@assets/png/vector-32.png';

// components
import { StatusCards } from '@components/molecules';
import { useAuth } from 'src/hooks/useAuth';
import { useHome } from 'src/hooks/useHome';

export function Homepage() {
  const [withNotification, setWithNotification] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { userData, getUserData } = useAuth();
  const { getHomeData, homeData, trackerData, isLoading } = useHome();
  const { width, height } = useWindowDimensions();

  const weekday = new Date().toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  const date = new Date()
    .toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    .replaceAll('de', '')
    .replace('.', '');

  async function handleGetHeathData() {
    await getHomeData();
  }

  function renderCardSystems() {
    if (homeData.systems?.length) {
      const systems = homeData.systems;

      const healthWalletStyleMap = {
        green: { title: 'excelente', bgColor: 'ciano.300', icon: Vector2 },
        yellow: { title: 'risco normal', bgColor: 'dark_blue.200', icon: Vector3 },
        red: { title: 'risco alto', bgColor: 'red.100', icon: Vector4 },
      };

      return systems.map((system) => (
        <TouchableOpacity onPress={() => navigation.navigate('healthWallet')}>
          <Box bg={healthWalletStyleMap[system.color].bgColor} rounded="2xl" w={170} shadow={4} p={4}>
            <VStack space={4}>
              <Text color="white" fontSize={16} fontWeight={600} letterSpacing={-0.16}>
                {system.description}
              </Text>

              <Image
                source={healthWalletStyleMap[system.color].icon}
                alt="Vetor"
                resizeMode="contain"
                size={24}
                ml={4}
              />

              <Text color="white" fontSize={14} fontWeight={600} letterSpacing={-0.16} textTransform="uppercase">
                {healthWalletStyleMap[system.color].title}
              </Text>
            </VStack>
          </Box>
        </TouchableOpacity>
      ));
    }
  }

  useEffect(() => {
    getUserData();
    handleGetHeathData();
  }, []);

  return (
    <View>
      {isLoading ? (
        <ContentLoader viewBox={`0 0 ${width} ${height}`} backgroundColor="#d5d5d5" foregroundColor="#ebebeb">
          <Rect x="24" y="92" rx="8" ry="8" width={140} height={20} />
          <Rect x="24" y="130" rx="8" ry="8" width={220} height={50} />
          <Rect x="24" y="190" rx="8" ry="8" width={160} height={20} />
          <Rect x="24" y="214" rx="8" ry="8" width={140} height={20} />
          <Rect x="310" y="120" rx="16" ry="16" width={75} height={75} />
          <Rect x="36" y="280" rx="12" ry="12" width={340} height={120} />
          <Rect x="24" y="430" rx="8" ry="8" width={100} height={20} />
          <Rect x="24" y="490" rx="16" ry="16" width={170} height={200} />
          <Rect x="208" y="490" rx="16" ry="16" width={170} height={200} />
          <Rect x="392" y="490" rx="16" ry="16" width={170} height={200} />
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
                  {`Olá, ${userData.name}! 👋`}
                </Text>

                <Text fontSize={12} fontWeight={400} letterSpacing={-0.12} color={'gray.400'}>
                  Hoje é um belo dia para{'\n'}
                  cuidar da sua saúde! :)
                </Text>
              </VStack>

              <TouchableOpacity onPress={() => navigation.navigate('notifications')}>
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
                <Box w={20} h={20} bg={'white'} borderRadius={16} alignItems={'center'} justifyContent={'center'}>
                  <BellIcon size={'40'} />
                </Box>
              </TouchableOpacity>
            </HStack>

            <Box w="100%" h="auto" bg={'white'} px={4} py={5} mt={12} borderRadius={12}>
              <HStack space={4} alignItems={'center'}>
                <Box
                  size={24}
                  bg={homeData ? 'purple.600' : 'gray.300'}
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
                    {Math.round(homeData.score) || '?'}
                  </Text>
                </Box>

                <VStack>
                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    Score X
                  </Text>

                  <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={3}>
                    Com base nos seus exames, o seu{'\n'}Score de saúde está acima da média
                  </Text>

                  {!!homeData.score ? (
                    <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={1} color="purple.700">
                      Monitorar saúde {'>'}
                    </Text>
                  ) : (
                    <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={1} color="ciano.400">
                      Clique aqui e importe seu exame {'>'}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </Box>

            <HStack mt={6} justifyContent={'space-between'}>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Health Wallet
              </Text>

              <TouchableOpacity>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            <HStack mt={2} h={265}>
              <ScrollView horizontal ref={scrollRef} mx={-6} showsHorizontalScrollIndicator={false}>
                <HStack space={3} mx={6} alignItems="center">
                  {renderCardSystems()}
                </HStack>
              </ScrollView>
            </HStack>

            <HStack mt={4} justifyContent={'space-between'}>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Rastreador Fitness
              </Text>

              <TouchableOpacity>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            {(trackerData.kcal ||
              trackerData.step ||
              trackerData.weight ||
              trackerData.hydration ||
              trackerData.nutrition ||
              trackerData.sleep) && <StatusCards />}
          </VStack>
        </ScrollView>
      )}
    </View>
  );
}
