import { TouchableOpacity } from 'react-native';

import { Flex, HStack, IButtonProps, Text, VStack } from 'native-base';

// assets
import { ChevronLeftIcon, MoreIcon } from '@assets/icons';

export type Props = IButtonProps & {
  withBackButton?: boolean;
  title?: string;
};

export function HeaderDescription({ withBackButton, title }: Props) {
  return (
    <HStack space={8} mx={6} alignItems="flex-start" pb={4}>
      {withBackButton && (
        <Flex py={1}>
          <TouchableOpacity>
            <ChevronLeftIcon />
          </TouchableOpacity>
        </Flex>
      )}

      {title && (
        <VStack flex={1}>
          <Text fontWeight={800} fontSize={20}>
            {title}
          </Text>
          <Text fontWeight={400} fontSize={18} color="gray.500">
            23/04/2023 - 09h:34
          </Text>
          <Text fontWeight={400} fontSize={18} color="gray.500">
            Laboratório: Delboni
          </Text>
        </VStack>
      )}

      <Flex mt={1}>
        <TouchableOpacity>
          <MoreIcon />
        </TouchableOpacity>
      </Flex>
    </HStack>
  );
}
