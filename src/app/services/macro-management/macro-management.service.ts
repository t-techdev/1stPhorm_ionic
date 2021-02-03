import { Injectable } from '@angular/core';
import { MacroCountingInfo, Meal, NutritionService, FoodItem } from '../nutrition/nutrition.service';
import { WeightsService } from '../weights/weights.service';
import { NutritionCalculatorService } from '../nutrition-calculator/nutrition-calculator.service';
import { CustomMacroService } from '../custom-macro/custom-macro.service';
import { MacroInfo, NutritionCalculator } from '../../pages/nutrition/nutrition-calculator';
import { FoodItemsService } from '../food-items/food-items.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../toast-service/toast-service.service';
import { ErrorsService } from '../errors/errors.service';
import { CustomMacro } from '../../interfaces/nutrition';
import { Transphormer, Weight } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MacroManagementService {

  constructor(
    public nutritionService: NutritionService,
    public nutritionCalculator: NutritionCalculatorService,
    public customMacroService: CustomMacroService,
    public weightService: WeightsService,
    public foodItemService: FoodItemsService
  ) {
  }

  public async macros(
    transphormer: Transphormer,
    forMacroCounting: boolean,
    currentWeight: Weight | null = null,
    date: Moment | null = null
  ) {

    let goalValues = this.defaultGoalValues();
    let bmrValues = this.defaultGoalValues();
    let meals = this.blankMeal();
    date = date || moment();
    const weightRequest = currentWeight ? Promise.resolve(currentWeight) : this.weightService.latestWeight();

    const [weight, latestMacro, macroCounting] = <[Weight, CustomMacro, MacroCountingInfo]>await Promise.all([
      weightRequest,
      this.customMacroService.latestMacro(),
      this.macroCounting(date)
    ]);
    let macros: MacroInfo | null = null;

    if (!forMacroCounting) {
      macros = new NutritionCalculator(transphormer, weight.weight).getMacros();

      return { goalValues, macros, meals, macroCounting, weight, bmrValues };
    }

    bmrValues = this.bmrValue(weight, transphormer);
    goalValues = bmrValues;

    if (latestMacro) {
      if (!latestMacro.reset_to_original) {
        goalValues = latestMacro;
      }
    }
    meals = this.setupMeals(meals, macroCounting);

    return { goalValues, macros, meals, macroCounting, weight, bmrValues };
  }

  public bmrValue(weight: Weight, transphormer: Transphormer) {
    return this.nutritionCalculator.calculateAdvancedMacros(
      weight.weight, transphormer.goal_weight_units.imperial.value, transphormer.activity_level,
      transphormer.transphormation_goal, transphormer.sex, transphormer.preference_macro_counting
    );
  }

  public blankMeal() {
    const meals = [];

    for (let i = 1; i <= 6; i++) {
      meals.push({
        meal_count: i,
        food_items: [],
        active: false
      });
    }

    return meals;
  }

  public defaultGoalValues() {
    return {
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0
    };
  }

  public setupMeals(meals: Meal[], macroCounting: MacroCountingInfo) {
    return meals.map(meal => {
      meal.food_items = macroCounting.tracked_items
        .filter(trackedItem => trackedItem.meal === meal.meal_count)
        .map(trackedItem => this.foodItemService.convertToFoodItem(trackedItem));
      meal.active = meal.food_items.length > 0;
      return meal;
    });
  }

  public async macroCounting(date: Moment): Promise<MacroCountingInfo> {
    let macroCounting: MacroCountingInfo;
    try {
      macroCounting = <MacroCountingInfo>await this.nutritionService.getMacroCountingInfo(date.toDate());
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }

      macroCounting = {
        track_date: moment().format('YYYY-MM-DD'),
        water_amount: 0,
        tracked_items: []
      };
    }

    return macroCounting;

  }

  public displayMacros(transphormer: Transphormer, macros?: MacroInfo, meals?: Meal[]) {
    return {
      get calories() {
        return calculateCalorieValue('calories');
      },
      get fats() {
        return calculateCalorieValue('fats');
      },
      get protein() {
        return calculateCalorieValue('protein');
      },
      get carbs() {
        return calculateCalorieValue('carbs');
      },
    };

    function calculateCalorieValue(type: string): string {
      if (transphormer.likely_to_do !== 'Calorie / Macro counting') {
        if (macros) {
          return macros[type].toString();
        }

        return '?';
      }

      if (!meals) {
        return '?';
      }

      return meals.reduce((carry, meal) => carry + meal.food_items
        .reduce((typeValue, foodItem) => typeValue + foodItem[type], 0)
        , 0).toFixed(0);
    }
  }
}

