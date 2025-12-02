import { Text, View } from 'react-native';

import {
  ContainerView,
  Logo,
  Title,
  WrapperTitle,
  Highlight,
  HighlightLink,
  Description,
  IconRobot,
  SignUpText,
  BackgroundImg,
} from './styles';
import logoImg from '@assets/png/logo.png';
import Robot from '@assets/png/robot.png';
import Vector from '@assets/png/vector.png';

export function Welcome() {
  return (
    <ContainerView>
      {/* <BackgroundImg source={Vector} resizeMode="cover"> */}
      <WrapperTitle>
        <Logo source={logoImg} />

        <Title>
          Olá, eu sou a{'\n'}
          <Highlight>examinus.</Highlight>
        </Title>

        <Description>A 1ª IA que cuida da sua saúde e{'\n'}interpreta seus exames laboratoriais!</Description>
      </WrapperTitle>

      <IconRobot source={Robot} />

      <SignUpText>
        Já tem uma conta? <HighlightLink>Conecte-se.</HighlightLink>
      </SignUpText>
      {/* </BackgroundImg> */}
    </ContainerView>
  );
}
