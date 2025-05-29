import { useRef, useState } from 'react';
import { VStack, Text, Image, Center, Actionsheet, useDisclose, IScrollViewProps, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector2 from '@assets/png/vector-17.png';

// components
import { Button } from '@components/atoms';
import { UploadType } from '@components/organisms/UploadType/uploadType';
import { useAuth } from 'src/hooks/useAuth';
import { UploadContextProvider } from '@contexts/UploadContext';
import { OnboardingContextProvider } from '@contexts/OnboardingContext';

export function Upload() {
  const [isManual, setManual] = useState<boolean>(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();
  const { signOut } = useAuth();

  return (
    <VStack flex={1} space={8} py={24}>
      <Center flex={1} mx={6} alignItems="center">
        <Image source={Vector2} defaultSource={Vector2} alt="Vetor" resizeMode="contain" w="100%" h={300} />

        <Button
          mt={4}
          variant="primary"
          size="lg"
          title="Desvende sua saúde"
          onPress={() => {
            onOpen();
            setManual(false);
          }}
          icon={<ArrowIcon />}
        />

        <Text fontSize={16} fontWeight={500} lineHeight={25.6} textAlign="center" mt={4}>
          Selecione a forma que deseja{'\n'}importar seu exame laboratorial
        </Text>
      </Center>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <UploadContextProvider>
          <OnboardingContextProvider>
            <UploadContextProvider>
              <Actionsheet.Content>
                <UploadType />
              </Actionsheet.Content>
            </UploadContextProvider>
          </OnboardingContextProvider>
        </UploadContextProvider>
      </Actionsheet>
    </VStack>
  );
}
