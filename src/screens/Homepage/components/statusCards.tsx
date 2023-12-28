import {
  AppleIcon,
  BarbellIcon,
  BedIcon,
  CheckIcon,
  WalkingIcon,
  WaterIcon,
} from '@assets/icons';
import { Progress } from '@components/Progress/progress';
import { Box, VStack, Text, HStack, Badge } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export function StatusCards() {
  return (
    <VStack mt={4} space={4}>
      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box
          bg={'gray.10'}
          w={20}
          h={20}
          borderRadius={12}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <BarbellIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={3}>
            Calorias Perdidas
          </Text>

          <Progress
            value={70}
            size={100}
            filledColor="red.50"
            bgColor="red.20"
          />

          <HStack justifyContent={'space-between'} mt={2}>
            <Text
              color={'gray.50'}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.12}
            >
              500kcal
            </Text>
            <Text
              color={'gray.50'}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.12}
            >
              2000kcal
            </Text>
          </HStack>
        </VStack>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box
          bg={'gray.10'}
          w={20}
          h={20}
          borderRadius={12}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <WalkingIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={1}>
            Passos
          </Text>

          <Text
            color={'gray.50'}
            fontSize={16}
            fontWeight={600}
            letterSpacing={-0.12}
          >
            Você deu 10.000 passos
          </Text>
        </VStack>

        <Box
          bg={'ciano.10'}
          w={12}
          h={12}
          borderRadius={8}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <CheckIcon size="36" />
        </Box>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box
          bg={'gray.10'}
          w={20}
          h={20}
          borderRadius={12}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <AppleIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={1}>
            Nutrição
          </Text>

          <HStack space={2}>
            <Badge
              borderRadius={6}
              bg={'dark_blue.30'}
              _text={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: -0.12,
                color: 'dark_blue.10',
              }}
            >
              Vitamina A
            </Badge>
            <Badge
              borderRadius={6}
              bg={'dark_blue.10'}
              _text={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: -0.12,
                color: 'dark_blue.40',
              }}
            >
              Ibuprofeno
            </Badge>
            <Badge
              borderRadius={6}
              bg={'dark_blue.10'}
              _text={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: -0.12,
                color: 'dark_blue.40',
              }}
            >
              2+
            </Badge>
          </HStack>
        </VStack>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box
          bg={'gray.10'}
          w={20}
          h={20}
          borderRadius={12}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <BedIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={1}>
            Sono
          </Text>

          <Text
            color={'gray.50'}
            fontSize={16}
            fontWeight={600}
            letterSpacing={-0.12}
          >
            11/36 Circadiano Mensal
          </Text>
        </VStack>

        <AnimatedCircularProgress
          size={68}
          lineCap="round"
          width={5}
          fill={35}
          children={() => (
            <Text fontSize={14} fontWeight={800} letterSpacing={1}>
              35%
            </Text>
          )}
          rotation={10}
          tintColor="#8A3FFC"
          backgroundColor="#DCE1E8"
        />
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box
          bg={'gray.10'}
          w={20}
          h={20}
          borderRadius={12}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <WaterIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={3}>
            Hidratação
          </Text>

          <HStack space={1}>
            <Box bg={'ciano.40'} h={2} w="15.3%" borderRadius={10} />
            <Box bg={'ciano.40'} h={2} w="15.3%" borderRadius={10} />
            <Box bg={'gray.20'} h={2} w="15.3%" borderRadius={10} />
            <Box bg={'gray.20'} h={2} w="15.3%" borderRadius={10} />
            <Box bg={'gray.20'} h={2} w="15.3%" borderRadius={10} />
            <Box bg={'gray.20'} h={2} w="15.3%" borderRadius={10} />
          </HStack>

          <HStack justifyContent={'space-between'} mt={1}>
            <Text
              color={'gray.50'}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.12}
            >
              7
            </Text>
            <Text
              color={'gray.50'}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.12}
            >
              12
            </Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}
