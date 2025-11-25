import { TouchableOpacity } from 'react-native';
import { Box, HStack, VStack, Text } from 'native-base';
import { Notification } from 'src/@types/notifications';
import { DownloadIcon } from '@assets/icons';
import { Progress } from '@components/molecules/Progress/progress';

type Props = {
  notification: Notification;
  onPressDownloadPdf?: (url: string) => void;
};

export function NotificationCard({ notification, onPressDownloadPdf }: Props) {
  if (notification.type === 'DOCTOR_MESSAGE') {
    return (
      <Box bg="white" borderRadius={12} p={4}>
        <HStack space={4}>
          <Box bg="ciano.300" borderRadius={10} w={16} h={16} />

          <VStack justifyContent="center" space={2}>
            <Text fontSize={16} fontWeight={600} letterSpacing={-0.14}>
              {notification.title}
            </Text>
            <Text fontSize={14} fontWeight={500} lineHeight={19.2}>
              {notification.description}
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  }

  if (notification.type === 'MONTHLY_INSIGHT') {
    return (
      <Box bg="white" borderRadius={12} p={4}>
        <HStack space={4}>
          <Box bg="dark_blue.30" borderRadius={10} w={16} h={16} />

          <VStack justifyContent="center" space={2}>
            <Text fontSize={16} fontWeight={600} letterSpacing={-0.14}>
              {notification.title}
            </Text>
            <Text fontSize={14} fontWeight={500} lineHeight={19.2}>
              {notification.description}
            </Text>

            {notification.pdfUrl && (
              <TouchableOpacity onPress={() => onPressDownloadPdf && onPressDownloadPdf(notification.pdfUrl!)}>
                <Box borderRadius={8} bg="dark_blue.10" w={40} p={2} justifyContent="center" flexDir="row">
                  <DownloadIcon size="20" />
                  <Text
                    ml={2}
                    color="dark_blue.40"
                    fontSize={12}
                    fontWeight={800}
                    letterSpacing={1}
                    textTransform="uppercase"
                  >
                    download pdf
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
          </VStack>
        </HStack>
      </Box>
    );
  }

  if (notification.type === 'STEPS_GOAL') {
    return (
      <Box bg="white" borderRadius={12} p={4}>
        <HStack space={4}>
          <Box bg="blue.40" borderRadius={10} w={16} h={16} />

          <VStack justifyContent="center" space={2} flex={1}>
            <Text fontSize={16} fontWeight={600} letterSpacing={-0.14}>
              {notification.title}
            </Text>
            <Text fontSize={14} fontWeight={500} lineHeight={19.2}>
              {notification.description}
            </Text>

            {typeof notification.progress === 'number' && (
              <Progress value={notification.progress} sizeW={100} filledColor="blue.40" bgColor="blue.20" />
            )}
          </VStack>
        </HStack>
      </Box>
    );
  }

  // fallback
  return (
    <Box bg="white" borderRadius={12} p={4}>
      <Text>{notification.title}</Text>
      <Text>{notification.description}</Text>
    </Box>
  );
}
