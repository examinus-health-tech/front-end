import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { Gender } from '@screens/Gender/gender';
import { Weight } from '@screens/Weight/weight';
import { Age } from '@screens/Age/age';
import { Physical } from '@screens/Physical/physical';
import { Humour } from '@screens/Humour/humour';
import { Habits } from '@screens/Habits/habits';
import { Upload } from '@screens/Upload/upload';
import { Score } from '@screens/Score/score';
import { Homepage } from '@screens/Homepage/homepage';

// settings screens
import { MyAccount } from '@screens/Settings/screens/myAccount/myAccount';
import { ConfigNotifications } from '@screens/Settings/screens/notifications/notifications';
import { Info } from '@screens/Settings/screens/info/info';
import { Security } from '@screens/Settings/screens/security/security';
import { ContactUs } from '@screens/Settings/screens/contactUs/contactUs';
import { AboutUs } from '@screens/Settings/screens/aboutUs/aboutUs';
import { Notifications } from '@screens/Notifications/screens/notifications/notifications';

export type AppRoutes = {
  gender: undefined;
  weight: undefined;
  age: undefined;
  upload: undefined;
  physical: undefined;
  humour: undefined;
  habits: undefined;
  score: undefined;
  homepage: undefined;
  myAccount: undefined;
  notifications: undefined;
  info: undefined;
  security: undefined;
  contactUs: undefined;
  aboutUs: undefined;
  configNotifications: undefined;
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {/* <Screen name="gender" component={Gender} />
      <Screen name="weight" component={Weight} />
      <Screen name="age" component={Age} />
      <Screen name="physical" component={Physical} />
      <Screen name="humour" component={Humour} />
      <Screen name="habits" component={Habits} />
      <Screen name="upload" component={Upload} />
      <Screen name="score" component={Score} />
      <Screen name="homepage" component={Homepage} />
      <Screen name="myAccount" component={MyAccount} />
      <Screen name="configNotifications" component={ConfigNotifications} />
      <Screen name="info" component={Info} />
      <Screen name="security" component={Security} /> */}
      <Screen name="contactUs" component={ContactUs} />
      {/* <Screen name="aboutUs" component={AboutUs} /> */}
      <Screen name="notifications" component={Notifications} />
    </Navigator>
  );
}
