import { Center, Box, Progress as ProgressNativeBase } from 'native-base';
import { IProgressProps } from 'native-base/lib/typescript/components/composites';

export type Props = IProgressProps & {
  value: number;
  sizeW: number;
  filledColor: string;
  bgColor: string;
};

export function Progress({
  value,
  sizeW,
  filledColor = 'gray.900',
  bgColor = 'gray.300',
  ...rest
}: Props) {
  return (
    <Center w={`${sizeW}%`}>
      <Box w="100%">
        <ProgressNativeBase
          _filledTrack={{
            bg: filledColor,
          }}
          bg={bgColor}
          value={value}
          {...rest}
        />
      </Box>
    </Center>
  );
}
