import { useNavigation } from '@react-navigation/native';
import { Box, HStack, IScrollViewProps, Image, ScrollView, Text, VStack } from 'native-base';
import { Linking, Alert, Platform } from 'react-native';

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
import { Card } from '../components/card/card';
import { Header } from '../components/header/header';
import { useRef, useState } from 'react';

export function AboutUs() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

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
            openURL('https://examinus.app/privacy-policy', 'Não foi possível abrir a Política de Privacidade.'),
        },
        {
          text: 'Fechar',
          style: 'cancel',
        },
      ]
    );
  };

  // Handle Join Team
  const handleJoinTeam = () => {
    openURL(
      'mailto:careers@examinus.app?subject=Quero fazer parte do Team Examinus',
      'Não foi possível abrir o email.'
    );
  };

  // Handle App Store Review
  const handleReview = () => {
    const appStoreId = '6739172726'; // Replace with actual App Store ID when available
    const url = Platform.select({
      ios: `itms-apps://apps.apple.com/app/id${appStoreId}?action=write-review`,
      android: 'market://details?id=com.examinusapp.mobile',
    });

    if (url) {
      openURL(url, 'Não foi possível abrir a loja de aplicativos.');
    }
  };

  // Handle Developer Info
  const handleDeveloper = () => {
    Alert.alert(
      'Desenvolvedor',
      'Examinus é desenvolvido com ❤️ por uma equipe dedicada a revolucionar a análise de exames laboratoriais.',
      [
        {
          text: 'Saber Mais',
          onPress: () => openURL('https://examinus.app/about', 'Não foi possível abrir o link.'),
        },
        {
          text: 'Fechar',
          style: 'cancel',
        },
      ]
    );
  };

  // Handle Partnership
  const handlePartnership = () => {
    openURL('mailto:partnerships@examinus.app?subject=Proposta de Parceria', 'Não foi possível abrir o email.');
  };

  // Handle Feedback
  const handleFeedback = () => {
    openURL('mailto:feedback@examinus.app?subject=Feedback sobre o Examinus', 'Não foi possível abrir o email.');
  };

  // Handle Social Media
  const handleSocialMedia = (platform: 'facebook' | 'instagram' | 'linkedin') => {
    const urls = {
      facebook: 'https://facebook.com/examinus',
      instagram: 'https://instagram.com/examinus',
      linkedin: 'https://linkedin.com/company/examinus',
    };

    openURL(urls[platform], `Não foi possível abrir ${platform}.`);
  };

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={24} mx={6}>
        <Header title="Sobre nós" handleBackTo={() => navigation.navigate('myAccount')} />

        <VStack mb={12} space={3} alignItems={'center'}>
          <Image source={Logo} defaultSource={Logo} alt="Vetor" resizeMode="stretch" />
          <Text color="gray.900" fontSize={28} fontWeight={800} lineHeight={32} letterSpacing={-0.96}>
            Examinus v1.2.5 - teste 24 de Outubro.
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
            goTo={handleJoinTeam}
          />

          <Card
            title="Avalie a Examinus"
            variant="primary"
            icon={<StarIcon size="30" />}
            action="chevron"
            goTo={handleReview}
          />

          <Card
            title="Desenvolvedor"
            variant="primary"
            icon={<FlaskIcon size="30" />}
            action="chevron"
            goTo={handleDeveloper}
          />

          <Card
            title="Seja nosso Parceiro"
            variant="primary"
            icon={<ShareIcon size="30" />}
            action="chevron"
            goTo={handlePartnership}
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
          <Box onTouchEnd={() => handleSocialMedia('facebook')}>
            <FacebookRoundedIcon size="30" />
          </Box>
          <Box onTouchEnd={() => handleSocialMedia('instagram')}>
            <InstagramIcon size="24" />
          </Box>
          <Box onTouchEnd={() => handleSocialMedia('linkedin')}>
            <LinkedinIcon size="30" />
          </Box>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
