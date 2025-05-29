import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, IScrollViewProps, Image, View, StatusBar } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  ArrowCurvedIcon,
  BellSecondaryIcon,
  ChatIcon,
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

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';
import { useAuth } from 'src/hooks/useAuth';

export function MyAccount() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { userData, user, signOut } = useAuth();

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <VStack flex={1} py={16} mx={6} mb={12}>
        <Header title="Minha Conta" handleBackTo={() => navigation.navigate('homepage')} />

        <Box bg={'gray.800'} w="100%" borderRadius={16} p={4}>
          <HStack space={3} alignItems={'center'}>
            <Image
              source={{
                uri: user.ImageUserUrl,
              }}
              size={20}
              borderWidth={2}
              borderColor="white"
              rounded={10}
            />

            <VStack flex={1} space={2}>
              <Text color={'white'} fontSize={22} fontWeight={800} letterSpacing={-0.36}>
                {userData.name} {userData.lastname}
              </Text>
              <Text color={'gray.200'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {user?.email}
              </Text>
            </VStack>

            <TouchableOpacity onPress={() => navigation.navigate('info')}>
              <EditIcon size="30" />
            </TouchableOpacity>
          </HStack>
        </Box>

        <VStack>
          <HStack mt={12} justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
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
              action="chevron"
              goTo={() => navigation.navigate('info')}
              icon={<UserIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Notificações"
              variant="primary"
              action="chevron"
              goTo={() => navigation.navigate('configNotifications')}
              icon={<BellSecondaryIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Preferências"
              variant="primary"
              action="chevron"
              icon={<GearIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Segurança"
              variant="primary"
              action="chevron"
              goTo={() => navigation.navigate('security')}
              icon={<LockIcon color="#3D4966" size="30" />}
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
              Acessibilidade
            </Text>

            <TouchableOpacity>
              <MoreIcon />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} space={3}>
            <Card title="Idioma" variant="primary" action="chevron" icon={<FlagIcon color="#3D4966" size="30" />} />
            <Card title="Dark Mode" variant="primary" icon={<EyeIcon color="#3D4966" size="30" />} action="switch" />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
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
              action="chevron"
              goTo={() => navigation.navigate('aboutUs')}
              icon={<QuestionIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Central de Ajuda"
              variant="primary"
              action="chevron"
              icon={<ChatIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Fale com o Team X"
              variant="primary"
              action="chevron"
              goTo={() => navigation.navigate('contactUs')}
              icon={<TelephoneIcon color="#3D4966" size="30" />}
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
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
              action="chevron"
              goTo={() => signOut()}
              icon={<ArrowCurvedIcon color="#3D4966" size="30" />}
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
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
              action="chevron"
              icon={<TrashIcon color="white" size="30" />}
              warning
            />
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
