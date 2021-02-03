import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TrainerAnnouncementsPage } from './trainer-announcements.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerAnnouncementsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TrainerAnnouncementsPage]
})
export class TrainerAnnouncementsPageModule {
}
