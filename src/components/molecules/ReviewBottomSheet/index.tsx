import { useState } from 'react';
import { TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { Actionsheet, Box, HStack, Text, VStack } from 'native-base';
import Svg, { Path } from 'react-native-svg';
import * as StoreReview from 'expo-store-review';
import { markAsReviewed, markReviewPromptShown } from '@services/reviewService';

interface ReviewBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewBottomSheet({ isOpen, onClose }: ReviewBottomSheetProps) {
  const [selectedRating, setSelectedRating] = useState(0);

  const openURL = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link.');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Erro', 'Não foi possível abrir o link.');
    }
  };

  const openStoreReview = async () => {
    await markAsReviewed();
    handleClose();

    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
      } else {
        const url = StoreReview.storeUrl();
        if (url) {
          openURL(url);
        }
      }
    } catch (error) {
      console.error('[Review] Erro ao solicitar review nativo:', error);
      const url = StoreReview.storeUrl();
      if (url) {
        openURL(url);
      }
    }
  };

  const handleSendFeedback = async () => {
    await markReviewPromptShown();
    handleClose();
    openURL('mailto:feedback@examinus.app?subject=Feedback sobre a Examinus');
  };

  const handleClose = () => {
    setSelectedRating(0);
    onClose();
  };

  const handleDismiss = async () => {
    await markReviewPromptShown();
    handleClose();
  };

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

  return (
    <Actionsheet isOpen={isOpen} onClose={handleDismiss}>
      <Actionsheet.Content bg="white" borderTopRadius={20} px={6} pt={6} pb={8}>
        <VStack w="100%" alignItems="center" space={4}>
          <Text fontSize={20} fontWeight={700} color="gray.900" textAlign="center" mt={2}>
            Avalie a Examinus
          </Text>

          <Text fontSize={14} fontWeight={400} color="gray.500" textAlign="center" lineHeight={20}>
            Sua opinião é muito importante para nós!{'\n'}Como você avalia sua experiência?
          </Text>

          <HStack justifyContent="center" mt={2}>
            {renderStars()}
          </HStack>

          {selectedRating > 0 && (
            <VStack w="100%" space={3} mt={4}>
              {selectedRating >= 4 ? (
                <>
                  <Text fontSize={14} color="gray.600" textAlign="center">
                    Que bom que você está gostando! Deixe sua avaliação na loja.
                  </Text>
                  <TouchableOpacity onPress={openStoreReview} activeOpacity={0.8}>
                    <Box bg="ciano.500" py={3} borderRadius={12} alignItems="center">
                      <Text fontSize={16} fontWeight={600} color="white">
                        Avaliar na {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text fontSize={14} color="gray.600" textAlign="center">
                    Sentimos muito! Conte-nos como podemos melhorar.
                  </Text>
                  <TouchableOpacity onPress={handleSendFeedback} activeOpacity={0.8}>
                    <Box bg="ciano.500" py={3} borderRadius={12} alignItems="center">
                      <Text fontSize={16} fontWeight={600} color="white">
                        Enviar Feedback
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity onPress={handleDismiss} activeOpacity={0.8}>
                <Box py={3} alignItems="center">
                  <Text fontSize={14} fontWeight={500} color="gray.500">
                    Agora não
                  </Text>
                </Box>
              </TouchableOpacity>
            </VStack>
          )}
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
