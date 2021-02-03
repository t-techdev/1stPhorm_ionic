import { Component, Input, OnInit } from '@angular/core';
import { MacroManagementService } from '../../services/macro-management/macro-management.service';
import { Transphormer } from '../../interfaces';

@Component({
  selector: 'app-macros-consumed',
  templateUrl: './macros-consumed.component.html',
  styleUrls: ['./macros-consumed.component.scss'],
})
export class MacrosConsumedComponent implements OnInit {

  @Input() public goalValues: {
    calories: number,
    protein: number,
    fats: number,
    carbs: number,
  } = null;

  @Input() public transphormer: Transphormer;

  @Input() public displayMacros: {
    fats: number | string;
    carbs: number | string;
    protein: number | string;
    calories: number | string
  } = null;

  constructor(
    public macroManagement: MacroManagementService,
  ) { }

  ngOnInit() {
    this.setupMacros();
  }

  get calsRemaining(): number {
    return Math.round(this.goalValues.calories - +this.displayMacros.calories);
  }

  public setupMacros() {
    if (this.goalValues !== null && this.displayMacros !== null) {
      return;
    }
    this.macroManagement.macros(this.transphormer, true, this.transphormer.latest_weight)
      .then((result) => {
        this.goalValues = result.goalValues;
        return this.macroManagement.displayMacros(this.transphormer, result.macros, result.meals);
      })
      .then((result) => {
        this.displayMacros = result;
      });
  }
}
