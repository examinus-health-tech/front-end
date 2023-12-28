import { ImageBackground } from 'react-native';
import styled from 'styled-components/native';

export const ContainerView = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100%;

  padding: 4px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_10};
`;

export const WrapperTitle = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const Logo = styled.Image`
  width: 64px;
  height: 64px;
`;

export const IconRobot = styled.Image`
  margin: 60px 0;
  width: 208px;
  height: 248px;
`;

export const Title = styled.Text`
  text-align: center;

  font-size: 30px;
  font-weight: 800;
  line-height: 38px;
  color: ${({ theme }) => theme.COLORS.GRAY_100};
`;

export const Highlight = styled.Text`
  color: ${({ theme }) => theme.COLORS.CIANO_40};
`;

export const Description = styled.Text`
  text-align: center;

  color: ${({ theme }) => theme.COLORS.GRAY_70};
  font-size: 16px;
  line-height: 25.6px;
`;

export const SingUpText = styled.Text`
  padding-top: 80px;

  text-align: center;

  color: ${({ theme }) => theme.COLORS.GRAY_50};
  font-size: 14;
  font-weight: 600;
  letter-spacing: -0.14px;
`;

export const HighlightLink = styled.Text`
  font-weight: 800;
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.COLORS.RED_50};
  color: ${({ theme }) => theme.COLORS.RED_50};
`;

export const BackgroundImg = styled(ImageBackground)``;
