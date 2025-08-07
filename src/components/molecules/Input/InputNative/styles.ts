import { TextInput } from 'react-native';
import styled from 'styled-components/native';

interface InputStyledProps {
  focused?: boolean;
}

export const InputStyled = styled(TextInput)<InputStyledProps>`
  background-color: ${(props) => (props.focused ? '#0cc1af' : '#ffffff')};
  height: 60px;
  border-radius: 16px;
  border: 5px solid ${(props) => (props.focused ? '#bad7e7' : 'transparent')};

  padding: 0 16px;

  font-family: 'PoligonBold';
  font-size: 32px;
  color: ${(props) => (props.focused ? '#DDF4F2' : '#090E1D')};
`;
