import { useEffect, useRef, useState, useCallback } from 'react';
import { TouchableOpacity, Linking, Alert, StatusBar } from 'react-native';
import {
  VStack,
  Text,
  useDisclose,
  Box,
  HStack,
  ScrollView,
  IScrollViewProps,
  Flex,
  Image,
  Badge,
  Avatar,
} from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  FigIcon,
  HeartIcon,
  ImuIcon,
  PanIcon,
  RinIcon,
  SanIcon,
  UserIcon,
  IntestineIcon,
  UrinaIcon,
  FlaskIcon,
} from '@assets/icons';
import Vector from '@assets/png/vector-22.png';

// components
import { HeaderTitle, Progress, StatusCards } from '@components/molecules';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useHome } from 'src/hooks/useHome';
import { useAuth } from 'src/hooks/useAuth';
import { getUserPersonalData } from 'src/services/userService';

export function HealthWallet() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { homeData, setCurrentSystem, currentSystem } = useHome();
  const { user, updateUserPhoto } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclose();

  // Garantir StatusBar dark e carregar foto de perfil quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');

      // Carregar foto de perfil se não estiver no contexto
      async function loadProfilePhotoIfNeeded() {
        if (user?.profilePhotoBase64) {
          return; // Já tem foto no contexto
        }

        try {
          const profileData = await getUserPersonalData();
          if (profileData?.profilePhotoBase64) {
            updateUserPhoto(profileData.profilePhotoBase64);
          }
        } catch (error) {
          console.log('⚠️ [HEALTH_WALLET] Erro ao buscar foto de perfil:', error);
        }
      }

      loadProfilePhotoIfNeeded();
    }, [user?.profilePhotoBase64, updateUserPhoto])
  );

  const getColorByScore = (score: number) => {
    if (score >= 0 && score <= 333) {
      return {
        title: 'risco alto',
        bgColor: 'red.50',
        color: '#FA4D5E',
        text: (
          <Text color={'gray.400'} fontSize={12} fontWeight={600} letterSpacing={-0.12}>
            Você precisa se cuidar melhor.<Text color={'#FA4D5E'}> Clique aqui</Text> para saber como.
          </Text>
        ),
      };
    } else if (score > 333 && score <= 666) {
      return {
        title: 'normal',
        bgColor: 'yellow.50',
        color: '#F59E0B',
        text: (
          <Text color={'gray.400'} fontSize={12} fontWeight={600} letterSpacing={-0.12}>
            Sua saúde está normal. Alguns indicadores podem melhorar.
            <Text color={'#F59E0B'}> Clique aqui</Text> para saber mais.
          </Text>
        ),
      };
    } else if (score > 666 && score <= 1000) {
      return {
        title: 'excelente',
        bgColor: 'green.50',
        color: '#0CC1AF',
        text: (
          <Text color={'gray.400'} fontSize={12} fontWeight={600} letterSpacing={-0.12}>
            Está excelente. Mantenha o bom score fazendo um
            <Text color={'#0CC1AF'}> check-up clicando aqui.</Text>
          </Text>
        ),
      };
    }
  };

  function renderSystems() {
    const systems = homeData.medicalExamOrganicSystemsScore;

    // Validação segura do array
    if (!systems || !Array.isArray(systems) || systems.length === 0) {
      return (
        <Flex align="center" mt={12}>
          <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={3}>
            Você não possui dados de exames.
          </Text>
        </Flex>
      );
    }

    function renderIcon(system: string, score: number) {
        const color = getColorByScore(score)?.color ?? '#000';

        const healthWalletIconsMap = {
          fígado: { icon: <FigIcon size="30" color={color} /> },
          imunidade: { icon: <ImuIcon size="30" color={color} /> },
          pâncreas: { icon: <PanIcon size="30" color={color} /> },
          rins: { icon: <RinIcon size="30" color={color} /> },
          sangue: { icon: <SanIcon size="30" color={color} /> },
          coração: { icon: <HeartIcon size="30" color={color} /> },
          intestino: { icon: <IntestineIcon size="30" color={color} /> },
          urina: { icon: <UrinaIcon size="30" color={color} /> },
        };

        return healthWalletIconsMap[system.toLowerCase() as keyof typeof healthWalletIconsMap]?.icon
          || <FlaskIcon size="30" color={color} />;
      }

      useEffect(() => {
        if (currentSystem?.nivel && currentSystem?.sistema) {
          navigation.navigate('heartScore');
        }
      }, [currentSystem]);

      return systems.map((system) => (
        <TouchableOpacity
          onPress={() =>
            setCurrentSystem({
              sistema: system.examOrganicSystemDescription,
              nivel: getColorByScore(system.organicSystemScore)?.title,
            })
          }
        >
          <Box
            mt={4}
            bg={'white'}
            w={'100%'}
            p={2}
            shadow={1}
            borderRadius={16}
            flexDir={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Box
              bg={getColorByScore(system.organicSystemScore)?.bgColor}
              w={20}
              h={20}
              borderRadius={10}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {renderIcon(system.examOrganicSystemDescription, system.organicSystemScore)}
            </Box>

            <VStack flex={1} ml={4} mr={3}>
              <Text fontSize={20} fontWeight={800} letterSpacing={-0.16}>
                {system.examOrganicSystemDescription}
              </Text>

              <Text color={'gray.400'} fontSize={12} fontWeight={600} letterSpacing={-0.12}>
                {getColorByScore(system.organicSystemScore)?.text}
              </Text>
            </VStack>

            <Badge
              bg={getColorByScore(system.organicSystemScore)?.bgColor}
              borderRadius={6}
              ml={2}
              _text={{
                textTransform: 'uppercase',
                color: getColorByScore(system.organicSystemScore)?.color,
                fontSize: 10,
              }}
            >
              {getColorByScore(system.organicSystemScore)?.title}
            </Badge>
          </Box>
        </TouchableOpacity>
      ));
  }

  return (
    <VStack py={16} flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <HeaderTitle title="Carteira de Saúde" withBackButton={() => navigation.navigate('homepage')} />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} space={8} pt={2} pb={32}>
          <VStack flex={1} mx={6}>
            {/* Score X Card - animação 1 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(0) : undefined}>
              <Box w="100%" h="auto" bg={'white'} px={4} py={5} borderRadius={12} shadow={2}>
              <VStack alignItems={'center'}>
                <AnimatedCircularProgress
                  size={150}
                  lineCap="round"
                  width={18}
                  fill={Math.round(homeData.generalScore / 10)}
                  children={() => (
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
                  rotation={270}
                  tintColor={getColorByScore(homeData.generalScore)?.color ?? '#0CC1AF'}
                  backgroundColor="#DCE1E8"
                  arcSweepAngle={180}
                />

                <Text mt={-12} fontSize={40} fontWeight={800} letterSpacing={-1.44} lineHeight={44}>
                  {homeData.generalScore}
                </Text>

                <Text mt={-2} fontSize={24} fontWeight={800} letterSpacing={-0.16}>
                  Score X
                </Text>

                <Text mt={2} color="gray.600" fontSize={12} fontWeight={500} lineHeight={19.2} textAlign="center">
                  {homeData.generalScoreActionRecommendation?.replace('\r\n', '')}
                </Text>

                {/* Medical Disclaimer */}
                <Box mt={2} px={3} py={2} bg="orange.50" borderRadius={8} borderWidth={1} borderColor="orange.200">
                  <Text fontSize={12} fontWeight={500} color="gray.700" textAlign="center" lineHeight={14}>
                    ⚠️ Aviso Médico: Esta análise é apenas informativa e não substitui consulta médica. Sempre consulte
                    seu médico antes de tomar decisões sobre sua saúde.
                  </Text>
                </Box>
              </VStack>
              </Box>
            </Animated.View>

            {/* Visão Geral - animação 2 */}
            <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(100) : undefined}>
              <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color={'gray.900'} mt={6}>
                Visão Geral
              </Text>

              {renderSystems()}
            </Animated.View>

            {/* Medical Information Sources - animação 3 */}
            {homeData.medicalExamOrganicSystemsScore?.length > 0 && (
              <Animated.View
                entering={!hasAnimated ? FadeInDown.duration(400).delay(200) : undefined}
                onLayout={() => !hasAnimated && setHasAnimated(true)}
              >
                <Box borderTopWidth={1} borderTopColor="gray.200" mt={8} mb={8} />
                <Box p={4} bg="white" borderRadius={12} borderWidth={1} borderColor="gray.200">
                  <Text fontSize={12} fontWeight={600} color="gray.600" mb={3}>
                    Fontes e Referências
                  </Text>
                  <VStack space={2}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.who.int/health-topics')}>
                      <Text fontSize={12} fontWeight={500} color="ciano.600">
                        ↗ Organização Mundial da Saúde (OMS)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.gov.br/saude')}>
                      <Text fontSize={12} fontWeight={500} color="ciano.600">
                        ↗ Ministério da Saúde (Brasil)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.mayocliniclabs.com')}>
                      <Text fontSize={12} fontWeight={500} color="ciano.600">
                        ↗ Mayo Clinic Laboratories
                      </Text>
                    </TouchableOpacity>
                  </VStack>
                  <Text fontSize={12} color="gray.500" mt={3}>
                    Consulte seu médico para interpretação personalizada.
                  </Text>
                </Box>
              </Animated.View>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
