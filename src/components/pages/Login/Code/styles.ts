import { TextInput } from 'react-native';
import styled from 'styled-components';

export const InputStyled = styled(TextInput).attrs((props) => ({
  placeholderTextColor: props.autoFocus ? 'transparent' : '#BEC5D2',
}))`
  background-color: ${(props) => (props.autoFocus ? '#0cc1af' : '#ffffff')};
  height: 64px;
  width: 52px;
  border-radius: 16px;
  border: 5px solid ${(props) => (props.autoFocus ? '#bad7e7' : 'transparent')};

  padding: 0 0 0 17px;

  font-family: 'PoligonBold';
  font-size: 32px;
  color: ${(props) => (props.autoFocus ? '#DDF4F2' : '#090E1D')};
`;
