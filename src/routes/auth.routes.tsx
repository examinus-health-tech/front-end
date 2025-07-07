import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Simplify, Health, StayCalm, Hello } from '@pages/Welcome';
import { SignIn, SignUp, ForgotPassword, SuccessLink, Code, PasswordConfig, SuccessPasswordChange } from '@pages/Login';

type AuthRoutes = {
  hello: undefined;
  simplify: undefined;
  health: undefined;
  stayCalm: undefined;
  signIn: undefined;
  signUp: undefined;
  forgotPassword: undefined;
  successLink: undefined;
  code: undefined;
  passwordConfig: undefined;
  successPasswordChange: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="hello" component={Hello} />
      <Screen name="simplify" component={Simplify} />
      <Screen name="health" component={Health} />
      <Screen name="stayCalm" component={StayCalm} />
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
      <Screen name="forgotPassword" component={ForgotPassword} />
      <Screen name="successLink" component={SuccessLink} />
      <Screen name="code" component={Code} />
      <Screen name="passwordConfig" component={PasswordConfig} />
      <Screen name="successPasswordChange" component={SuccessPasswordChange} />
    </Navigator>
  );
}
