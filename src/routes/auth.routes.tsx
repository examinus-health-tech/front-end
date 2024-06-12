import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { Hello, Simplify, Health, StayCalm } from '@pages/Welcome';
import {
  SignIn,
  SignUp,
  ForgotPassword,
  SuccessLink,
} from '@components/pages/Login';

type AuthRoutes = {
  hello: undefined;
  simplify: undefined;
  health: undefined;
  stayCalm: undefined;
  signIn: undefined;
  signUp: undefined;
  forgotPassword: undefined;
  successLink: undefined;
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
    </Navigator>
  );
}
