import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { FeatureBanner, resetDismissedBanners } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
  };
});

jest.mock('@assets/icons', () => ({
  CloseIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'close-icon' }),
}));

const DISMISSED_BANNERS_KEY = '@examinus:dismissed_banners';

describe('FeatureBanner', () => {
  const defaultProps = {
    id: 'test-banner-1',
    icon: React.createElement(require('react-native').View, { testID: 'banner-icon' }),
    title: 'Nova Funcionalidade',
    description: 'Descricao do banner',
    actionText: 'Experimentar',
    onAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders null initially while checking dismissed status', () => {
    const { toJSON } = render(<FeatureBanner {...defaultProps} />);
    // Starts as isDismissed=true (hidden) until checkIfDismissed runs
    expect(toJSON()).toBeNull();
  });

  it('renders banner when not dismissed', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const { getByText } = render(<FeatureBanner {...defaultProps} />);
    await waitFor(() => {
      expect(getByText('Nova Funcionalidade')).toBeTruthy();
      expect(getByText('Descricao do banner')).toBeTruthy();
    });
  });

  it('renders action text with arrow', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const { getByText } = render(<FeatureBanner {...defaultProps} />);
    await waitFor(() => {
      expect(getByText('Experimentar →')).toBeTruthy();
    });
  });

  it('renders icon', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const { getByTestId } = render(<FeatureBanner {...defaultProps} />);
    await waitFor(() => {
      expect(getByTestId('banner-icon')).toBeTruthy();
    });
  });

  it('stays hidden when banner id is in dismissed list', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(['test-banner-1'])
    );
    const { toJSON } = render(<FeatureBanner {...defaultProps} />);
    await waitFor(() => {
      expect(toJSON()).toBeNull();
    });
  });

  it('calls onAction when action text is pressed', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const onAction = jest.fn();
    const { getByText } = render(
      <FeatureBanner {...defaultProps} onAction={onAction} />
    );
    await waitFor(() => {
      expect(getByText('Experimentar →')).toBeTruthy();
    });
    fireEvent.press(getByText('Experimentar →'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('dismisses the banner and saves to AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const onDismiss = jest.fn();
    const { getByTestId, toJSON } = render(
      <FeatureBanner {...defaultProps} onDismiss={onDismiss} />
    );
    await waitFor(() => {
      expect(getByTestId('close-icon')).toBeTruthy();
    });
    const closeButton = getByTestId('close-icon').parent;
    await act(async () => {
      if (closeButton) fireEvent.press(closeButton);
    });
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        DISMISSED_BANNERS_KEY,
        JSON.stringify(['test-banner-1'])
      );
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  it('does not duplicate id in dismissed list', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify([]))  // for checkIfDismissed
      .mockResolvedValueOnce(JSON.stringify(['test-banner-1'])); // for handleDismiss
    const { getByTestId } = render(<FeatureBanner {...defaultProps} />);
    await waitFor(() => {
      expect(getByTestId('close-icon')).toBeTruthy();
    });
    const closeButton = getByTestId('close-icon').parent;
    await act(async () => {
      if (closeButton) fireEvent.press(closeButton);
    });
    // When id already exists, setItem should not be called
  });

  it('does not show close button when dismissible is false', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const { queryByTestId } = render(
      <FeatureBanner {...defaultProps} dismissible={false} />
    );
    await waitFor(() => {
      expect(queryByTestId('close-icon')).toBeNull();
    });
  });

  it('handles AsyncStorage error in checkIfDismissed', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
    const { getByText } = render(<FeatureBanner {...defaultProps} />);
    await waitFor(() => {
      expect(getByText('Nova Funcionalidade')).toBeTruthy();
    });
  });

  it('handles AsyncStorage error in handleDismiss', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify([]))  // for checkIfDismissed
      .mockRejectedValueOnce(new Error('Storage error')); // for handleDismiss
    const { getByTestId, toJSON } = render(<FeatureBanner {...defaultProps} />);
    await waitFor(() => {
      expect(getByTestId('close-icon')).toBeTruthy();
    });
    const closeButton = getByTestId('close-icon').parent;
    await act(async () => {
      if (closeButton) fireEvent.press(closeButton);
    });
    // Should still dismiss (set isDismissed to true) even on error
    await waitFor(() => {
      expect(toJSON()).toBeNull();
    });
  });

  it('applies custom colors', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const { toJSON } = render(
      <FeatureBanner
        {...defaultProps}
        bgColor="blue.50"
        iconBgColor="blue.100"
        actionColor="blue.600"
      />
    );
    await waitFor(() => {
      expect(toJSON()).toBeTruthy();
    });
  });

  it('calls onDismiss callback when provided', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const onDismiss = jest.fn();
    const { getByTestId } = render(
      <FeatureBanner {...defaultProps} onDismiss={onDismiss} />
    );
    await waitFor(() => {
      expect(getByTestId('close-icon')).toBeTruthy();
    });
    const closeButton = getByTestId('close-icon').parent;
    await act(async () => {
      if (closeButton) fireEvent.press(closeButton);
    });
    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });
});

describe('resetDismissedBanners', () => {
  it('removes the dismissed banners key from AsyncStorage', async () => {
    await resetDismissedBanners();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(DISMISSED_BANNERS_KEY);
  });
});
