import { TrainerLinkingModule } from './../../components/trainer-linking/trainer-linking.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TrainerRequestsPage } from './trainer-requests.page';

const routes: Routes = [
  {
    path: '',
    component: TrainerRequestsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TrainerLinkingModule
  ],
  declarations: [TrainerRequestsPage]
})
export class TrainerRequestsPageModule {
}
