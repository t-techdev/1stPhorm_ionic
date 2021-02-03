import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InfoNutritionPage } from './info-nutrition.page';
import { NutritionModule } from '../../components/nutrition/nutrition.module';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: InfoNutritionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NutritionModule,
    AppComponentsModule
  ],
  declarations: [InfoNutritionPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InfoNutritionPageModule {}
