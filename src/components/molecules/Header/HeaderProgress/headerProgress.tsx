import { TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

import { HStack, IButtonProps, Text, VStack, Box } from 'native-base';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// assets
import { ChevronLeftIcon } from '@assets/icons';

export type Props = IButtonProps & {
  progressValue?: number;
  withBackButton?: () => void;
  jumpTo?: () => void;
};

export function HeaderProgress({ progressValue, jumpTo, withBackButton }: Props) {
  // Progress bar animada via Reanimated (em vez do Progress nativo do native-base que snapava)
  const width = useSharedValue(progressValue ?? 0);

  useEffect(() => {
    width.value = withTiming(progressValue ?? 0, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });
  }, [progressValue]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

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
        <Box flex={1} h={2} bg="gray.100" borderRadius={4} overflow="hidden">
          <Animated.View
            style={[
              { height: '100%', backgroundColor: '#111827', borderRadius: 4 },
              fillStyle,
            ]}
          />
        </Box>
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
