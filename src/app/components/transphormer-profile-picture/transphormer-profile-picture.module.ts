import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TransphormerProfilePictureComponent } from './transphormer-profile-picture.component';

@NgModule({
  declarations: [TransphormerProfilePictureComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [TransphormerProfilePictureComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransphormerProfilePictureModule {
}
