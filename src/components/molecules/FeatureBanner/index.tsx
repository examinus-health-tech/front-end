import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, HStack, VStack, Text } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CloseIcon } from '@assets/icons';

type FeatureBannerProps = {
  id: string; // Identificador único para persistir o dismiss
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  bgColor?: string;
  iconBgColor?: string;
  actionColor?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

const DISMISSED_BANNERS_KEY = '@examinus:dismissed_banners';

export function FeatureBanner({
  id,
  icon,
  title,
  description,
  actionText,
  onAction,
  bgColor = 'ciano.50',
  iconBgColor = 'ciano.100',
  actionColor = 'ciano.600',
  dismissible = true,
  onDismiss,
}: FeatureBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Começa escondido até verificar

  useEffect(() => {
    checkIfDismissed();
  }, []);

  const checkIfDismissed = async () => {
    try {
      const dismissed = await AsyncStorage.getItem(DISMISSED_BANNERS_KEY);
      const dismissedList = dismissed ? JSON.parse(dismissed) : [];
      setIsDismissed(dismissedList.includes(id));
    } catch (error) {
      setIsDismissed(false);
    }
  };

  const handleDismiss = async () => {
    try {
      const dismissed = await AsyncStorage.getItem(DISMISSED_BANNERS_KEY);
      const dismissedList = dismissed ? JSON.parse(dismissed) : [];
      if (!dismissedList.includes(id)) {
        dismissedList.push(id);
        await AsyncStorage.setItem(DISMISSED_BANNERS_KEY, JSON.stringify(dismissedList));
      }
      setIsDismissed(true);
      onDismiss?.();
    } catch (error) {
      setIsDismissed(true);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Box bg={bgColor} borderRadius={16} p={4} mb={4}>
      <HStack space={3} alignItems="flex-start">
        <Box bg={iconBgColor} w={12} h={12} borderRadius={12} alignItems="center" justifyContent="center">
          {icon}
        </Box>

        <VStack flex={1} space={1}>
          <Text fontSize={16} fontWeight={700} color="gray.900" letterSpacing={-0.16}>
            {title}
          </Text>
          <Text fontSize={14} fontWeight={500} color="gray.600" lineHeight={18}>
            {description}
          </Text>
          <TouchableOpacity onPress={onAction}>
            <Text fontSize={14} fontWeight={700} color={actionColor} mt={1}>
              {actionText} →
            </Text>
          </TouchableOpacity>
        </VStack>

        {dismissible && (
          <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Box p={1}>
              <CloseIcon size="16" color="#9CA3AF" />
            </Box>
          </TouchableOpacity>
        )}
      </HStack>
    </Box>
  );
}

// Função utilitária para resetar banners dismissados (útil para testes)
export async function resetDismissedBanners() {
  await AsyncStorage.removeItem(DISMISSED_BANNERS_KEY);
}
