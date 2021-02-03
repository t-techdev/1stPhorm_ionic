import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NutritionModule } from '../../components/nutrition/nutrition.module';
import { MacroPage } from './macro.page';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { CalendarModule } from '../../components/calendar/calendar.module';
import { CustomMacrosModule } from '../../components/nutrition/custom-macros/custom-macros.module';

const routes: Routes = [
  {
    path: '',
    component: MacroPage,
    canDeactivate: [AndroidBackButtonGuard]
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NutritionModule,
    CalendarModule,
    IonicModule,
    CustomMacrosModule,
    RouterModule.forChild(routes),
  ],
  declarations: [MacroPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MacroPageModule { }
