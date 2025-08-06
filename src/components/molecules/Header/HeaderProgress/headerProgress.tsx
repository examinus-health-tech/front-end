import { TouchableOpacity } from 'react-native';

import { HStack, IButtonProps, Text, VStack } from 'native-base';

// assets
import { ChevronLeftIcon } from '@assets/icons';

// components
import { Progress } from '@components/molecules/Progress/progress';

export type Props = IButtonProps & {
  progressValue?: number;
  withBackButton?: () => void;
  jumpTo?: () => void;
};

export function HeaderProgress({ progressValue, jumpTo, withBackButton }: Props) {
  return (
    <HStack space={8} mx={6} justifyContent="space-between" alignItems="center">
      {withBackButton && (
        <VStack py={1}>
          <TouchableOpacity onPress={withBackButton}>
            <ChevronLeftIcon />
          </TouchableOpacity>
        </VStack>
      )}

      {!!progressValue && (
        <Progress value={progressValue} sizeW={withBackButton ? 50 : 60} filledColor="gray.900" bgColor="gray.100" />
      )}

      <VStack py={1}>
        {jumpTo && (
          <TouchableOpacity
            onPress={() => {
              jumpTo();
            }}
          >
            <Text fontSize={16} color="gray.900" lineHeight={25.6} fontWeight={500}>
              Pular
            </Text>
          </TouchableOpacity>
        )}
      </VStack>
    </HStack>
  );
}
