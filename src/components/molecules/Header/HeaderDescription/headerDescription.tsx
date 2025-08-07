import { TouchableOpacity } from 'react-native';

import { Flex, HStack, IButtonProps, Text, VStack } from 'native-base';

// assets
import { ChevronLeftIcon, MoreIcon } from '@assets/icons';

export type Props = IButtonProps & {
  withBackButton?: () => void;
  title?: string;
  date?: string;
  subTitle?: string;
};

export function HeaderDescription({ withBackButton, title, date, subTitle }: Props) {
  return (
    <HStack space={8} mx={6} alignItems="flex-start" pb={4}>
      {withBackButton && (
        <Flex py={1}>
          <TouchableOpacity onPress={() => withBackButton()}>
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
            {date}
          </Text>
          <Text fontWeight={400} fontSize={18} color="gray.500">
            {subTitle}
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
