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

// components
import { Button } from '@components/atoms';
import { HeaderProgress } from '@components/molecules';

export type ISelectedPhysical = 0 | 1 | 2 | 3 | 4;

export const enumPhysicalLabel = {
  1: 'ruim',
  2: 'regular',
  3: 'moderado',
  4: 'bom',
};

export function Humour() {
  const [selectedPhysical, setSelectedPhysical] =
    useState<ISelectedPhysical>(0);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack bg={'gray.400'} flex={1} space={8} py={24}>
      <HeaderProgress
        progressValue={33}
        withBackButton
        jumpTo={() => navigation.navigate('')}
      />

      <VStack flex={1} mx={6} space={8}>
        <Text
          color="gray.900"
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
          bottom={-50}
          variant="primary"
          size="full"
          title="Continuar"
          onPress={() => navigation.navigate('habits')}
          icon={<ArrowIcon />}
        />
      </VStack>
    </VStack>
  );
}
