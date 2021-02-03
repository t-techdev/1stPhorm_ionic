import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TrainerMessagesPage } from './trainer-messages.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerMessagesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TrainerMessagesPage]
})
export class TrainerMessagesPageModule {
}
