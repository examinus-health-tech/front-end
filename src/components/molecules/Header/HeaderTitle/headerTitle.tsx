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
  badgeVariant?: 'risco alto' | 'risco normal' | 'excelente';
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

      case 'risco normal': {
        return (
          <Badge
            bg="ciano.100"
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

      case 'excelente': {
        return (
          <Badge
            bg="purple.100"
            borderRadius={6}
            _text={{
              textTransform: 'uppercase',
              color: 'purple.400',
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
    <HStack space={8} mx={6} alignItems="center" pb={4}>
      {withBackButton && (
        <VStack py={1}>
          <TouchableOpacity onPress={withBackButton}>
            <ChevronLeftIcon color={color === 'white' ? '#ffffff' : '#090E1D'} />
          </TouchableOpacity>
        </VStack>
      )}

      {title && (
        <Text flex={1} color={color} fontWeight={800} fontSize={20}>
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
