import { VStack, Text, Box, Center, Pressable } from 'native-base';
import { Platform } from 'react-native';
import { openAppStore } from '@services/versionService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  message?: string;
}

export function ForceUpdateScreen({ message }: Props) {
  const storeName = Platform.OS === 'ios' ? 'App Store' : 'Play Store';

  return (
    <Box flex={1} bg="white" safeArea>
      <Center flex={1} px={8}>
        <VStack space={6} alignItems="center" maxW="320px">
          {/* Ícone */}
          <Box
            bg="ciano.50"
            p={6}
            borderRadius={999}
          >
            <MaterialCommunityIcons
              name="cellphone-arrow-down"
              size={64}
              color="#0CC1AF"
            />
          </Box>

          {/* Título */}
          <Text
            fontSize={28}
            fontWeight={700}
            color="gray.800"
            textAlign="center"
            lineHeight={34}
          >
            Atualização Necessária
          </Text>

          {/* Descrição */}
          <Text
            fontSize={16}
            fontWeight={400}
            color="gray.500"
            textAlign="center"
            lineHeight={24}
          >
            {message ||
              'Uma nova versão do Examinus está disponível. Atualize o aplicativo para continuar usando todos os recursos.'}
          </Text>

          {/* Botão */}
          <Pressable
            onPress={openAppStore}
            bg="ciano.300"
            w="100%"
            py={5}
            px={8}
            borderRadius={16}
            alignItems="center"
            justifyContent="center"
            mt={4}
            _pressed={{ opacity: 0.8 }}
          >
            <Text color="white" fontWeight={700} fontSize={16}>
              Atualizar na {storeName}
            </Text>
          </Pressable>

          {/* Nota */}
          <Text
            fontSize={12}
            fontWeight={400}
            color="gray.400"
            textAlign="center"
            lineHeight={18}
          >
            Após atualizar, abra o aplicativo novamente para continuar.
          </Text>
        </VStack>
      </Center>
    </Box>
  );
}
