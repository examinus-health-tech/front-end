import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Center,
  ScrollView,
  Text,
  VStack,
  HStack,
} from 'native-base';

import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms/Button/button';
import { HeaderTitle, Input } from '@components/molecules';

export function OtpSecurity() {
  const scrollRef = useRef<any>(null);
  const field1 = useRef<null | HTMLElement>(null);
  const field2 = useRef(null);
  const field3 = useRef(null);
  const field4 = useRef(null);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} space={8} py={24}>
        <HeaderTitle title="OTP Segurança" withBackButton={() => {}} />

        <VStack flex={1} mx={6} space={4}>
          <Center mt={32}>
            <Text color="gray.600" fontSize={16} textAlign="center" w={300}>
              Por favor, digite o código de 4 dígitos que você recebeu no seu
              telefone! 🙏
            </Text>
          </Center>

          <HStack mt={12} space={4}>
            <Input
              ref={field1}
              h="105px"
              w="85px"
              fontSize={48}
              fontWeight={700}
              maxLength={1}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholder="0"
              placeholderTextColor="gray.200"
              borderRadius={20}
              pl="28px"
              borderColor="transparent"
              borderStyle="inset"
              _focus={{
                color: 'ciano.10',
                bgColor: 'ciano.300',
                borderColor: 'dark_blue.20',
                placeholderTextColor: 'transparent',
                borderWidth: 5,
                pl: '26px',
              }}
            />
            <Input
              ref={field2}
              h="105px"
              w="85px"
              fontSize={48}
              fontWeight={700}
              maxLength={1}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholder="0"
              placeholderTextColor="gray.200"
              borderRadius={20}
              pl="28px"
              borderColor="transparent"
              borderStyle="inset"
              _focus={{
                color: 'ciano.10',
                bgColor: 'ciano.300',
                borderColor: 'dark_blue.20',
                placeholderTextColor: 'transparent',
                borderWidth: 5,
                pl: '26px',
              }}
              autoFocus={!!field1.current}
            />
            <Input
              ref={field3}
              h="105px"
              w="85px"
              fontSize={48}
              fontWeight={700}
              maxLength={1}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholder="0"
              placeholderTextColor="gray.200"
              borderRadius={20}
              pl="28px"
              borderColor="transparent"
              borderStyle="inset"
              _focus={{
                color: 'ciano.10',
                bgColor: 'ciano.300',
                borderColor: 'dark_blue.20',
                placeholderTextColor: 'transparent',
                borderWidth: 5,
                pl: '26px',
              }}
            />
            <Input
              ref={field4}
              h="105px"
              w="85px"
              fontSize={48}
              fontWeight={700}
              maxLength={1}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholder="0"
              placeholderTextColor="gray.200"
              borderRadius={20}
              pl="28px"
              borderColor="transparent"
              borderStyle="inset"
              _focus={{
                color: 'ciano.10',
                bgColor: 'ciano.300',
                borderColor: 'dark_blue.20',
                placeholderTextColor: 'transparent',
                borderWidth: 5,
                pl: '26px',
              }}
            />
          </HStack>

          <Button
            variant="primary"
            size="full"
            title="Continuar"
            // onPress={handleNextStep}
            icon={<ArrowIcon />}
          />

          <Center mt={16} flexDir="row">
            <Text color="gray.600" fontSize={16} textAlign="center">
              Não recebeu nenhum código?{' '}
            </Text>
            <TouchableOpacity>
              <Text color="ciano.700" fontSize={16} textAlign="center">
                Reenviar.
              </Text>
            </TouchableOpacity>
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
