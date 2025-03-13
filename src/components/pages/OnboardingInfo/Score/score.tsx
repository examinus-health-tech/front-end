import { VStack, Text, Image, Center, Box, HStack, useTheme } from 'native-base';
import { DefaultTheme, useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-10.png';
import Logo from '@assets/png/logo.png';

// components
import { Button } from '@components/atoms';
import { useEffect } from 'react';

export function Score() {
  const { colors } = useTheme();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  useEffect(() => {
    const theme = DefaultTheme;
    theme.colors.background = colors.purple[500];
  }, []);

  return (
    <VStack flex={1} bg={'purple.500'} space={8}>
      <Image source={Vector} defaultSource={Vector} alt="X examinus Logo" resizeMode="stretch" w="100%" h={400} />

      <Center flex={1} alignItems="center">
        <Box bgColor={'white'} w={'180'} h={'82'} borderRadius={12} p={2}>
          <HStack alignItems={'center'} justifyContent={'space-around'}>
            <Image
              source={Logo}
              defaultSource={Logo}
              alt="X examinus Logo"
              resizeMode="contain"
              opacity={10}
              color={'purple.500'}
              tintColor={'purple.500'}
            />

            <Text fontSize={80} fontWeight={800} lineHeight={80} color={'purple.500'}>
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

        <Text fontSize={14} fontWeight={500} lineHeight={22.4} color={'white'} textAlign="center" mt={4}>
          Estamos redirecionando você para a tela inicial.{'\n'}
          Está pronto para ficar saudável com a Examinus?{' '}
        </Text>

        <Button
          variant="outline"
          size="md"
          title="Bora ficar saudável"
          icon={<ArrowIcon />}
          mt={6}
          onPress={() => navigation.navigate('homepage')}
        />
      </Center>
    </VStack>
  );
}
