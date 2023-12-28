import { TouchableOpacity } from 'react-native';

import { HStack, Text, VStack } from 'native-base';

// type
import { Props } from './index.type';

// assets
import { ChevronLeftIcon } from '@assets/icons';

// components
import { Progress } from '@components/Progress/progress';

export function Header({ progressValue, jumpTo, withBackButton }: Props) {
  return (
    <HStack space={8} justifyContent="space-between" alignItems="center">
      {withBackButton && (
        <VStack px={2} py={1}>
          <TouchableOpacity>
            <ChevronLeftIcon />
          </TouchableOpacity>
        </VStack>
      )}

      <Progress
        value={progressValue}
        size={withBackButton ? 50 : 60}
        filledColor="gray.100"
        bgColor="gray.20"
      />

      <VStack px={2} py={1}>
        {jumpTo && (
          <TouchableOpacity>
            <Text
              fontSize={16}
              color="gray.100"
              lineHeight={25.6}
              fontWeight={500}
            >
              Pular
            </Text>
          </TouchableOpacity>
        )}
      </VStack>
    </HStack>
  );
}
