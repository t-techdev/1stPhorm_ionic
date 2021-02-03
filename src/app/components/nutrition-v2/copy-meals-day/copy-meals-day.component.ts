import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { Meal, NutritionService, FoodItem } from '../../../services/nutrition/nutrition.service';
import { MacroCounting, MacroManagementService } from '../../../services/macro-management/macro-management.service';
import { FoodItemsService } from '../../../services/food-items/food-items.service';

@Component({
  selector: 'app-copy-meals-day',
  templateUrl: './copy-meals-day.component.html',
  styleUrls: ['./copy-meals-day.component.scss'],
})
export class CopyMealsDayComponent implements OnInit {
  public spinner = false;

  public toDate = moment();

  @Input()
  public date;

  @Input()
  public singleMeal;

  @Input()
  public macroCounting: MacroCounting;

  @Input()
  public meals: Meal[] = [];

  public isDetail = false;
  public buttonText = "Copy all Meals";

  constructor(
    private modal: ModalController,
    public nutritionService: NutritionService,
    private foodItemService: FoodItemsService,
    public macroManagement: MacroManagementService
  ) {
  }

  ngOnInit() {
    if (this.singleMeal) {
      this.buttonText = "Copy Meal";
    }
  }

  public closeModal() {
    this.modal.dismiss();
  }

  public equalDate() {
    const x = moment(this.date).format("YYYY-MM-DD");
    const y = moment(this.toDate).format("YYYY-MM-DD");
    return x === y;
  }

  dateChange(date: Date) {
    this.toDate = moment(date);
  }

  public async copy() {
    const date = moment(this.toDate).format("YYYY-MM-DD");
    this.spinner = true;

    try {
      const macroCountingInfo = await this.macroManagement.macroCounting(moment(date));
      this.meals.forEach((meal) => {
        meal.food_items.forEach(async (foodItem) => {
          await this.foodItemService.createFoodItem(macroCountingInfo.id, meal.meal_count, false, foodItem);
        });
      });
      this.modal.dismiss(date);
    } catch (e) {

    } finally {
      this.spinner = false;
    }
  }
}
