import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProgressUpdateModule } from '../../../components/progress-update/progress-update.module';
import { AppComponentsModule } from '../../../components/common-components.module';
import { AssessmentListPage } from './assessment-list.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProgressUpdateModule,
    AppComponentsModule
  ],
  declarations: [AssessmentListPage]
})
export class AssessmentListPageModule {
}
