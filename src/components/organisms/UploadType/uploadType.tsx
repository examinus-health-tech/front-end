import { Platform, TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Image,
  Center,
  Box,
  HStack,
  Actionsheet,
  useDisclose,
  Container,
} from 'native-base';
import * as DocumentPicker from 'expo-document-picker';

// assets
import { EditIcon, UploadIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-9.png';
import { useState } from 'react';
import { UploadTypeManual } from '../UploadTypeManual/uploadTypeManual';

export function UploadType() {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset[]>(
    {} as DocumentPicker.DocumentPickerAsset[]
  );
  const { isOpen, onOpen, onClose } = useDisclose();

  async function handleUploadFile() {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.canceled) {
      return;
    }

    setFile(result.assets);
  }

  return (
    <Container>
      <VStack alignItems="center" mt={12}>
        <Image
          source={Vector1}
          defaultSource={Vector1}
          alt="Vetor"
          resizeMode="stretch"
          h={240}
        />

        <Text
          mt={8}
          fontSize={24}
          fontWeight={800}
          letterSpacing={-0.24}
          textAlign="center"
        >
          Como você deseja{'\n'}
          importar seu exame?
        </Text>

        <Text
          fontSize={14}
          fontWeight={500}
          lineHeight={22.4}
          color="gray.300"
          textAlign="center"
          mt={2}
        >
          Selecione a opção abaixo para que{'\n'}
          possamos simplificar sua saúde:
        </Text>

        <HStack space={4} mt={8} mb={40}>
          <TouchableOpacity
            onPress={() => {
              handleUploadFile();
            }}
          >
            <Box
              bg="ciano.300"
              w={40}
              h={20}
              py={2}
              px={4}
              rounded="2xl"
              alignItems="center"
              borderWidth={4}
              borderColor="gray.200"
            >
              <UploadIcon />
              <Text
                fontSize={18}
                fontWeight={700}
                letterSpacing={-0.18}
                color="white"
                mt={1}
              >
                Importar PDF
              </Text>
            </Box>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onOpen();
            }}
          >
            <Box
              w={40}
              h={20}
              py={2}
              px={4}
              rounded="2xl"
              alignItems="center"
              borderWidth={4}
              borderColor="gray.50"
            >
              <EditIcon color="#052B3B" />
              <Text
                fontSize={18}
                fontWeight={700}
                letterSpacing={-0.18}
                color="gray.400"
                mt={1}
              >
                Inserir manual
              </Text>
            </Box>
          </TouchableOpacity>
        </HStack>

        <Center mb={12}>
          <TouchableOpacity>
            <Text
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color="gray.200"
            >
              fazer isso mais tarde
            </Text>
          </TouchableOpacity>
        </Center>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <UploadTypeManual />
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </Container>
  );
}
