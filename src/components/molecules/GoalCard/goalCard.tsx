import { ReactNode } from 'react';
import { Box, Text } from 'native-base';

export type Props = {
  icon: ReactNode;
  iconBgColor: string;
  value: string;
  unit: string;
  label: string;
};

export function GoalCard({ icon, iconBgColor, value, unit, label }: Props) {
  return (
    <Box bg="white" rounded="2xl" flex={1} p={4}>
      <Box size={12} background={iconBgColor} rounded={12} alignItems="center" justifyContent="center">
        {icon}
      </Box>
      <Text fontFamily="Poligon" fontSize={28} letterSpacing={-0.28} fontWeight={800} mt={4} color="gray.900">
        {value}{' '}
        <Text color="gray.300" fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={800}>
          {unit}
        </Text>
      </Text>
      <Text color="gray.300" fontFamily="Poligon" fontSize={14} letterSpacing={-0.14} fontWeight={500}>
        {label}
      </Text>
    </Box>
  );
}
