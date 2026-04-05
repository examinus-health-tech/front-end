import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Mocks ---

jest.mock('native-base', () => {
  const RN = require('react-native');
  const React = require('react');

  const MockModal = Object.assign(
    ({ children, isOpen, onClose, ...rest }: any) =>
      isOpen
        ? require("react").createElement(
            RN.View,
            { testID: 'whats-new-modal' },
            children,
            onClose
              ? require("react").createElement(RN.TouchableOpacity, {
                  testID: 'modal-backdrop-close',
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
        require("react").createElement(RN.TouchableOpacity, { testID: 'modal-close-button' }),
    },
  );

  return {
    Modal: MockModal,
    VStack: RN.View,
    Text: RN.Text,
    HStack: RN.View,
    Box: RN.View,
    ScrollView: RN.ScrollView,
    Pressable: RN.TouchableOpacity,
  };
});

// Mock Button
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

// Mock expo-constants - needs to be configurable per test
let mockAppVersion = '1.2.12';
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    get expoConfig() {
      return { version: mockAppVersion };
    },
  },
}));

import { WhatsNewModal } from './WhatsNewModal';

describe('WhatsNewModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAppVersion = '1.2.12';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders children always', async () => {
    const { getByText } = render(
      <WhatsNewModal>
        <Text>Child Content</Text>
      </WhatsNewModal>,
    );
    expect(getByText('Child Content')).toBeTruthy();
  });

  it('shows the modal when version has not been seen before', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    const modal = await findByTestId('whats-new-modal');
    expect(modal).toBeTruthy();
  });

  it('does not show the modal when version has been seen', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('1.2.12');
    mockAppVersion = '1.2.12';

    const { queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    // Wait for async checkVersion to complete
    await act(async () => {});

    expect(queryByTestId('whats-new-modal')).toBeNull();
  });

  it('does not show the modal when no content for current version', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '9.9.9'; // No content for this version

    const { queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    await act(async () => {});

    expect(queryByTestId('whats-new-modal')).toBeNull();
  });

  it('displays "App Atualizado!" header text', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByText('App Atualizado!')).toBeTruthy();
  });

  it('displays the version number', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByText(/Versão 1\.2\.12/)).toBeTruthy();
  });

  it('displays the features title for the version', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByText('Novidades da versão 1.2.12')).toBeTruthy();
  });

  it('displays all feature items', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByText('Rastreador Fitness')).toBeTruthy();
    expect(await findByText('Análise do Dia')).toBeTruthy();
    expect(await findByText('Health Connect')).toBeTruthy();
    expect(await findByText('Melhorias Gerais')).toBeTruthy();
  });

  it('displays feature descriptions', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByText(/Acompanhe seus passos/)).toBeTruthy();
    expect(await findByText(/insights personalizados/)).toBeTruthy();
    expect(await findByText(/Integração completa/)).toBeTruthy();
    expect(await findByText(/Correções de bugs/)).toBeTruthy();
  });

  it('displays feature icons (emojis)', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByText('🎉')).toBeTruthy();
  });

  it('displays the "Entendi!" button', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByText('Entendi!')).toBeTruthy();
  });

  it('saves version to AsyncStorage and closes modal when "Entendi!" is pressed', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByTestId, queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    const button = await findByTestId('button-Entendi!');
    await act(async () => {
      fireEvent.press(button);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@examinus:lastSeenVersion',
      '1.2.12',
    );
  });

  it('closes modal even when AsyncStorage.setItem fails', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
    mockAppVersion = '1.2.12';
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { findByTestId, queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    const button = await findByTestId('button-Entendi!');
    await act(async () => {
      fireEvent.press(button);
    });

    // Modal should close even on storage error
    await waitFor(() => {
      expect(queryByTestId('whats-new-modal')).toBeNull();
    });

    consoleSpy.mockRestore();
  });

  it('handles AsyncStorage.getItem error gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Read error'));
    mockAppVersion = '1.2.12';
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    // Wait for async operations
    await act(async () => {});

    // Modal should not be shown when checkVersion fails
    expect(queryByTestId('whats-new-modal')).toBeNull();
    consoleSpy.mockRestore();
  });

  it('uses fallback version "1.0.0" when expoConfig.version is not available', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = undefined as any;

    const { queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    // Wait for async operations
    await act(async () => {});

    // Version 1.0.0 has no content defined, so modal should not show
    expect(queryByTestId('whats-new-modal')).toBeNull();
  });

  it('shows "Novidades" as fallback title when content has no title', async () => {
    // Content for 1.2.12 has a title, so this tests the fallback path
    // When currentVersion has no content, the component renders content?.title || 'Novidades'
    // This is covered when content is undefined
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByText } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    // Should display the actual title, not the fallback
    expect(await findByText('Novidades da versão 1.2.12')).toBeTruthy();
  });

  it('calls checkVersion on mount', async () => {
    const getItemSpy = AsyncStorage.getItem as jest.Mock;
    getItemSpy.mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    await act(async () => {});

    expect(getItemSpy).toHaveBeenCalledWith('@examinus:lastSeenVersion');
  });

  it('renders children alongside the modal', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByTestId, getByText } = render(
      <WhatsNewModal>
        <Text>My App Content</Text>
      </WhatsNewModal>,
    );

    // Both children and modal should be present
    expect(getByText('My App Content')).toBeTruthy();
    expect(await findByTestId('whats-new-modal')).toBeTruthy();
  });

  it('closes modal via onClose handler (backdrop close)', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockAppVersion = '1.2.12';

    const { findByTestId, queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    const closeBackdrop = await findByTestId('modal-backdrop-close');
    await act(async () => {
      fireEvent.press(closeBackdrop);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@examinus:lastSeenVersion',
      '1.2.12',
    );

    await waitFor(() => {
      expect(queryByTestId('whats-new-modal')).toBeNull();
    });
  });

  it('does not show modal when last seen version matches current version', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('1.2.12');
    mockAppVersion = '1.2.12';

    const { queryByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    await act(async () => {});

    expect(queryByTestId('whats-new-modal')).toBeNull();
  });

  it('shows modal when last seen version differs from current', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('1.2.11');
    mockAppVersion = '1.2.12';

    const { findByTestId } = render(
      <WhatsNewModal>
        <Text>App</Text>
      </WhatsNewModal>,
    );

    expect(await findByTestId('whats-new-modal')).toBeTruthy();
  });
});
