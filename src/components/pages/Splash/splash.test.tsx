import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Splash } from './splash';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    View: ({ children, ...props }: any) => <RN.View {...props}>{children}</RN.View>,
    Image: ({ alt, ...props }: any) => <RN.View testID="splash-image" {...props} />,
  };
});

// ── expo-video mock ──
const mockPlay = jest.fn();
const mockAddListener = jest.fn().mockReturnValue({ remove: jest.fn() });

jest.mock('expo-video', () => {
  const RN = require('react-native');
  return {
    useVideoPlayer: (source: any, callback: any) => {
      const player = {
        loop: false,
        muted: false,
        play: mockPlay,
        addListener: mockAddListener,
      };
      // Execute the callback to initialize the player
      if (callback) {
        callback(player);
      }
      return player;
    },
    VideoView: ({ player, ...props }: any) => (
      <RN.View testID="video-view" {...props} />
    ),
  };
});

// ── Asset mocks ──
jest.mock('../../../assets/splash.mp4', () => 'mocked-splash-video');
jest.mock('../../../../assets/splash.png', () => 'mocked-splash-image');

describe('Splash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS for each test
    jest.resetModules();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<Splash />);
    expect(getByTestId('video-view')).toBeTruthy();
  });

  it('renders the VideoView component', () => {
    const { getByTestId } = render(<Splash />);
    const videoView = getByTestId('video-view');
    expect(videoView).toBeTruthy();
  });

  it('initializes the video player and calls play', () => {
    render(<Splash />);
    expect(mockPlay).toHaveBeenCalled();
  });

  it('sets up status change listener on the player', () => {
    render(<Splash />);
    expect(mockAddListener).toHaveBeenCalledWith('statusChange', expect.any(Function));
  });

  it('shows fallback image when video has error', async () => {
    // Simulate the error by triggering the status listener
    mockAddListener.mockImplementation((event: string, callback: Function) => {
      if (event === 'statusChange') {
        // Immediately call the callback with an error status
        setTimeout(() => callback({ status: 'error' }), 0);
      }
      return { remove: jest.fn() };
    });

    const { getByTestId } = render(<Splash />);

    await waitFor(() => {
      expect(getByTestId('splash-image')).toBeTruthy();
    });
  });

  it('cleans up the listener on unmount', () => {
    const mockRemove = jest.fn();
    mockAddListener.mockReturnValue({ remove: mockRemove });

    const { unmount } = render(<Splash />);
    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });
});
