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
  Input,
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
import { useHome } from 'src/hooks/useHome';

export function MyAccount() {
  const { isOpen: isSignOutOpen, onOpen: onSignOutOpen, onClose: onSignOutClose } = useDisclose();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclose();
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclose();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState({
    reason: '',
    customReason: '',
  });

  const deleteReasons = [
    { value: 'not_using', label: 'Não uso mais o app' },
    { value: 'privacy', label: 'Preocupações com privacidade' },
    { value: 'found_alternative', label: 'Encontrei alternativa melhor' },
    { value: 'not_useful', label: 'App não atende minhas necessidades' },
    { value: 'other', label: 'Outro motivo' },
  ];

  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user, signOut, deleteAccount } = useAuth();
  const { clearHomeData } = useHome();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      // Limpar dados do contexto de Home
      clearHomeData();
      // Fazer logout (limpa AsyncStorage e user state)
      await signOut();
      onSignOutClose();
    } catch (error) {
      console.error('Erro ao sair:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccountClick = () => {
    onFeedbackOpen();
  };

  const handleContinueToDelete = () => {
    onFeedbackClose();
    onDeleteOpen();
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // TODO: Enviar feedback para backend quando endpoint estiver disponível
      // if (deleteFeedback.reason) {
      //   await api.post('/user-feedback/delete-account', {
      //     reason: deleteFeedback.reason,
      //     customReason: deleteFeedback.customReason,
      //   });
      // }
      console.log('Feedback de exclusão:', deleteFeedback);
      onDeleteClose();
      await deleteAccount();
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    } finally {
      setIsDeleting(false);
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
                {user?.fullName || 'Usuário'}
              </Text>
              {user?.email ? (
                <Text color={'gray.200'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                  {user.email}
                </Text>
              ) : null}
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
              comingSoon={true}
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

        <VStack mt={12}>
          <TouchableOpacity onPress={handleDeleteAccountClick}>
            <HStack alignItems="center" space={3} bg="gray.100" px={4} py={3} borderRadius={12}>
              <TrashIcon color="#9CA3AF" size="20" />
              <Text fontSize={14} fontWeight={500} color="gray.500">
                Deletar Conta
              </Text>
            </HStack>
          </TouchableOpacity>
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

      {/* BottomSheet de Feedback - Por que está saindo? */}
      <Actionsheet isOpen={isFeedbackOpen} onClose={onFeedbackClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={6}>
            <VStack space={4}>
              <Text fontSize={20} fontWeight={800} color="gray.900">
                Por que você está saindo?
              </Text>
              <Text fontSize={14} color="gray.600">
                Sua opinião nos ajuda a melhorar o app
              </Text>

              <VStack space={2}>
                {deleteReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.value}
                    onPress={() => setDeleteFeedback({ ...deleteFeedback, reason: reason.value })}
                  >
                    <HStack
                      space={3}
                      alignItems="center"
                      p={3}
                      borderRadius={8}
                      bg={deleteFeedback.reason === reason.value ? 'ciano.50' : 'gray.50'}
                      borderWidth={1}
                      borderColor={deleteFeedback.reason === reason.value ? 'ciano.400' : 'gray.100'}
                    >
                      <Box
                        w={5}
                        h={5}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor={deleteFeedback.reason === reason.value ? 'ciano.500' : 'gray.300'}
                        bg={deleteFeedback.reason === reason.value ? 'ciano.500' : 'white'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        {deleteFeedback.reason === reason.value && <Box w={2} h={2} borderRadius={4} bg="white" />}
                      </Box>
                      <Text fontSize={14} color="gray.700">
                        {reason.label}
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                ))}
              </VStack>

              {deleteFeedback.reason === 'other' && (
                <Input
                  placeholder="Conte-nos mais..."
                  value={deleteFeedback.customReason}
                  onChangeText={(text) => setDeleteFeedback({ ...deleteFeedback, customReason: text })}
                  multiline
                  h={20}
                  fontSize={14}
                  borderRadius={8}
                  borderColor="gray.200"
                  _focus={{ borderColor: 'ciano.400' }}
                />
              )}

              <HStack space={3} w="100%" mt={4}>
                <Button
                  flex={1}
                  variant="primary"
                  size="md"
                  title="Voltar"
                  onPress={onFeedbackClose}
                  borderColor="gray.300"
                  _text={{ color: 'gray.600' }}
                />
                <Button
                  flex={1}
                  variant="primary"
                  size="md"
                  title="Continuar"
                  onPress={handleContinueToDelete}
                  bgColor="red.500"
                  _pressed={{ bgColor: 'red.600' }}
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
                    Esta acao e irreversivel!
                  </Text>
                  <Text fontSize={14} fontWeight={500} textAlign="center" color="gray.600" lineHeight={20}>
                    Ao deletar sua conta, todos os seus dados serao permanentemente removidos:
                  </Text>
                  <VStack space={1} alignItems="center" w="100%">
                    <Text fontSize={14} color="gray.600">
                      - Histórico de exames
                    </Text>
                    <Text fontSize={14} color="gray.600">
                      - Dados de saude
                    </Text>
                    <Text fontSize={14} color="gray.600">
                      - Configuracoes personalizadas
                    </Text>
                  </VStack>
                </VStack>
              </VStack>

              <HStack space={3} w="100%" mt={4}>
                <Button
                  flex={1}
                  variant="primary"
                  size="lg"
                  title={isDeleting ? 'Deletando...' : 'Deletar Conta'}
                  onPress={handleDeleteAccount}
                  bgColor="red.500"
                  _pressed={{ bgColor: 'red.600' }}
                  isLoading={isDeleting}
                  isDisabled={isDeleting}
                />
                <Button
                  flex={1}
                  variant="primary"
                  size="lg"
                  title="Cancelar"
                  onPress={onDeleteClose}
                  borderColor="gray.300"
                  _text={{ color: 'gray.600' }}
                  isDisabled={isDeleting}
                />
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </ScrollView>
  );
}
