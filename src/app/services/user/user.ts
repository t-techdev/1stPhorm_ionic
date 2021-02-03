import {
  ActiveLevelTypes,
  CameraPhotos,
  CustomMacro,
  LinkApplication,
  NutritionPlan,
  PreferenceMacroCounting,
  ProgramTypes,
  Sex,
  Trainer,
  TrainingLevelsTypes,
  TransphormationGoalTypes,
  Transphormer as TransphormerInterface,
  Units,
  UnitTypes,
  Weight,
  WorkoutSession
} from '../../interfaces';

export class Transphormer implements TransphormerInterface {
  access_to_gym: '1' | '0';
  activity_level: ActiveLevelTypes;
  age: number;
  created_at: string;
  custom_macros: CustomMacro | null;
  date_of_birth: string;
  display_name: string;
  dob: string;
  email: string;
  first_image_date: string | false | null;
  first_name: string;
  goal_weight: number;
  goal_weight_unit: UnitTypes;
  goal_weight_units: Units;
  gym_workout_selection: ProgramTypes;
  height: number;
  home_workout_selection: any;
  id: number;
  is_paid_user: boolean;
  is_trainer: boolean;
  last_name: string;
  last_two_month_updates: CameraPhotos[];
  latest_image: CameraPhotos | null;
  latest_weight: Weight;
  latest_weight_diff: number;
  latest_workout: WorkoutSession | null;
  likely_to_do: NutritionPlan;
  linked_trainer: LinkApplication | null | undefined;
  meals_per_day: 3 | 4 | 5;
  preference_macro_counting: PreferenceMacroCounting | null;
  profile_complete: boolean;
  profile_picture_url: string;
  sex: Sex;
  starting_weight: Weight;
  trainer: Trainer | null;
  training_level: TrainingLevelsTypes;
  transphormation_goal: TransphormationGoalTypes;
  unit_type: UnitTypes;
  weight: number;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  instagram: string;
  twitter: string;

  constructor(user: TransphormerInterface) {

  }

}
