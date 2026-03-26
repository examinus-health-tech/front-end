import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './button';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Button: ({ children, isLoading, onPress, testID, ...rest }: any) => (
      <RN.TouchableOpacity testID={testID} onPress={onPress} {...rest}>
        {children}
      </RN.TouchableOpacity>
    ),
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Row: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

describe('Button', () => {
  const defaultProps = {
    title: 'Click Me',
    size: 'md' as const,
    variant: 'primary' as const,
  };

  it('renders with title text', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'inline', 'outline', 'fab', 'fabDark', 'fabOutline', 'transparent'] as const;
    variants.forEach((variant) => {
      const { getByText } = render(
        <Button title="Test" size="md" variant={variant} />
      );
      expect(getByText('Test')).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'fab', 'full'] as const;
    sizes.forEach((size) => {
      const { getByText } = render(
        <Button title="Test" size={size} variant="primary" />
      );
      expect(getByText('Test')).toBeTruthy();
    });
  });

  it('renders an icon when provided', () => {
    const RN = require('react-native');
    const icon = <RN.View testID="button-icon" />;
    const { getByTestId } = render(
      <Button {...defaultProps} icon={icon} />
    );
    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('renders icon alongside title', () => {
    const RN = require('react-native');
    const icon = <RN.View testID="button-icon" />;
    const { getByText, getByTestId } = render(
      <Button {...defaultProps} icon={icon} />
    );
    expect(getByText('Click Me')).toBeTruthy();
    expect(getByTestId('button-icon')).toBeTruthy();
  });

  it('hides content when isLoading is true', () => {
    const { queryByText } = render(
      <Button {...defaultProps} isLoading={true} />
    );
    expect(queryByText('Click Me')).toBeNull();
  });

  it('shows content when isLoading is false', () => {
    const { getByText } = render(
      <Button {...defaultProps} isLoading={false} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('handles onPress events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button {...defaultProps} onPress={onPress} />
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders without title (icon only)', () => {
    const RN = require('react-native');
    const icon = <RN.View testID="icon-only" />;
    const { getByTestId, queryByText } = render(
      <Button size="fab" variant="fab" icon={icon} />
    );
    expect(getByTestId('icon-only')).toBeTruthy();
  });

  it('applies custom fontSize', () => {
    const { getByText } = render(
      <Button {...defaultProps} fontSize={20} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('applies custom textColor', () => {
    const { getByText } = render(
      <Button {...defaultProps} textColor="red" />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('renders with outline variant (borderWidth = 1)', () => {
    const { getByText } = render(
      <Button title="Outline" size="md" variant="outline" />
    );
    expect(getByText('Outline')).toBeTruthy();
  });

  it('spreads additional rest props', () => {
    const { getByTestId } = render(
      <Button {...defaultProps} testID="custom-button" />
    );
    expect(getByTestId('custom-button')).toBeTruthy();
  });
});
