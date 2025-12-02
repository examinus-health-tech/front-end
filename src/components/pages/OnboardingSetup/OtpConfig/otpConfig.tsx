import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Center,
  Flex,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';

import Vector from '@assets/png/vector-15.png';
import { ArrowIcon, TelephoneIcon } from '@assets/icons';

import { Button } from '@components/atoms/Button/button';
import { HeaderTitle, Input } from '@components/molecules';

export function OtpConfig() {
  const scrollRef = useRef<any>(null);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} space={8} py={24}>
        <HeaderTitle title="OTP Configuração" withBackButton={() => {}} />

        <Image
          source={Vector}
          defaultSource={Vector}
          alt="X examinus Logo"
          resizeMode="stretch"
          h={360}
          mt={12}
        />

        <VStack flex={1} mx={6} space={4}>
          <Center>
            <Text color="gray.600" fontSize={16} textAlign="center" w={300}>
              Enviaremos uma mensagem SMS única. Taxas de operadora podem ser
              cobradas.
            </Text>
          </Center>

          <Input
            mt={2}
            InputRightElement={
              <Flex mr={4} align="center" justify="center">
                <Icon as={<TelephoneIcon />} w="full" />
              </Flex>
            }
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <Button
            variant="primary"
            size="full"
            title="Continuar"
            // onPress={handleNextStep}
            icon={<ArrowIcon />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
