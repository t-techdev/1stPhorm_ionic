import { Injectable, Inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { AltServing, FoodItem } from '../nutrition/nutrition.service';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { ErrorFormat } from '../../interfaces/errors';

export interface TrackedFood {
  id: number;
  nutrition_day_id: number;
  meal: number;
  name: string;
  fats: number;
  carbs: number;
  protein: number;
  calories: number;
  fiber?: number;
  consumed_amount: number;
  consumed_unit: string;
  is_custom: boolean;
  is_custom_food_template: boolean;
  serving_information: ServingInfo;
  is_branded_food: boolean;
  nutritioninx_item_id: string | null;
  nutritioninx_food_name: string | null;
  total_count?: number;
  thumbnail?: string;
}

interface ServingInfo {
  id: number;
  tracked_item_id: number;
  fiber?: number;
  fats: number;
  carbs: number;
  protein: number;
  calories: number;
  serving_amount: number;
  serving_unit: string;
  alt_servings: AltServing[];
}

@Injectable({
  providedIn: 'root'
})
export class FoodItemsService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar,
  ) {
    super(http, platform, userService, rollbar);

    FoodItemsService.SET_PLATFORM(platform);
    FoodItemsService.SET_ROLLBAR(rollbar);
  }

  public createFoodItem(nutritionId: number, meal: number, isCustom: boolean, foodItem: FoodItem, isCustomFoodTemplate = false): Promise<FoodItem | ErrorFormat> {
    const body = this.convertFoodItemToBody(foodItem, meal, isCustom, isCustomFoodTemplate);

    return this.http.post<TrackedFood>(FoodItemsService.Url(`nutritions/macro-counting/${nutritionId}/tracked-item`),
      body,
      FoodItemsService.BaseOptions()
    )
      .toPromise()
      .then(result => this.convertToFoodItem(result))
      .catch(FoodItemsService.HandleError);
  }

  public createFoodItems(nutritionId: number, foodItems: FoodItem[], meal: number = 0): Promise<FoodItem[] | ErrorFormat> {
    const body_ary = [];
    foodItems.forEach((foodItem) => {
      const fmeal = (meal === 0) ? foodItem.meal : meal;
      const body = this.convertFoodItemToBody(foodItem, fmeal, foodItem.is_custom, foodItem.is_custom_food_template);
      body_ary.push(body);
    })

    return this.http.post<TrackedFood[]>(FoodItemsService.Url(`nutritions/macro-counting/${nutritionId}/tracked-items`),
      body_ary,
      FoodItemsService.BaseOptions()
    )
      .toPromise()
      .then(result => this.convertToFoodItems(result))
      .catch(FoodItemsService.HandleError);
  }

  public createQuickAddItem(nutritionId: number, meal: number, isCustom: boolean, foodItem: FoodItem, isCustomFoodTemplate = false): Promise<FoodItem | ErrorFormat> {
    const body = foodItem;

    return this.http.post<TrackedFood>(FoodItemsService.Url(`nutritions/macro-counting/${nutritionId}/quick-add`),
      body,
      FoodItemsService.BaseOptions()
    )
      .toPromise()
      .then(result => this.convertToFoodItem(result))
      .catch(FoodItemsService.HandleError);
  }

  public convertToFoodItems(trackedItems: TrackedFood[]): FoodItem[] {
    const foodItems: FoodItem[] = [];
    trackedItems.forEach((trackedItem: TrackedFood) => {
      foodItems.push(this.convertToFoodItem(trackedItem));
    })
    return foodItems;
  }

  public convertToFoodItem(trackedItem: TrackedFood): FoodItem {
    const item = <FoodItem>{
      id: trackedItem.id,
      name: trackedItem.name,
      meal: trackedItem.meal,
      calories: trackedItem.calories,
      carbs: trackedItem.carbs,
      protein: trackedItem.protein,
      fats: trackedItem.fats,
      fiber: trackedItem.fiber * 1 || 0,
      is_custom: trackedItem.is_custom,
      is_branded_food: trackedItem.is_branded_food,
      nutritioninx_food_name: trackedItem.nutritioninx_food_name,
      nutritioninx_item_id: trackedItem.nutritioninx_item_id,
      is_custom_food_template: trackedItem.is_custom_food_template,
      amount_consumed: {
        unit: trackedItem.consumed_unit,
        amount: trackedItem.consumed_amount,
      },
      serving_size: trackedItem.serving_information ? {
        calories: trackedItem.serving_information.calories,
        carbs: trackedItem.serving_information.carbs,
        protein: trackedItem.serving_information.protein,
        fats: trackedItem.serving_information.fats,
        unit: trackedItem.serving_information.serving_unit,
        amount: trackedItem.serving_information.serving_amount,
      } : null,
      alt_servings: trackedItem.serving_information ? trackedItem.serving_information.alt_servings : null,
      total_count: trackedItem.total_count || 0
    };
    item['fiber'] = trackedItem.fiber;
    if (trackedItem.serving_information) {
      item.serving_size['fiber'] = trackedItem.serving_information.fiber;
    }
    if (trackedItem.thumbnail) {
      item['thumbnail'] = trackedItem.thumbnail;
    }
    if (trackedItem.consumed_unit === 'quick add') {
      item['quick_add'] = true;
    }
    return item;
  }

  public updateFoodItem(foodItemId: number, nutritionId: number, meal: number, isCustom: boolean, foodItem: FoodItem, isCustomFoodTemplate = false)
    : Promise<FoodItem | ErrorFormat> {
    const body = this.convertFoodItemToBody(foodItem, meal, isCustom, isCustomFoodTemplate);

    return this.http.put<TrackedFood>(FoodItemsService.Url(`nutritions/macro-counting/${nutritionId}/tracked-item/${foodItemId}`),
      body,
      FoodItemsService.BaseOptions()
    )
      .toPromise()
      .then(result => this.convertToFoodItem(result))
      .catch(FoodItemsService.HandleError);
  }

  public updateQuickAddItem(foodItemId: number, nutritionId: number, meal: number, isCustom: boolean, foodItem: FoodItem, isCustomFoodTemplate = false)
    : Promise<FoodItem | ErrorFormat> {
    const body = foodItem;

    return this.http.post<TrackedFood>(FoodItemsService.Url(`nutritions/macro-counting/${nutritionId}/quick-add/${foodItemId}`),
      body,
      FoodItemsService.BaseOptions()
    )
      .toPromise()
      .then(result => this.convertToFoodItem(result))
      .catch(FoodItemsService.HandleError);
  }

  public deleteFoodItem(foodItemId: number, nutritionDayId: number): Promise<any | ErrorFormat> {
    return this.http.delete(FoodItemsService.Url(`nutritions/macro-counting/${nutritionDayId}/tracked-item/${foodItemId}`),
      FoodItemsService.BaseOptions()
    )
      .toPromise()
      .catch(FoodItemsService.HandleError);
  }

  public deleteQuickAddItem(foodItemId: number, nutritionDayId: number): Promise<any | ErrorFormat> {
    return this.http.delete(FoodItemsService.Url(`nutritions/macro-counting/${nutritionDayId}/quick-add/${foodItemId}`),
      FoodItemsService.BaseOptions()
    )
      .toPromise()
      .catch(FoodItemsService.HandleError);
  }

  /**
   * Returns recent food items
   */
  public recentFoodItems(): Promise<FoodItem[] | ErrorFormat> {
    return this.http.get<TrackedFood[]>(FoodItemsService.Url(`nutritions/macro-counting/tracked-item/recent`),
      FoodItemsService.BaseOptions(true, true, 900)
    )
      .toPromise()
      .then(result => result.map(item => this.convertToFoodItem(item)))
      .catch(FoodItemsService.HandleError);
  }

  /**
   * Returns around this time food items
   */
  public aroundTimeFoodItems(): Promise<FoodItem[] | ErrorFormat> {
    return this.http.get<TrackedFood[]>(FoodItemsService.Url(`nutritions/macro-counting/tracked-item/around-this-time`),
      FoodItemsService.BaseOptions(true, true, 3600)
    )
      .toPromise()
      .then(result => result.map(item => this.convertToFoodItem(item)))
      .catch(FoodItemsService.HandleError);
  }

  private convertFoodItemToBody(foodItem: FoodItem, meal: number, isCustom: boolean, isCustomFoodTemplate = false) {
    const item = {
      calories: foodItem.calories,
      fats: foodItem.fats,
      carbs: foodItem.carbs,
      protein: foodItem.protein,
      meal: meal,
      is_custom: isCustom,
      name: foodItem.name,
      is_custom_food_template: isCustomFoodTemplate,
      is_branded_food: foodItem.is_branded_food,
      nutritioninx_food_name: foodItem.nutritioninx_food_name,
      nutritioninx_item_id: foodItem.nutritioninx_item_id,
      meal_template_id: foodItem.meal_template_id || null,
      serving_size: {
        calories: foodItem.serving_size.calories,
        fats: foodItem.serving_size.fats,
        carbs: foodItem.serving_size.carbs,
        protein: foodItem.serving_size.protein,
        amount: foodItem.serving_size.amount,
        unit: foodItem.serving_size.unit,
      },
      amount_consumed: {
        amount: foodItem.amount_consumed.amount,
        unit: foodItem.amount_consumed.unit,
      },
      alt_servings: foodItem.alt_servings
    };
    if (foodItem.fiber) {
      item['fiber'] = foodItem.fiber;
      item.serving_size['fiber'] = foodItem.serving_size.fiber;
    }
    if (foodItem.thumbnail) {
      item['thumbnail'] = foodItem.thumbnail;
    }
    return item;
  }
}
