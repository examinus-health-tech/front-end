export interface OnboardingProps {
  age?: number;
  gender?: 'M' | 'F';
  weight?: number;
  height?: number;
  physicalLevel?: number;
  workoutLevel?: number;
  humor?: number;
  eatingHabits?: string;
}

export type stepListProps =
  | 'gender'
  | 'weight'
  | 'height'
  | 'age'
  | 'physical'
  | 'humour'
  | 'habits'
  | 'upload'
  | 'error'
  | 'score';

export interface stepProps {
  progress?: number;
  currentStep: stepListProps;
  nextStep?: stepListProps;
  previousStep?: stepListProps;
}
