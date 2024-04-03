import { ChevronRightIcon, EditIcon } from '@assets/icons';
import { Box, HStack, Text, Switch, VStack } from 'native-base';
import { TouchableOpacity } from 'react-native';

export type Props = {
  title: string;
  subTitle?: string;
  icon?: JSX.Element;
  warning?: boolean;
  value?: string;
  action?: 'switch' | 'value' | 'chevron';
  goTo?: () => void;
  variant: 'primary' | 'description' | 'value' | 'checkbox' | 'switch';
};

export function Card({
  title,
  subTitle,
  icon,
  warning,
  action,
  goTo,
  variant,
  value,
}: Props) {
  function renderLeftBox() {
    if (variant === 'primary') {
      return (
        <Box
          bg={warning ? 'red.50' : 'white'}
          w={16}
          h={16}
          borderRadius={12}
          borderColor={'gray.900'}
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
        <Text
          flex={1}
          color={warning ? 'red.50' : 'gray.900'}
          fontSize={18}
          fontWeight={600}
          letterSpacing={-0.16}
        >
          {title}
        </Text>
      );
    }

    if (variant === 'description') {
      return (
        <VStack flex={1} mr={12}>
          <Text
            color={'gray.900'}
            fontSize={18}
            fontWeight={600}
            letterSpacing={-0.16}
          >
            {title}
          </Text>

          <Text
            color={'gray.400'}
            fontSize={12}
            fontWeight={500}
            lineHeight={19.2}
          >
            {subTitle}
          </Text>
        </VStack>
      );
    }
  }

  function renderAction() {
    if (action === 'switch') {
      return <Switch onTrackColor="ciano.300" />;
    }

    if (action === 'value') {
      return (
        <HStack alignItems={'center'}>
          <Text
            color={'gray.400'}
            fontSize={14}
            fontWeight={600}
            letterSpacing={-0.14}
          >
            {value}
          </Text>
          <ChevronRightIcon size="30" color={'#BEC5D2'} />
        </HStack>
      );
    }

    if (action === 'chevron') {
      return (
        <ChevronRightIcon size="30" color={warning ? '#FA4D5E' : '#BEC5D2'} />
      );
    }
  }

  return (
    <TouchableOpacity onPress={goTo}>
      <Box bg={warning ? 'red.20' : 'white'} w="100%" borderRadius={16} p={3}>
        <HStack space={5} alignItems={'center'}>
          {renderLeftBox()}

          {renderDescription()}

          {renderAction()}
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
