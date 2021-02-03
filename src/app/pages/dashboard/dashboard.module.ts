import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ContestWidgetModule } from '../../components/contest-widget/contest-widget.module';
import { DashboardComponentsModule } from '../../components/dashboard-components/dashboard-components.module';
import { AppComponentsModule } from '../../components/common-components.module';
import { ConvertUnitModule } from '../../pipes/convert-unit/convert-unit.module';
import { GoPremiumPageModule } from '../go-premium/go-premium.module';
import { FreeTrialCtaModule } from '../../components/free-trial-cta/free-trial-cta.module';
import { FeatureFlagModule } from '../../directives/feature-flag/feature-flag.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SafeUrlModule,
        ContestWidgetModule,
        DashboardComponentsModule,
        AppComponentsModule,
        GoPremiumPageModule,
        ConvertUnitModule,
        FreeTrialCtaModule,
        FeatureFlagModule
    ],
  declarations: [DashboardPage],
  entryComponents: [],
  providers: [
    LocalNotifications,
    InAppBrowser
  ]
})
export class DashboardPageModule {
}
