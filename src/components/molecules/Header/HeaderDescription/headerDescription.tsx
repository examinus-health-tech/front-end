import { TouchableOpacity } from 'react-native';

import { HStack, IButtonProps, Text, VStack, Menu, Pressable } from 'native-base';

// assets
import { ChevronLeftIcon, MoreIcon, TrashIcon } from '@assets/icons';

export type Props = IButtonProps & {
  withBackButton?: () => void;
  title?: string;
  subTitle?: string;
  onDeletePress?: () => void;
};

export function HeaderDescription({ withBackButton, title, subTitle, onDeletePress }: Props) {
  return (
    <HStack space={4} mx={6} alignItems="center" mb={6}>
      {withBackButton && (
        <TouchableOpacity onPress={() => withBackButton()}>
          <ChevronLeftIcon size="30" />
        </TouchableOpacity>
      )}

      {title && (
        <VStack flex={1}>
          <Text fontWeight={800} fontSize={20}>
            {title}
          </Text>
          {subTitle && (
            <Text fontWeight={400} fontSize={14} color="gray.500">
              {subTitle}
            </Text>
          )}
        </VStack>
      )}

      <Menu
        trigger={(triggerProps) => (
          <Pressable {...triggerProps} hitSlop={8}>
            <MoreIcon />
          </Pressable>
        )}
        placement="bottom right"
      >
        <Menu.Item
          onPress={onDeletePress}
          _pressed={{ bg: 'red.50' }}
        >
          <HStack space={2} alignItems="center">
            <TrashIcon color="#EF4444" size="18" />
            <Text color="red.500" fontWeight={600}>
              Excluir exame
            </Text>
          </HStack>
        </Menu.Item>
      </Menu>
    </HStack>
  );
}
