import React from 'react';
import { render } from '@testing-library/react-native';
import { CustomText } from './text';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: RN.View,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: RN.View,
    VStack: RN.View,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

describe('CustomText', () => {
  it('renders children when variant is "display"', () => {
    const { getByText } = render(
      <CustomText variant="display" fontSize={180} fontWeight={700}>
        Hello World
      </CustomText>
    );
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders with display variant and correct text content', () => {
    const { getByText } = render(
      <CustomText variant="display" fontSize={64}>
        42
      </CustomText>
    );
    expect(getByText('42')).toBeTruthy();
  });

  it('returns undefined for unknown variant', () => {
    const { toJSON } = render(
      <CustomText variant="unknown">Test</CustomText>
    );
    expect(toJSON()).toBeNull();
  });

  it('returns undefined when no variant is provided', () => {
    const { toJSON } = render(
      <CustomText>Test</CustomText>
    );
    expect(toJSON()).toBeNull();
  });

  it('passes fontWeight prop to display variant', () => {
    const { getByText } = render(
      <CustomText variant="display" fontWeight={800}>
        Bold Text
      </CustomText>
    );
    expect(getByText('Bold Text')).toBeTruthy();
  });

  it('renders numeric children in display variant', () => {
    const { getByText } = render(
      <CustomText variant="display" fontSize={180}>
        12345
      </CustomText>
    );
    expect(getByText('12345')).toBeTruthy();
  });
});
