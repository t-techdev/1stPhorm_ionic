
import { NutritionItem } from '../../services/nutrition/nutrition.service';
import { mySQLFormattedDate } from '../../helpers';
import { Meal, MealItem } from '../../interfaces/simple-nutrition';

export class SetActiveDay {
  static readonly type = '[Nutrition] Set Active Day';
  public activeDate: string;

  constructor(private day: string | Date) {
    if (day instanceof Date) {
      this.activeDate = mySQLFormattedDate(day);
    } else {
      this.activeDate = day;
    }
  }
}

export class StoreNutritionFoodData {
  static readonly type = '[Nutrition] StoreNutritionFoodData';

  constructor(public day: string, public meal: Meal, public mealItem: MealItem, public nutritionItem: NutritionItem) {}
}

export class ToggleSupplementUsed {
  static readonly type = '[Nutrition] ToggleSupplementUsed';

  constructor(public supplementIndex: number) {}
}

export class SupplementConfigurationUpdated {
  static readonly type = '[Nutrition] SupplementConfigurationUpdated';

  constructor(public supplements: MealItem[]) {}
}

export class ToggleExpandSupplements {
  static readonly type = '[Nutrition] ExpandSupplements';

  constructor() {}
}

export class ToggleExpandMeal {
  static readonly type = '[Nutrition] ToggleExpandMeal';

  constructor(public activeDate: string, public mealIndex: number) {}
}
