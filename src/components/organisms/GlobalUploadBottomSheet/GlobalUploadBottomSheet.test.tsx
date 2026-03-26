import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { StatusBar } from 'react-native';

// --- Mocks ---

// Mock NativeBase
jest.mock('native-base', () => {
  const RN = require('react-native');
  const React = require('react');

  const MockActionsheet = Object.assign(
    ({ children, isOpen, onClose }: any) =>
      isOpen
        ? require("react").createElement(
            RN.View,
            { testID: 'actionsheet' },
            children,
            require("react").createElement(RN.TouchableOpacity, {
              testID: 'actionsheet-close-trigger',
              onPress: onClose,
            }),
          )
        : null,
    {
      Content: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'actionsheet-content' }, children),
      Item: RN.TouchableOpacity,
    },
  );

  const MockModal = Object.assign(
    ({ children, isOpen, onClose, ...rest }: any) =>
      isOpen
        ? require("react").createElement(
            RN.View,
            { testID: 'modal' },
            children,
            onClose
              ? require("react").createElement(RN.TouchableOpacity, {
                  testID: 'modal-close-trigger',
                  onPress: onClose,
                })
              : null,
          )
        : null,
    {
      Content: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'modal-content' }, children),
      Body: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'modal-body' }, children),
      CloseButton: () =>
        require("react").createElement(RN.View, { testID: 'modal-close-button' }),
    },
  );

  return {
    Actionsheet: MockActionsheet,
    useDisclose: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    }),
    Modal: MockModal,
    VStack: RN.View,
    Text: RN.Text,
    Image: RN.Image,
    Box: RN.View,
    HStack: RN.View,
  };
});

// Track useDisclose state per test
let mockCameraIsOpen = false;
const mockCameraOnOpen = jest.fn(() => {
  mockCameraIsOpen = true;
});
const mockCameraOnClose = jest.fn(() => {
  mockCameraIsOpen = false;
});

jest.mock('native-base', () => {
  const RN = require('react-native');
  const React = require('react');

  const MockActionsheet = Object.assign(
    ({ children, isOpen, onClose }: any) =>
      isOpen
        ? require("react").createElement(
            RN.View,
            { testID: 'actionsheet' },
            children,
            require("react").createElement(RN.TouchableOpacity, {
              testID: 'actionsheet-close-trigger',
              onPress: onClose,
            }),
          )
        : null,
    {
      Content: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'actionsheet-content' }, children),
      Item: RN.TouchableOpacity,
    },
  );

  const MockModal = Object.assign(
    ({ children, isOpen, onClose, ...rest }: any) =>
      isOpen
        ? require("react").createElement(
            RN.View,
            { testID: 'modal' },
            children,
            onClose
              ? require("react").createElement(RN.TouchableOpacity, {
                  testID: 'modal-close-trigger',
                  onPress: onClose,
                })
              : null,
          )
        : null,
    {
      Content: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'modal-content' }, children),
      Body: ({ children }: any) =>
        require("react").createElement(RN.View, { testID: 'modal-body' }, children),
      CloseButton: () =>
        require("react").createElement(RN.View, { testID: 'modal-close-button' }),
    },
  );

  return {
    Actionsheet: MockActionsheet,
    useDisclose: () => ({
      isOpen: mockCameraIsOpen,
      onOpen: mockCameraOnOpen,
      onClose: mockCameraOnClose,
    }),
    Modal: MockModal,
    VStack: RN.View,
    Text: RN.Text,
    Image: RN.Image,
    Box: RN.View,
    HStack: RN.View,
  };
});

// Mock UploadBottomSheetContext
const mockCloseBottomSheet = jest.fn();
let mockIsBottomSheetOpen = false;
jest.mock('src/contexts/UploadBottomSheetContext', () => ({
  useUploadBottomSheet: () => ({
    isBottomSheetOpen: mockIsBottomSheetOpen,
    closeBottomSheet: mockCloseBottomSheet,
  }),
}));

// Mock useUpload
const mockHandleUploadFile = jest.fn();
const mockSetWithError = jest.fn();
const mockSetWithSuccess = jest.fn();
let mockIsLoadingUploadContext = false;
let mockWithError = false;
let mockWithSuccess = false;
jest.mock('src/hooks/useUpload', () => ({
  useUpload: () => ({
    isLoadingUploadContext: mockIsLoadingUploadContext,
    withError: mockWithError,
    withSuccess: mockWithSuccess,
    setWithError: mockSetWithError,
    setWithSuccess: mockSetWithSuccess,
    handleUploadFile: mockHandleUploadFile,
  }),
}));

