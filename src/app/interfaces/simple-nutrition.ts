import { NutritionItem } from '../services/nutrition/nutrition.service';

export type MealType = 'meal' | 'supplements';
export type CategoryTypes = 'supplement' | 'protein' | 'carb' | 'veggie';

export interface Meal {
  name: string;
  type: MealType;
  items: MealItem[];
  food?: FoodItem[];
  expanded?: boolean;
  noSupplements?: boolean;
}

export interface MealItem {
  name: string;
  type: CategoryTypes;
  selectedNutrition?: NutritionItem;
  use?: boolean;
}

export interface FoodItem {
  name: string;
  categories: MealItem[];
}

export interface SimpleNutritionData {
  nutrition_day_id?: number;
  nutrition: Meal[];
  supplements: Meal;
  configuration: any;
}

export interface SimpleNutritionResponse {
  track_date: string;
  transphormer_id: number;
  id: number;
  data: SimpleNutritionData;
}
