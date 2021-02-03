import { Moment } from 'moment';
import { Weight } from './types';

export interface CustomMacro {
    id: number;
    reset_to_original: boolean;
    carbs: number;
    fats: number;
    protein: number;
    calories: number;
    transphormer_id: number;
    edit_date: Moment;
    base_weight?: Weight;
}

export enum NutritionPlan {
  MacroMealPlan = 'Macro meal plan',
  CalorieMacroCounting = 'Calorie / Macro counting',
  PortionControl = 'Portion control'
}
