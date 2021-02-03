import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NutritionItem } from '../../../services/nutrition/nutrition.service';
import { NutritionCalculator } from '../nutrition-calculator';
import { UserService } from '../../../services/user/user.service';
import { MealItem } from '../../../interfaces/simple-nutrition';
import { Transphormer } from '../../../interfaces';

@Component({
  selector: 'app-pick-item',
  templateUrl: './pick-item.component.html',
  styleUrls: ['./pick-item.component.scss'],
})
export class PickItemComponent implements OnInit {
  @Input()
  public nutritionItems: NutritionItem[] = [];

  @Input()
  public showAmounts = true;

  @Input()
  public calculator: NutritionCalculator;

  @Input()
  public checkedNutritionId: number | null = null;

  @Input()
  public headerTitle = '';

  @Input()
  public weight = 0;

  @Input()
  public category: MealItem;

  @Input()
  public numberOfMeals = 6;

  constructor(
    public modalCtrl: ModalController,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  public selectItem(item: NutritionItem) {
    this.modalCtrl.dismiss(item);
  }

  public removeSelection() {
    this.modalCtrl.dismiss(null);
  }

  public get transphormer(): Transphormer {
    return this.userService.user;
  }

  public nutritionValue(name: string) {
    return this.calculator.nutritionValue(this.category.type, name);
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.close();
  }

  nutritionValueOunces(name: string) {
    const value = this.calculator.nutritionValue(this.category.type, name);
    const main = (value * 0.03527396192) * 10;
    return (Math.round(main) / 10).toFixed(1);
  }
}
