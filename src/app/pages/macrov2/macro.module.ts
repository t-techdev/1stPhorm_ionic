import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NutritionV2Module } from '../../components/nutrition-v2/nutrition.module';
import { CalendarModule } from '../../components/calendar/calendar.module';
import { MacroPage } from './macro.page';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { CopyMealsDayComponent } from '../../components/nutrition-v2/copy-meals-day/copy-meals-day.component';
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
    IonicModule,
    RouterModule.forChild(routes),
    NutritionV2Module,
    CustomMacrosModule,
    CalendarModule,
  ],
  declarations: [MacroPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CopyMealsDayComponent]
})
export class MacroV2PageModule { }
