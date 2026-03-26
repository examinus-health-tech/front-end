import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// --- Mocks ---

jest.mock('native-base', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    VStack: RN.View,
    Text: RN.Text,
    Image: ({ alt, ...rest }: any) =>
      React.createElement(RN.Image, { ...rest, accessibilityLabel: alt }),
    Center: RN.View,
    Box: RN.View,
    HStack: RN.View,
  };
});

// Mock expo-document-picker
const mockGetDocumentAsync = jest.fn();
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: (...args: any[]) => mockGetDocumentAsync(...args),
}));

// Mock icons
jest.mock('@assets/icons', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    EditIcon: (props: any) => React.createElement(RN.View, { testID: 'edit-icon' }),
    UploadIcon: () => React.createElement(RN.View, { testID: 'upload-icon' }),
  };
});

jest.mock('@assets/png/vector-9.png', () => 'mock-vector-9');

import { UploadType } from './uploadType';

describe('UploadType', () => {
  const defaultProps = {
    setIsCameraOpen: jest.fn(),
    navigation: {
      navigate: jest.fn(),
      reset: jest.fn(),
    },
    handleUploadFileFromOnboarding: jest.fn(),
    handleCameraPermission: jest.fn(),
    onCloseActionSheet: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDocumentAsync.mockReset();
  });

  it('renders the component correctly', () => {
    const { getByText } = render(<UploadType {...defaultProps} />);
    expect(getByText(/Como você deseja/)).toBeTruthy();
    expect(getByText(/importar seu exame\?/)).toBeTruthy();
  });

  it('renders the subtitle text', () => {
    const { getByText } = render(<UploadType {...defaultProps} />);
    expect(getByText(/Selecione a opção abaixo/)).toBeTruthy();
    expect(getByText(/possamos simplificar sua saúde:/)).toBeTruthy();
  });

  it('renders the PDF button', () => {
    const { getByText } = render(<UploadType {...defaultProps} />);
    expect(getByText('PDF')).toBeTruthy();
  });

  it('renders the Imagem button', () => {
    const { getByText } = render(<UploadType {...defaultProps} />);
    expect(getByText('Imagem')).toBeTruthy();
  });

  it('renders the skip upload text', () => {
    const { getByText } = render(<UploadType {...defaultProps} />);
    expect(getByText('fazer isso mais tarde')).toBeTruthy();
  });

  it('renders the vector image', () => {
    const { UNSAFE_getAllByType } = render(<UploadType {...defaultProps} />);
    // Image is rendered
    expect(UNSAFE_getAllByType(require('react-native').Image).length).toBeGreaterThanOrEqual(1);
  });

  it('renders upload and edit icons', () => {
    const { getByTestId } = render(<UploadType {...defaultProps} />);
    expect(getByTestId('upload-icon')).toBeTruthy();
    expect(getByTestId('edit-icon')).toBeTruthy();
  });

  // --- PDF file selection tests ---

  it('calls getDocumentAsync when PDF button is pressed', async () => {
    mockGetDocumentAsync.mockResolvedValueOnce({ canceled: true });

    const { getByText } = render(<UploadType {...defaultProps} />);
    await act(async () => {
      fireEvent.press(getByText('PDF'));
    });

    expect(mockGetDocumentAsync).toHaveBeenCalledWith({
      type: 'application/pdf',
      multiple: false,
    });
  });

  it('does nothing when user cancels file selection', async () => {
    mockGetDocumentAsync.mockResolvedValueOnce({ canceled: true });

    const { getByText } = render(<UploadType {...defaultProps} />);
    await act(async () => {
      fireEvent.press(getByText('PDF'));
    });

    expect(defaultProps.handleUploadFileFromOnboarding).not.toHaveBeenCalled();
    expect(defaultProps.onCloseActionSheet).not.toHaveBeenCalled();
  });

  it('calls handleUploadFileFromOnboarding with selected file', async () => {
    const mockFile = { uri: 'file://test.pdf', name: 'test.pdf' };
    mockGetDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [mockFile],
    });
    defaultProps.handleUploadFileFromOnboarding.mockResolvedValueOnce(undefined);

    const { getByText } = render(<UploadType {...defaultProps} />);
    await act(async () => {
      fireEvent.press(getByText('PDF'));
    });

    expect(defaultProps.handleUploadFileFromOnboarding).toHaveBeenCalledWith(mockFile);
  });

  it('calls onCloseActionSheet after successful file upload', async () => {
    const mockFile = { uri: 'file://test.pdf', name: 'test.pdf' };
    mockGetDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [mockFile],
    });
    defaultProps.handleUploadFileFromOnboarding.mockResolvedValueOnce(undefined);

    const { getByText } = render(<UploadType {...defaultProps} />);
    await act(async () => {
      fireEvent.press(getByText('PDF'));
    });

    expect(defaultProps.onCloseActionSheet).toHaveBeenCalled();
  });

  it('does not call onCloseActionSheet when not provided', async () => {
    const mockFile = { uri: 'file://test.pdf', name: 'test.pdf' };
    mockGetDocumentAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [mockFile],
    });

    const propsWithoutClose = {
      ...defaultProps,
      onCloseActionSheet: undefined,
      handleUploadFileFromOnboarding: jest.fn().mockResolvedValueOnce(undefined),
    };

    const { getByText } = render(<UploadType {...propsWithoutClose} />);
    await act(async () => {
      fireEvent.press(getByText('PDF'));
    });

    // Should not throw when onCloseActionSheet is undefined
    expect(propsWithoutClose.handleUploadFileFromOnboarding).toHaveBeenCalled();
  });

  it('handles error during file upload gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockGetDocumentAsync.mockRejectedValueOnce(new Error('Upload failed'));

    const { getByText } = render(<UploadType {...defaultProps} />);
    await act(async () => {
      fireEvent.press(getByText('PDF'));
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  // --- Camera / Image button tests ---

  it('calls handleCameraPermission when Imagem is pressed and handleCameraPermission is provided', () => {
    const { getByText } = render(<UploadType {...defaultProps} />);
    fireEvent.press(getByText('Imagem'));
    expect(defaultProps.handleCameraPermission).toHaveBeenCalled();
    expect(defaultProps.setIsCameraOpen).not.toHaveBeenCalled();
  });

  it('calls setIsCameraOpen(true) when Imagem is pressed without handleCameraPermission', () => {
    const propsWithoutPermission = {
      ...defaultProps,
      handleCameraPermission: undefined,
    };

    const { getByText } = render(<UploadType {...propsWithoutPermission} />);
    fireEvent.press(getByText('Imagem'));
    expect(defaultProps.setIsCameraOpen).toHaveBeenCalledWith(true);
  });

  it('does not crash when setIsCameraOpen is undefined and no handleCameraPermission', () => {
    const propsNoCamera = {
      ...defaultProps,
      handleCameraPermission: undefined,
      setIsCameraOpen: undefined,
    };

    const { getByText } = render(<UploadType {...propsNoCamera} />);
    // Should not throw
    fireEvent.press(getByText('Imagem'));
  });

  // --- Skip upload / navigation tests ---

  it('calls navigation.reset when "fazer isso mais tarde" is pressed', async () => {
    jest.useFakeTimers();

    const { getByText } = render(<UploadType {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('fazer isso mais tarde'));
      jest.advanceTimersByTime(600);
    });

    expect(defaultProps.navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'homepage' }],
    });

    jest.useRealTimers();
  });

  it('calls onCloseActionSheet before navigation on skip', async () => {
    jest.useFakeTimers();

    const { getByText } = render(<UploadType {...defaultProps} />);

    await act(async () => {
      fireEvent.press(getByText('fazer isso mais tarde'));
      jest.advanceTimersByTime(600);
    });

    expect(defaultProps.onCloseActionSheet).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('falls back to navigate when reset throws', async () => {
    jest.useFakeTimers();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const propsWithFailingReset = {
      ...defaultProps,
      navigation: {
        reset: jest.fn(() => { throw new Error('reset failed'); }),
        navigate: jest.fn(),
      },
    };

    const { getByText } = render(<UploadType {...propsWithFailingReset} />);

    await act(async () => {
      fireEvent.press(getByText('fazer isso mais tarde'));
      jest.advanceTimersByTime(600);
    });

    expect(propsWithFailingReset.navigation.navigate).toHaveBeenCalledWith('homepage');
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });

  it('does not call onCloseActionSheet on skip when it is not provided', async () => {
    jest.useFakeTimers();
    const propsWithoutClose = {
      ...defaultProps,
      onCloseActionSheet: undefined,
    };

    const { getByText } = render(<UploadType {...propsWithoutClose} />);

    await act(async () => {
      fireEvent.press(getByText('fazer isso mais tarde'));
      jest.advanceTimersByTime(600);
    });

    expect(defaultProps.navigation.reset).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
