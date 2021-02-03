import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FilterComponent } from '../../components/filter/filter.component';
import { MyTransphormersPage } from './my-transphormers.page';
import { FilterModule } from '../../components/filter/filter.module';
import { ConvertUnitModule } from '../../pipes/convert-unit/convert-unit.module';

const routes: Routes = [
  {
    path: '',
    component: MyTransphormersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FilterModule,
    ReactiveFormsModule,
    FormsModule,
    ConvertUnitModule
  ],
  declarations: [MyTransphormersPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [FilterComponent]
})
export class MyTransphormersPageModule {
}
