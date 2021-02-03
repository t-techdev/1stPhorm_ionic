import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-info-customize',
  templateUrl: './info-customize.component.html',
  styleUrls: ['./info-customize.component.scss'],
})
export class InfoCustomizeComponent {

  constructor(
    public popoverCtrl: PopoverController
  ) {
  }

  public close() {
    this.popoverCtrl.dismiss();
  }

}
