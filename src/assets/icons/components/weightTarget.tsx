import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface Props extends SvgProps {
  size?: string;
  color?: string;
}

export function WeightTargetIcon({ size = '24', color = '#FA4D5E', ...rest }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M10.5458 14H7V21H5V6.5C5 5.11929 6.11929 4 7.5 4H10.5458C11.0394 4 11.5219 4.1461 11.9326 4.41987L14.1768 5.91603C14.2589 5.97078 14.3555 6 14.4542 6H17.5C18.8807 6 20 7.11929 20 8.5V13.5C20 14.8807 18.8807 16 17.5 16H14.4542C13.9606 16 13.4781 15.8539 13.0674 15.5801L10.8232 14.084C10.7411 14.0292 10.6445 14 10.5458 14Z"
        fill={color}
      />
    </Svg>
  );
}
