import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function PIllIcon({ size = '24', color = '#0CC1AF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M15 15L9.17157 9.17157" stroke={color} strokeWidth="1.5" />
      <Path
        d="M18.8787 5.87868L18.1213 5.12132C16.9497 3.94975 15.0503 3.94975 13.8787 5.12132L5.12132 13.8787C3.94975 15.0503 3.94975 16.9497 5.12132 18.1213L5.87868 18.8787C7.05025 20.0503 8.94975 20.0503 10.1213 18.8787L18.8787 10.1213C20.0503 8.94975 20.0503 7.05025 18.8787 5.87868Z"
        stroke="#052B3B"
        strokeWidth="1.5"
      />
    </Svg>
  );
}
