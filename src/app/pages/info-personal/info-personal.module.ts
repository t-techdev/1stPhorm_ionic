import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InfoPersonalPage } from './info-personal.page';
import { TransphormerProfilePictureModule } from './../../components/transphormer-profile-picture/transphormer-profile-picture.module';
import { HeightModule } from '../../components/height/height.module';

const routes: Routes = [
  {
    path: '',
    component: InfoPersonalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TransphormerProfilePictureModule,
    HeightModule
  ],
  declarations: [InfoPersonalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InfoPersonalPageModule {}
