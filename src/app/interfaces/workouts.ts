import { UnitTypes } from './unit-types.enum';
import { Units } from './unit-type';
import { NutritionPlan } from './nutrition';
import { Tag } from '../services/excercise/exercise.service';
import { Moment } from 'moment';

export enum Sex {
  Male = '1',
  Female = '2'
}

export type NutritionValues = 'Macro meal plan' | 'Calorie / Macro counting' | 'Portion control';

export interface PersonalInfo {
  height: number;
  weight: number;
  sex: Sex;
  goal_weight: number;
  goal_weight_unit: UnitTypes;
  goal_weight_units: Units;
  date_of_birth: string;
  first_name?: string;
  last_name?: string;
  unit_type: UnitTypes;
  transphormation_goal?: TransphormationGoalTypes;
}

export interface BaseInfo {
  training_level: TrainingLevelsTypes;
  gym_workout_selection: ProgramTypes;
  home_workout_selection?: any; // @todo remove!!
  transphormation_goal?: TransphormationGoalTypes;
  access_to_gym: '1' | '0';
  activity_level: ActiveLevelTypes;
  likely_to_do: NutritionPlan;
  meals_per_day: 3 | 4 | 5;
  preference_macro_counting?: PreferenceMacroCounting;
}

export interface ContactInfo {
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  instagram: string;
  twitter: string;
}

export interface OnBoarding extends PersonalInfo, BaseInfo, ContactInfo {
}

export enum TrainingLevel {
  Beginner = 3,
  Intermediate = 1,
  Advanced = 2,
}

export const TrainingLevels = [
  {
    name: 'Beginner',
    value: TrainingLevel.Beginner,
  },
  {
    name: 'Intermediate',
    value: TrainingLevel.Intermediate,
  },
  {
    name: 'Advanced',
    value: TrainingLevel.Advanced,
  },
];
export type TrainingLevelsTypes = number;
export type ProgramTypes = number;
export type PreferenceMacroCounting = 'Carbs' | 'Fats' | 'Both';

export enum Goal {
  Lose = 'Primarily lose bodyfat',
  Maintain = 'Maintain',
  Gain = 'Gain lean muscle',
}

export const TransphormationGoal: TransphormationGoalTypes[] = [
  Goal.Lose,
  Goal.Maintain,
  Goal.Gain
];
export const TrainingProgramTypes = [
  {
    name: 'EMOM',
    value: 1
  },
  {
    name: 'Traditional',
    value: 2
  },
  {
    name: 'Cross Training',
    value: 3
  },
  {
    name: 'Weight loss',
    value: 4
  },
  {
    name: 'Strength Training',
    value: 9
  },
];

export const AtHomeWorkoutTypes = [
  {
    name: 'No equipment',
    value: 5
  },
  {
    name: 'Dumbbells, Kettlebells, and/or bands',
    value: 6
  },
];

export type TransphormationGoalTypes =
  Goal.Lose
  | Goal.Maintain
  | Goal.Gain;
export const ActiveLevels = [
  'Sedentary',
  'Light Activity',
  'Very Active'
];
export type ActiveLevelTypes =
  | 'Sedentary'
  | 'Light Activity'
  | 'Very Active';

export interface WorkoutSession {
  id: number;
  workout_id: number;
  transphormer_id: number;
  completed: boolean;
  switched_to_home: boolean;
  workout_data?: WorkoutExerciseData[] | null;
  workout?: Workout;
  notes: WorkoutNote | null;
  workout_date: string;
  session_exercises: WorkoutSessionExercise[];
}

export interface WorkoutExerciseData {
  exercise_group_id: number;
  exercise_id: number;
  workout_session_id: number;
  workout_info: WorkoutInfo[] | null;
  logged_on: string | null;
  completed_on: string | null;
}

export interface WorkoutInfo {
  reps?: number | null;
  weight: number | null;
}

export interface Workout {
  id: number;
  training_id: number;
  workout_date: string;
  is_rest_day?: number;
  name?: string;
  week: number;
  day: number;
  exercise_groups: WorkoutGroup[];
  training?: Training;
}

export interface WorkoutGroup {
  id: number;
  workout_id: number;
  exercise_group_template_id?: number;
  name?: string;
  instructions?: string;
  group_time?: number;
  total_sets?: number;
  repeat?: number;
  order_number: number;
  created_at: string;
  updated_at: string;
  exercises: WorkoutExercise[];
}

export interface Training {
  id: number;
  program_type: string;
  training_level: string;
  subscription_type: string;
  description?: string;
  start_date: string;
  end_date: string;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  modification_notes: string;
  video: string;
  video_url: string;
  link?: string;
  description: string;
  isEditing?: boolean;
  tags?: Tag[];
  alternate_exercises?: Exercise[];
}

export interface WorkoutExercise {
  id: number;
  exercise_group_id: number;
  exercise_group_template_exercise_id?: number;
  exercise_id: number;
  total_sets: null;
  record_type?: number;
  instructions?: string;
  order_number: number;
  created_at: string;
  updated_at: string;
  time_period: number;
  name: string;
  exercise: Exercise;
  last_exercise_records?: string;
}

export interface WorkoutExercisePivot extends Exercise {
  pivot: {
    instructions: string;
    record_type: ExerciseTypes;
    id: number;
    total_reps: number | null;
  };
}

export interface WorkoutNote {
  id: number;
  transphormer_id: number;
  workout_session_id: number;
  notes: string;
}

export type ExerciseTypes = 'Weight' | 'Weight and Reps' | 'Nothing';

export interface WorkoutSessionExercise {
  id: number;
  workout_session_id: number;
  exercise_id: number;
  exercise_group_id: number;
  set: number;
  reps: number | null;
  weight: number | null;
}

export interface WorkoutSessionExerciseHistory {
  workout_date: string | Moment;
  workout_session_exercises: WorkoutSessionExercise[];
}
