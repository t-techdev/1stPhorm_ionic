import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from '../../../services/nutrition/nutrition.service';

@Component({
  selector: 'app-around-this-time',
  templateUrl: './around-this-time.component.html',
  styleUrls: ['./around-this-time.component.scss'],
})
export class AroundThisTimeComponent implements OnInit {

  @Input()
  public aroundThisTimeItems: FoodItem[] = [];
  
  @Output()
  public openRecentFood: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public addMealTemplate: EventEmitter<any> = new EventEmitter<any>();

  public showMoreAroundThisTime = false;
  
  constructor() { }

  ngOnInit() {}

}
