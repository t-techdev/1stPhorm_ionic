import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FoodItem } from '../../../services/nutrition/nutrition.service';
import { FoodItemsService } from '../../../services/food-items/food-items.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../services/errors/errors.service';
import { CustomFoodTemplate, CustomFoodTemplateService } from '../../../services/custom-food-template/custom-food-template.service';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.component.html',
  styleUrls: ['./edit-food.component.scss']
})
export class EditFoodComponent implements OnInit {
  public spinner = false;

  @Input()
  public mealIndex = 1;

  @Input() 
  public customFoodTemplate;

  @Input()
  public foodItem: FoodItem;

  @Input()
  public nutritionDayId = 0;

  @Input()
  public isCustom = true;


  constructor(
    private modal: ModalController,
    private foodItemService: FoodItemsService,
    private toastService: ToastService,
    public errorService: ErrorsService,
    private customFoodTemplateService: CustomFoodTemplateService
  ) {
  }

  ngOnInit() {   
  }

  public closeModal() {
    this.modal.dismiss();
  }

  public async updateFoodItem(foodItem: FoodItem) {
    this.spinner = true;
    try {
      const updatedFoodItem = <FoodItem>await this.foodItemService.updateFoodItem(
        this.foodItem.id, this.nutritionDayId, this.mealIndex, this.isCustom, foodItem
      );
      this.modal.dismiss(updatedFoodItem);
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }

  }

  public async updateCustomFood(foodItem: FoodItem) {
    this.spinner = true;

    try {
      const food = <CustomFoodTemplate>await this.customFoodTemplateService
        .updateCustomFood(this.customFoodTemplate.id, foodItem);

      this.modal.dismiss(food);
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  public async removeFoodItem() {
    this.spinner = true;
    try {
      await this.foodItemService.deleteFoodItem(this.foodItem.id, this.nutritionDayId);
      this.modal.dismiss('remove');
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
    this.closeModal();
  }
}
