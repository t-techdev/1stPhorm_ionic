import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from '../../../services/nutrition/nutrition.service';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss'],
})
export class FoodItemComponent implements OnInit {

  @Input() public foodItem: FoodItem;

  @Output() public openEditFoodItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() public addFoodItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() public saveAsMealTemplate: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  openEditFoodItemEvent(foodItem: FoodItem) {
    this.openEditFoodItem.emit(foodItem);
  }

  addFoodItemEvent() {
    this.addFoodItem.emit();
  }

  saveAsMealTemplateEvent() {
    this.saveAsMealTemplate.emit();
  }
}
