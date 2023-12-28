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
  SingUpText,
  BackgroundImg,
} from './styles';
import logoImg from '@assets/logo.png';
import Robot from '@assets/robot.png';
import Vector from '@assets/vector.png';

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

        <Description>
          A 1ª IA que cuida da sua saúde e{'\n'}interpreta seus exames
          laboratoriais!
        </Description>
      </WrapperTitle>

      <IconRobot source={Robot} />

      <SingUpText>
        Já tem uma conta? <HighlightLink>Conecte-se.</HighlightLink>
      </SingUpText>
      {/* </BackgroundImg> */}
    </ContainerView>
  );
}
