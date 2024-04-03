import { useNavigation } from '@react-navigation/native';
import {
  Box,
  HStack,
  IScrollViewProps,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  BellIcon,
  BriefcaseIcon,
  ChatIcon,
  FacebookRoundedIcon,
  FlaskIcon,
  InstagramIcon,
  LinkedinIcon,
  ShareIcon,
  StarIcon,
  TelephoneIcon,
} from '@assets/icons';
import Logo from '@assets/png/logo.png';

// components
import { Card } from '../../components/card/card';
import { Header } from '../../components/header/header';
import { useRef } from 'react';

export function AboutUs() {
  const scrollRef = useRef<IScrollViewProps>(null);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} bg={'gray.400'} py={24} mx={6}>
        <Header
          title="Sobre nós"
          handleBackTo={() => navigation.navigate('myAccount')}
        />

        <VStack mb={12} space={3} alignItems={'center'}>
          <Image
            source={Logo}
            defaultSource={Logo}
            alt="Vetor"
            resizeMode="stretch"
          />
          <Text
            color="gray.900"
            fontSize={28}
            fontWeight={800}
            lineHeight={32}
            letterSpacing={-0.96}
          >
            Examinus v1.
          </Text>
        </VStack>

        <VStack space={3}>
          <Card
            title="Política de Privacidade"
            variant="primary"
            icon={<BellIcon size="30" />}
            action="chevron"
          />

          <Card
            title="Faça parte do Team X"
            variant="primary"
            icon={<BriefcaseIcon size="30" />}
            action="chevron"
          />

          <Card
            title="Avalie a Examinus"
            variant="primary"
            icon={<StarIcon size="30" />}
            action="chevron"
          />

          <Card
            title="Desenvolvedor"
            variant="primary"
            icon={<FlaskIcon size="30" />}
            action="chevron"
          />

          <Card
            title="Seja nosso Parceiro"
            variant="primary"
            icon={<ShareIcon size="30" />}
            action="chevron"
          />

          <Card
            title="Enviar um Feedback"
            variant="primary"
            icon={<ChatIcon size="30" />}
            action="chevron"
          />
        </VStack>

        <HStack
          mt={12}
          alignItems={'center'}
          justifyContent={'center'}
          space={8}
        >
          <FacebookRoundedIcon size="30" />
          <InstagramIcon size="24" />
          <LinkedinIcon size="30" />
        </HStack>
      </VStack>
    </ScrollView>
  );
}
