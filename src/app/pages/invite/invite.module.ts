import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InvitePage } from './invite.page';
import { LogoModule } from '../../components/logo/logo.module';

const routes: Routes = [
  {
    path: '',
    component: InvitePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LogoModule
  ],
  declarations: [InvitePage]
})
export class InvitePageModule {
}
