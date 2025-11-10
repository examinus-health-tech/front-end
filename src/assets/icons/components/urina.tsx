import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export interface IconProps {
  size?: string;
  color?: string;
}

export default function UrinaIcon({
  size = '24',
  color = '#BEC5D2',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 57 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0_1039_18803)">
        <Path
          d="M40.375 38.9375C40.375 43.2186 36.9061 46.6875 32.625 46.6875H24.375C20.0939 46.6875 16.625 43.2186 16.625 38.9375V23.75H40.375V38.9375Z"
          fill={color}
        />
        <Path
          d="M17.8126 22.5625L19.0001 10.3125H38.0001L39.1876 22.5625H17.8126Z"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M40.375 38.9375C40.375 43.2186 36.9061 46.6875 32.625 46.6875H24.375C20.0939 46.6875 16.625 43.2186 16.625 38.9375V23.75H40.375V38.9375Z"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1039_18803">
          <Rect width={57} height={57} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