export class MacroCounting {
  currentWeight: Weight;
  macroCountingInfo: MacroCountingInfo;
  bmrValues;
  meals: Meal[];
  activeBmrValues;

  macroManagement: MacroManagementService;
  loadingCtrl: LoadingController;
  nutritionService: NutritionService;
  toastService: ToastService;
  errorService: ErrorsService;

  constructor(
    _currentWeight: Weight,
    _macroCountingInfo: MacroCountingInfo,
    _bmrValues: any,
    _meals: Meal[],
    _activeBmrValues: any,
    _macroManagement?: MacroManagementService,
    _loadingCtrl?: LoadingController,
    _nutritionService?: NutritionService,
    _toastService?: ToastService,
    _errorService?: ErrorsService
  ) {
    this.currentWeight = _currentWeight;
    this.macroCountingInfo = _macroCountingInfo;
    this.bmrValues = _bmrValues;
    this.activeBmrValues = _activeBmrValues;
    this.meals = _meals;

    this.macroManagement = _macroManagement;
    this.loadingCtrl = _loadingCtrl;
    this.nutritionService = _nutritionService;
    this.toastService = _toastService;
    this.errorService = _errorService;
  }

  public get calories(): number {
    return this.fixDecimal(this.meals
      .reduce((carry, meal) => carry + meal.food_items
        .reduce((calories, foodItem) => calories + foodItem.calories, 0)
      , 0));
  }

  public get protein(): number {
    return this.fixDecimal(this.meals
      .reduce((carry, meal) => carry + meal.food_items
        .reduce((protein, foodItem) => protein + foodItem.protein, 0)
      , 0));
  }

  public get carbs(): number {
    return this.fixDecimal(this.meals
      .reduce((carry, meal) => carry + meal.food_items
        .reduce((carbs, foodItem) => carbs + foodItem.carbs, 0)
      , 0));
  }

  public get fats(): number {
    return this.fixDecimal(this.meals
      .reduce((carry, meal) => carry + meal.food_items
        .reduce((fats, foodItem) => fats + foodItem.fats, 0)
      , 0));
  }

  public fixDecimal(val: any) {
    return Math.round(val);
  }

  public get caloriesRemaining(): string {
    return (this.activeBmrValues.calories - this.calories).toFixed(0);
  }

  public updateMeal(updatedMeal: Meal) {
    const index = this.meals.findIndex(meal => meal.meal_count === updatedMeal.meal_count);
    this.meals[index] = updatedMeal;
    const meals = _.cloneDeep(this.meals);
    this.meals = this.meals.map(meal => {
      meal.food_items = meals.reduce((foodItems: FoodItem[], m) => {
        foodItems = foodItems.concat(m.food_items.filter(item => item.meal === meal.meal_count));
        return foodItems;
      }, []);

      meal.active = meal.food_items.length > 0;
      return meal;
    });
  }

  public async updateWaterAmount(water: number) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });
    await loader.present();

    try {
      this.macroCountingInfo.water_amount += water;

      this.macroCountingInfo = <MacroCountingInfo>await this.nutritionService.updateMacroCountingInfo(this.macroCountingInfo);

    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
      this.macroCountingInfo.water_amount -= water;
    } finally {
      loader.dismiss();
    }
  }

  public async resetMacroInfoForDate(date: Date) {
    const loader = await this.loadingCtrl.create({
      message: 'Please wait ...'
    });
    await loader.present();
    try {
      this.macroCountingInfo = await this.macroManagement.macroCounting(moment(date));
      const meals = this.macroManagement.setupMeals(this.macroManagement.blankMeal(), this.macroCountingInfo);
      this.meals = meals;
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      loader.dismiss();
    }
  }
}
