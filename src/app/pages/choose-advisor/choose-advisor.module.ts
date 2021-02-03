import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChooseAdvisorPage } from './choose-advisor.page';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: ChooseAdvisorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AppComponentsModule
  ],
  declarations: [ChooseAdvisorPage]
})
export class ChooseAdvisorPageModule {}
