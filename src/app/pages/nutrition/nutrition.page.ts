import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Moment } from 'moment';
import { PickItemComponent } from './pick-item/pick-item.component';
import { NutritionItem } from '../../services/nutrition/nutrition.service';
import { NutritionCalculator } from './nutrition-calculator';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';
import { UserService } from '../../services/user/user.service';
import { mySQLFormattedDate } from '../../helpers';
import { SetActiveDay, StoreNutritionFoodData } from '../../store/actions/nutrition.actions';
import { Select, Store } from '@ngxs/store';
import { NutritionState } from '../../store/states/nutrition.state';
import { choices } from './nutrition-values';
import { CategoryTypes, Meal, MealItem } from '../../interfaces/simple-nutrition';
import { NutritionPlan, NutritionValues, Transphormer } from '../../interfaces';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit, CanLeaveRoute {
  public canLeaveAndroidBack = true;
  public day: Meal[] = [];

  public activeDate: string;
  public minDate: Moment;

  @Select(NutritionState.activeNutritionData) activeDay$;
  @Select(NutritionState.activeDate) activeDate$;

  private readonly calculator: NutritionCalculator;

  constructor(
    private modal: ModalController,
    private nav: NavController,
    private userService: UserService,
    private store: Store,
    public analyticService: AnalyticsService
  ) {
    this.minDate = moment(this.userService.user.created_at);

    this.calculator = new NutritionCalculator(
      this.transphormer,
      this.transphormer.latest_weight.weight,
      this.transphormer.meals_per_day
    );
  }

  ngOnInit() {
    this.activeDay$.subscribe((data) => {
      this.day = data;
    });
    this.activeDate$.subscribe((activeDate) => {
      this.activeDate = activeDate;
    });
    this.onDateChange(new Date());
  }

  public getNutritionItems(): NutritionItem[] {
    const result: NutritionItem[] = [];
    for (const type in choices) {
      if (choices[type] instanceof Array) {
        const options = choices[type];
        for (let i = 0; i < options.length; i++) {
          result.push({type, name: options[i].name, unit: options[i].unit} as NutritionItem);
        }
      }
    }
    return result;
  }

  getItemsForType(type: CategoryTypes) {
    return this.getNutritionItems().filter(i => i.type === type);
  }


  public get shouldShowAmounts() {
    return this.getNutritionType() === NutritionPlan.MacroMealPlan;
  }

  public async pickItem(selection: { meal: Meal, mealItem: MealItem }) {
    const {meal, mealItem} = selection;
    this.canLeaveAndroidBack = false;
    const myModal = await this.modal.create({
      component: PickItemComponent,
      backdropDismiss: false,
      componentProps: {
        showAmounts: this.shouldShowAmounts,
        calculator: this.calculator,
        nutritionItems: this.getItemsForType(mealItem.type),
        headerTitle: mealItem.name,
        checkedNutritionId: mealItem.selectedNutrition
          ? (<NutritionItem>mealItem.selectedNutrition).name
          : null,
        weight: this.transphormer.latest_weight.imperial.value,
        category: mealItem,
      },
    });
    await myModal.present();

    const data = <NutritionItem | null>(await myModal.onDidDismiss()).data;
    this.canLeaveAndroidBack = true;

    if (data) {
      data.calculatedQuantity = this.calculator.nutritionValue(data.type, data.name);
      if (data.unit === 'grams') {
        data.calculatedOunces = Math.round((data.calculatedQuantity * 0.03527396192) * 10) / 10;
      }
    }
    this.store.dispatch(new StoreNutritionFoodData(this.activeDate, meal, mealItem, data));

    this.analyticService.logEvent(AnalyticEvents.LoggingNutrition);
  }

  public async mealInfo() {
    if (this.userService.activeNutrition() === NutritionPlan.MacroMealPlan) {
      this.nav.navigateForward('/help/meal-plan');
    } else {
      this.nav.navigateForward('/help/portion-control');
    }
  }

  public get transphormer(): Transphormer {
    return this.userService.user;
  }

  /**
   * Handler to check date change events from week tab
   *
   * @param newDate
   */
  public onDateChange(newDate: Date) {
    this.store.dispatch(new SetActiveDay(mySQLFormattedDate(newDate)));
  }

  public getNutritionType(): NutritionValues {
    return this.userService.activeNutrition();
  }

}
