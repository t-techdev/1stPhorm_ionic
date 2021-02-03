import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WalkthruPage } from './walkthru.page';
import { WalkthruItemComponent } from './components/walkthru-item/walkthru-item.component';

const routes: Routes = [
  {
    path: '',
    component: WalkthruPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalkthruPage, WalkthruItemComponent]
})
export class WalkthruPageModule {}
