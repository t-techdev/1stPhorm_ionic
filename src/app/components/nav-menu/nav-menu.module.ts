import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { IonicModule } from '@ionic/angular';
import { ExpandedMenuComponent } from './components/expanded-menu/expanded-menu.component';
import { ActiveRouteDirective } from './directives/active-route.directive';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ShowMyFoodPipe } from './pipes/show-my-food/show-my-food.pipe';
import { CalorieCountingPipe } from './pipes/calorie-counting/calorie-counting.pipe';
import { ConvertUnitModule } from '../../pipes/convert-unit/convert-unit.module';
import { GoPremiumPageModule } from '../../pages/go-premium/go-premium.module';

@NgModule({
  declarations: [BottomNavComponent, ExpandedMenuComponent, ActiveRouteDirective, ShowMyFoodPipe, CalorieCountingPipe],
  imports: [
    CommonModule,
    IonicModule,
    ConvertUnitModule,
    GoPremiumPageModule
  ],
  providers: [LocalNotifications],
  exports: [BottomNavComponent, ExpandedMenuComponent],
  entryComponents: [ExpandedMenuComponent]
})
export class NavMenuModule {
}
