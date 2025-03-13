import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ReactNode, createContext, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';

import { api } from 'src/services/api';

type homeProps = {
  score: number;
  systems: {
    hwal_id: number;
    code: string;
    description: string;
    color: string;
  }[];
};

type trackerProps = {
  kcal: {
    calculation_date: string;
    kcal_completed: string;
    kcal_goal: string | null;
  }[];
  step: {
    calculation_date: string;
    step_completed: string;
    step_goal: string;
    distance_completed: string;
    distance_goal: string;
    hour_completed: string;
    hour_goal: string;
  }[];
  weight: {
    calculation_date: string;
    weight_completed: string;
    weight_goal: null;
  }[];
  hydration: {
    calculation_date: string;
    hydration_completed: string;
    hydration_goal: string;
  }[];
  nutrition: {
    calculation_date: string;
    nutrition_completed: any;
  }[];
  sleep: {
    calculation_date: string;
    sleep_completed: string;
    sleep_goal: string;
  }[];
};

type specificSystemProps = {
  sistema: string;
  nivel: string;
} | null;

export type HomeContextDataProps = {
  homeData: homeProps;
  getHomeData: () => void;
  isLoading: boolean;
  trackerData: trackerProps;
  currentSystem: specificSystemProps;
  setCurrentSystem: (val: specificSystemProps) => void;
};

type HomeContextProviderProps = {
  children: ReactNode;
};

export const HomeContext = createContext<HomeContextDataProps>({} as HomeContextDataProps);

export function HomeContextProvider({ children }: HomeContextProviderProps) {
  const [homeData, setHomeData] = useState<homeProps>({} as homeProps);
  const [trackerData, setTrackerData] = useState<trackerProps>({} as trackerProps);
  const [currentSystem, setCurrentSystem] = useState<specificSystemProps>({} as specificSystemProps);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth();

  async function getHomeData() {
    setIsLoading(true);
    try {
      const responseScore = await api.get('/health-wallet/list', { headers: { email: user.email } });

      const dataScore = responseScore.data.data;

      if (dataScore.detail) {
        setHomeData(dataScore.detail);
      }

      const responseTracker = await api.get('/fitness-tracker/list', {
        headers: { email: user.email, start_date: '2023-11-19', end_date: '2023-11-21' },
      });

      const dataTracker = responseTracker.data.data;

      if (dataTracker.detail) {
        setTrackerData(dataTracker.detail);
      }
    } catch (error) {
      throw error;
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <HomeContext.Provider
      value={{
        homeData,
        getHomeData,
        isLoading,
        trackerData,
        currentSystem,
        setCurrentSystem,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
