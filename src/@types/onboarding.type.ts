export interface OnboardingProps {
  age?: number;
  gender?: 'M' | 'F';
  weight?: number;
  physicalLevel?: number;
  humor?: number;
  eatingHabits?: number;
  email: string;
}

export type stepListProps = 'gender' | 'weight' | 'age' | 'physical' | 'habits' | 'upload' | 'error' | 'score';

export interface stepProps {
  progress?: number;
  currentStep: stepListProps;
  nextStep?: stepListProps;
  previousStep?: stepListProps;
}
