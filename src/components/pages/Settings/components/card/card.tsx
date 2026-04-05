import { ChevronRightIcon, EditIcon } from '@assets/icons';
import { Box, HStack, Text, VStack } from 'native-base';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

export type Props = {
  title: string;
  subTitle?: string;
  icon?: JSX.Element;
  warning?: boolean;
  value?: string;
  action?: 'switch' | 'value' | 'chevron';
  goTo?: () => void;
  variant: 'primary' | 'description' | 'value' | 'checkbox' | 'switch';
  comingSoon?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
};

export function Card({ title, subTitle, icon, warning, action, goTo, variant, value, comingSoon, switchValue, onSwitchChange, disabled, testID }: Props) {
  function renderLeftBox() {
    if (variant === 'primary') {
      return (
        <Box
          bg={warning ? 'red.400' : 'white'}
          w={16}
          h={16}
          borderRadius={12}
          borderColor={'gray.100'}
          borderWidth={warning ? 0 : 1}
          alignItems={'center'}
          justifyContent={'center'}
        >
          {icon}
        </Box>
      );
    }
  }

  function renderDescription() {
    if (variant === 'primary' || variant === 'value') {
      return (
        <Text flex={1} color={warning ? 'red.400' : 'gray.900'} fontSize={18} fontWeight={600} letterSpacing={-0.16}>
          {title}
        </Text>
      );
    }

    if (variant === 'description') {
      return (
        <VStack flex={1} mr={12}>
          <Text color={'gray.900'} fontSize={18} fontWeight={600} letterSpacing={-0.16}>
            {title}
          </Text>

          <Text color={'gray.400'} fontSize={12} fontWeight={500} lineHeight={19.2}>
            {subTitle}
          </Text>
        </VStack>
      );
    }
  }

  function renderAction() {
    if (comingSoon) {
      return (
        <Box bg="gray.200" px={3} py={2} borderRadius={8}>
          <Text color="gray.500" fontSize={12} fontWeight={600}>
            Em Breve
          </Text>
        </Box>
      );
    }

    // Switch é tratado no early return, não chega aqui

    if (action === 'value') {
      return (
        <HStack alignItems={'center'}>
          <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.14}>
            {value}
          </Text>
          <ChevronRightIcon size="30" color={'#BEC5D2'} />
        </HStack>
      );
    }

    if (action === 'chevron') {
      return <ChevronRightIcon size="30" color={warning ? '#FA4D5E' : '#BEC5D2'} />;
    }
  }

  // Se for switch, usa layout NativeBase mas com toggle customizado
  if (action === 'switch') {
    const handleCardPress = () => {
      if (!comingSoon && !disabled && onSwitchChange) {
        onSwitchChange(!switchValue);
      }
    };

    return (
      <TouchableOpacity onPress={handleCardPress} disabled={comingSoon || disabled} activeOpacity={0.7}>
        <Box
          bg={warning ? 'red.100' : 'white'}
          w="100%"
          borderRadius={16}
          p={3}
          opacity={comingSoon || disabled ? 0.6 : 1}
        >
          <HStack space={5} alignItems={'center'}>
            {renderLeftBox()}

            {renderDescription()}

            {comingSoon ? (
              <Box bg="gray.200" px={3} py={2} borderRadius={8}>
                <Text color="gray.500" fontSize={12} fontWeight={600}>
                  Em Breve
                </Text>
              </Box>
            ) : (
              <CustomToggle
                value={switchValue || false}
                onValueChange={onSwitchChange}
                disabled={disabled}
              />
            )}
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity testID={testID} onPress={comingSoon || disabled ? undefined : goTo} disabled={comingSoon || disabled}>
      <Box
        bg={warning ? 'red.100' : 'white'}
        w="100%"
        borderRadius={16}
        p={3}
        opacity={comingSoon || disabled ? 0.6 : 1}
      >
        <HStack space={5} alignItems={'center'}>
          {renderLeftBox()}

          {renderDescription()}

          {renderAction()}
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}

// Toggle customizado para evitar bugs do Switch nativo no iOS
function CustomToggle({
  value,
  onValueChange,
  disabled
}: {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}) {
  const translateX = useRef(new Animated.Value(value ? 22 : 2)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 22 : 2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        styles.toggleTrack,
        { backgroundColor: value ? '#0CC1AF' : '#E5E7EB' },
        disabled && { opacity: 0.5 }
      ]}
    >
      <Animated.View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX }] }
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleTrack: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
