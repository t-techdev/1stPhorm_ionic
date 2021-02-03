import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from '../../../services/nutrition/nutrition.service';

@Component({
  selector: 'app-recent-food',
  templateUrl: './recent-food.component.html',
  styleUrls: ['./recent-food.component.scss'],
})
export class RecentFoodComponent implements OnInit {
  
  @Input()
  public recentItems: FoodItem[] = [];
  
  @Output()
  public openRecentFood: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

}
