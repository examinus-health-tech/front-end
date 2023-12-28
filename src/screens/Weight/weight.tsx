import { VStack, Text, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RulerPicker } from 'react-native-ruler-picker';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';

// components
import { Button } from '@components/Button/button';
import { Header } from '@components/Header';

export function Weight() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('age');
  }

  function handleGoToUpload() {
    navigation.navigate('upload');
  }

  return (
    <VStack flex={1} bg={'gray.10'} space={8} py={24} mx={6}>
      <Header progressValue={33} withBackButton jumpTo={handleGoToUpload} />
      <Text
        color="gray.100"
        fontSize={32}
        fontWeight={800}
        lineHeight={38}
        letterSpacing={-1.2}
        mt={4}
      >
        Qual é o seu peso?
      </Text>

      <Center>
        <RulerPicker
          min={0}
          max={240}
          step={1}
          fractionDigits={0}
          initialValue={20}
          onValueChange={(number) => console.log(number)}
          onValueChangeEnd={(number) => console.log(number)}
          unit="kgs"
          shortStepHeight={20}
          longStepHeight={60}
          indicatorHeight={120}
          indicatorColor="#0CC1AF"
          shortStepColor="#BEC5D2"
          longStepColor="#3D4966"
          valueTextStyle={{
            fontSize: 60,
            fontWeight: '800',
            color: '#052B3B',
          }}
          unitTextStyle={{
            fontSize: 24,
            fontWeight: '600',
            color: '#3D4966',
          }}
        />
      </Center>

      <Button
        position="absolute"
        bottom={10}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={handleNextStep}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
