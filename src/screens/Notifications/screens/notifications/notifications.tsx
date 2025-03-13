import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  HStack,
  ScrollView,
  IScrollViewProps,
  Box,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { DownloadIcon, FlagIcon, MoreIcon } from '@assets/icons';

// components
import { Header } from '../../components/header/header';
import { Progress } from '@components/molecules/Progress/progress';

export function Notifications() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} bg={'gray.400'} py={24} mx={6}>
        <Header
          title="Notificações"
          handleBackTo={() => navigation.navigate('myAccount')}
        />

        <VStack>
          <HStack justifyContent={'space-between'}>
            <Text
              fontSize={18}
              fontWeight={800}
              letterSpacing={-0.16}
              color={'gray.900'}
            >
              Recentes
            </Text>

            <Text
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.14}
              color={'gray.600'}
            >
              251 Total
            </Text>
          </HStack>
        </VStack>

        <VStack space={4}>
          <Box bg={'white'} borderRadius={12} p={4}>
            <HStack space={4}>
              <Box bg={'ciano.300'} borderRadius={10} w={16} h={16}></Box>

              <VStack justifyContent={'center'} space={2}>
                <Text fontSize={16} fontWeight={600} letterSpacing={-0.14}>
                  Mensagem não lida: Doutor X
                </Text>
                <Text fontSize={14} fontWeight={500} lineHeight={19.2}>
                  Doutor X acabou de lhe enviar 4 mensagens
                </Text>
              </VStack>
            </HStack>
          </Box>

          <Box bg={'white'} borderRadius={12} p={4}>
            <HStack space={4}>
              <Box bg={'dark_blue.30'} borderRadius={10} w={16} h={16}></Box>

              <VStack justifyContent={'center'} space={2}>
                <Text fontSize={16} fontWeight={600} letterSpacing={-0.14}>
                  Insight Mensal de Saúde
                </Text>
                <Text fontSize={14} fontWeight={500} lineHeight={19.2}>
                  Seu insight mensal de saúde está pronto!
                </Text>

                <TouchableOpacity>
                  <Box
                    borderRadius={8}
                    bg={'dark_blue.10'}
                    w={40}
                    p={2}
                    justifyContent={'center'}
                    flexDir={'row'}
                  >
                    <DownloadIcon size="20" />
                    <Text
                      ml={2}
                      color={'dark_blue.40'}
                      fontSize={12}
                      fontWeight={800}
                      letterSpacing={1}
                      textTransform={'uppercase'}
                    >
                      download pdf
                    </Text>
                  </Box>
                </TouchableOpacity>
              </VStack>
            </HStack>
          </Box>

          <Box bg={'white'} borderRadius={12} p={4}>
            <HStack space={4}>
              <Box bg={'blue.40'} borderRadius={10} w={16} h={16}></Box>

              <VStack justifyContent={'center'} space={2} flex={1}>
                <Text fontSize={16} fontWeight={600} letterSpacing={-0.14}>
                  Dê mais passos, Ande mais!
                </Text>
                <Text fontSize={14} fontWeight={500} lineHeight={19.2}>
                  Você precisa dar mais 3.150 passos hoje.
                </Text>

                <Progress
                  value={80}
                  sizeW={100}
                  filledColor="blue.40"
                  bgColor="blue.20"
                />
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