// Mock useTabBar
const mockHideTabBar = jest.fn();
const mockShowTabBar = jest.fn();
jest.mock('src/hooks/useTabBar', () => ({
  useTabBar: () => ({
    hideTabBar: mockHideTabBar,
    showTabBar: mockShowTabBar,
  }),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: jest.fn(),
  }),
}));

// Mock child components
jest.mock('@components/pages/Homepage/UploadMain/uploadType/uploadType', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    UploadType: ({ onCameraOpen, handleUploadFileProp }: any) =>
      React.createElement(
        RN.View,
        { testID: 'upload-type' },
        React.createElement(RN.TouchableOpacity, {
          testID: 'camera-open-button',
          onPress: onCameraOpen,
        }),
        React.createElement(RN.TouchableOpacity, {
          testID: 'upload-file-button',
          onPress: () => handleUploadFileProp?.({ uri: 'test.pdf' }),
        }),
      ),
  };
});

jest.mock('@components/pages/Homepage/UploadMain/uploadCamera/uploadCamera', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    UploadCamera: ({ isOpen, onClose }: any) =>
      isOpen
        ? React.createElement(
            RN.View,
            { testID: 'upload-camera' },
            React.createElement(RN.TouchableOpacity, {
              testID: 'camera-close-button',
              onPress: onClose,
            }),
          )
        : null,
  };
});

jest.mock('@components/pages/Homepage/UploadMain/loading/loading', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Loading: () => React.createElement(RN.View, { testID: 'loading-component' }),
  };
});

jest.mock('@components/pages/Homepage/UploadMain/ScoreWarning/scoreWarning', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    ScoreWarning: ({ onClose }: any) =>
      React.createElement(
        RN.View,
        { testID: 'score-warning' },
        React.createElement(RN.TouchableOpacity, {
          testID: 'score-warning-close',
          onPress: onClose,
        }),
      ),
  };
});

jest.mock('@components/atoms', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...rest }: any) =>
      React.createElement(
        RN.TouchableOpacity,
        { onPress, testID: `button-${title}` },
        React.createElement(RN.Text, null, title),
      ),
  };
});

jest.mock('@assets/png/vector-18.png', () => 'mock-vector-18');
jest.mock('@routes/app.routes', () => ({}));

// Spy on StatusBar
jest.spyOn(StatusBar, 'setBarStyle');

import { GlobalUploadBottomSheet } from './GlobalUploadBottomSheet';

