import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message/message.service';
import { OnboardingService } from '../../services/onboarding/onboarding.service';
import { NutritionPlan, Transphormer } from '../../interfaces';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-post-subscription-popup',
  templateUrl: './post-subscription-popup.component.html',
  styleUrls: ['./post-subscription-popup.component.scss'],
})
export class PostSubscriptionPopupComponent implements OnInit {

  public step = 'advisor';
  public totalSteps = 3;
  private _currentStep = 1;

  public user: Transphormer;
  public data;

  constructor(
    private messageService: MessageService,
    private onboarding: OnboardingService,
    private modal: ModalController,
  ) {
  }

  ngOnInit() {
    const {
      gym_workout_selection,
      meals_per_day,
    } = this.user;

    const preference_macro_counting = this.user.likely_to_do === NutritionPlan.CalorieMacroCounting
      ? this.user.preference_macro_counting : 'Both';

    this.data = {
      likely_to_do: NutritionPlan.CalorieMacroCounting,
      gym_workout_selection,
      meals_per_day,
      preference_macro_counting
    };
    if (this.user.linked_trainer === null) {
      this.totalSteps = 2;
      this.step = 'nutrition';
    }
  }

  get currentStep(): number {
    return this._currentStep;
  }

  set currentStep(value: number) {
    switch (value) {
      default:
      case 1:
        this.step = this.totalSteps === 3 ? 'advisor' : 'nutrition';
        break;
      case 2:
        this.step = this.totalSteps === 3 ? 'nutrition' : 'workout';
        break;
      case 3:
        this.step = 'workout';
    }
    this._currentStep = value;
  }

  async finish() {
    await this.onboarding.updateOnBoardInformation(this.data);
    await this.modal.dismiss();
  }

  close() {
    this.modal.dismiss().then();
  }

  updateValues($event: any) {
    this.data = {...this.data, ...$event};
  }

  sendMessage(messageContent: string) {
    this.messageService.sendMessage(this.user.linked_trainer.trainer.transphormer.id, messageContent).then();
  }

  next() {
    this.currentStep = this.currentStep + 1;
  }
}
