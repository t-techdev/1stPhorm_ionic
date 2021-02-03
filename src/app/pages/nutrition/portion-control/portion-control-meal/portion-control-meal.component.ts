import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToggleExpandMeal } from '../../../../store/app.actions';
import { Meal, MealItem } from '../../../../interfaces/simple-nutrition';

@Component({
  selector: 'app-portion-control-meal',
  templateUrl: './portion-control-meal.component.html',
  styleUrls: ['./portion-control-meal.component.scss'],
})
export class PortionControlMealComponent implements OnInit {

  @Input() activeDate: string;
  @Input() meal: Meal;
  @Input() mealIndex: number;
  @Input() showAmounts = false;
  @Output() foodTapped = new EventEmitter<MealItem>();

  constructor(private store: Store) { }

  ngOnInit() {}

  public get items() {
    if (this.meal.expanded) {
      return this.meal.items;
    } else {
      return [];
    }
  }

  pickItem(item: MealItem) {
    this.foodTapped.emit(item);
  }

  toggleMealExpanded() {
    this.store.dispatch(new ToggleExpandMeal(this.activeDate, this.mealIndex));
  }
}
