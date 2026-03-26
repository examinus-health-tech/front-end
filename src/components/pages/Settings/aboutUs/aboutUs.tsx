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
      if (__DEV__) console.error('Error opening URL:', error);
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
      if (__DEV__) console.error('Erro ao verificar avaliação:', error);
    }

    onReviewOpen();
  };

  // Abre a loja de aplicativos e marca como avaliado
  const openStoreReview = async () => {
    const appStoreId = '6754453015'; // Examinus App Store ID
    const url = Platform.select({
      ios: `itms-apps://apps.apple.com/app/id${appStoreId}?action=write-review`,
      android: 'market://details?id=com.examinus.app',
    });

    // Marca como avaliado no AsyncStorage
    try {
      await AsyncStorage.setItem(HAS_REVIEWED_KEY, 'true');
    } catch (error) {
      if (__DEV__) console.error('Erro ao salvar avaliação:', error);
    }

    onReviewClose();

    if (url) {
      openURL(url, 'Não foi possível abrir a loja de aplicativos.');
    }
  };

  // Renderiza as estrelas de avaliação
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isSelected = i <= selectedRating;
      const starColor = isSelected ? '#F59E0B' : '#D1D5DB';
      stars.push(
        <TouchableOpacity key={i} onPress={() => setSelectedRating(i)} activeOpacity={0.7}>
          <Box px={2}>
            <Svg width={36} height={36} viewBox="0 0 24 24">
              <Path
                d="M10.41 18.9937C11.3828 18.3857 12.6172 18.3857 13.59 18.9937L16.463 20.7894C17.6554 21.5346 19.1257 20.377 18.681 19.043L17.6394 15.9181C17.2529 14.7587 17.6083 13.4808 18.5379 12.6875L20.9056 10.6668C21.9661 9.76168 21.326 8.02579 19.9318 8.02579H17.3656C16.1577 8.02579 15.0677 7.30141 14.5998 6.18783L13.4643 3.48526C12.9383 2.23316 11.1519 2.26893 10.6764 3.54108L9.72875 6.07619C9.29049 7.24865 8.17035 8.02579 6.91865 8.02579H4.06818C2.67399 8.02579 2.03394 9.76168 3.09442 10.6667L5.46211 12.6875C6.39167 13.4808 6.74709 14.7587 6.36064 15.9181L5.31899 19.043C4.87433 20.377 6.3446 21.5346 7.53701 20.7894L10.41 18.9937Z"
                fill={isSelected ? starColor : 'none'}
                stroke={starColor}
                strokeWidth={2}
              />
            </Svg>
          </Box>
        </TouchableOpacity>
      );
    }
    return stars;
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
    <View flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <VStack pt={16} mx={6}>
        <Header title="Sobre nós" handleBackTo={() => navigation.navigate('myAccount')} />
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
