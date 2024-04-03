import { useRef } from 'react';
import {
  Box,
  HStack,
  IScrollViewProps,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';

import Vector from '@assets/png/vector-13.png';
import { ArrowIcon } from '@assets/icons';

import { HeaderProgress } from '@components/molecules';
import { Button } from '@components/atoms';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useNavigation } from '@react-navigation/native';

export function NotificationConfig() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const scrollRef = useRef<IScrollViewProps>(null);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} space={8} py={24}>
        <HeaderProgress progressValue={60} jumpTo={() => {}} withBackButton />

        <VStack flex={1} mx={6} space={8}>
          <Text
            color="gray.900"
            fontWeight={800}
            fontSize={30}
            fontFamily="Poligon"
            lineHeight={38}
            mt={4}
          >
            Configurar notificações
          </Text>

          <Image
            source={Vector}
            defaultSource={Vector}
            alt="X examinus Logo"
            resizeMode="stretch"
            w="100%"
            h={320}
          />

          <VStack space={4}>
            <HStack alignItems={'center'} space={4}>
              <Box
                w={12}
                h={12}
                borderRadius={12}
                backgroundColor={'ciano.100'}
              />
              <Text
                color="gray.600"
                fontWeight={700}
                fontSize={16}
                fontFamily="Poligon"
              >
                Informações de saúde personalizadas
              </Text>
            </HStack>
            <HStack alignItems={'center'} space={4}>
              <Box
                w={12}
                h={12}
                borderRadius={12}
                backgroundColor={'dark_blue.20'}
              />
              <Text
                color="gray.600"
                fontWeight={700}
                fontSize={16}
                fontFamily="Poligon"
              >
                Lembrete Diario
              </Text>
            </HStack>
            <HStack alignItems={'center'} space={4}>
              <Box
                w={12}
                h={12}
                borderRadius={12}
                backgroundColor={'purple.20'}
              />
              <Text
                color="gray.600"
                fontWeight={700}
                fontSize={16}
                fontFamily="Poligon"
              >
                Recomendação personalizada
              </Text>
            </HStack>
          </VStack>

          <Button
            variant="primary"
            position="absolute"
            bottom={-50}
            size="full"
            title="Permitir"
            onPress={() => navigation.navigate('biomConfig')}
            icon={<ArrowIcon />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
