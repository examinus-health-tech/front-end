import { ChevronLeftIcon, MoreIcon } from '@assets/icons';
import { Text, HStack } from 'native-base';
import { TouchableOpacity } from 'react-native';

export type Props = {
  title: string;
  backTo: () => void;
};

export function Header({ backTo, title }: Props) {
  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      space={4}
      mb={10}
    >
      <TouchableOpacity onPress={backTo}>
        <ChevronLeftIcon size="30" color={'#052B3B'} />
      </TouchableOpacity>

      <Text
        flex={1}
        color={'gray.900'}
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
