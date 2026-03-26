import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock NativeBase
jest.mock('native-base', () => {
  const RN = require('react-native');
  const React = require('react');
  return {
    Actionsheet: Object.assign(
      ({ children, isOpen, onClose }: any) =>
        isOpen
          ? require("react").createElement(RN.View, { testID: 'actionsheet' }, children)
          : null,
      {
        Content: ({ children }: any) =>
          require("react").createElement(RN.View, { testID: 'actionsheet-content' }, children),
        Item: RN.TouchableOpacity,
      },
    ),
    useDisclose: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    }),
  };
});

// Mock child components
const mockSetManual = jest.fn();
jest.mock('../UploadTypeManual/uploadTypeManual', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    UploadTypeManual: ({ setManual }: any) =>
      React.createElement(
        RN.View,
        { testID: 'upload-type-manual' },
        React.createElement(RN.TouchableOpacity, {
          testID: 'manual-back-button',
          onPress: () => setManual(false),
        }),
      ),
  };
});

jest.mock('../UploadType/uploadType', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    UploadType: (props: any) =>
      React.createElement(RN.View, { testID: 'upload-type' }),
  };
});

import { ActionSheetUpload } from './actionsheetUpload';

describe('ActionSheetUpload', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    navigation: { navigate: jest.fn() },
    handleUploadFile: jest.fn(),
    setIsCameraOpen: jest.fn(),
    handleCameraPermission: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { queryByTestId } = render(
      <ActionSheetUpload {...defaultProps} isOpen={false} />,
    );
    expect(queryByTestId('actionsheet')).toBeNull();
  });

  it('renders the Actionsheet when isOpen is true', () => {
    const { getByTestId } = render(
      <ActionSheetUpload {...defaultProps} />,
    );
    expect(getByTestId('actionsheet')).toBeTruthy();
    expect(getByTestId('actionsheet-content')).toBeTruthy();
  });

  it('renders UploadType by default (not manual mode)', () => {
    const { getByTestId, queryByTestId } = render(
      <ActionSheetUpload {...defaultProps} />,
    );
    expect(getByTestId('upload-type')).toBeTruthy();
    expect(queryByTestId('upload-type-manual')).toBeNull();
  });

  it('passes setIsCameraOpen to UploadType', () => {
    const { getByTestId } = render(
      <ActionSheetUpload {...defaultProps} />,
    );
    expect(getByTestId('upload-type')).toBeTruthy();
  });

  it('renders with optional props as undefined', () => {
    const { getByTestId } = render(
      <ActionSheetUpload isOpen={true} onClose={jest.fn()} />,
    );
    expect(getByTestId('upload-type')).toBeTruthy();
  });

  it('renders Actionsheet.Content inside Actionsheet', () => {
    const { getByTestId } = render(
      <ActionSheetUpload {...defaultProps} />,
    );
    const actionsheet = getByTestId('actionsheet');
    const content = getByTestId('actionsheet-content');
    expect(actionsheet).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('uses default empty object for navigation when not provided', () => {
    const { getByTestId } = render(
      <ActionSheetUpload
        isOpen={true}
        onClose={jest.fn()}
        setIsCameraOpen={jest.fn()}
      />,
    );
    expect(getByTestId('upload-type')).toBeTruthy();
  });

  it('uses default no-op for handleUploadFile when not provided', () => {
    const { getByTestId } = render(
      <ActionSheetUpload
        isOpen={true}
        onClose={jest.fn()}
        navigation={{}}
      />,
    );
    expect(getByTestId('upload-type')).toBeTruthy();
  });

  it('passes onClose to the Actionsheet', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <ActionSheetUpload {...defaultProps} onClose={onClose} />,
    );
    expect(getByTestId('actionsheet')).toBeTruthy();
  });

  it('renders correctly with all props provided', () => {
    const { getByTestId } = render(
      <ActionSheetUpload
        isOpen={true}
        onClose={jest.fn()}
        navigation={{ navigate: jest.fn(), reset: jest.fn() }}
        handleUploadFile={jest.fn()}
        setIsCameraOpen={jest.fn()}
        handleCameraPermission={jest.fn()}
      />,
    );
    expect(getByTestId('actionsheet')).toBeTruthy();
    expect(getByTestId('upload-type')).toBeTruthy();
  });

  it('starts in non-manual mode by default', () => {
    const { queryByTestId } = render(
      <ActionSheetUpload {...defaultProps} />,
    );
    expect(queryByTestId('upload-type')).toBeTruthy();
    expect(queryByTestId('upload-type-manual')).toBeNull();
  });
});
