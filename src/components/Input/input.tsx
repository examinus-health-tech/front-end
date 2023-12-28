import {
  Flex,
  Icon,
  Input as InputNativeBase,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import { Props } from './input.type';

export function Input({ leftIcon, rightIcon, label, ...rest }: Props) {
  return (
    <VStack>
      <Text
        color="gray.100"
        fontSize={16}
        fontWeight={800}
        letterSpacing={-0.14}
      >
        {label}
      </Text>
      <InputNativeBase
        bg="white"
        h={12}
        borderRadius={12}
        color="gray.70"
        fontSize={16}
        fontWeight={600}
        letterSpacing={-0.16}
        InputLeftElement={
          <Flex ml={5} align="center" justify="center">
            <Icon as={leftIcon} w="full" />
          </Flex>
        }
        InputRightElement={
          <Pressable onPress={() => {}}>
            <Flex mr={5} align="center" justify="center">
              <Icon as={rightIcon} w="full" />
            </Flex>
          </Pressable>
        }
        {...rest}
      />
    </VStack>
  );
}
