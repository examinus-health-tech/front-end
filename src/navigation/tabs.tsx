import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Homepage } from '@components/pages/Homepage/Homepage/homepage';

const { Screen } = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <>
      <Screen name="Homepage" component={Homepage} />
      <Screen name="Homepage1" component={Homepage} />
      <Screen name="Homepage2" component={Homepage} />
      <Screen name="Homepage3" component={Homepage} />
      <Screen name="Homepage4" component={Homepage} />
    </>
  );
};
