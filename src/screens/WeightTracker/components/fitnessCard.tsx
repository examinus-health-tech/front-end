import { EditIcon } from '@assets/icons';
import { Text, Box, Flex } from 'native-base';

export type Props = {
  title: string;
  value?: string;
  unit?: 'kg' | 'mg' | 'kcal' | 'h' | 'ml';
  // goTo: () => void;
};

export function FitnessCard({ title, value, unit }: Props) {
  return (
    <Box bg="white" rounded="2xl" h={236} w={180} position="relative">
      <Flex p={4}>
        <Flex direction="row" justify="space-between" mb={8}>
          <Text
            color="gray.900"
            fontFamily="Poligon"
            fontSize={16}
            fontWeight={600}
            letterSpacing={-0.16}
          >
            {title}
          </Text>

          <EditIcon color="#818BA0" size="32" />
        </Flex>

        <Flex direction="row" align="flex-end">
          <Text
            color="gray.900"
            fontFamily="Poligon"
            fontSize={24}
            fontWeight={800}
            letterSpacing={-0.24}
            lineHeight={24}
          >
            {value}
          </Text>
          <Text
            color="gray.900"
            fontFamily="Poligon"
            fontSize={14}
            fontWeight={600}
            letterSpacing={-0.14}
            pl={1}
            lineHeight={22}
          >
            {unit}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
