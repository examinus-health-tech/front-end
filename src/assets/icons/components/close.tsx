import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CloseIcon({ size = '24', color = '#BEC5D2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5.00001 15L8.23224 11.7678C9.20855 10.7915 10.7915 10.7914 11.7678 11.7678L15 15"
        stroke={color}
        stroke-width="1.66667"
      />
      <Path
        d="M14.9999 5L11.7677 8.23224C10.7914 9.20857 9.20849 9.20857 8.23218 8.23224L4.99995 4.99995"
        stroke={color}
        stroke-width="1.66667"
      />
    </Svg>
  );
}
