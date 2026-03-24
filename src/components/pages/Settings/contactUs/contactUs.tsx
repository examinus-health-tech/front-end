import { useNavigation } from '@react-navigation/native';
import { Image, Text, VStack } from 'native-base';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { TelephoneIcon } from '@assets/icons';
import Logo from '@assets/png/logo.png';

// components
import { Card } from '../components/card/card';
import { Header } from '../components/header/header';

export function ContactUs() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack testID="screen-contact-us" flex={1} py={16} mx={6}>
      <Header title="Fale Conosco" handleBackTo={() => navigation.goBack()} />

      <VStack mt={24} mb={16} space={3} alignItems={'center'}>
        <Image source={Logo} defaultSource={Logo} alt="Vetor" resizeMode="stretch" />
        <Text color="gray.900" fontSize={28} fontWeight={800} lineHeight={32} letterSpacing={-0.96}>
          Examinus v1.3.0
        </Text>
      </VStack>

      <VStack space={3}>
        <Card title="contato@examinus.com.br" variant="primary" icon={<TelephoneIcon size="30" />} />
      </VStack>
    </VStack>
  );
}
