import { TouchableOpacity } from 'react-native';

import { Badge, HStack, IButtonProps, Text, VStack } from 'native-base';

// assets
import { ChevronLeftIcon, FilterIcon, MoreIcon } from '@assets/icons';

// components
import { Progress } from '@components/molecules/Progress/progress';

export type Props = IButtonProps & {
  withBackButton?: boolean;
  withMoreButton?: boolean;
  withFilterButton?: boolean;
  title?: string;
  badgeVariant?: 'warning' | 'normal' | 'good';
  filterButtonAction?: () => void;
};

export function HeaderTitle({
  withBackButton,
  withMoreButton,
  withFilterButton,
  title,
  badgeVariant,
  filterButtonAction,
}: Props) {
  function renderBadge() {
    switch (badgeVariant) {
      case 'warning': {
        return (
          <Badge
            bg="red.20"
            borderRadius={6}
            _text={{
              textTransform: 'uppercase',
              color: 'red.50',
              fontSize: 12,
            }}
          >
            risco alto
          </Badge>
        );
      }

      case 'warning': {
        return (
          <Badge
            bg="ciano.400"
            borderRadius={6}
            _text={{
              textTransform: 'uppercase',
              color: 'ciano.400',
              fontSize: 10,
            }}
          >
            risco alto
          </Badge>
        );
      }

      case 'warning': {
        return (
          <Badge
            bg="ciano.400"
            borderRadius={6}
            _text={{
              textTransform: 'uppercase',
              color: 'ciano.400',
              fontSize: 10,
            }}
          >
            risco alto
          </Badge>
        );
      }
    }
  }

  return (
    <HStack space={8} mx={6} alignItems="center" pb={4}>
      {withBackButton && (
        <VStack py={1}>
          <TouchableOpacity>
            <ChevronLeftIcon />
          </TouchableOpacity>
        </VStack>
      )}

      {title && (
        <Text flex={1} color="gray.900" fontWeight={800} fontSize={20}>
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
          <FilterIcon />
        </TouchableOpacity>
      )}

      {badgeVariant && renderBadge()}
    </HStack>
  );
}
