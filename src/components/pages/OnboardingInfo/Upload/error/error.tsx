import { useEffect, useState } from 'react';
import { VStack, Text, Image, Center, useDisclose } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-18.png';

// components
import { Button } from '@components/atoms';
import { HeaderProgress } from '@components/molecules';
import { TouchableOpacity } from 'react-native';

export function UploadError() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack bg={'gray.400'} flex={1} space={8} py={24}>
      <HeaderProgress progressValue={33} withBackButton />

      <Center flex={1} mx={6} mt={-32} alignItems="center">
        <Text
          fontSize={24}
          fontWeight={800}
          lineHeight={25.6}
          textAlign="center"
          mt={40}
          color={'red.60'}
        >
          Xiii, deu ruim! :(
        </Text>

        <Text
          fontSize={14}
          fontWeight={500}
          lineHeight={25.6}
          textAlign="center"
          color={'gray.400'}
        >
          Seu exame não foi processado.{'\n'} Verifique o formato do arquivo
          enviado.
        </Text>

        <Image
          source={Vector}
          defaultSource={Vector}
          alt="Vetor"
          resizeMode="contain"
          w="100%"
          h={300}
          mt={8}
        />

        <Button
          mt={16}
          variant="primary"
          size="lg"
          title="Tentar novamente"
          icon={<ArrowIcon />}
        />
      </Center>

      <Center>
        <TouchableOpacity>
          <Text
            bottom={-30}
            fontSize={16}
            fontWeight={600}
            letterSpacing={-0.16}
            color="gray.200"
          >
            fazer isso mais tarde
          </Text>
        </TouchableOpacity>
      </Center>
    </VStack>
  );
}
