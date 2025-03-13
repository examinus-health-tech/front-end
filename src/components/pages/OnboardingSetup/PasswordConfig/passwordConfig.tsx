import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  Box,
  Center,
  Flex,
  HStack,
  IScrollViewProps,
  Icon,
  ScrollView,
  Text,
  VStack,
} from 'native-base';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { ArrowIcon, EyeIcon } from '@assets/icons';

import { Button } from '@components/atoms';
import { HeaderProgress, Input } from '@components/molecules';

export function PasswordConfig() {
  const [type, setType] = useState<'password' | 'text'>('password');

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const scrollRef = useRef<IScrollViewProps>(null);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} space={8} py={24}>
        <HeaderProgress progressValue={60} jumpTo={() => {}} withBackButton />

        <VStack mx={6} space={2}>
          <Text
            color="gray.900"
            fontWeight={800}
            fontSize={30}
            fontFamily="Poligon"
            lineHeight={38}
            mt={4}
          >
            Configuração de senha
          </Text>

          <Input
            InputRightElement={
              <Flex mr={4} align="center" justify="center">
                <Icon as={<EyeIcon solid color="#818BA0" />} w="full" />
              </Flex>
            }
            h={16}
            fontSize={24}
            type="password"
            autoCapitalize="none"
          />

          <HStack
            flex={1}
            justifyContent="space-between"
            space={2}
            mt={4}
            mx={1}
          >
            <Box w="22%" h={2} bg="ciano.300" borderRadius={2} />
            <Box w="22%" h={2} bg="ciano.300" borderRadius={2} />
            <Box w="22%" h={2} bg="ciano.900" borderRadius={2} />
            <Box w="22%" h={2} bg="ciano.900" borderRadius={2} />
          </HStack>

          <HStack justifyContent="center">
            <Text
              color="gray.600"
              fontSize={14}
              fontWeight={500}
              lineHeight={38}
            >
              Senha forte:{' '}
            </Text>
            <Text
              color="gray.600"
              fontWeight={800}
              fontSize={14}
              lineHeight={38}
              bold={true}
            >
              Maravilhosa!
            </Text>
          </HStack>

          <Button
            variant="primary"
            size="full"
            title="Continuar"
            onPress={() => navigation.navigate('notificationConfig')}
            icon={<ArrowIcon />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
