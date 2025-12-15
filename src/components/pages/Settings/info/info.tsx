import { useNavigation } from '@react-navigation/native';
import { Box, Image, ScrollView, StatusBar, VStack, Flex, Icon, WarningOutlineIcon, Text, Actionsheet, useDisclose } from 'native-base';
import { useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { CheckIcon, EditIcon, MailIcon, UserIcon } from '@assets/icons';

// components
import { Button } from '@components/atoms/Button/button';
import { Input } from '@components/molecules/Input/input';
import { SuccessSaved } from '@components/pages/Settings/components/successSaved/successSaved';
import { Header } from '../components/header/header';
import { useAuth } from 'src/hooks/useAuth';
import { useCustomToast } from 'src/hooks/useCustomToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserPersonalData, getUserPersonalData, uploadProfilePhoto, deleteProfilePhoto } from '@services/userService';
import { AppError } from '@utils/AppErrors';

type FormDataProps = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  country: string;
};

const infoSchema = yup.object({
  fullName: yup.string().required('Nome completo é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
  phone: yup.string().required('Telefone é obrigatório').min(14, 'Telefone inválido'),
  birthDate: yup.string().required('Data de nascimento é obrigatória').matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida'),
  address: yup.string().required('Endereço é obrigatório'),
  country: yup.string().required('País é obrigatório'),
});

/**
 * Aplica máscara de telefone brasileiro: (11) 99999-9999
 */
function applyPhoneMask(value: string): string {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '');

  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);

  // Aplica a máscara
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
}

/**
 * Aplica máscara de data: DD/MM/AAAA
 */
function applyDateMask(value: string): string {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '');

  // Limita a 8 dígitos
  const limited = numbers.slice(0, 8);

  // Aplica a máscara
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
}

