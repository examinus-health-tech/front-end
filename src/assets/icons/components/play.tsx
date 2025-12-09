import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function PlayIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9.28615 5.40686L17.9241 10.7225C18.8759 11.3082 18.8759 12.6918 17.9241 13.2775L9.28615 18.5931C8.28675 19.2082 7 18.4891 7 17.3157L7 6.68435C7 5.51087 8.28674 4.79184 9.28615 5.40686Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9.28615 5.40686L17.9241 10.7225C18.8759 11.3082 18.8759 12.6918 17.9241 13.2775L9.28615 18.5931C8.28675 19.2082 7 18.4891 7 17.3157L7 6.68435C7 5.51087 8.28674 4.79184 9.28615 5.40686Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
