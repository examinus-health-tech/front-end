import { HStack } from 'native-base';
import { RangeTab } from '@components/atoms';

export type TimeRange = '1d' | '1w' | '1m' | '1y' | 'all';

export type Props = {
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
};

const ranges: { value: TimeRange; label: string }[] = [
  { value: '1d', label: '1 Dia' },
  { value: '1w', label: '1 Semana' },
  { value: '1m', label: '1 Mês' },
  { value: '1y', label: '1 Ano' },
  { value: 'all', label: 'Tudo' },
];

export function TimeRangePicker({ selected, onSelect }: Props) {
  return (
    <HStack flex={1} justifyContent="space-between">
      {ranges.map((range) => (
        <RangeTab
          key={range.value}
          label={range.label}
          isSelected={selected === range.value}
          onPress={() => onSelect(range.value)}
        />
      ))}
    </HStack>
  );
}
