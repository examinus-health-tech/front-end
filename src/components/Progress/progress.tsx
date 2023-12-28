import {
  VStack,
  Center,
  Box,
  Progress as ProgressNativeBase,
} from 'native-base';
import { Props } from './progress.type';

export function Progress({
  value,
  size,
  filledColor = 'gray.100',
  bgColor = 'gray.20',
}: Props) {
  return (
    <Center w={`${size}%`}>
      <Box w="100%">
        <ProgressNativeBase
          _filledTrack={{
            bg: filledColor,
          }}
          bg={bgColor}
          value={value}
        />
      </Box>
    </Center>
  );
}
