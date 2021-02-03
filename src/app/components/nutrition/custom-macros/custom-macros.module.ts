import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomMacrosComponent } from './custom-macros.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: [
    CustomMacrosComponent,
  ],
  entryComponents: [
    CustomMacrosComponent
  ],
  exports: [
    CustomMacrosComponent,
  ]
})
export class CustomMacrosModule {
}
