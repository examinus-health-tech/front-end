import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { SignIn } from '@screens/SingIn/singIn';
import { SignUp } from '@screens/SingUp/singUp';
import { StepFour } from '@screens/Welcome/components/Steps/stepFour';
import { StepOne } from '@screens/Welcome/components/Steps/stepOne';
import { StepThree } from '@screens/Welcome/components/Steps/stepThree';
import { StepTwo } from '@screens/Welcome/components/Steps/stepTwo';

type AuthRoutes = {
  stepOne: undefined;
  stepTwo: undefined;
  stepThree: undefined;
  stepFour: undefined;
  signIn: undefined;
  signUp: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="stepOne" component={StepOne} />
      <Screen name="stepTwo" component={StepTwo} />
      <Screen name="stepThree" component={StepThree} />
      <Screen name="stepFour" component={StepFour} />
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  );
}
