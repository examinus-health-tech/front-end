import { VStack, Text, Image, Center, Box, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-10.png';
import XLogo from '@assets/png/x-logo.png';

// components
import { Button } from '@components/Button/button';

export function Score() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('homepage');
  }

  return (
    <VStack flex={1} bg={'purple.60'} space={8} py={24}>
      <Image
        source={Vector}
        defaultSource={Vector}
        alt="X examinus Logo"
        resizeMode="stretch"
        w="100%"
        h={400}
      />

      <Center flex={1} alignItems="center">
        <Box bgColor={'white'} w={'180'} h={'82'} borderRadius={12} p={2}>
          <HStack alignItems={'center'} justifyContent={'space-around'}>
            <Box
              bg={'purple.20'}
              w={16}
              h={16}
              borderRadius={12}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image
                source={XLogo}
                defaultSource={XLogo}
                alt="X examinus Logo"
                resizeMode="contain"
                w={8}
                h={10}
              />
            </Box>

            <Text
              fontSize={80}
              fontWeight={800}
              lineHeight={80}
              color={'purple.60'}
            >
              88
            </Text>
          </HStack>
        </Box>

        <Text
          fontSize={24}
          fontWeight={800}
          lineHeight={32}
          letterSpacing={-0.96}
          color={'white'}
          textAlign="center"
          mt={8}
        >
          Yeaaaah!{'\n'}
          Seu Score X é 88.
        </Text>

        <Text
          fontSize={14}
          fontWeight={500}
          lineHeight={22.4}
          color={'white'}
          textAlign="center"
          mt={4}
        >
          Estamos redirecionando você para a tela inicial.{'\n'}
          Está pronto para ficar saudável com a Examinus?{' '}
        </Text>

        <Button
          variant="outline"
          size="md"
          title="Bora ficar saudável"
          icon={<ArrowIcon />}
          mt={6}
          onPress={handleNextStep}
        />
      </Center>
    </VStack>
  );
}
