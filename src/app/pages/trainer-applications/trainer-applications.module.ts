import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TrainerApplicationsPage } from './trainer-applications.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerApplicationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TrainerApplicationsPage]
})
export class TrainerApplicationsPageModule {
}
