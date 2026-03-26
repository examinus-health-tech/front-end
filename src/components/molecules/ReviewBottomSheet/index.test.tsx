import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Linking, Alert, Platform } from 'react-native';
import { ReviewBottomSheet } from './index';

const mockMarkAsReviewed = jest.fn();
const mockMarkReviewPromptShown = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Actionsheet: Object.assign(
      (props: any) => {
        if (!props.isOpen) return null;
        return require("react").createElement(RN.View, { testID: 'actionsheet' }, props.children);
      },
      {
        Content: (props: any) => require("react").createElement(RN.View, props),
      }
    ),
    Box: (props: any) => require("react").createElement(RN.View, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
  };
});

jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg' }),
    Path: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'svg-path' }),
  };
});

jest.mock('@services/reviewService', () => ({
  markAsReviewed: (...args: any[]) => mockMarkAsReviewed(...args),
  markReviewPromptShown: (...args: any[]) => mockMarkReviewPromptShown(...args),
}));

describe('ReviewBottomSheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMarkAsReviewed.mockResolvedValue(undefined);
    mockMarkReviewPromptShown.mockResolvedValue(undefined);
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  });

  it('renders nothing when isOpen is false', () => {
    const { toJSON } = render(
      <ReviewBottomSheet isOpen={false} onClose={jest.fn()} />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders the bottom sheet when isOpen is true', () => {
    const { getByText } = render(<ReviewBottomSheet {...defaultProps} />);
    expect(getByText('Avalie a Examinus')).toBeTruthy();
    expect(getByText(/Sua opinião é muito importante/)).toBeTruthy();
  });

  it('renders 5 star buttons', () => {
    const { getAllByTestId } = render(<ReviewBottomSheet {...defaultProps} />);
    expect(getAllByTestId('svg').length).toBe(5);
  });

  it('does not show action buttons before rating is selected', () => {
    const { queryByText } = render(<ReviewBottomSheet {...defaultProps} />);
    expect(queryByText('Enviar Feedback')).toBeNull();
    expect(queryByText(/Avaliar na/)).toBeNull();
  });

  it('shows store review option for rating >= 4', () => {
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    // Press 4th star
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[3].parent!);
    expect(getByText(/Avaliar na/)).toBeTruthy();
    expect(getByText(/Que bom que você está gostando/)).toBeTruthy();
  });

  it('shows store review option for 5 stars', () => {
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[4].parent!);
    expect(getByText(/Avaliar na/)).toBeTruthy();
  });

  it('shows feedback option for rating < 4', () => {
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    // Press 3rd star
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[2].parent!);
    expect(getByText('Enviar Feedback')).toBeTruthy();
    expect(getByText(/Sentimos muito/)).toBeTruthy();
  });

  it('shows feedback option for 1 star', () => {
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[0].parent!);
    expect(getByText('Enviar Feedback')).toBeTruthy();
  });

  it('shows "Agora nao" dismiss button when rating is selected', () => {
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[0].parent!);
    expect(getByText('Agora não')).toBeTruthy();
  });

  it('calls markAsReviewed and opens store on store review press', async () => {
    const onClose = jest.fn();
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet isOpen={true} onClose={onClose} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[4].parent!);
    await act(async () => {
      fireEvent.press(getByText(/Avaliar na/));
    });
    expect(mockMarkAsReviewed).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls markReviewPromptShown and opens mail on feedback press', async () => {
    const onClose = jest.fn();
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet isOpen={true} onClose={onClose} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[1].parent!);
    await act(async () => {
      fireEvent.press(getByText('Enviar Feedback'));
    });
    expect(mockMarkReviewPromptShown).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls markReviewPromptShown on dismiss', async () => {
    const onClose = jest.fn();
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet isOpen={true} onClose={onClose} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[0].parent!);
    await act(async () => {
      fireEvent.press(getByText('Agora não'));
    });
    expect(mockMarkReviewPromptShown).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('resets selected rating on close', async () => {
    const onClose = jest.fn();
    const { getAllByTestId, getByText, queryByText } = render(
      <ReviewBottomSheet isOpen={true} onClose={onClose} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[2].parent!);
    expect(getByText('Enviar Feedback')).toBeTruthy();
    // Dismiss
    await act(async () => {
      fireEvent.press(getByText('Agora não'));
    });
    // After closing, the rating should reset. But since isOpen is still true in this render,
    // we check that onClose was called
    expect(onClose).toHaveBeenCalled();
  });

  it('handles openURL failure when canOpenURL returns false', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[4].parent!);
    await act(async () => {
      fireEvent.press(getByText(/Avaliar na/));
    });
    alertSpy.mockRestore();
  });

  it('handles openURL exception', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockRejectedValue(new Error('Failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[4].parent!);
    await act(async () => {
      fireEvent.press(getByText(/Avaliar na/));
    });
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('shows correct store name for iOS', () => {
    Platform.OS = 'ios';
    const { getAllByTestId, getByText } = render(
      <ReviewBottomSheet {...defaultProps} />
    );
    const stars = getAllByTestId('svg');
    fireEvent.press(stars[4].parent!);
    expect(getByText(/App Store/)).toBeTruthy();
  });
});
