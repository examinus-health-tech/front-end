import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Center,
  IScrollViewProps,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import Vector from '@assets/png/vector-14.png';
import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms/Button/button';
import { HeaderTitle } from '@components/molecules';

export function BiomConfig() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const scrollRef = useRef<IScrollViewProps>(null);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} space={8} py={24}>
        <HeaderTitle title="Configuração de Biometria" withBackButton />

        <VStack flex={1} mx={6} space={8} h="100%">
          <Image
            source={Vector}
            defaultSource={Vector}
            alt="X examinus Logo"
            resizeMode="contain"
            h={280}
            mt={12}
            mb={4}
          />

          <Center>
            <Text color="gray.900" fontWeight={800} fontSize={24}>
              Escaneie sua Digital 👆
            </Text>
            <Text
              color="gray.600"
              fontSize={16}
              textAlign={'center'}
              w={300}
              mt={4}
            >
              Acesse com a sua biometria para tornar sua conta mais segura.
            </Text>
          </Center>

          <Button
            position="absolute"
            bottom={-90}
            variant="secondary"
            size="full"
            title="Pular"
            onPress={() => navigation.navigate('otpConfig')}
          />
          <Button
            position="absolute"
            bottom={-160}
            variant="primary"
            size="full"
            title="Continuar"
            onPress={() => navigation.navigate('otpConfig')}
            icon={<ArrowIcon />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
