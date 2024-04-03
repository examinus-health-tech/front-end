import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Flex,
  IScrollViewProps,
  Icon,
  ScrollView,
  Text,
  VStack,
} from 'native-base';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import {
  ArrowIcon,
  BriefcaseIcon,
  EmailIcon,
  LocationIcon,
  TelephoneIcon,
  UserIcon,
} from '@assets/icons';

import { Button } from '@components/atoms';
import { HeaderProgress, Input } from '@components/molecules';

export function EditProfile() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const scrollRef = useRef<IScrollViewProps>(null);

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      // alwaysBounceVertical={true}
      automaticallyAdjustKeyboardInsets={true}
    >
      <VStack flex={1} space={8} py={24}>
        <HeaderProgress progressValue={60} jumpTo={() => {}} withBackButton />

        <VStack flex={1} mx={6} space={2}>
          <Text
            color="gray.900"
            fontWeight={800}
            fontSize={30}
            lineHeight={38}
            mt={4}
          >
            Editar Perfil
          </Text>

          <Text color="gray.600" fontSize={16} lineHeight={38}>
            Conclua a configuração do seu perfil.
          </Text>

          <Flex alignItems={'center'} my={4}>
            <Box
              bg={'gray.200'}
              w={40}
              h={40}
              borderRadius={20}
              borderColor={'white'}
              borderWidth={1}
              alignItems={'center'}
              justifyContent={'flex-end'}
            >
              <Box
                bg={'gray.700'}
                w={16}
                h={16}
                mb={-8}
                borderRadius={16}
                borderColor={'gray.400'}
                borderWidth={6}
              />
            </Box>
          </Flex>

          <VStack space={6} mt={4}>
            <Input
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon as={<UserIcon solid color="black" />} w="full" />
                </Flex>
              }
              autoCapitalize="none"
              label="Nome completo"
            />

            <Input
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon as={<TelephoneIcon solid color="black" />} w="full" />
                </Flex>
              }
              keyboardType="phone-pad"
              autoCapitalize="none"
              label="Telefone"
            />

            <Input
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon as={<LocationIcon solid color="black" />} w="full" />
                </Flex>
              }
              select
              options={[{ label: 'teste', value: 'teste' }]}
              label="Localização"
            />

            <Input
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon as={<EmailIcon solid color="black" />} w="full" />
                </Flex>
              }
              keyboardType="email-address"
              autoCapitalize="none"
              label="E-mail"
            />

            <Input
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon as={<BriefcaseIcon solid color="black" />} w="full" />
                </Flex>
              }
              autoCapitalize="none"
              label="Profissão"
              mb={6}
            />

            <Button
              variant="primary"
              position="absolute"
              bottom={-50}
              size="full"
              title="Continuar"
              onPress={() => navigation.navigate('passwordConfig')}
              icon={<ArrowIcon />}
            />
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
