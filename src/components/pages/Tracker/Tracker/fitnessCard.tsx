import { EditIcon } from '@assets/icons';
import { Text, Box, Flex } from 'native-base';
import { TouchableOpacity } from 'react-native';

export type Props = {
  title: string;
  value?: string;
  unit?: 'kg' | 'mg' | 'kcal' | 'h' | 'ml';
  goTo?: () => void;
};

export function FitnessCard({ title, value, unit, goTo }: Props) {
  return (
    <Box bg="white" rounded="2xl" h={236} flex={1} position="relative">
      <TouchableOpacity onPress={goTo}>
        <Flex p={4}>
          <Flex direction="row" justify="space-between" mb={6}>
            <Text color="gray.900" fontSize={18} fontWeight={600} letterSpacing={-0.16}>
              {title}
            </Text>

            <EditIcon color="#818BA0" size="32" />
          </Flex>

          <Flex direction="row" align="flex-end">
            <Text color="gray.900" fontSize={24} fontWeight={800} letterSpacing={-0.24} lineHeight={24}>
              {value}
            </Text>
            <Text color="gray.900" fontSize={14} fontWeight={600} letterSpacing={-0.14} pl={1} lineHeight={22}>
              {unit}
            </Text>
          </Flex>
        </Flex>
      </TouchableOpacity>
    </Box>
  );
}
