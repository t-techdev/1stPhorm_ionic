import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contest-registration',
  templateUrl: './contest-registration.page.html',
  styleUrls: ['./contest-registration.page.scss'],
})
export class ContestRegistrationPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
  ) {

  }

  ngOnInit() {
  }

  gotIt($event: Event) {
    this.modalController.dismiss('gotIt');
  }

  async cancelAction() {
    await this.modalController.dismiss();
  }

}
