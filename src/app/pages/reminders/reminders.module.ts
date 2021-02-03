import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RemindersPage } from './reminders.page';
import { HiddenSettingsComponent } from '../../components/hidden-settings/hidden-settings.component';

const routes: Routes = [
  {
    path: '',
    component: RemindersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [RemindersPage, HiddenSettingsComponent],
  entryComponents: [HiddenSettingsComponent]
})
export class RemindersPageModule {}
