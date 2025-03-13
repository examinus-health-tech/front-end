import { VStack, Text, Image, Center, Box, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-10.png';
import Logo from '@assets/png/logo.png';

// components
import { Button } from '@components/atoms';

export function ScoreWarning() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack flex={1} space={8} py={24} bg={'purple.500'}>
      <Image source={Vector} defaultSource={Vector} alt="X examinus Logo" resizeMode="stretch" w="100%" h={400} />

      <Center flex={1} alignItems="center">
        <Text
          fontSize={24}
          fontWeight={800}
          lineHeight={32}
          letterSpacing={-0.96}
          color={'white'}
          textAlign="center"
          mt={8}
        >
          Yeaaaah! Seu Score X{'\n'}
          está sendo processado!
        </Text>

        <Text fontSize={14} fontWeight={500} lineHeight={22.4} color={'white'} textAlign="center" mt={4}>
          Fique tranquilo! Você receberá uma notificação{'\n'}
          assim que estiver pronto. Enquanto cuidamos de{'\n'}
          você, aproveite o melhor app de saúde!
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
