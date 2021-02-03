import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SubscribePage } from './subscribe.page';
import { ProductBlockComponent } from './product-block/product-block.component';

const routes: Routes = [
  {
    path: '',
    component: SubscribePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SubscribePage, ProductBlockComponent]
})
export class SubscribePageModule {}
