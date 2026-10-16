import { useCallback } from 'react';
import { Text as RNText, TouchableOpacity } from 'react-native';
import { Box, HStack, ScrollView, StatusBar, Text, VStack, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { Header } from '../components/header/header';

// hooks
import { useFontScale } from 'src/hooks/useFontScale';

// theme
import { FONT_SCALE_OPTIONS, FontScaleOption } from 'src/theme/fontScale';

// Base do "Aa" de cada opção. Usa Text do RN (fora do tema) para mostrar o tamanho
// relativo de cada opção, independente da escala aplicada no momento.
const SAMPLE_BASE_SIZE = 18;
const SAMPLE_GLYPH = 'Aa';

function isSelected(option: FontScaleOption, current: number) {
  return Math.abs(option.scale - current) < 0.001;
}

export function FontSize() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { fontScale, setFontScale } = useFontScale();

  const handleSelect = useCallback(
    (option: FontScaleOption) => {
      setFontScale(option.scale);
    },
    [setFontScale],
  );

  return (
    <View testID="screen-font-size" flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <VStack pt={16} mx={6}>
        <Header title="Tamanho da fonte" handleBackTo={() => navigation.goBack()} />
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mb={20}>
          <Text fontSize={14} fontWeight={500} color="gray.600" lineHeight={20}>
            Ajuste o tamanho dos textos do app. A mudança vale para todas as telas.
          </Text>

          <VStack mt={6} space={3} accessibilityRole="radiogroup">
            {FONT_SCALE_OPTIONS.map((option) => {
              const selected = isSelected(option, fontScale);
              return (
                <TouchableOpacity
                  key={option.id}
                  testID={`btn-font-scale-${option.id}`}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`Tamanho ${option.label}`}
                >
                  <HStack
                    bg="white"
                    borderRadius={12}
                    px={4}
                    py={4}
                    alignItems="center"
                    borderWidth={2}
                    borderColor={selected ? 'ciano.400' : 'transparent'}
                  >
                    <Box w={12} alignItems="center">
                      <RNText
                        style={{
                          fontFamily: 'PoligonBold',
                          fontSize: SAMPLE_BASE_SIZE * option.scale,
                          color: '#242E49',
                        }}
                        allowFontScaling={false}
                      >
                        {SAMPLE_GLYPH}
                      </RNText>
                    </Box>
                    <Text flex={1} ml={3} fontSize={16} fontWeight={700} color="gray.800">
                      {option.label}
                    </Text>
                    <Box
                      w={6}
                      h={6}
                      borderRadius={999}
                      borderWidth={2}
                      borderColor={selected ? 'ciano.400' : 'gray.300'}
                      alignItems="center"
                      justifyContent="center"
                    >
                      {selected && <Box w={3} h={3} borderRadius={999} bg="ciano.400" />}
                    </Box>
                  </HStack>
                </TouchableOpacity>
              );
            })}
          </VStack>

          {/* Pré-visualização ao vivo: usa os mesmos tamanhos dos cards do app */}
          <Text mt={8} fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
            Pré-visualização
          </Text>
          <Box testID="font-scale-preview" bg="white" borderRadius={12} p={4} mt={4} shadow={2}>
            <Text fontSize={16} fontWeight={700} color="gray.800" letterSpacing={-0.16}>
              Gerencie seus medicamentos
            </Text>
            <Text mt={1} fontSize={14} fontWeight={500} color="gray.600" lineHeight={18}>
              Cadastre remédios, receba lembretes e acompanhe sua adesão.
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
}
