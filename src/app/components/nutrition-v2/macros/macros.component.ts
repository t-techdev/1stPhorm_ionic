import { Component, OnInit, Input } from '@angular/core';
import { NutritionService } from '../../../services/nutrition/nutrition.service';

@Component({
  selector: 'app-macros',
  templateUrl: './macros.component.html',
  styleUrls: ['./macros.component.scss'],
})
export class MacrosComponent implements OnInit {
  @Input()
  public currentValue = 0;

  @Input()
  public totalValue = 0;

  @Input()
  public barColor = '';

  @Input()
  public dangerColor = '';

  @Input()
  public categoryName = '';

  @Input()
  public currentNutritionValue = 0;

  @Input()
  public goalValue = 0;

  constructor(public nutritionService: NutritionService) {
  }

  ngOnInit() {
  }

  public get percentage(): number {
    return (this.currentNutritionValue / this.goalValue) * 100;
  }

  public get changeBarColor(): string {
    if (this.percentage >= 100 && !this.withinMacroTarget) {
      return this.dangerColor;
    }

    return this.barColor;
  }

  public get withinMacroTarget(): boolean {
    const targetWindow = this.categoryName === 'fats' ? 3 : 5;
    return (this.currentNutritionValue >= this.goalValue - targetWindow)
      && (this.currentNutritionValue <= this.goalValue + targetWindow);
  }

}
