import { VStack, Text, Image, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-18.png';

// components
import { Button } from '@components/atoms';

// hooks
import { useUpload } from 'src/hooks/useUpload';
import { useEffect } from 'react';

export function UploadError() {
  const { setWithError } = useUpload();

  useEffect(() => {
    return () => {
      setWithError(false);
    };
  }, []);

  return (
    <VStack flex={1} space={8} py={24}>
      <Center flex={1} mx={6} mt={-32} alignItems="center">
        <Text fontSize={24} fontWeight={800} lineHeight={25.6} textAlign="center" mt={40} color={'red.500'}>
          Xiii, deu ruim! :(
        </Text>

        <Text fontSize={14} fontWeight={500} lineHeight={25.6} textAlign="center" color={'gray.400'}>
          Seu exame não foi processado.{'\n'} Verifique os dados enviado.
        </Text>

        <Image source={Vector} defaultSource={Vector} alt="Vetor" resizeMode="contain" w="100%" h={300} mt={8} />

        <Button
          mt={12}
          variant="primary"
          size="lg"
          title="Tentar novamente"
          icon={<ArrowIcon />}
          onPress={() => setWithError(false)}
        />
      </Center>
    </VStack>
  );
}
