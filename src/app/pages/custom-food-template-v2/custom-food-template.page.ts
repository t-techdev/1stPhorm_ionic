import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { CustomFoodTemplate, CustomFoodTemplateService } from '../../services/custom-food-template/custom-food-template.service';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { MealTemplate, MealTemplatesService } from '../../services/meal-templates/meal-templates.service';
import { FoodItem } from '../../services/nutrition/nutrition.service';
import { AddFoodComponent } from '../../components/nutrition-v2/add-food/add-food.component';
import { EditFoodComponent } from '../../components/nutrition-v2/edit-food/edit-food.component';
import { MealTemplateNameComponent } from '../../components/nutrition-v2/meal-template-name/meal-template-name.component';

interface ListItem {
  type: 'custom-food' | 'meal';
  item: CustomFoodTemplate | MealTemplate<FoodItem>;
}

@Component({
  selector: 'app-custom-food-template',
  templateUrl: './custom-food-template.page.html',
  styleUrls: ['./custom-food-template.page.scss'],
})
export class CustomFoodTemplatePage implements OnInit, CanLeaveRoute {
  public spinner = false;

  public customFoods: CustomFoodTemplate[] = [];

  public mealTemplates: MealTemplate<FoodItem>[] = [];

  public list: ListItem[] = [];

  public canLeaveAndroidBack = true;

  constructor(
    private modalCtrl: ModalController,
    private customFoodTemplateService: CustomFoodTemplateService,
    private alertCtrl: AlertController,
    private cacheService: RequestCachingService,
    private toastService: ToastService,
    public errorService: ErrorsService,
    private changeDetector: ChangeDetectorRef,
    public mealTemplateService: MealTemplatesService,
    public actionSheetCtrl: ActionSheetController
  ) {
  }

  ngOnInit() {
    this.listFoodTemplates();
  }

  public async openAddCustomFoodModal() {
    const addModal = await this.modalCtrl.create({
      component: AddFoodComponent,
      backdropDismiss: false,
      componentProps: {
        showFoodManagement: true,
        customFoodTemplate: true,
      }
    });

    await addModal.present();

    const result = await addModal.onDidDismiss();

    if (result.data) {
      this.customFoods.push(result.data);
      this.list.push({ type: 'custom-food', item: result.data });
      this.cacheService.clearAll();
    }
  }

  public async listFoodTemplates() {
    this.spinner = true;

    try {
      const customFoodRequest = this.customFoodTemplateService.listCustomFoods();
      const mealTemplateRequest = this.mealTemplateService.all();

      this.customFoods = <CustomFoodTemplate[]>await customFoodRequest;
      this.mealTemplates = <MealTemplate<FoodItem>[]>await mealTemplateRequest;
      this.createList();

    } catch (e) {
      console.log(e);
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  public async openEditFoodModal(customFood: CustomFoodTemplate) {
    const foodItem = <FoodItem>{
      calories: customFood.calories,
      fats: customFood.fats,
      carbs: customFood.carbs,
      protein: customFood.protein,
      fiber: customFood.fiber,
      name: customFood.name,
      serving_size: {
        unit: customFood.serving_unit,
        amount: customFood.serving_amount,
        calories: customFood.calories,
        fats: customFood.fats,
        carbs: customFood.carbs,
        protein: customFood.protein,
        fiber: customFood.fiber
      },
      amount_consumed: {
        unit: customFood.serving_unit,
        amount: 1,
      }
    };
    const editModal = await this.modalCtrl.create({
      component: EditFoodComponent,
      componentProps: {
        customFoodTemplate: customFood,
        foodItem: foodItem
      },
      backdropDismiss: false
    });

    await editModal.present();

    const result = await editModal.onDidDismiss();

    if (result.data) {
      const index = this.customFoods.findIndex(food => food.id === customFood.id);
      const index1 = this.list.findIndex(food => food.item.id === customFood.id);
      this.customFoods[index] = result.data;
      this.list[index1].item = result.data;
      this.cacheService.clearAll();
    }
  }

  public async removeTemplate(type: string, template: CustomFoodTemplate | MealTemplate<FoodItem>) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      buttons: [ {
        text: 'Cancel',
        role: 'success',
      }, {
        text: 'Remove',
        role: 'success',
        cssClass: 'global-danger',
        handler: () => {
          if (type === 'custom-food') {
            this.destroyTemplate(<CustomFoodTemplate>template);
          } else {
            this.destroyMealTemplate(<MealTemplate<FoodItem>>template);
          }
        }
      }]
    });

    await alert.present();
  }

  private async destroyTemplate(template: CustomFoodTemplate) {
    this.spinner = true;

    try {
      await this.customFoodTemplateService.deleteCustomFood(template.id);
      const index = this.customFoods.findIndex(food => food.id === template.id);
      this.customFoods.splice(index, 1);
      this.createList();
      this.cacheService.clearAll();
      this.changeDetector.detectChanges();
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
      console.log(e);
    } finally {
      this.spinner = false;
    }
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.canLeaveAndroidBack = false;
  }

  private createList() {
    this.list = [];
    this.list = this.list.concat(this.customFoods.map<ListItem>(item => {
      return { type: 'custom-food', item };
    })).concat(this.mealTemplates.map<ListItem>(item => {
      return { type: 'meal', item };
    }));

    this.list = this.list.sort((item1, item2) => item1.item.name.toUpperCase() >= item2.item.name.toUpperCase() ? 1 : -1);
  }

  public async destroyMealTemplate(template: MealTemplate<FoodItem>) {
    this.spinner = true;
    try {
      await this.mealTemplateService.delete(template.id);
      this.mealTemplates.splice(this.mealTemplates.findIndex(food => food.id === template.id), 1);
      this.createList();
      this.changeDetector.detectChanges();
      this.cacheService.clearAll();
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  public async openEditMealModal(meal: MealTemplate<FoodItem>) {
    const editModal = await this.modalCtrl.create({
      component: MealTemplateNameComponent,
      componentProps: {
        meal
      },
      backdropDismiss: false,
      cssClass: 'meal-template-name-modal'
    });

    await editModal.present();

    const result = await editModal.onDidDismiss();

    if (result.data) {
      const index = this.mealTemplates.findIndex(food => food.id === meal.id);
      this.mealTemplates[index] = result.data;
      this.createList();
      this.cacheService.clearAll();
    }
  }

  public async more(ev, listItem) {
    const editText = listItem.type === "custom-food" ? "Edit food" : "Edit Meal Name";
    const removeText = listItem.type === "custom-food" ? "Remove food" : "Remove Meal";
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: editText,
          handler: () => {
            if (listItem.type === "custom-food") {
              this.openEditFoodModal(listItem.item);
            } else {
              this.openEditMealModal(listItem.item);
            }
          }
        }, {
          text: removeText,
          handler: () => {
            this.removeTemplate(listItem.type, listItem.item);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        },
      ],
    });

    await actionSheet.present();
  }
}
