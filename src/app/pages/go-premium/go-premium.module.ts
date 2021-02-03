import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoPremiumPage } from './go-premium.page';
import { AppComponentsModule } from '../../components/common-components.module';
import { PremiumComponent } from '../../components/premium/premium.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppComponentsModule,
  ],
  entryComponents: [GoPremiumPage, PremiumComponent],
  declarations: [GoPremiumPage, PremiumComponent]
})
export class GoPremiumPageModule {}
