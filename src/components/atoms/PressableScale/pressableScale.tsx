import { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  scaleTo?: number;
}

/**
 * Wrapper que dá feedback de "squeeze" ao pressionar — útil em cards
 * tappables (ex: seleção de gênero). Usa Reanimated + spring pra suavidade.
 */
export function PressableScale({
  children,
  scaleTo = 0.95,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, { damping: 18, stiffness: 280, mass: 0.5 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 18, stiffness: 280, mass: 0.5 });
        onPressOut?.(e);
      }}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
