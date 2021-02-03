import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MealTemplate, MealTemplatesService } from '../../../services/meal-templates/meal-templates.service';
import { ErrorsService, FoodItem, ToastService } from '../../../services';

@Component({
  selector: 'app-meal-template-name',
  templateUrl: './meal-template-name.component.html',
  styleUrls: ['./meal-template-name.component.scss'],
})
export class MealTemplateNameComponent implements OnInit {
  public spinner = false;

  @Input()
  public meal: MealTemplate<FoodItem>;

  public form: FormGroup;

  constructor(
    public modalController: ModalController,
    private toastService: ToastService,
    private errorService: ErrorsService,
    private mealTemplateService: MealTemplatesService
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl((this.meal ? this.meal.name : ''), [Validators.required, Validators.minLength(3), Validators.maxLength(250)])
    });
  }

  public async save() {
    if (this.meal) {
      this.spinner = true;
      try {
        const meal = <MealTemplate<FoodItem>>await this.mealTemplateService.update(this.meal.id, this.form.get('name').value);
        await this.toastService.flash('Meal name updated successfully.');
        await this.modalController.dismiss(meal);
      } catch (e) {
        await this.toastService.flash(this.errorService.firstError(e));
      } finally {
        this.spinner = false;
      }
    } else {
      await this.modalController.dismiss(this.form.get('name').value);
    }
  }

  public close() {
    this.modalController.dismiss(false).then();
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.close();
  }
}
