import { VStack, Text, Image, Center, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-48.png';

// components
import { Button } from '@components/atoms';

export function ScoreWarning() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack flex={1} bg={'purple.500'} justifyContent="space-between">
      <Box flex={1} justifyContent="center" alignItems="center">
        <Image
          source={Vector}
          defaultSource={Vector}
          alt="Health illustration"
          resizeMode="contain"
          w="100%"
          h={400}
          mt={-8}
        />

        <VStack space={4} alignItems="center" mt={8} px={6}>
          <Text
            fontSize={28}
            fontWeight={800}
            lineHeight={36}
            letterSpacing={-0.96}
            color={'white'}
            textAlign="center"
          >
            Yeaaaah! Seu Score X{'\n'}
            está sendo processado!
          </Text>

          <Text fontSize={16} fontWeight={500} lineHeight={24} color={'white'} textAlign="center" px={4}>
            Fique tranquilo! Você receberá uma notificação assim que estiver pronto. Enquanto cuidamos de você, aproveite o melhor app de saúde!
          </Text>

          <Button
            variant="outline"
            size="md"
            title="Bora ficar saudável"
            icon={<ArrowIcon />}
            mt={4}
            onPress={() => navigation.navigate('homepage')}
          />
        </VStack>
      </Box>
    </VStack>
  );
}
