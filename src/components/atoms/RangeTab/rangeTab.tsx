import { Box, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';

export type Props = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export function RangeTab({ label, isSelected, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        borderColor={isSelected ? 'gray.900' : 'gray.100'}
        borderWidth={2}
        borderRadius={8}
        px={4}
        py={2}
        background={isSelected ? 'gray.900' : 'transparent'}
      >
        <Text
          color={isSelected ? 'white' : 'gray.400'}
          fontFamily="Poligon"
          fontSize={12}
          fontWeight={500}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
