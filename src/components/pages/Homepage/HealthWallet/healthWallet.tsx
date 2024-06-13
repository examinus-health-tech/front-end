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
    if (homeData.systems?.length) {
      const systems = homeData.systems;

      const healthWalletMap = {
        green: {
          title: 'excelente',
          bgColor: 'purple.50',
          color: '#8A3FFC',
          text: 'Está excelente. Mantenha o bom score fazendo um check-up clicando aqui.',
        },
        yellow: {
          title: 'risco normal',
          bgColor: 'ciano.50',
          color: '#0CC1AF',
          text: 'Aí sim! Seu sistema digestivo está ótimo!',
        },
        red: {
          title: 'risco alto',
          bgColor: 'red.50',
          color: '#FA4D5E',
          text: 'Você precisa se cuidar melhor. Clique aqui para saber como.',
        },
      };

      function renderIcon(code: string, color: string) {
        const healthWalletIconsMap = {
          FIG: { icon: <FigIcon size="30" color={healthWalletMap[color].color} /> },
          IMU: { icon: <ImuIcon size="30" color={healthWalletMap[color].color} /> },
          MUS: { icon: <MusIcon size="30" color={healthWalletMap[color].color} /> },
          PAN: { icon: <PanIcon size="30" color={healthWalletMap[color].color} /> },
          RIN: { icon: <RinIcon size="30" color={healthWalletMap[color].color} /> },
          SAN: { icon: <SanIcon size="30" color={healthWalletMap[color].color} /> },
        };

        return healthWalletIconsMap[code].icon;
      }

      useEffect(() => {
        if (currentSystem?.nivel && currentSystem?.sistema) {
          console.log('!@# 🚀 ~ useEffect ~ currentSystem:', currentSystem);
          navigation.navigate('heartScore');
        }
      }, [currentSystem]);

      return systems.map((system) => (
        <TouchableOpacity
          onPress={() => setCurrentSystem({ sistema: system.description, nivel: healthWalletMap[system.color].title })}
        >
          <Box
            mt={4}
            bg={'white'}
            w={'100%'}
            p={4}
            shadow={1}
            borderRadius={16}
            flexDir={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Box
              bg={healthWalletMap[system.color].bgColor}
              w={20}
              h={20}
              borderRadius={10}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {renderIcon(system.code, system.color)}
            </Box>

            <VStack flex={1} ml={4}>
              <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={2}>
                {system.description}
              </Text>

              <Text color={'gray.400'} fontSize={12} fontWeight={600} letterSpacing={-0.12}>
                {healthWalletMap[system.color].text}
              </Text>
            </VStack>

            <Badge
              bg={healthWalletMap[system.color].bgColor}
              borderRadius={6}
              _text={{
                textTransform: 'uppercase',
                color: healthWalletMap[system.color].color,
                fontSize: 10,
              }}
            >
              {healthWalletMap[system.color].title}
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
                  width={20}
                  fill={Math.round((homeData.score / 1000) * 100)}
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
                  tintColor="#00b39d"
                  backgroundColor="#DCE1E8"
                  arcSweepAngle={180}
                />

                <Text mt={-12} fontSize={40} fontWeight={800} letterSpacing={-1.44} lineHeight={44}>
                  {Math.round(homeData.score)}
                </Text>

                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                  Score X
                </Text>

                <Text mt={2} color="gray.600" fontSize={12} fontWeight={500} lineHeight={19.2} textAlign="center">
                  Com base nos seus exames, o seu Score{'\n'} de saúde está acima da média. Continue assim!
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
