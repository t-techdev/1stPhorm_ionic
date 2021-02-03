import { Injectable } from '@angular/core';
import { UserService } from './user/user.service';
import { Meal, MealItem, MealType, NutritionPlan, NutritionValues } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SimpleNutritionService {

  constructor(
    protected userService: UserService,
  ) {
  }

  generateDay(numberOfMeals: number = 3, mealNames: string[] = null): Meal[] {
    if (mealNames === undefined && numberOfMeals === 3) {
      mealNames = ['Breakfast', 'Lunch', 'Dinner'];
    }
    const useNumberedMeals = mealNames === null || mealNames.length === 0;

    const meals: Meal[] = [];

    for (let i = 1; i <= numberOfMeals; i++) {
      meals.push(meal(useNumberedMeals ? `Meal ${i}` : mealNames[i - 1]));
    }

    return meals;
  }

  generateDayFor(nutritionType: NutritionValues) {
    if (nutritionType === NutritionPlan.PortionControl) {
      return this.generateDay(3);
    } else if (nutritionType === NutritionPlan.MacroMealPlan) {
      return this.generateDay(this.userService.user.meals_per_day, null);
    }
  }

}

const mealTemplate: MealItem[] = [
  {
    name: 'Protein',
    type: 'protein',
    selectedNutrition: null,
  },
  {
    name: 'Carb',
    type: 'carb',
    selectedNutrition: null,
  },
  {
    name: 'Veggie',
    type: 'veggie',
    selectedNutrition: null,
  },
];

function meal(name: string, type: MealType = 'meal'): Meal {
  return {
    name,
    type,
    expanded: true,
    items: [...mealTemplate],
  };
}

