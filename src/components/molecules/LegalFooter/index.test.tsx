import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { LegalFooter } from './index';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: RN.View,
    Text: ({ children, onPress, ...rest }: any) => (
      <RN.Text onPress={onPress} {...rest}>{children}</RN.Text>
    ),
    HStack: RN.View,
    VStack: RN.View,
    Pressable: RN.TouchableOpacity,
    Center: RN.View,
    Icon: RN.View,
    Input: RN.TextInput,
    Progress: RN.View,
    useTheme: () => ({ colors: { primary: { 500: '#0CC1AF' } } }),
  };
});

jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true));

describe('LegalFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<LegalFooter />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the introductory text', () => {
    const { getByText } = render(<LegalFooter />);
    expect(getByText(/Ao continuar, você concorda com a nossa/)).toBeTruthy();
  });

  it('renders the privacy policy link text', () => {
    const { getByText } = render(<LegalFooter />);
    expect(getByText('Política de Privacidade')).toBeTruthy();
  });

  it('opens the correct URL when privacy policy is pressed', () => {
    const { getByText } = render(<LegalFooter />);
    const privacyLink = getByText('Política de Privacidade');

    fireEvent.press(privacyLink);

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://examinus-politica-privacidade.vercel.app/privacy-policy'
    );
  });

  it('calls Linking.openURL exactly once on press', () => {
    const { getByText } = render(<LegalFooter />);
    const privacyLink = getByText('Política de Privacidade');

    fireEvent.press(privacyLink);

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
  });

  it('does not call Linking.openURL on initial render', () => {
    render(<LegalFooter />);
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
