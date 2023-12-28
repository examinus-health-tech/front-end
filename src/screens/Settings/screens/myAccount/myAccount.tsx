import { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Image,
  Center,
  Actionsheet,
  useDisclose,
  Box,
  View,
  HStack,
  ScrollView,
  IScrollViewProps,
  Flex,
  Checkbox,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  ArrowCurvedIcon,
  ArrowIcon,
  BellSecondaryIcon,
  ChatIcon,
  ChevronLeftIcon,
  EditIcon,
  EyeIcon,
  FlagIcon,
  GearIcon,
  LockIcon,
  MoreIcon,
  QuestionIcon,
  TelephoneIcon,
  TrashIcon,
  UserIcon,
  WarningIcon,
} from '@assets/icons';
import Vector from '@assets/png/vector-9.png';
import XLogo from '@assets/png/x-examinus.png';

// components
import { Button } from '@components/Button/button';
import { Header } from '../../components/header/header';
import { Card } from '../../components/card/card';

export function MyAccount() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  function handleNextStep() {
    navigation.navigate('upload');
  }

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} bg={'gray.10'} py={24} mx={6}>
        <Header
          title="Minha Conta"
          handleBackTo={() => navigation.navigate('homepage')}
        />

        <Box bg={'gray.100'} w="100%" borderRadius={16} p={4}>
          <HStack space={3} alignItems={'center'}>
            <Box
              bg={'gray.30'}
              w={20}
              h={20}
              borderRadius={12}
              borderColor={'white'}
              borderWidth={2}
            />

            <VStack flex={1} space={2}>
              <Text
                color={'white'}
                fontSize={22}
                fontWeight={800}
                letterSpacing={-0.36}
              >
                Ariene Queiroz
              </Text>
              <Text
                color={'gray.30'}
                fontSize={16}
                fontWeight={600}
                letterSpacing={-0.12}
              >
                arienecabral@hotmail.com
              </Text>
            </VStack>

            <TouchableOpacity onPress={() => navigation.navigate('info')}>
              <EditIcon size="30" />
            </TouchableOpacity>
          </HStack>
        </Box>

        <VStack>
          <HStack mt={12} justifyContent={'space-between'}>
            <Text
              fontSize={16}
              fontWeight={800}
              letterSpacing={-0.16}
              color={'gray.100'}
            >
              Configurações Gerais
            </Text>

            <TouchableOpacity>
              <MoreIcon />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} space={3}>
            <Card
              title="Informação Pessoal"
              variant="primary"
              goTo={() => navigation.navigate('info')}
              icon={<UserIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Notificações"
              variant="primary"
              goTo={() => navigation.navigate('notifications')}
              icon={<BellSecondaryIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Preferências"
              variant="primary"
              icon={<GearIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Segurança"
              variant="primary"
              goTo={() => navigation.navigate('security')}
              icon={<LockIcon color="#3D4966" size="30" />}
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text
              fontSize={16}
              fontWeight={800}
              letterSpacing={-0.16}
              color={'gray.100'}
            >
              Acessibilidade
            </Text>

            <TouchableOpacity>
              <MoreIcon />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} space={3}>
            <Card
              title="Idioma"
              variant="primary"
              icon={<FlagIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Dark Mode"
              variant="primary"
              icon={<EyeIcon color="#3D4966" size="30" />}
              action="switch"
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text
              fontSize={16}
              fontWeight={800}
              letterSpacing={-0.16}
              color={'gray.100'}
            >
              Ajuda & Suporte
            </Text>

            <TouchableOpacity>
              <MoreIcon />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} space={3}>
            <Card
              title="Sobre"
              variant="primary"
              icon={<QuestionIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Central de Ajuda"
              variant="primary"
              icon={<ChatIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Fale com o Team X"
              variant="primary"
              goTo={() => navigation.navigate('contactUs')}
              icon={<TelephoneIcon color="#3D4966" size="30" />}
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text
              fontSize={16}
              fontWeight={800}
              letterSpacing={-0.16}
              color={'gray.100'}
            >
              Desconectar
            </Text>

            <TouchableOpacity>
              <MoreIcon />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} space={3}>
            <Card
              title="Sair"
              variant="primary"
              icon={<ArrowCurvedIcon color="#3D4966" size="30" />}
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text
              fontSize={16}
              fontWeight={800}
              letterSpacing={-0.16}
              color={'gray.100'}
            >
              Zona Perigosa
            </Text>

            <TouchableOpacity>
              <WarningIcon size="30" />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} space={3}>
            <Card
              title="Deletar Conta"
              variant="primary"
              icon={<TrashIcon color="white" size="30" />}
              warning
            />
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
