import { TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Center,
  HStack,
  Flex,
  Badge,
  CloseIcon,
  Box,
  Modal,
} from 'native-base';

// assets
import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { ArrowIcon } from '@assets/icons';
import { useState } from 'react';

export function UploadTypeManual({ setManual }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <VStack alignItems="center" mt={12} w="100%">
      <Text
        fontSize={24}
        fontWeight={800}
        letterSpacing={-0.24}
        textAlign="center"
      >
        Insira o exame manualmente
      </Text>

      <Text
        fontSize={14}
        fontWeight={500}
        lineHeight={22.4}
        textAlign="center"
        mx={8}
        mt={2}
        color={'gray.400'}
      >
        Preencha as informações abaixo conforme está no seu exame em PDF ou
        papel
      </Text>

      <HStack mx={8} mt={12}>
        <Input label="Nome do Laboratório" h={10} />
      </HStack>

      <HStack mx={8} mt={8} space={10} flexDir="row">
        <Input label="Nome do Médico" h={10} />
        <Input label="Data do Exame" h={10} />
      </HStack>

      <HStack mx={8} mt={8}>
        <Input label="Nome do Laboratório" h={10} select />
      </HStack>

      <HStack flexWrap="wrap" flexDir="row" mx={8} mt={8} space={4}>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            Vitamina A
          </Flex>
        </Badge>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            Hemoglobina
          </Flex>
        </Badge>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            Hemoglobina
          </Flex>
        </Badge>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            uréia
          </Flex>
        </Badge>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            Vitamina A
          </Flex>
        </Badge>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            Hemoglobina
          </Flex>
        </Badge>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            Vitamina A
          </Flex>
        </Badge>
        <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
          <Flex
            _text={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: -0.12,
              color: 'gray.600',
              textTransform: 'uppercase',
            }}
            flexDir="row"
            alignItems="center"
          >
            <TouchableOpacity>
              <Box
                w={5}
                h={5}
                alignItems="center"
                justifyContent="center"
                pl={4}
              >
                <CloseIcon color="gray.600" mr={4} size={3} />
              </Box>
            </TouchableOpacity>
            creatinina
          </Flex>
        </Badge>
      </HStack>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        borderRadius={20}
        _backdrop={{
          bg: 'gray.900',
        }}
      >
        <Modal.Content maxWidth="350" maxH="212">
          <Modal.CloseButton />
          <Modal.Body>
            <HStack mx={2} mt={8} space={4} flexDir="row">
              <Input label="Valor exame" h={10} />
              <Input label="Data do Exame" h={10} />
            </HStack>

            <Center mt={6}>
              <Button variant="primary" title="Inserir" size="sm" />
            </Center>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Button
        my={12}
        variant="primary"
        size="lg"
        title="Desvende sua saúde"
        onPress={() => {
          setShowModal(true);
        }}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
