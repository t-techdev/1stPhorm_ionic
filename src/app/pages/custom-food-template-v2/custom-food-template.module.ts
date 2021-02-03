import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CustomFoodTemplatePage } from './custom-food-template.page';
import { NutritionV2Module } from '../../components/nutrition-v2/nutrition.module';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomFoodTemplatePage,
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NutritionV2Module,
    ReactiveFormsModule
  ],
  declarations: [CustomFoodTemplatePage],
  entryComponents: []
})
export class CustomFoodTemplateV2PageModule {
}
