import styled from 'styled-components/native';
import { Image } from 'native-base';

export const ImageFiltered = styled.Image`
  filter: saturate(500%) contrast(800%) brightness(500%) invert(80%) sepia(50%) hue-rotate(120deg) !important;
`;
