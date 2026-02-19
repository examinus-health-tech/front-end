import { TouchableOpacity } from 'react-native';

import { Badge, HStack, IButtonProps, Text, VStack } from 'native-base';

// assets
import { ChevronLeftIcon, FilterIcon, MoreIcon } from '@assets/icons';

// components
import { Progress } from '@components/molecules/Progress/progress';

export type Props = IButtonProps & {
  withBackButton?: () => void;
  withMoreButton?: boolean;
  withFilterButton?: boolean;
  title?: string;
  badgeVariant?: 'risco alto' | 'normal' | 'excelente';
  filterButtonAction?: () => void;
  color?: string;
};

export function HeaderTitle({
  withBackButton,
  withMoreButton,
  withFilterButton,
  title,
  badgeVariant,
  filterButtonAction,
  color = 'gray.900',
}: Props) {
  function renderBadge() {
    switch (badgeVariant) {
      case 'risco alto': {
        return (
          <Badge
            bg="red.100"
            borderRadius={6}
            _text={{
              textTransform: 'uppercase',
              color: 'red.400',
              fontSize: 12,
            }}
          >
            {badgeVariant}
          </Badge>
        );
      }

      case 'normal': {
        return (
          <Badge
            bg="yellow.100"
            borderRadius={6}
            _text={{
              textTransform: 'uppercase',
              color: 'yellow.600',
              fontSize: 10,
            }}
          >
            {badgeVariant}
          </Badge>
        );
      }

      case 'excelente': {
        return (
          <Badge
            bg="ciano.50"
            borderRadius={6}
            _text={{
              textTransform: 'uppercase',
              color: 'ciano.400',
              fontSize: 10,
            }}
          >
            {badgeVariant}
          </Badge>
        );
      }
    }
  }

  return (
    <HStack space={4} mx={6} alignItems="center" mb={6}>
      {withBackButton && (
        <TouchableOpacity onPress={withBackButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ padding: 8, margin: -8 }}>
          <ChevronLeftIcon size="30" color={color === 'white' ? '#ffffff' : '#052B3B'} />
        </TouchableOpacity>
      )}

      {title && (
        <Text flex={1} color={color} fontWeight={800} fontSize={20} letterSpacing={-0.2}>
          {title}
        </Text>
      )}

      {withMoreButton && (
        <TouchableOpacity>
          <MoreIcon />
        </TouchableOpacity>
      )}

      {withFilterButton && (
        <TouchableOpacity onPress={filterButtonAction}>
          <FilterIcon color={color === 'white' ? '#ffffff' : '#818BA0'} />
        </TouchableOpacity>
      )}

      {badgeVariant && renderBadge()}
    </HStack>
  );
}
