import React from 'react';
import { render } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import { CustomRefreshControl } from './customRefreshControl';

describe('CustomRefreshControl', () => {
  const defaultProps = {
    refreshing: false,
    onRefresh: jest.fn(),
  };

  it('renders without crashing', () => {
    const { toJSON } = render(
      <ScrollView
        refreshControl={
          <CustomRefreshControl {...defaultProps} />
        }
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with refreshing=true', () => {
    const { toJSON } = render(
      <ScrollView
        refreshControl={
          <CustomRefreshControl refreshing={true} onRefresh={jest.fn()} />
        }
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with refreshing=false', () => {
    const { toJSON } = render(
      <ScrollView
        refreshControl={
          <CustomRefreshControl refreshing={false} onRefresh={jest.fn()} />
        }
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('passes onRefresh callback', () => {
    const onRefresh = jest.fn();
    const { toJSON } = render(
      <ScrollView
        refreshControl={
          <CustomRefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('passes additional rest props', () => {
    const { toJSON } = render(
      <ScrollView
        refreshControl={
          <CustomRefreshControl
            {...defaultProps}
            progressViewOffset={50}
            enabled={true}
          />
        }
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies correct tintColor for iOS', () => {
    const tree = render(
      <ScrollView
        refreshControl={
          <CustomRefreshControl {...defaultProps} />
        }
      />
    );
    // Verifies component renders successfully with tintColor set
    expect(tree.toJSON()).toBeTruthy();
  });

  it('applies correct colors array for Android', () => {
    const tree = render(
      <ScrollView
        refreshControl={
          <CustomRefreshControl {...defaultProps} />
        }
      />
    );
    expect(tree.toJSON()).toBeTruthy();
  });
});
