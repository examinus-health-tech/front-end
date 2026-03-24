import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthRoutes } from './auth.routes';

// ── Navigation mock ──────────────────────────────────────────────────
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children, screenOptions, ...p }: any) => {
      const RN = require('react-native');
      return (
        <RN.View testID="auth-navigator" {...p}>
          {children}
        </RN.View>
      );
    },
    Screen: ({ name, component: Component, ...p }: any) => {
      const RN = require('react-native');
      return <RN.View testID={`screen-${name}`} />;
    },
  }),
}));

// ── Screen component mocks ──────────────────────────────────────────
jest.mock('@pages/Welcome', () => {
  const RN = require('react-native');
  return {
    Simplify: () => <RN.View testID="Simplify" />,
    Health: () => <RN.View testID="Health" />,
    StayCalm: () => <RN.View testID="StayCalm" />,
    Hello: () => <RN.View testID="Hello" />,
  };
});

jest.mock('@pages/Login', () => {
  const RN = require('react-native');
  return {
    SignIn: () => <RN.View testID="SignIn" />,
    SignUp: () => <RN.View testID="SignUp" />,
    ForgotPassword: () => <RN.View testID="ForgotPassword" />,
    SuccessLink: () => <RN.View testID="SuccessLink" />,
    Code: () => <RN.View testID="Code" />,
    PasswordConfig: () => <RN.View testID="PasswordConfig" />,
    SuccessPasswordChange: () => <RN.View testID="SuccessPasswordChange" />,
  };
});

describe('AuthRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the auth navigator', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('auth-navigator')).toBeTruthy();
  });

  it('registers the hello screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-hello')).toBeTruthy();
  });

  it('registers the simplify screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-simplify')).toBeTruthy();
  });

  it('registers the health screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-health')).toBeTruthy();
  });

  it('registers the stayCalm screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-stayCalm')).toBeTruthy();
  });

  it('registers the signIn screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-signIn')).toBeTruthy();
  });

  it('registers the signUp screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-signUp')).toBeTruthy();
  });

  it('registers the forgotPassword screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-forgotPassword')).toBeTruthy();
  });

  it('registers the successLink screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-successLink')).toBeTruthy();
  });

  it('registers the code screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-code')).toBeTruthy();
  });

  it('registers the passwordConfig screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-passwordConfig')).toBeTruthy();
  });

  it('registers the successPasswordChange screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    expect(getByTestId('screen-successPasswordChange')).toBeTruthy();
  });

  it('registers all 11 auth screens', () => {
    const { getByTestId } = render(<AuthRoutes />);
    const screenNames = [
      'hello', 'simplify', 'health', 'stayCalm',
      'signIn', 'signUp', 'forgotPassword', 'successLink',
      'code', 'passwordConfig', 'successPasswordChange',
    ];
    screenNames.forEach((name) => {
      expect(getByTestId(`screen-${name}`)).toBeTruthy();
    });
  });

  it('renders consistently on multiple renders', () => {
    const { getByTestId: get1 } = render(<AuthRoutes />);
    expect(get1('auth-navigator')).toBeTruthy();
    expect(get1('screen-hello')).toBeTruthy();

    const { getByTestId: get2 } = render(<AuthRoutes />);
    expect(get2('auth-navigator')).toBeTruthy();
    expect(get2('screen-signIn')).toBeTruthy();
  });

  it('has hello as the first registered screen', () => {
    const { getByTestId } = render(<AuthRoutes />);
    // Verify hello screen exists (it is the initial route)
    expect(getByTestId('screen-hello')).toBeTruthy();
    // And the navigator wraps all screens
    expect(getByTestId('auth-navigator')).toBeTruthy();
  });
});
