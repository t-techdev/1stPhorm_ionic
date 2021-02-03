import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FreeTrialCtaComponent } from '../free-trial-cta/free-trial-cta.component';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { LogEventDecoratorService } from '../../decorators/log-event-decorator.service';

@NgModule({
  declarations: [
    FreeTrialCtaComponent,
  ],
  exports: [
    FreeTrialCtaComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  providers: [
    LogEventDecoratorService,
  ]
})
export class FreeTrialCtaModule { }
