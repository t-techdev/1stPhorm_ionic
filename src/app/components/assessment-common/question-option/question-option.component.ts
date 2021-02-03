import { Component, Input, OnInit } from '@angular/core';
import { QuestionOption } from '../../../interfaces';
import { PopoverController } from '@ionic/angular';
import { PremiumPopoverComponent } from '../../../pages/onboarding/components';

@Component({
  selector: 'app-question-option',
  templateUrl: './question-option.component.html',
  styleUrls: ['./question-option.component.scss'],
})
export class QuestionOptionComponent implements OnInit {

  hideIcon = false;
  hideSvg = false;

  @Input() option: QuestionOption;

  constructor(
    public popoverController: PopoverController
  ) {
  }

  ngOnInit() {
  }

  async premium(ev: Event) {
    ev.stopPropagation();
    const popover = await this.popoverController.create({
      component: PremiumPopoverComponent,
      cssClass: 'premium-option',
      showBackdrop: false,
      event: ev,
    });
    return await popover.present();
  }

}
