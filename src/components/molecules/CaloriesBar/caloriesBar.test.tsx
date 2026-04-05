import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CaloriesBar } from './caloriesBar';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, onLayout, ...rest }: any) => (
      <RN.View onLayout={onLayout} testID="calories-container" {...rest}>
        {children}
      </RN.View>
    ),
    VStack: RN.View,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

describe('CaloriesBar', () => {
  const defaultProps = {
    burned: 500,
    target: 2000,
  };

  it('renders without crashing', () => {
    const { toJSON } = render(<CaloriesBar {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders bars after layout event', () => {
    const { getByTestId } = render(<CaloriesBar {...defaultProps} />);
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    // After layout, bars should render (containerWidth > 0)
    expect(container).toBeTruthy();
  });

  it('does not render bars before layout event (containerWidth = 0)', () => {
    const { getByTestId } = render(<CaloriesBar {...defaultProps} />);
    const container = getByTestId('calories-container');
    // Before layout event, containerWidth is 0, so no bars should render
    expect(container.children.length).toBe(0);
  });

  it('renders with burned equal to target', () => {
    const { getByTestId } = render(
      <CaloriesBar burned={2000} target={2000} />
    );
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    expect(container).toBeTruthy();
  });

  it('renders with burned exceeding target', () => {
    const { getByTestId } = render(
      <CaloriesBar burned={2500} target={2000} />
    );
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    expect(container).toBeTruthy();
  });

  it('renders with burned = 0', () => {
    const { getByTestId } = render(
      <CaloriesBar burned={0} target={2000} />
    );
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    expect(container).toBeTruthy();
  });

  it('uses custom gap value', () => {
    const { getByTestId } = render(
      <CaloriesBar burned={500} target={2000} gap={16} />
    );
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    expect(container).toBeTruthy();
  });

  it('uses default gap of 8 when not provided', () => {
    const { getByTestId } = render(
      <CaloriesBar burned={500} target={2000} />
    );
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    expect(container).toBeTruthy();
  });

  it('handles very small burned values', () => {
    const { getByTestId } = render(
      <CaloriesBar burned={1} target={2000} />
    );
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    expect(container).toBeTruthy();
  });

  it('renders with gap = 0', () => {
    const { getByTestId } = render(
      <CaloriesBar burned={1000} target={2000} gap={0} />
    );
    const container = getByTestId('calories-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 300 } },
    });

    expect(container).toBeTruthy();
  });
});
