import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-go-premium',
  templateUrl: './go-premium.page.html',
  styleUrls: ['./go-premium.page.scss'],
})
export class GoPremiumPage implements OnInit {
  public type: String;

  constructor(
    private modalController: ModalController,
    private nav: NavController,
    private navParams: NavParams,
  ) {

  }

  ngOnInit() {
    this.type = this.navParams.get('type');
  }

  goPremium() {
    this.modalController.dismiss();
    this.nav.navigateRoot('subscribe');
  }

  get title() {
    switch (this.type) {
      case 'live-streaming':
        return 'Live Streaming';
      case 'messages':
        return 'Advisor Messaging';
      case 'body-metrics':
        return 'Body Metrics';
      default:
      return 'Premium Functionality';
    }
  }
}
