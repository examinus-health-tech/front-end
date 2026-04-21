import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from './loading';

// Mock native-base
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Image: (props: any) => <RN.Image {...props} />,
    Center: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Svg: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Rect: (props: any) => <RN.View {...props} />,
    Circle: (props: any) => <RN.View {...props} />,
  };
});

// Mock assets
jest.mock('@assets/png/x-examinus.png', () => 'mock-x-examinus');

describe('Loading', () => {
  it('renders the component tree', () => {
    const { toJSON } = render(<Loading />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing on mount/unmount', () => {
    const { unmount } = render(<Loading />);
    unmount();
  });
});
