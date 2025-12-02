import { TouchableOpacity } from 'react-native';
import { Box, HStack, VStack, Text } from 'native-base';
import { Notification } from 'src/@types/notifications';
import { DownloadIcon } from '@assets/icons';
import { Progress } from '@components/molecules/Progress/progress';

type Props = {
  notification: Notification;
  onPressDownloadPdf?: (url: string) => void;
  onPress?: (notification: Notification) => void;
};

// Indicador de não lido (bolinha azul)
function UnreadIndicator() {
  return <Box position="absolute" top={2} right={2} w={3} h={3} borderRadius="full" bg="ciano.300" />;
}

export function NotificationCard({ notification, onPressDownloadPdf, onPress }: Props) {
  const isUnread = !notification.read;
  const cardBg = isUnread ? 'blue.50' : 'white';
  const borderStyle = isUnread ? { borderWidth: 1, borderColor: 'ciano.200' } : {};

  const handlePress = () => {
    onPress?.(notification);
  };

  if (notification.type === 'DOCTOR_MESSAGE') {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Box bg={cardBg} borderRadius={12} p={4} {...borderStyle} position="relative">
          {isUnread && <UnreadIndicator />}
          <HStack space={4}>
            <Box bg="ciano.300" borderRadius={10} w={16} h={16} />

            <VStack justifyContent="center" space={2} flex={1}>
              <Text fontSize={16} fontWeight={isUnread ? 700 : 600} letterSpacing={-0.14} color="gray.900">
                {notification.title}
              </Text>
              <Text fontSize={14} fontWeight={500} lineHeight={19.2} color="gray.600">
                {notification.description}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  }

  if (notification.type === 'MONTHLY_INSIGHT') {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Box bg={cardBg} borderRadius={12} p={4} {...borderStyle} position="relative">
          {isUnread && <UnreadIndicator />}
          <VStack space={2}>
            <Text fontSize={16} fontWeight={700} letterSpacing={-0.14} color="gray.900">
              {notification.title}
            </Text>
            <Text fontSize={14} fontWeight={500} lineHeight={19.2} color="gray.600">
              {notification.description}
            </Text>

            {notification.pdfUrl && (
              <TouchableOpacity onPress={() => onPressDownloadPdf && onPressDownloadPdf(notification.pdfUrl!)}>
                <HStack borderRadius={8} bg="gray.100" px={3} py={2} alignItems="center" alignSelf="flex-start" mt={2}>
                  <DownloadIcon size="20" color="#3D4966" />
                  <Text
                    ml={2}
                    color="gray.800"
                    fontSize={12}
                    fontWeight={700}
                    letterSpacing={0.5}
                    textTransform="uppercase"
                  >
                    download pdf
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
          </VStack>
        </Box>
      </TouchableOpacity>
    );
  }

  if (notification.type === 'STEPS_GOAL') {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Box bg={cardBg} borderRadius={12} p={4} {...borderStyle} position="relative">
          {isUnread && <UnreadIndicator />}
          <VStack space={2}>
            <Text fontSize={16} fontWeight={700} letterSpacing={-0.14} color="gray.900">
              {notification.title}
            </Text>
            <Text fontSize={14} fontWeight={500} lineHeight={19.2} color="gray.600">
              {notification.description}
            </Text>

            {typeof notification.progress === 'number' && (
              <Box mt={2}>
                <Progress value={notification.progress} sizeW={100} filledColor="blue.40" bgColor="gray.200" />
              </Box>
            )}
          </VStack>
        </Box>
      </TouchableOpacity>
    );
  }

  // fallback - notificação genérica
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Box bg={cardBg} borderRadius={12} p={4} {...borderStyle} position="relative">
        {isUnread && <UnreadIndicator />}
        <VStack space={2}>
          <Text fontSize={16} fontWeight={700} letterSpacing={-0.14} color="gray.900">
            {notification.title}
          </Text>
          <Text fontSize={14} fontWeight={500} lineHeight={19.2} color="gray.600">
            {notification.description}
          </Text>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
}
