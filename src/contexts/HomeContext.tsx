import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ReactNode, createContext, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';

import { api } from 'src/services/api';

type homeProps = {
  medicalExamId: string;
  createdDate: string;
  generalScore: number;
  generalScoreActionRecommendation: string;
  medicalExamGender: string;
  medicalExamStatus: string;
  medicalExamItems: {
    examItemDescription: string;
    medicalExamItemReferenceValue: string;
    medicalExamItemMeasureUnit: string;
    medicalExamItemScore: number;
    medicalExamItemWeightSummaryExplanation: string;
    medicalExamItemWeightActionRecommendation: string;
    medicalExamItemWeightColor: string;
    medicalExamItemWeightDescription: string;
  }[];
  medicalExamOrganicSystemsScore: {
    examOrganicSystemId: string;
    examOrganicSystemDescription: string;
    organicSystemScore: number;
    organicSystemScoreSummaryExplanation: string;
    organicSystemScoreActionRecommendation: string;
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
  isLoadingHomeContext: boolean;
  trackerData: trackerProps;
  currentSystem: specificSystemProps;
  setCurrentSystem: (val: specificSystemProps) => void;
  clearHomeData: () => void;
};

type HomeContextProviderProps = {
  children: ReactNode;
};

export const HomeContext = createContext<HomeContextDataProps>({} as HomeContextDataProps);

export function HomeContextProvider({ children }: HomeContextProviderProps) {
  const [homeData, setHomeData] = useState<homeProps>({} as homeProps);
  const [examListData, setExamListData] = useState<homeProps>({} as homeProps);
  const [trackerData, setTrackerData] = useState<trackerProps>({} as trackerProps);
  const [currentSystem, setCurrentSystem] = useState<specificSystemProps>({} as specificSystemProps);
  const [isLoadingHomeContext, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth();

  async function getHomeData() {
    setIsLoading(true);

    try {
      const response = await api.get('medical-exam-scores/get-last-final-result-by-current-user-logged', {
        headers: {
          'Accept': 'application/octet-stream'
        }
      });

      const { data } = response;
      setHomeData(data.data);
    } catch (error: any) {
      // 404 é esperado quando o usuário não tem exames ainda
      if (error.response?.status === 404) {
        setHomeData({} as homeProps);
        return;
      }

      // Para outros erros, loga e não quebra a aplicação
      console.error('❌ [HomeContext] Erro ao buscar dados:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function clearHomeData() {
    console.log('🧹 [HomeContext] Limpando dados da homepage');
    setHomeData({} as homeProps);
    setExamListData({} as homeProps);
    setTrackerData({} as trackerProps);
    setCurrentSystem(null);
  }

  return (
    <HomeContext.Provider
      value={{
        homeData,
        getHomeData,
        isLoadingHomeContext,
        trackerData,
        currentSystem,
        setCurrentSystem,
        clearHomeData,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
