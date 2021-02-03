import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContestRegistrationPage } from './contest-registration.page';
import { AppComponentsModule } from '../../components/common-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppComponentsModule,
  ],
  entryComponents: [ContestRegistrationPage],
  declarations: [ContestRegistrationPage]
})
export class ContestRegistrationPageModule { }
