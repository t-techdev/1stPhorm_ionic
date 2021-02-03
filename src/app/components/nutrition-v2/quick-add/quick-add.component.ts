import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodItem } from '../../../services/nutrition/nutrition.service';
import { FoodItemsService } from '../../../services/food-items/food-items.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../services/errors/errors.service';

@Component({
  selector: 'app-quick-add',
  templateUrl: './quick-add.component.html',
  styleUrls: ['./quick-add.component.scss'],
})
export class QuickAddComponent implements OnInit {
  public spinner = false;
  @ViewChild('inputCalories') inputCalories;

  @Input()
  public mealIndex = 1;

  @Input()
  public nutritionDayId = 0;

  @Input()
  public set quickItem(quickItem: FoodItem) {
    if (!this.form) {
      this.initForm();
    }
    this._quickItem = quickItem;
    this.setForm(this._quickItem);
  }

  public form: FormGroup;
  private _quickItem: FoodItem;

  constructor(
    private foodItemService: FoodItemsService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private errorService: ErrorsService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.initForm();
    this.subscribeToFormValueChanges();
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.inputCalories.setFocus();
    }, 500);
  }

  private initForm() {
    if (this.form) {
      return;
    }
    this.form = this.formBuilder.group({
      calories: this.formBuilder.control({ value: '', disabled: false }, [Validators.required]),
      protein: this.formBuilder.control({ value: '', disabled: false }),
      fats: this.formBuilder.control({ value: '', disabled: false }),
      carbs: this.formBuilder.control({ value: '', disabled: false }),
      fiber: this.formBuilder.control({ value: '', disabled: false }),
    });
  }

  private setForm(item: FoodItem) {
    this.form.get('calories').setValue(item.calories);
    this.form.get('protein').setValue(item.protein === 0 ? '' : item.protein);
    this.form.get('carbs').setValue(item.carbs === 0 ? '' : item.carbs);
    this.form.get('fats').setValue(item.fats === 0 ? '' : item.fats);
    this.form.get('fiber').setValue(item.fiber === 0 ? '' : item.fiber);
  }

  private subscribeToFormValueChanges() {
    this.form.get('calories').valueChanges.subscribe(() => {
    });
    this.form.get('protein').valueChanges.subscribe(() => {
      this.setCalculateCalories();
    });
    this.form.get('carbs').valueChanges.subscribe(() => {
      this.setCalculateCalories();
    });
    this.form.get('fats').valueChanges.subscribe(() => {
      this.setCalculateCalories();
    });
    this.form.get('fiber').valueChanges.subscribe(() => {
      this.setCalculateCalories();
    });
  }

  private setCalculateCalories() {
    const calories = this.form.get('protein').value * 4
      + this.form.get('carbs').value * 4
      + this.form.get('fats').value * 9
      + this.form.get('fiber').value * 4;

    this.form.get('calories').setValue(calories);
  }

  public async save() {
    this.spinner = true;
    var quickItem;
    
    try {  
      if (this._quickItem) {
        quickItem = <FoodItem>await this.foodItemService.updateQuickAddItem(
          this._quickItem.id, this.nutritionDayId, this.mealIndex, false, this.createFoodItemValue());
      } else {
        quickItem = <FoodItem>await this.foodItemService
          .createQuickAddItem(this.nutritionDayId, this.mealIndex, false, this.createFoodItemValue());
      }

      this.modal.dismiss({
        mealIndex: this.mealIndex,
        quickItem: quickItem
      });
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  private createFoodItemValue(): FoodItem {
    const form = this.form.getRawValue();
    
    return <FoodItem> {
      is_custom: false,
      name: "Quick Add",
      calories: form.calories,
      protein: form.protein * 1,
      carbs: form.carbs * 1,
      fats: form.fats * 1,
      fiber: form.fiber * 1,
      meal: this.mealIndex,
      consumed_amount: 1,
      consumed_unit: 'quick add'
    };
  }

  public closeModal() {
    this.modal.dismiss();
  }
}
