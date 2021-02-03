import { Token } from '../services/base/base.service';
import { OnBoarding, WorkoutSession } from './workouts';
import { CustomMacro } from './nutrition';
import { UnitTypes } from './unit-types.enum';
import { Units } from './unit-type';
import { Moment } from 'moment';

export interface RegisterResponse {
  transphormer: Transphormer;
  token: Token;
}

export type ApplicationStatus = 'waiting' | 'accepted';

export interface LinkApplication {
  id: number;
  trainer_id: number;
  transphormer_id: number;
  status: ApplicationStatus;
  trainer: Trainer;
  transphormer: Transphormer;
}

export interface CameraPhotos {
  picture_front: string;
  picture_back: string;
  picture_side: string;
  transphormer_id: number;
  id: number;
  video_url: string;
  text?: string;
  created_at: string;
}

export interface Weight extends Units {
  weight: number;
  logged_on: Moment | string;
  id: number;
  transphormer_id: number;
  nice_logged_date?: string;
  is_base_weight: boolean;
  unit_type: UnitTypes;
}

export interface Transphormer extends OnBoarding {
  id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  height_in_inches?: string;
  trainer: Trainer | null;
  is_trainer: boolean;
  latest_weight?: Weight;
  starting_weight?: Weight;
  starting_weight_value?: number;
  latest_weight_value?: number;
  latest_weight_diff: number;
  latest_image?: CameraPhotos | null;
  latest_workout?: WorkoutSession | null;
  age: number;
  created_at: string;
  is_paid_user: boolean;
  profile_complete: boolean;
  linked_trainer?: LinkApplication | null | undefined;
  last_two_month_updates?: CameraPhotos[];
  first_image_date: string | false | null;
  custom_macros?: CustomMacro | null;
  unit_type: UnitTypes;
  profile_picture_url?: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  instagram: string;
  twitter: string;
}

export interface Trainer {
  id: number;
  transphormer_id: number;
  legionnaire_url: string;
  referral_url: string;
  transphormer?: Transphormer;
  address: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  facebook: string | null;
  google_plus: string | null;
  instagram: string | null;
  linkedin: string | null;
  pintrest: string | null;
  twitter: string | null;
  youtube: string | null;
  facebook_group: string | null;
  certifications: string;
  current_training_clients: string;
  years_training: string;
  creates_nutrition_plan: boolean;
  passed_basic_training: boolean;
  recommends_supplements: boolean;
  has_legionnaire_coach: boolean;
  creates_workout_plans: boolean;
  legionnaire_coach: string;
  how_train_clients: string;
}

export type Advisor = Trainer;