describe('GlobalUploadBottomSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsBottomSheetOpen = false;
    mockIsLoadingUploadContext = false;
    mockWithError = false;
    mockWithSuccess = false;
    mockCameraIsOpen = false;
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<GlobalUploadBottomSheet />);
    expect(toJSON).toBeDefined();
  });

  it('does not show actionsheet when bottomSheet is closed and no error', () => {
    mockIsBottomSheetOpen = false;
    mockWithError = false;
    const { queryByTestId } = render(<GlobalUploadBottomSheet />);
    expect(queryByTestId('actionsheet')).toBeNull();
  });

  it('shows actionsheet when bottomSheet is open', () => {
    mockIsBottomSheetOpen = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    expect(getByTestId('actionsheet')).toBeTruthy();
  });

  it('shows actionsheet when there is an error', () => {
    mockWithError = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    expect(getByTestId('actionsheet')).toBeTruthy();
  });

  it('shows UploadType when bottomSheet is open without error', () => {
    mockIsBottomSheetOpen = true;
    mockWithError = false;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    expect(getByTestId('upload-type')).toBeTruthy();
  });

  it('shows error UI when withError is true', () => {
    mockWithError = true;
    const { getByText } = render(<GlobalUploadBottomSheet />);
    expect(getByText('Xiii, deu ruim! :(')).toBeTruthy();
    expect(getByText(/Seu exame não foi processado/)).toBeTruthy();
  });

  it('shows "Tentar novamente" button in error state', () => {
    mockWithError = true;
    const { getByText } = render(<GlobalUploadBottomSheet />);
    expect(getByText('Tentar novamente')).toBeTruthy();
  });

  it('calls setWithError(false) when "Tentar novamente" is pressed', () => {
    mockWithError = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    fireEvent.press(getByTestId('button-Tentar novamente'));
    expect(mockSetWithError).toHaveBeenCalledWith(false);
  });

  it('shows loading modal when isLoadingUploadContext is true', () => {
    mockIsLoadingUploadContext = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    expect(getByTestId('loading-component')).toBeTruthy();
  });

  it('does not show loading modal when isLoadingUploadContext is false', () => {
    mockIsLoadingUploadContext = false;
    const { queryByTestId } = render(<GlobalUploadBottomSheet />);
    expect(queryByTestId('loading-component')).toBeNull();
  });

  it('shows success modal when withSuccess is true', () => {
    mockWithSuccess = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    expect(getByTestId('score-warning')).toBeTruthy();
  });

  it('does not show success modal when withSuccess is false', () => {
    mockWithSuccess = false;
    const { queryByTestId } = render(<GlobalUploadBottomSheet />);
    expect(queryByTestId('score-warning')).toBeNull();
  });

  it('calls setWithSuccess(false) and showTabBar when success modal is closed', () => {
    mockWithSuccess = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    fireEvent.press(getByTestId('score-warning-close'));
    expect(mockSetWithSuccess).toHaveBeenCalledWith(false);
    expect(mockShowTabBar).toHaveBeenCalled();
    expect(StatusBar.setBarStyle).toHaveBeenCalledWith('dark-content');
  });

  it('closes bottomSheet and hides tab bar when loading starts', () => {
    mockIsLoadingUploadContext = true;
    render(<GlobalUploadBottomSheet />);
    expect(mockCloseBottomSheet).toHaveBeenCalled();
    expect(mockHideTabBar).toHaveBeenCalled();
    expect(StatusBar.setBarStyle).toHaveBeenCalledWith('light-content');
  });

  it('resets StatusBar to dark-content when loading stops', () => {
    mockIsLoadingUploadContext = false;
    render(<GlobalUploadBottomSheet />);
    expect(StatusBar.setBarStyle).toHaveBeenCalledWith('dark-content');
  });

  it('hides tab bar when withError is true', () => {
    mockWithError = true;
    render(<GlobalUploadBottomSheet />);
    expect(mockHideTabBar).toHaveBeenCalled();
  });

  it('hides tab bar when withSuccess is true', () => {
    mockWithSuccess = true;
    render(<GlobalUploadBottomSheet />);
    expect(mockHideTabBar).toHaveBeenCalled();
  });

  it('calls handleBottomSheetClose which resets error and closes bottomSheet', () => {
    mockIsBottomSheetOpen = true;
    mockWithError = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    fireEvent.press(getByTestId('actionsheet-close-trigger'));
    expect(mockSetWithError).toHaveBeenCalledWith(false);
    expect(mockCloseBottomSheet).toHaveBeenCalled();
    expect(StatusBar.setBarStyle).toHaveBeenCalledWith('dark-content');
  });

  it('calls handleBottomSheetClose without resetting error when no error', () => {
    mockIsBottomSheetOpen = true;
    mockWithError = false;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    fireEvent.press(getByTestId('actionsheet-close-trigger'));
    expect(mockSetWithError).not.toHaveBeenCalled();
    expect(mockCloseBottomSheet).toHaveBeenCalled();
  });

  it('calls handleCameraOpen which closes bottomSheet and opens camera', () => {
    mockIsBottomSheetOpen = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    fireEvent.press(getByTestId('camera-open-button'));
    expect(mockCloseBottomSheet).toHaveBeenCalled();
    expect(mockCameraOnOpen).toHaveBeenCalled();
    expect(mockHideTabBar).toHaveBeenCalled();
  });

  it('does not show camera component when camera is closed', () => {
    mockCameraIsOpen = false;
    mockIsBottomSheetOpen = true;
    const { queryByTestId } = render(<GlobalUploadBottomSheet />);
    expect(queryByTestId('upload-camera')).toBeNull();
  });

  it('renders error image in error state', () => {
    mockWithError = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    expect(getByTestId('actionsheet-content')).toBeTruthy();
  });

  it('renders all three sections: actionsheet, camera, and modals', () => {
    mockIsBottomSheetOpen = true;
    mockIsLoadingUploadContext = true;
    mockWithSuccess = true;
    const { getByTestId } = render(<GlobalUploadBottomSheet />);
    expect(getByTestId('actionsheet')).toBeTruthy();
    expect(getByTestId('loading-component')).toBeTruthy();
    expect(getByTestId('score-warning')).toBeTruthy();
  });
});
