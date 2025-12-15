import { TouchableOpacity } from 'react-native';
import { Box, HStack, VStack, Text } from 'native-base';
import { Notification } from 'src/@types/notifications';
import { DownloadIcon } from '@assets/icons';
import { Progress } from '@components/molecules/Progress/progress';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para formatar data relativa (ex: "há 2 horas", "há 3 dias")
function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  } catch {
    return '';
  }
}

type Props = {
  notification: Notification;
  onPressDownloadPdf?: (url: string) => void;
  onPress?: (notification: Notification) => void;
};

export function NotificationCard({ notification, onPressDownloadPdf, onPress }: Props) {
  const isUnread = !notification.read;

  // Estilos diferenciados para lida vs não lida
  const cardStyles = isUnread
    ? {
        bg: 'blue.50',
        borderWidth: 1,
        borderColor: 'ciano.200',
      }
    : {
        bg: 'white',
      };

  const handlePress = () => {
    onPress?.(notification);
  };

  if (notification.type === 'DOCTOR_MESSAGE') {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Box borderRadius={10} px={3} py={2.5} {...cardStyles} position="relative">
          {isUnread && (
            <Box position="absolute" top={1.5} right={1.5} bg="ciano.400" px={1.5} py={0.5} borderRadius={4}>
              <Text fontSize={8} fontWeight={700} color="white">NOVO</Text>
            </Box>
          )}
          <HStack space={3}>
            <Box bg="ciano.300" borderRadius={8} w={12} h={12} />

            <VStack justifyContent="center" space={0.5} flex={1}>
              <Text fontSize={14} fontWeight={isUnread ? 700 : 600} letterSpacing={-0.14} color="gray.900">
                {notification.title}
              </Text>
              <Text fontSize={13} fontWeight={500} lineHeight={18} color="gray.600" numberOfLines={2}>
                {notification.description}
              </Text>
              {notification.createdAt && (
                <Text fontSize={10} fontWeight={400} color="gray.400">
                  {formatRelativeDate(notification.createdAt)}
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  }

  if (notification.type === 'MONTHLY_INSIGHT') {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Box borderRadius={10} px={3} py={2.5} {...cardStyles} position="relative">
          {isUnread && (
            <Box position="absolute" top={1.5} right={1.5} bg="ciano.400" px={1.5} py={0.5} borderRadius={4}>
              <Text fontSize={8} fontWeight={700} color="white">NOVO</Text>
            </Box>
          )}
          <VStack space={1}>
            <Text fontSize={14} fontWeight={isUnread ? 700 : 600} letterSpacing={-0.14} color="gray.900" mr={14}>
              {notification.title}
            </Text>
            <Text fontSize={13} fontWeight={500} lineHeight={18} color="gray.600" numberOfLines={2}>
              {notification.description}
            </Text>

            <HStack justifyContent="space-between" alignItems="center">
              {notification.pdfUrl && (
                <TouchableOpacity onPress={() => onPressDownloadPdf && onPressDownloadPdf(notification.pdfUrl!)}>
                  <HStack borderRadius={6} bg="gray.100" px={2} py={1.5} alignItems="center">
                    <DownloadIcon size="16" color="#3D4966" />
                    <Text
                      ml={1.5}
                      color="gray.800"
                      fontSize={10}
                      fontWeight={700}
                      letterSpacing={0.5}
                      textTransform="uppercase"
                    >
                      download pdf
                    </Text>
                  </HStack>
                </TouchableOpacity>
              )}
              {notification.createdAt && (
                <Text fontSize={10} fontWeight={400} color="gray.400">
                  {formatRelativeDate(notification.createdAt)}
                </Text>
              )}
            </HStack>
          </VStack>
        </Box>
      </TouchableOpacity>
    );
  }

  if (notification.type === 'STEPS_GOAL') {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Box borderRadius={10} px={3} py={2.5} {...cardStyles} position="relative">
          {isUnread && (
            <Box position="absolute" top={1.5} right={1.5} bg="ciano.400" px={1.5} py={0.5} borderRadius={4}>
              <Text fontSize={8} fontWeight={700} color="white">NOVO</Text>
            </Box>
          )}
          <VStack space={1}>
            <Text fontSize={14} fontWeight={isUnread ? 700 : 600} letterSpacing={-0.14} color="gray.900" mr={14}>
              {notification.title}
            </Text>
            <Text fontSize={13} fontWeight={500} lineHeight={18} color="gray.600" numberOfLines={2}>
              {notification.description}
            </Text>

            {typeof notification.progress === 'number' && (
              <Box mt={1}>
                <Progress value={notification.progress} sizeW={100} filledColor="blue.400" bgColor="gray.200" />
              </Box>
            )}

            {notification.createdAt && (
              <Text fontSize={10} fontWeight={400} color="gray.400">
                {formatRelativeDate(notification.createdAt)}
              </Text>
            )}
          </VStack>
        </Box>
      </TouchableOpacity>
    );
  }

  // fallback - notificação genérica
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Box borderRadius={10} px={3} py={2.5} {...cardStyles} position="relative">
        {isUnread && (
          <Box position="absolute" top={1.5} right={1.5} bg="ciano.400" px={1.5} py={0.5} borderRadius={4}>
            <Text fontSize={8} fontWeight={700} color="white">NOVO</Text>
          </Box>
        )}
        <VStack space={1}>
          <Text fontSize={14} fontWeight={isUnread ? 700 : 600} letterSpacing={-0.14} color="gray.900" mr={14}>
            {notification.title}
          </Text>
          <Text fontSize={13} fontWeight={500} lineHeight={18} color="gray.600" numberOfLines={2}>
            {notification.description}
          </Text>
          {notification.createdAt && (
            <Text fontSize={10} fontWeight={400} color="gray.400">
              {formatRelativeDate(notification.createdAt)}
            </Text>
          )}
        </VStack>
      </Box>
    </TouchableOpacity>
  );
}
