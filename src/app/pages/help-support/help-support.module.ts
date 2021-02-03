import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HelpSupportPage } from './help-support.page';
import { InAppPurchase2 } from 'third-party/in-app-purchase-2/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

const routes: Routes = [
  {
    path: '',
    component: HelpSupportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HelpSupportPage],
  providers: [
    InAppPurchase2,
    InAppBrowser
  ]
})
export class HelpSupportPageModule {}
