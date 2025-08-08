import { ReactNode, createContext, useContext, useState } from 'react';

type TabBarContextDataProps = {
  isTabBarVisible: boolean;
  hideTabBar: () => void;
  showTabBar: () => void;
};

type TabBarContextProviderProps = {
  children: ReactNode;
};

export const TabBarContext = createContext<TabBarContextDataProps>({} as TabBarContextDataProps);

export function TabBarContextProvider({ children }: TabBarContextProviderProps) {
  const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(true);

  function hideTabBar() {
    setIsTabBarVisible(false);
  }

  function showTabBar() {
    setIsTabBarVisible(true);
  }

  return (
    <TabBarContext.Provider value={{
      isTabBarVisible,
      hideTabBar,
      showTabBar,
    }}>
      {children}
    </TabBarContext.Provider>
  );
}

