import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HelpPage } from './help.page';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { NutritionInfoComponent } from './nutrition-info/nutrition-info.component';
import { PortionControlComponent } from './portion-control/portion-control.component';
import { FoodGuideComponent } from './food-guide/food-guide.component';
import { ExternalLinkModule } from '../../directives/external-link/external-link.module';
import { WarmupComponent } from './workouts/warmup/warmup.component';

const routes: Routes = [
  { path: '', component: HelpPage },
  { path: 'meal-plan', component: MealPlanComponent },
  { path: 'portion-control', component: PortionControlComponent },
  { path: 'food-guide', component: FoodGuideComponent },
  { path: 'nutrition', component: NutritionInfoComponent },
  { path: 'warmups', component: WarmupComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExternalLinkModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HelpPage,
    MealPlanComponent,
    NutritionInfoComponent,
    PortionControlComponent,
    WarmupComponent,
    FoodGuideComponent
  ]
})
export class HelpPageModule {
}
