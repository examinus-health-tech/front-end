import { VStack, Text, Image, Center, Actionsheet, useDisclose } from 'native-base';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector2 from '@assets/png/vector-17.png';

// components
import { Button } from '@components/atoms';
import { UploadType } from '@components/pages/Homepage/UploadMain';
import { useUpload } from 'src/hooks/useUpload';
import { UploadError } from '../error/error';
import { Loading } from '../loading/loading';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export function UploadMain() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { isLoading, withError, withSuccess, setWithSuccess } = useUpload();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  useEffect(() => {
    if (withSuccess) navigation.navigate('homepage');
  }, [withSuccess]);

  useEffect(() => {
    return () => {
      setWithSuccess(false);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  } else if (withError) {
    return <UploadError />;
  }

  return (
    <VStack flex={1} space={8} py={24}>
      <Center flex={1} mx={6} alignItems="center">
        <Image source={Vector2} alt="Vector" resizeMode="contain" w="100%" h={300} />

        <Button
          mt={4}
          variant="primary"
          size="lg"
          title="Desvende sua saúde"
          onPress={() => {
            onOpen();
          }}
          icon={<ArrowIcon />}
        />

        <Text fontSize={16} fontWeight={500} lineHeight={25.6} textAlign="center" mt={4}>
          Selecione a forma que deseja{'\n'}importar seu exame laboratorial
        </Text>
      </Center>

      {/* <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <UploadType />
        </Actionsheet.Content>
      </Actionsheet> */}
    </VStack>
  );
}
