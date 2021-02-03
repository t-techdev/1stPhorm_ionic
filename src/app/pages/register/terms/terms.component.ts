import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
  ) {
  }

  ngOnInit() {
  }

  public close() {
    this.modalCtrl.dismiss();
  }
}
