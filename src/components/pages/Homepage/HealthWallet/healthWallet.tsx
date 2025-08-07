import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { VStack, Text, useDisclose, Box, HStack, ScrollView, IScrollViewProps, Flex, Image, Badge } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  BarbellIcon,
  BellIcon,
  CalendarIcon,
  FigIcon,
  HeartIcon,
  ImuIcon,
  MoreIcon,
  MusIcon,
  PanIcon,
  RinIcon,
  SanIcon,
} from '@assets/icons';
import Vector from '@assets/png/vector-22.png';

// components
import { HeaderTitle, Progress, StatusCards } from '@components/molecules';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useHome } from 'src/hooks/useHome';

export function HealthWallet() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { homeData, setCurrentSystem, currentSystem } = useHome();
  const { isOpen, onOpen, onClose } = useDisclose();

  function renderSystems() {
    if (homeData.medicalExamOrganicSystemsScore?.length) {
      const systems = homeData.medicalExamOrganicSystemsScore;

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
            title: 'risco normal',
            bgColor: 'ciano.50',
            color: '#0CC1AF',
            text: (
              <Text color={'gray.400'} fontSize={12} fontWeight={600} letterSpacing={-0.12}>
                Aí sim! Seu sistema digestivo está ótimo!
              </Text>
            ),
          };
        } else if (score > 666 && score <= 1000) {
          return {
            title: 'excelente',
            bgColor: 'purple.50',
            color: '#8A3FFC',
            text: (
              <Text color={'gray.400'} fontSize={12} fontWeight={600} letterSpacing={-0.12}>
                Está excelente. Mantenha o bom score fazendo um
                <Text color={'#8A3FFC'}> check-up clicando aqui.</Text>
              </Text>
            ),
          };
        }
      };

      function renderIcon(system: string, score: number) {
        const color = getColorByScore(score)?.color ?? '#000';

        const healthWalletIconsMap = {
          fígado: { icon: <FigIcon size="30" color={color} /> },
          imunidade: { icon: <ImuIcon size="30" color={color} /> },
          pâncreas: { icon: <PanIcon size="30" color={color} /> },
          rins: { icon: <RinIcon size="30" color={color} /> },
          sangue: { icon: <SanIcon size="30" color={color} /> },
          coração: { icon: <HeartIcon size="30" color={color} /> },
        };

        return healthWalletIconsMap[system.toLowerCase() as keyof typeof healthWalletIconsMap]?.icon;
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
              sexo: homeData.medicalExamGender,
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

            <VStack flex={1} ml={4}>
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
    } else {
      return (
        <Flex align="center" mt={12}>
          <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={3}>
            Você não possui dados de exames.
          </Text>
        </Flex>
      );
    }
  }

  return (
    <VStack my={16}>
      <HeaderTitle title="Health Wallet" withBackButton={() => navigation.navigate('homepage')} position="fixed" />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} space={8} pt={2} pb={32}>
          <VStack flex={1} mx={6}>
            <Box w="100%" h="auto" bg={'white'} px={4} py={5} borderRadius={12} shadow={2}>
              <VStack alignItems={'center'}>
                <AnimatedCircularProgress
                  size={150}
                  lineCap="round"
                  width={18}
                  fill={Math.round(homeData.generalScore / 10)}
                  children={() => (
                    <Box
                      mt={-4}
                      size={12}
                      bg={'gray.500'}
                      opacity={20}
                      borderRadius={100}
                      alignItems={'center'}
                      justifyContent={'center'}
                    ></Box>
                  )}
                  rotation={270}
                  tintColor="#8A3FFC"
                  backgroundColor="#DCE1E8"
                  arcSweepAngle={180}
                />

                <Text mt={-12} fontSize={40} fontWeight={800} letterSpacing={-1.44} lineHeight={44}>
                  {homeData.generalScore}
                </Text>

                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                  Score X
                </Text>

                <Text mt={2} color="gray.600" fontSize={12} fontWeight={500} lineHeight={19.2} textAlign="center">
                  {homeData.generalScoreActionRecommendation?.replace('\r\n', ' ')}
                </Text>
              </VStack>
            </Box>

            <HStack justifyContent={'space-between'} mt={6}>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Overview
              </Text>

              <TouchableOpacity>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            {renderSystems()}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
