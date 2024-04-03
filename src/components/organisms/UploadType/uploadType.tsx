import { TouchableOpacity } from 'react-native';
import { VStack, Text, Image, Center, Box, HStack } from 'native-base';

// assets
import { EditIcon, UploadIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-9.png';

interface IProps {
  setManual: (flag: boolean) => void;
}

export function UploadType({ setManual }: IProps) {
  return (
    <>
      <VStack w="100%" h="100%" alignItems="center" mt={24}>
        <Image
          source={Vector1}
          defaultSource={Vector1}
          alt="Vetor"
          resizeMode="stretch"
          w="70%"
          h={200}
        />

        <Text
          fontSize={24}
          fontWeight={800}
          letterSpacing={-0.24}
          textAlign="center"
          mt={8}
        >
          Como você deseja{'\n'}
          importar seu exame?
        </Text>

        <Text
          fontSize={14}
          fontWeight={500}
          lineHeight={22.4}
          textAlign="center"
          mt={2}
        >
          Selecione a opção abaixo para que{'\n'}
          possamos simplificar sua saúde:
        </Text>

        <HStack space={4} mt={8}>
          <TouchableOpacity
            onPress={() => {
              setManual(false);
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
              borderColor="gray.400"
            >
              <UploadIcon />
              <Text
                fontSize={18}
                fontWeight={700}
                letterSpacing={-0.18}
                color="ciano.400"
                mt={1}
              >
                Importar PDF
              </Text>
            </Box>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setManual(true)}>
            <Box
              bg="gray.400"
              w={40}
              h={20}
              py={2}
              px={4}
              rounded="2xl"
              alignItems="center"
              borderWidth={4}
              borderColor="gray.400"
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
      </VStack>

      <Center position="absolute" bottom={16}>
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
    </>
  );
}
