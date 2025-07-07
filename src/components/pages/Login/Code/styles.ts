import { TextInput } from 'react-native';
import styled from 'styled-components/native';

export const InputStyled = styled(TextInput).attrs((props) => ({
  placeholderTextColor: props.autoFocus ? 'transparent' : '#BEC5D2',
}))`
  background-color: ${(props) => (props.autoFocus ? '#0cc1af' : '#ffffff')};
  height: 56px;
  width: 48px;
  border-radius: 16px;
  text-align: center;
  border: 5px solid ${(props) => (props.autoFocus ? '#bad7e7' : 'transparent')};

  font-family: 'PoligonBold';
  font-size: 32px;
  color: ${(props) => (props.autoFocus ? '#DDF4F2' : '#090E1D')};

  &:focus {
    outline: none;
  }
`;
