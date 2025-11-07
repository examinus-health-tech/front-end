import { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Box,
  HStack,
  ScrollView,
  IScrollViewProps,
  Image,
  View,
  StatusBar,
  Actionsheet,
  useDisclose,
  Flex,
} from 'native-base';
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
import { Button } from '@components/atoms';
import { useAuth } from 'src/hooks/useAuth';

export function MyAccount() {
  const { isOpen: isSignOutOpen, onOpen: onSignOutOpen, onClose: onSignOutClose } = useDisclose();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclose();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user, signOut, deleteAccount } = useAuth();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      onSignOutClose();
    } catch (error) {
      console.error('Erro ao sair:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      onDeleteClose();
      await deleteAccount();
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <VStack flex={1} py={16} mx={6} mb={20}>
        <Header title="Minha Conta" handleBackTo={() => navigation.navigate('homepage')} />

        <Box bg={'gray.800'} w="100%" borderRadius={16} p={4}>
          <HStack space={3} alignItems={'center'}>
            {/* <Image
              source={
                {
                  // uri: user.ImageUserUrl,
                }
              }
              size={20}
              borderWidth={2}
              borderColor="white"
              rounded={10}
            /> */}

            <VStack flex={1} space={2}>
              <Text color={'white'} fontSize={22} fontWeight={800} letterSpacing={-0.36}>
                {user?.fullName}
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
              comingSoon={true}
              icon={<BellSecondaryIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Preferências"
              variant="primary"
              action="chevron"
              comingSoon={true}
              icon={<GearIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Segurança"
              variant="primary"
              action="chevron"
              comingSoon={true}
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
            <Card
              title="Idioma"
              variant="primary"
              action="chevron"
              comingSoon={true}
              icon={<FlagIcon color="#3D4966" size="30" />}
            />
            <Card
              title="Dark Mode"
              variant="primary"
              icon={<EyeIcon color="#3D4966" size="30" />}
              action="switch"
              comingSoon={true}
            />
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
              comingSoon={true}
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
              goTo={onSignOutOpen}
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
              goTo={onDeleteOpen}
              icon={<TrashIcon color="white" size="30" />}
              warning
            />
          </VStack>
        </VStack>
      </VStack>

      {/* BottomSheet para confirmação de sair */}
      <Actionsheet isOpen={isSignOutOpen} onClose={onSignOutClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={6}>
            <VStack space={4} alignItems="center">
              <Box p={3} bg="red.100" borderRadius={12}>
                <ArrowCurvedIcon color="#EF4444" size="36" />
              </Box>

              <VStack space={2} alignItems="center">
                <Text fontSize={20} fontWeight={800} letterSpacing={-0.2} color="gray.900">
                  Sair da Conta
                </Text>
                <Text fontSize={16} fontWeight={500} textAlign="center" color="gray.600" lineHeight={24}>
                  Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o app.
                </Text>
              </VStack>

              <HStack space={3} w="100%" mt={4}>
                <Button
                  flex={1}
                  variant="primary"
                  size="md"
                  title={isSigningOut ? 'Saindo...' : 'Sair'}
                  onPress={handleSignOut}
                  bgColor="red.500"
                  _pressed={{ bgColor: 'red.600' }}
                  isLoading={isSigningOut}
                  isDisabled={isSigningOut}
                />
                <Button
                  flex={1}
                  variant="primary"
                  size="md"
                  title="Cancelar"
                  onPress={onSignOutClose}
                  borderColor="gray.300"
                  _text={{ color: 'gray.600' }}
                  isDisabled={isSigningOut}
                />
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>

      {/* BottomSheet para confirmação de deletar conta */}
      <Actionsheet isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={6}>
            <VStack space={4} alignItems="center">
              <Box p={3} bg="red.100" borderRadius={12}>
                <WarningIcon color="#EF4444" size="36" />
              </Box>

              <VStack space={2} alignItems="center">
                <Text fontSize={20} fontWeight={800} letterSpacing={-0.2} color="gray.900">
                  Deletar Conta
                </Text>
                <VStack space={3} alignItems="center">
                  <Text fontSize={16} fontWeight={600} textAlign="center" color="red.600">
                    ⚠️ Esta ação é irreversível!
                  </Text>
                  <Text fontSize={14} fontWeight={500} textAlign="center" color="gray.600" lineHeight={20}>
                    Ao deletar sua conta, todos os seus dados serão permanentemente removidos:
                  </Text>
                  <VStack space={1} alignItems="center" w="100%">
                    <Text fontSize={14} color="gray.600">
                      • Histórico de exames
                    </Text>
                    <Text fontSize={14} color="gray.600">
                      • Dados de saúde
                    </Text>
                    <Text fontSize={14} color="gray.600">
                      • Configurações personalizadas
                    </Text>
                  </VStack>
                </VStack>
              </VStack>

              <HStack space={3} w="100%" mt={4}>
                <Button
                  flex={1}
                  variant="primary"
                  size="lg"
                  title="Deletar Conta"
                  onPress={handleDeleteAccount}
                  bgColor="red.500"
                  _pressed={{ bgColor: 'red.600' }}
                />
                <Button
                  flex={1}
                  variant="primary"
                  size="lg"
                  title="Cancelar"
                  onPress={onDeleteClose}
                  borderColor="gray.300"
                  _text={{ color: 'gray.600' }}
                />
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </ScrollView>
  );
}
