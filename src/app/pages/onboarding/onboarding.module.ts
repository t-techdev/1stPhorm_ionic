import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HeightModule } from '../../components/height/height.module';

import { OnboardingPage } from './onboarding.page';
import { AssessmentCommonModule } from '../../components/assessment-common/assessment-common.module';
import { InfoGatheringPage, IntroComponent, PersonalContactPage, PremiumPopoverComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: OnboardingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HeightModule,
    AssessmentCommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OnboardingPage,
    InfoGatheringPage,
    IntroComponent,
    PersonalContactPage,
    PremiumPopoverComponent
  ],
  entryComponents: [
    PremiumPopoverComponent
  ]
})
export class OnboardingPageModule {
}
