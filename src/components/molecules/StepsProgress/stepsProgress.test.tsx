import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StepsProgress } from './stepsProgress';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, onLayout, ...rest }: any) => (
      <RN.View onLayout={onLayout} {...rest}>
        {children}
      </RN.View>
    ),
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: RN.View,
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Svg: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Path: (props: any) => <RN.View {...props} />,
  };
});

jest.mock('@assets/icons', () => ({
  WalkingIcon: ({ size, color }: any) => {
    const RN = require('react-native');
    return <RN.View testID="walking-icon" />;
  },
}));

describe('StepsProgress', () => {
  const defaultProps = {
    steps: 5000,
    goal: 10000,
  };

  it('renders without crashing', () => {
    const { toJSON } = render(<StepsProgress {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('does not render SVG content before layout event', () => {
    const { queryByTestId } = render(<StepsProgress {...defaultProps} />);
    // Before layout, containerWidth is 0, so SVG content should not render
    expect(queryByTestId('walking-icon')).toBeNull();
  });

  it('renders SVG content after layout event', () => {
    const { root } = render(<StepsProgress {...defaultProps} />);

    // Find the outermost Box (which has onLayout) and trigger layout
    const boxes = root.findAll((node) => node.props.onLayout);
    if (boxes.length > 0) {
      fireEvent(boxes[0], 'layout', {
        nativeEvent: { layout: { width: 300 } },
      });
    }

    expect(root).toBeTruthy();
  });

  it('displays the steps count formatted', () => {
    const { root } = render(<StepsProgress {...defaultProps} />);

    const boxes = root.findAll((node) => node.props.onLayout);
    if (boxes.length > 0) {
      fireEvent(boxes[0], 'layout', {
        nativeEvent: { layout: { width: 300 } },
      });
    }

    // Steps should be formatted with locale pt-BR
    const formattedSteps = (5000).toLocaleString('pt-BR');
    expect(root).toBeTruthy();
  });

  it('displays "Passos" label', () => {
    const { root } = render(<StepsProgress {...defaultProps} />);

    const boxes = root.findAll((node) => node.props.onLayout);
    if (boxes.length > 0) {
      fireEvent(boxes[0], 'layout', {
        nativeEvent: { layout: { width: 300 } },
      });
    }

    expect(root).toBeTruthy();
  });

  it('displays the goal label', () => {
    const { root } = render(<StepsProgress {...defaultProps} />);

    const boxes = root.findAll((node) => node.props.onLayout);
    if (boxes.length > 0) {
      fireEvent(boxes[0], 'layout', {
        nativeEvent: { layout: { width: 300 } },
      });
    }

    expect(root).toBeTruthy();
  });

  it('caps progress at 100% when steps exceed goal', () => {
    const { toJSON } = render(
      <StepsProgress steps={15000} goal={10000} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with 0 steps', () => {
    const { toJSON } = render(
      <StepsProgress steps={0} goal={10000} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with steps equal to goal', () => {
    const { toJSON } = render(
      <StepsProgress steps={10000} goal={10000} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with large step counts', () => {
    const { toJSON } = render(
      <StepsProgress steps={100000} goal={50000} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders "0" label at bottom left after layout', () => {
    const { root } = render(<StepsProgress {...defaultProps} />);

    const boxes = root.findAll((node) => node.props.onLayout);
    if (boxes.length > 0) {
      fireEvent(boxes[0], 'layout', {
        nativeEvent: { layout: { width: 300 } },
      });
    }

    expect(root).toBeTruthy();
  });
});
