import { VStack } from 'native-base';

// routes

// assets

// components
import { HeaderProgress } from '@components/molecules';
import {
  Gender,
  Weight,
  Age,
  Physical,
  Habits,
  Upload,
} from '@components/pages/OnboardingInfo';
import { useOnboarding } from 'src/hooks/useOnboarding';

export function OnboardingSteps() {
  const { step, handlePreviousStep, jumpToUpload, stepsMap } = useOnboarding();

  function handleSteps() {
    const selectedStep = stepsMap[step];

    switch (selectedStep.currentStep) {
      case 'gender': {
        return <Gender />;
      }
      case 'weight': {
        return <Weight />;
      }
      case 'age': {
        return <Age />;
      }
      case 'physical': {
        return <Physical />;
      }
      case 'habits': {
        return <Habits />;
      }
      case 'upload': {
        return <Upload />;
      }
    }
  }

  return (
    <VStack flex={1} space={8} py={24}>
      <HeaderProgress
        progressValue={stepsMap[step].progress}
        {...(stepsMap[step].nextStep && {
          jumpTo: () => jumpToUpload(),
        })}
        {...(stepsMap[step].previousStep && {
          withBackButton: () => handlePreviousStep(),
        })}
      />

      {handleSteps()}
    </VStack>
  );
}
