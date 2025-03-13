import { Text, VStack, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import Vector from '@assets/png/vector-11.png';
import { GearIcon } from '@assets/icons';
import { Button } from '@components/atoms/Button/button';

export function SuccessSaved() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack mt={40}>
      <Image
        source={Vector}
        defaultSource={Vector}
        alt="X examinus Logo"
        resizeMode="stretch"
        w="100%"
        h={350}
      />

      <VStack alignItems={'center'} space={4} mb={10} mx={6}>
        <Text
          color={'gray.900'}
          fontSize={30}
          fontWeight={800}
          letterSpacing={-0.2}
          textAlign={'center'}
        >
          Conta Atualizada{'\n'}com Sucesso!
        </Text>
        <Text
          color={'gray.400'}
          fontSize={16}
          fontWeight={500}
          lineHeight={25.6}
          textAlign={'center'}
        >
          Obrigado por atualizar sua conta!
        </Text>

        <Button
          mt={4}
          variant="primary"
          size="full"
          title="Voltar as Configurações"
          onPress={() => navigation.navigate('myAccount')}
          icon={<GearIcon color="#FFFFFF" size="28" />}
        />
      </VStack>
    </VStack>
  );
}
