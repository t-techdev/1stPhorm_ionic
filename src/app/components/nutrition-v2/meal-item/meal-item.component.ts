import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FoodItem, Meal, NutritionService } from '../../../services/nutrition/nutrition.service';
import { ActionSheetController, ModalController, PopoverController } from '@ionic/angular';
import { EditFoodComponent } from '../edit-food/edit-food.component';
import { AddFoodComponent } from '../add-food/add-food.component';
import { MealTemplatesService } from '../../../services/meal-templates/meal-templates.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../services/errors/errors.service';
import { MealTemplateNameComponent } from '../meal-template-name/meal-template-name.component';
import { RequestCachingService } from '../../../services/interceptors/caching/request-caching.service';
import { QuickAddComponent } from '../quick-add/quick-add.component';

@Component({
  selector: 'app-meal-item',
  templateUrl: './meal-item.component.html',
  styleUrls: ['./meal-item.component.scss']
})
export class MealItemComponent implements OnInit {

  @Input()
  public meal: Meal;

  @Input()
  public nutritionDayId = 0;

  @Output()
  public mealUpdated: EventEmitter<Meal> = new EventEmitter<Meal>();

  @Output()
  public mealCopied: EventEmitter<Meal[]> = new EventEmitter<Meal[]>();

  public showFoodItems = false;
  public insOpened = false;

  constructor(
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    public mealTemplateService: MealTemplatesService,
    public toastService: ToastService,
    public errorService: ErrorsService,
    public cacheService: RequestCachingService,
    public actionSheetCtrl: ActionSheetController,
    public nutritionService: NutritionService
  ) {
  }

  ngOnInit() {
  }

  /**
   * Opens the edit modal for food item
   *
   * @param foodItem
   * @param foodItemIndex
   */
  public async openEditFoodItem(foodItem: FoodItem, foodItemIndex: number) {
    const editFoodModal = await this.modalCtrl.create({
      component: EditFoodComponent,
      componentProps: {
        foodItem,
        isCustom: foodItem.is_custom,
        mealIndex: this.meal.meal_count,
        nutritionDayId: this.nutritionDayId
      },
      backdropDismiss: false
    });

    await editFoodModal.present();

    const result = await editFoodModal.onDidDismiss();
    if (result.data === 'remove') {
      this.meal.food_items.splice(foodItemIndex, 1);
      this.mealUpdated.emit(this.meal);
    } else if (result.data) {
      this.meal.food_items[foodItemIndex] = result.data;
      this.mealUpdated.emit(this.meal);
    }
  }

  public async openEditQuickItem(quickItem: FoodItem, quickItemIndex: number) {
    const modal = await this.modalCtrl.create({
      component: QuickAddComponent,
      componentProps: {
        quickItem,
        mealIndex: this.meal.meal_count,
        nutritionDayId: this.nutritionDayId
      },
      backdropDismiss: false
    });

    await modal.present();

    const result = await modal.onDidDismiss();
    if (result.data) {
      this.meal.food_items[quickItemIndex] = result.data.quickItem;
    }
  }

  public removeQuickItem(quickItem: FoodItem, quickItemIndex: number) {
    this.meal.food_items.splice(quickItemIndex, 1);
  }

  public async add() {    
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Meal ' + this.meal.meal_count,
      buttons: [
        {
          text: 'Add Food',
          handler: () => {
            this.addFoodItem();
          },
        },
        {
          text: 'Quick Add Calories / macros',
          handler: () => {
            this.quickAdd();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ],
    });

    await actionSheet.present();
  }
  /**
   * Modal to add food item to existing meal list
   */
  public async addFoodItem() {
    const addFoodModal = await this.modalCtrl.create({
      component: AddFoodComponent,
      backdropDismiss: false,
      componentProps: {
        mealIndex: this.meal.meal_count,
        nutritionDayId: this.nutritionDayId
      }
    });
    await addFoodModal.present();

    const result = await addFoodModal.onDidDismiss();

    if (result.data) {

      if (result.data.foodItem) {
        this.meal.food_items.push(result.data.foodItem);
        this.mealUpdated.emit(this.meal);
      } else if (result.data.foodItems.length > 0) {
        for (const foodItem of result.data.foodItems) {
          this.meal.food_items.push(foodItem);
        }
        this.mealUpdated.emit(this.meal);
      }
      this.insOpened = true;
    }
  }

  public async quickAdd() {
    const quickAddModal = await this.modalCtrl.create({
      component: QuickAddComponent,
      backdropDismiss: false,
      componentProps: {
        mealIndex: this.meal.meal_count,
        nutritionDayId: this.nutritionDayId
      }
    });
    await quickAddModal.present();

    const result = await quickAddModal.onDidDismiss();

    if (result.data) {
      this.meal.food_items.push(result.data.quickItem);
      this.insOpened = true;
    }
  }

  public async more(meal, ev) {
    if (meal.food_items.length === 0) {
      return;
    }
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Save as meal',
          handler: () => {
            this.saveAsMealTemplate();
          },
        },
        {
          text: 'Copy meal',
          handler: () => {
            this.mealCopied.emit([this.meal]);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ],
    });

    await actionSheet.present();
  }

  /**
   * Save meal template to server
   */
  public async saveAsMealTemplate() {
    const name = await this.openMealTemplateNameModal();

    if (!name) {
      return;
    }

    try {
      await this.mealTemplateService.create(<string>name, this.meal.food_items);
      this.toastService.flash('Meal saved.');
      this.cacheService.clearAll();
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    }
  }

  /**
   * Open modal to ask for meal template name
   */
  public async openMealTemplateNameModal(): Promise<string | boolean> {
    const modal = await this.modalCtrl.create({
      component: MealTemplateNameComponent,
      cssClass: 'meal-template-name-modal'
    });

    await modal.present();

    const result = await modal.onDidDismiss();

    return !result.data ? false : result.data;
  }
}
