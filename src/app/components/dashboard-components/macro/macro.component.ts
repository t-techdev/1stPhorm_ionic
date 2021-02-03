import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-macro',
  templateUrl: './macro.component.html',
  styleUrls: ['./macro.component.scss'],
})
export class MacroComponent implements OnInit {

  @Input()
  public macroValue: number | string = '?';

  @Input()
  public macroType: 'calories' | 'protein' | 'carbs' | 'fats' = 'calories';

  @Input()
  public goal = 0;

  constructor() {
  }

  ngOnInit() {
  }

  public get withinMacroTarget(): boolean {
    if (this.macroType !== 'calories') {
      let w = 5;
      if (this.macroType === 'fats')
        w = 3;
      if (this.macroValue >= this.goal - w && this.macroValue <= this.goal + w)
        return true;
      else
        return false;
    }

    return false;
  }

  public get percentage(): number {

    if (<any>this.macroValue instanceof String) {
      return 0;
    }

    return (<number>this.macroValue / this.goal) * 100;
  }

}
