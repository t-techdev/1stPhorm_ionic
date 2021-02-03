import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TrainerRegistrationPage } from './trainer-registration.page';
import { LogoModule } from '../../components/logo/logo.module';

const routes: Routes = [
  {
    path: '',
    component: TrainerRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    LogoModule
  ],
  declarations: [TrainerRegistrationPage]
})
export class TrainerRegistrationPageModule {
}
