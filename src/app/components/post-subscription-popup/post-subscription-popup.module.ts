import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PostSubscriptionPopupComponent } from './post-subscription-popup.component';
import { AppComponentsModule } from '../common-components.module';
import {
  SubscriptionAdvisorInfoComponent,
  SubscriptionNutritionPlanComponent,
  SubscriptionTrainingPlanComponent
} from './components';
import { AssessmentCommonModule } from '../assessment-common/assessment-common.module';
import { CustomMacrosComponent } from '../nutrition/custom-macros/custom-macros.component';
import { CustomMacrosModule } from '../nutrition/custom-macros/custom-macros.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AppComponentsModule,
    AssessmentCommonModule,
    CustomMacrosModule,
  ],
  declarations: [
    PostSubscriptionPopupComponent,
    SubscriptionAdvisorInfoComponent,
    SubscriptionNutritionPlanComponent,
    SubscriptionTrainingPlanComponent,
  ],
  exports: [
    PostSubscriptionPopupComponent,
  ],
  entryComponents: [
    PostSubscriptionPopupComponent,
    SubscriptionAdvisorInfoComponent,
    SubscriptionNutritionPlanComponent,
    SubscriptionTrainingPlanComponent,
    CustomMacrosComponent
  ]
})
export class PostSubscriptionPopupModule {
}
