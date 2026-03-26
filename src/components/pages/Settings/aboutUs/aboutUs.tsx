import { useNavigation } from '@react-navigation/native';
import { Box, HStack, IScrollViewProps, Image, ScrollView, Text, VStack, View, StatusBar, useDisclose } from 'native-base';
import { Linking, Alert } from 'react-native';
import { hasUserReviewed } from '@services/reviewService';
import { ReviewBottomSheet } from '@molecules/ReviewBottomSheet';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  BellIcon,
  BriefcaseIcon,
  ChatIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  ShareIcon,
  StarIcon,
  TelephoneIcon,
} from '@assets/icons';
import Logo from '@assets/png/logo.png';

// components
import { Card } from '../components/card/card';
import { Header } from '../components/header/header';
import { useRef } from 'react';

export function AboutUs() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclose();

  // Helper function to open URLs
  const openURL = async (url: string, errorMessage: string = 'Não foi possível abrir o link.') => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', errorMessage, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Erro', errorMessage, [{ text: 'OK' }]);
    }
  };

  // Handle Privacy Policy
  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Política de Privacidade',
      'Nossa Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais e de saúde.',
      [
        {
          text: 'Ver Online',
          onPress: () =>
            openURL('https://www.examinus.com.br/privacy-policy', 'Não foi possível abrir a Política de Privacidade.'),
        },
        {
          text: 'Fechar',
          style: 'cancel',
        },
      ]
    );
  };


  // Handle App Store Review - abre o bottom sheet ou mostra mensagem se já avaliou
  const handleReview = async () => {
    try {
      const reviewed = await hasUserReviewed();
      if (reviewed) {
        Alert.alert(
          'Obrigado!',
          'Você já avaliou a Examinus. Agradecemos seu feedback!',
          [{ text: 'OK' }]
        );
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar avaliação:', error);
    }

    onReviewOpen();
  };

  // Handle Feedback
  const handleFeedback = () => {
    openURL('mailto:feedback@examinus.app?subject=Feedback sobre a Examinus', 'Não foi possível abrir o email.');
  };

  // Handle Social Media
  const handleSocialMedia = (platform: 'instagram' | 'linkedin' | 'facebook') => {
    const urls = {
      instagram: 'https://www.instagram.com/examinus.br/',
      linkedin: 'https://www.linkedin.com/company/examinus/',
      facebook: 'https://www.facebook.com/profile.php?id=100082981159991',
    };

    openURL(urls[platform], `Não foi possível abrir ${platform}.`);
  };

  return (
    <View testID="screen-about-us" flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <VStack pt={16} mx={6}>
        <Header title="Sobre nós" handleBackTo={() => navigation.goBack()} />
      </VStack>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mb={20}>

        <VStack mb={12} space={3} alignItems={'center'}>
          <Image source={Logo} defaultSource={Logo} alt="Vetor" resizeMode="stretch" />
          <Text color="gray.900" fontSize={28} fontWeight={800} lineHeight={32} letterSpacing={-0.96}>
            Examinus v1.3.0
          </Text>
        </VStack>

        <VStack space={3}>
          <Card
            title="Política de Privacidade"
            variant="primary"
            icon={<BellIcon size="30" />}
            action="chevron"
            goTo={handlePrivacyPolicy}
          />

          <Card
            title="Faça parte do Team X"
            variant="primary"
            icon={<BriefcaseIcon size="30" />}
            action="chevron"
            comingSoon={true}
          />

          <Card
            title="Avalie a Examinus"
            variant="primary"
            icon={<StarIcon size="30" />}
            action="chevron"
            goTo={handleReview}
          />

          <Card
            title="Seja nosso Parceiro"
            variant="primary"
            icon={<ShareIcon size="30" />}
            action="chevron"
            comingSoon={true}
          />

          <Card
            title="Enviar um Feedback"
            variant="primary"
            icon={<ChatIcon size="30" />}
            action="chevron"
            goTo={handleFeedback}
          />
        </VStack>

        <HStack mt={12} alignItems={'center'} justifyContent={'center'} space={8}>
          <Box onTouchEnd={() => handleSocialMedia('instagram')}>
            <InstagramIcon size="24" />
          </Box>
          <Box onTouchEnd={() => handleSocialMedia('facebook')}>
            <FacebookIcon size="24" />
          </Box>
          <Box onTouchEnd={() => handleSocialMedia('linkedin')}>
            <LinkedinIcon size="30" />
          </Box>
        </HStack>
        </VStack>
      </ScrollView>

      <ReviewBottomSheet isOpen={isReviewOpen} onClose={onReviewClose} />
    </View>
  );
}
