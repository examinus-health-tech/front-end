import { useState } from 'react';
import {
  Image,
  VStack,
  Text,
  Box,
  HStack,
  Divider,
  ZStack,
  Center,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-8.png';

// components
import { Button } from '@components/Button/button';
import { Header } from '@components/Header';
import { TouchableOpacity } from 'react-native';
import { ISelectedPhysical, enumPhysicalLabel } from './humour.type';

export function Humour() {
  const [selectedPhysical, setSelectedPhysical] =
    useState<ISelectedPhysical>(0);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('habits');
  }

  function handleGoToUpload() {
    navigation.navigate('');
  }

  return (
    <VStack flex={1} bg={'gray.10'} space={8} py={24} mx={6}>
      <Header progressValue={33} withBackButton jumpTo={handleGoToUpload} />
      <Text
        color="gray.100"
        fontSize={32}
        fontWeight={800}
        lineHeight={38}
        letterSpacing={-1.2}
        mt={4}
      >
        Como está seu humor atualmente?
      </Text>

      <Button
        position="absolute"
        bottom={10}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={handleNextStep}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