export function Info() {
  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Inicia carregando
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { isOpen: isPhotoMenuOpen, onOpen: onPhotoMenuOpen, onClose: onPhotoMenuClose } = useDisclose();

  const scrollRef = useRef<any>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { showError, showSuccess } = useCustomToast();

  const { user, updateUserPhoto } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormDataProps>({
    resolver: yupResolver(infoSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: '',
      country: 'Brasil',
    },
  });

  async function handleSelectFromGallery() {
    try {
      onPhotoMenuClose();

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria de fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPhotoUri(imageUri);

        // Upload para o backend
        try {
          showSuccess({
            title: 'Enviando foto...',
            description: 'Aguarde enquanto fazemos o upload.',
          });

          const savedPhotoBase64 = await uploadProfilePhoto(imageUri);
          setPhotoUri(savedPhotoBase64); // Usar a foto salva no backend

          // Atualizar contexto para cache global
          updateUserPhoto(savedPhotoBase64);

          showSuccess({
            title: 'Foto salva!',
            description: 'Sua foto de perfil foi atualizada com sucesso.',
          });
        } catch (uploadError: any) {
          console.error('Erro no upload:', uploadError);
          setPhotoUri(null); // Reverter em caso de erro

          showError({
            title: 'Erro no upload',
            description: uploadError.message || 'Não foi possível enviar a foto.',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      showError({
        title: 'Erro',
        description: 'Não foi possível selecionar a foto.',
      });
    }
  }

  async function handleTakePhoto() {
    try {
      onPhotoMenuClose();

      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPhotoUri(imageUri);

        // Upload para o backend
        try {
          showSuccess({
            title: 'Enviando foto...',
            description: 'Aguarde enquanto fazemos o upload.',
          });

          const savedPhotoBase64 = await uploadProfilePhoto(imageUri);
          setPhotoUri(savedPhotoBase64); // Usar a foto salva no backend

          // Atualizar contexto para cache global
          updateUserPhoto(savedPhotoBase64);

          showSuccess({
            title: 'Foto salva!',
            description: 'Sua foto de perfil foi atualizada com sucesso.',
          });
        } catch (uploadError: any) {
          console.error('Erro no upload:', uploadError);
          setPhotoUri(null); // Reverter em caso de erro

          showError({
            title: 'Erro no upload',
            description: uploadError.message || 'Não foi possível enviar a foto.',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      showError({
        title: 'Erro',
        description: 'Não foi possível tirar a foto.',
      });
    }
  }

  async function handleRemovePhoto() {
    try {
      onPhotoMenuClose();

      // Deletar no backend
      await deleteProfilePhoto();

      setPhotoUri(null);

      // Limpar foto do contexto
      updateUserPhoto(null);

      showSuccess({
        title: 'Foto removida!',
        description: 'Sua foto de perfil foi removida com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao remover foto:', error);
      showError({
        title: 'Erro',
        description: error.message || 'Não foi possível remover a foto.',
      });
    }
  }

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      try {
        console.log('📥 [INFO] Carregando perfil completo do usuário (endpoint unificado)');

        // 🎯 Buscar TODOS os dados em uma única chamada ao endpoint unificado
        // Retorna: fullName, email, phone, location, birthDate, country, etc
        const profileData = await getUserPersonalData();

        if (profileData) {
          console.log('✅ [INFO] Perfil completo encontrado no backend:', profileData);

          // Preencher dados básicos (fullName, email)
          if (profileData.fullName) {
            setValue('fullName', profileData.fullName);
          } else if (user?.fullName) {
            setValue('fullName', user.fullName);
          }

          if (profileData.email) {
            setValue('email', profileData.email);
          } else if (user?.email || user?.name) {
            setValue('email', user.email || user.name || '');
          }

          // Preencher dados pessoais (phone, location, birthDate, country)
          if (profileData.phone) {
            setValue('phone', profileData.phone);
          }

          if (profileData.location) {
            setValue('address', profileData.location);
          }

          if (profileData.birthDate) {
            // Converter data ISO para formato DD/MM/AAAA
            const date = new Date(profileData.birthDate);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            setValue('birthDate', `${day}/${month}/${year}`);
          }

          if (profileData.country) {
            setValue('country', profileData.country);
          } else {
            setValue('country', 'Brasil');
          }
        } else {
          console.log('ℹ️ [INFO] Nenhum dado encontrado no backend, usando dados locais');

          // Fallback: dados do contexto de autenticação
          if (user) {
            setValue('fullName', user.fullName || '');
            setValue('email', user.email || user.name || '');
          }

          // Fallback: Carregar dados pessoais do AsyncStorage (do onboarding)
          const personalDataJson = await AsyncStorage.getItem('@app:personalData');
          if (personalDataJson) {
            const localData = JSON.parse(personalDataJson);

            // Preencher campos com dados do onboarding se disponíveis
            if (localData.age) {
              // Calcular data de nascimento aproximada baseada na idade
              const currentYear = new Date().getFullYear();
              const birthYear = currentYear - localData.age;
              setValue('birthDate', `01/01/${birthYear}`);
            }
          }

          // Sempre definir Brasil como país padrão se não houver dados
          setValue('country', 'Brasil');
        }

        // Carregar foto do perfil se disponível
        // Prioridade: contexto (cache) > profilePhotoBase64 do backend > photoUrl do contexto
        if (user?.profilePhotoBase64) {
          // Usar foto do contexto (cache)
          setPhotoUri(user.profilePhotoBase64);
        } else if (profileData?.profilePhotoBase64) {
          setPhotoUri(profileData.profilePhotoBase64);
          // Atualizar contexto para cache
          updateUserPhoto(profileData.profilePhotoBase64);
        } else if (user?.photoUrl) {
          setPhotoUri(user.photoUrl);
        }
      } catch (error) {
        console.error('❌ [INFO] Erro ao carregar dados do usuário:', error);

        const errorMessage =
          error instanceof AppError ? error.message : 'Não foi possível carregar seus dados. Tente novamente.';

        showError({
          title: 'Erro ao carregar dados',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [user, setValue, updateUserPhoto]);

  async function handleSaveInfo(data: FormDataProps) {
    if (!user?.userId) {
      showError({
        title: 'Erro',
        description: 'Usuário não autenticado',
      });
      return;
    }

    setIsSaving(true);
    console.log('📤 [INFO] Salvando perfil completo do usuário:', data);

    try {
      // Converter data de DD/MM/AAAA para ISO string
      const [day, month, year] = data.birthDate.split('/');
      const birthDateISO = new Date(`${year}-${month}-${day}`).toISOString();

      // 🎯 Salvar TUDO em uma única chamada ao endpoint unificado
      // Sempre usa PUT (UPSERT - o backend cria ou atualiza automaticamente)
      // Atualiza simultaneamente: fullName, email, phone, location, birthDate, country
      await saveUserPersonalData({
        // Dados básicos do User
        fullName: data.fullName,
        email: data.email,

        // Dados pessoais
        phone: data.phone,
        location: data.address,
        birthDate: birthDateISO,
        country: data.country,
      });

      console.log('✅ [INFO] Perfil completo salvo com sucesso!');
      setSuccess(true);
    } catch (error) {
      console.error('❌ [INFO] Erro ao salvar perfil completo:', error);

      let errorMessage = 'Não foi possível salvar seus dados. Tente novamente.';
      let errorTitle = 'Erro ao salvar';

      if (error instanceof AppError) {
        errorMessage = error.message;

        // Detectar inconsistência específica do backend
        const msg = error.message?.toLowerCase() || '';
        if (
          (msg.includes('já possui dados') || msg.includes('already exists')) &&
          msg.includes('atualização')
        ) {
          errorTitle = 'Inconsistência no Backend';
          errorMessage = 'O sistema indica que os dados existem mas não consegue atualizá-los. Por favor, contate o suporte técnico.';
        }
      }

      showError({
        title: errorTitle,
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isSuccess) {
    return <SuccessSaved />;
  }

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <StatusBar barStyle="default" backgroundColor="transparent" translucent />
        <VStack space={4} alignItems="center">
          <Box
            size={20}
            borderRadius={10}
            bg="gray.100"
            alignItems="center"
            justifyContent="center"
          >
            <UserIcon size="48" color="#9CA3AF" />
          </Box>
          <Text fontSize={16} fontWeight={600} color="gray.500">
            Carregando dados...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        <StatusBar barStyle="default" backgroundColor="transparent" translucent />

      <Box w={'100%'} h={240} borderBottomRadius={24} position={'absolute'} bgColor={'gray.900'} />

      {/* Foto de perfil clicável */}
      <TouchableOpacity
        onPress={onPhotoMenuOpen}
        style={{
          position: 'absolute',
          top: 160,
          alignSelf: 'center',
          zIndex: 10,
        }}
        activeOpacity={0.8}
      >
        <Box
          size={28}
          borderRadius={14}
          overflow="hidden"
          bg="gray.700"
          alignItems="center"
          justifyContent="center"
          borderWidth={4}
          borderColor="white"
          shadow={4}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} size={28} alt="Foto de perfil" />
          ) : (
            <UserIcon size="80" color="#9CA3AF" />
          )}
        </Box>

        {/* Ícone de edição */}
        <Box
          position="absolute"
          bottom={0}
          right={0}
          bg="ciano.400"
          size={10}
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
          borderWidth={2}
          borderColor="white"
        >
          <EditIcon size="20" color="#FFFFFF" />
        </Box>
      </TouchableOpacity>

      <VStack flex={1} py={16} mx={6} zIndex={1}>
        <Header title="Informações Pessoais" bgMode handleBackTo={() => navigation.navigate('homepage')} />

        <VStack mt={48} space={5}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="default"
                autoCapitalize="words"
                label="Nome Completo"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="email-address"
                autoCapitalize="none"
                label="Endereço de E-mail"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="phone-pad"
                autoCapitalize="none"
                label="Telefone"
                value={value}
                onChangeText={(text) => {
                  const masked = applyPhoneMask(text);
                  onChange(masked);
                }}
                placeholder="(11) 99999-9999"
                errorMessage={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="number-pad"
                autoCapitalize="none"
                label="Data de Nascimento"
                value={value}
                onChangeText={(text) => {
                  const masked = applyDateMask(text);
                  onChange(masked);
                }}
                placeholder="DD/MM/AAAA"
                errorMessage={errors.birthDate?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="default"
                autoCapitalize="none"
                label="Endereço"
                value={value}
                onChangeText={onChange}
                placeholder="Rua, número, bairro, cidade"
                errorMessage={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="default"
                autoCapitalize="words"
                label="País"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.country?.message}
              />
            )}
          />

          <Button
            mt={4}
            variant="primary"
            size="full"
            title={isSaving ? "Salvando..." : "Salvar"}
            onPress={handleSubmit(handleSaveInfo as any)}
            icon={<CheckIcon color="#FFFFFF" size="28" />}
            isLoading={isSaving}
            disabled={isSaving || isLoading}
          />
        </VStack>
      </VStack>

      {/* Menu de opções de foto */}
      <Actionsheet isOpen={isPhotoMenuOpen} onClose={onPhotoMenuClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={2}>
            <Text fontSize={18} fontWeight={700} mb={4}>
              Foto de Perfil
            </Text>

            <Actionsheet.Item onPress={handleSelectFromGallery}>
              <Text fontSize={16}>Escolher da Galeria</Text>
            </Actionsheet.Item>

            <Actionsheet.Item onPress={handleTakePhoto}>
              <Text fontSize={16}>Tirar Foto</Text>
            </Actionsheet.Item>

            {photoUri && (
              <Actionsheet.Item onPress={handleRemovePhoto}>
                <Text fontSize={16} color="red.500">
                  Remover Foto
                </Text>
              </Actionsheet.Item>
            )}

            <Actionsheet.Item onPress={onPhotoMenuClose}>
              <Text fontSize={16} color="gray.600">
                Cancelar
              </Text>
            </Actionsheet.Item>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
