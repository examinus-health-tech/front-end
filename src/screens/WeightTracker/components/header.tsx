import { ChevronLeftIcon, MoreIcon } from '@assets/icons';
import { Text, HStack } from 'native-base';
import { TouchableOpacity } from 'react-native';

export type Props = {
  title: string;
  bgMode?: boolean;
  backTo: () => void;
};

export function Header({ backTo, bgMode = false, title }: Props) {
  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      space={4}
      mb={10}
    >
      <TouchableOpacity onPress={backTo}>
        <ChevronLeftIcon size="30" color={bgMode ? '#FFFFFF' : '#052B3B'} />
      </TouchableOpacity>

      <Text
        flex={1}
        color={bgMode ? 'white' : 'gray.900'}
        fontSize={20}
        fontWeight={800}
        letterSpacing={-0.2}
      >
        {title}
      </Text>

      <TouchableOpacity>
        <MoreIcon />
      </TouchableOpacity>
    </HStack>
  );
}
