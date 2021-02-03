import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroComponent } from './macro/macro.component';
import { WeightWidgetComponent } from '../weight-widget/weight-widget.component';
import { IonicModule } from '@ionic/angular';
import { ConvertUnitModule } from '../../pipes/convert-unit/convert-unit.module';
import { MacrosConsumedComponent } from '../macros-consumed/macros-consumed.component';
import { TodaysWorkoutComponent } from '../todays-workout/todays-workout.component';
import { DashboardVideoComponent } from '../dashboard-video/dashboard-video.component';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';

@NgModule({
  declarations: [
    MacroComponent,
    MacrosConsumedComponent,
    TodaysWorkoutComponent,
    DashboardVideoComponent,
    WeightWidgetComponent,
  ],
  exports: [
    MacroComponent,
    WeightWidgetComponent,
    TodaysWorkoutComponent,
    DashboardVideoComponent,
    MacrosConsumedComponent,
  ],
  imports: [
    SafeUrlModule,
    ConvertUnitModule,
    CommonModule,
    IonicModule,
  ],
})
export class DashboardComponentsModule { }
