import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NutritionPage } from './nutrition.page';
import { PickItemComponent } from './pick-item/pick-item.component';
import { HelpPopupComponent } from './help-popup/help-popup.component';
import { SupplementCustomizeComponent } from './supplement-customize/supplement-customize.component';
import { MacroComponent } from './macro/macro.component';
import { PieChartModule } from '../../components/pie-chart/pie-chart.module';
import { PortionControlComponent } from './portion-control/portion-control.component';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { CalendarModule } from '../../components/calendar/calendar.module';
import { FoodGuideComponent } from './food-guide/food-guide.component';
import { AppComponentsModule } from '../../components/common-components.module';
import { PortionControlMacrosComponent } from './portion-control/portion-control-macros/portion-control-macros.component';
import { PortionControlMealComponent } from './portion-control/portion-control-meal/portion-control-meal.component';
import { PortionControlSupplementsComponent } from './portion-control/portion-control-supplements/portion-control-supplements.component';

const routes: Routes = [
  {
    path: '',
    component: NutritionPage,
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule,
    PieChartModule,
    SafeUrlModule,
    AppComponentsModule
  ],
  declarations: [
    NutritionPage,
    PickItemComponent,
    MacroComponent,
    PortionControlMealComponent,
    PortionControlSupplementsComponent,
    PortionControlComponent,
    FoodGuideComponent,
    HelpPopupComponent,
    SupplementCustomizeComponent,
    PortionControlMacrosComponent
  ],
  entryComponents: [
    PickItemComponent,
    PortionControlMealComponent,
    PortionControlSupplementsComponent,
    FoodGuideComponent,
    HelpPopupComponent,
    SupplementCustomizeComponent
  ],
  providers: [InAppBrowser]
})
export class NutritionPageModule {
}
