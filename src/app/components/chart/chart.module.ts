import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ChartComponent, LineChartComponent],
  exports: [ChartComponent, LineChartComponent]
})
export class ChartModule {
}
