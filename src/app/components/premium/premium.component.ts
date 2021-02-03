import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-premium, [appPremium]',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {
  @Input() image: String;
  @Input() continueButtonText: String;
  @Input() cancelText: String;

  @Output() goPremium = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  continue($event: Event) {
    this.goPremium.emit();
  }

  async cancelAction() {
    await this.modalController.dismiss();
  }

}
