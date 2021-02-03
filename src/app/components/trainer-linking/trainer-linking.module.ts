import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainerRequestComponent } from './trainer-request/trainer-request.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';
import { LabelValueItemComponent } from '../label-value-item/label-value-item.component';
import { AppComponentsModule } from '../common-components.module';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, AppComponentsModule],
  declarations: [TrainerRequestComponent, TrainerProfileComponent, LabelValueItemComponent],
  exports: [TrainerRequestComponent, TrainerProfileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrainerLinkingModule {
}
