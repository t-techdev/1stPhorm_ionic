import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PasswordChangePage } from './password-change.page';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: PasswordChangePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    AppComponentsModule
  ],
  declarations: [PasswordChangePage]
})
export class PasswordChangePageModule {}
