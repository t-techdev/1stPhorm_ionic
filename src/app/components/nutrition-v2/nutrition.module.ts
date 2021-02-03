import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { IonicModule } from '@ionic/angular';
import { MacrosComponent } from './macros/macros.component';
import { WaterComponent } from './water/water.component';
import { MealListComponent } from './meal-list/meal-list.component';
import { MealItemComponent } from './meal-item/meal-item.component';
import { AddFoodComponent } from './add-food/add-food.component';
import { CustomFoodComponent } from './custom-food/custom-food.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditFoodComponent } from './edit-food/edit-food.component';
import { FactorNumberComponent } from './factor-number/factor-number.component';
import { MealTemplateNameComponent } from './meal-template-name/meal-template-name.component';
import { FoodItemComponent } from './food-item/food-item.component';
import { CopyMealsDayComponent } from './copy-meals-day/copy-meals-day.component';
import { CalendarMiniComponent } from './calendar-mini/calendar-mini.component';
import { SearchFoodComponent } from './search-food/search-food.component';
import { RecentFoodComponent } from './recent-food/recent-food.component';
import { AroundThisTimeComponent } from './around-this-time/around-this-time.component';
import { QuickAddComponent } from './quick-add/quick-add.component';
import { QuickItemComponent } from './quick-item/quick-item.component';

@NgModule({
  declarations: [
    ProgressBarComponent,
    MacrosComponent,
    WaterComponent,
    MealListComponent,
    MealItemComponent,
    AddFoodComponent,
    CustomFoodComponent,
    EditFoodComponent,
    FactorNumberComponent,
    CopyMealsDayComponent,
    CalendarMiniComponent,
    MealTemplateNameComponent,
    FoodItemComponent,
    AroundThisTimeComponent,
    SearchFoodComponent,
    RecentFoodComponent,
    QuickAddComponent, QuickItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ProgressBarComponent,
    MacrosComponent,
    WaterComponent,
    MealListComponent,
    MealItemComponent,
    AddFoodComponent,
    CustomFoodComponent,
    CopyMealsDayComponent,
    CalendarMiniComponent,
    AroundThisTimeComponent,
    SearchFoodComponent,
    RecentFoodComponent,
    QuickAddComponent
  ],
  entryComponents: [
    EditFoodComponent,
    MealTemplateNameComponent,
    FoodItemComponent,
    AddFoodComponent
  , QuickAddComponent, QuickItemComponent]
})
export class NutritionV2Module {
}
