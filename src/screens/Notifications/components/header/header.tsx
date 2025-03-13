import { TouchableOpacity } from 'react-native';
import { Text, HStack, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps, AppRoutes } from '@routes/app.routes';

// assets
import { ChevronLeftIcon, GearIcon } from '@assets/icons';

export type Props = {
  title: string;
  bgMode?: boolean;
  handleBackTo: () => void;
};

export function Header({ title, bgMode, handleBackTo }: Props) {
  return (
    <HStack
      alignItems={'center'}
      justifyContent={'space-between'}
      space={4}
      mb={10}
    >
      <TouchableOpacity onPress={handleBackTo}>
        <ChevronLeftIcon size="30" color={'#052B3B'} />
      </TouchableOpacity>

      <Text
        flex={1}
        color={'gray.900'}
        fontSize={20}
        fontWeight={800}
        letterSpacing={-0.2}
      >
        {title}
      </Text>

      <TouchableOpacity onPress={handleBackTo}>
        <GearIcon size="30" color={'#052B3B'} />
      </TouchableOpacity>
    </HStack>
  );
}
