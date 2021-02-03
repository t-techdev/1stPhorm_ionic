import { Component, EventEmitter, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { BottomMenuService, ErrorsService, OnboardingService, ToastService } from '../../services';

import {
  AssessmentQuestion,
  BaseInfo,
  ContactInfo,
  NutritionPlan,
  PersonalInfo,
  QuestionOption
} from '../../interfaces';
import { questions } from './questions';
import { QuestionFlow } from './onboarding.types';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  public _currentState: string;
  private _activeQuestion = 1;
  public answers: { [key: string]: any } = {};
  public questions: AssessmentQuestion[] = questions;
  public _onboardingFlow: Array<QuestionFlow> = [
    {id: 'info', next: 'activity_level'},
    {id: 'activity_level', next: 'training_level_past'},
    {id: 'training_level_past', next: 'training_level'},
    {id: 'training_level', next: 'likely_to_do_past'},
    {id: 'likely_to_do_past', next: 'likely_to_do'},
    {id: 'likely_to_do', next: OnboardingPage.likelyToDoNext},
    {id: 'meals_per_day', next: 'gym_workout_selection', prev: 'likely_to_do'},
    {id: 'preference_macro_counting', next: 'gym_workout_selection', prev: 'likely_to_do'},
    {id: 'gym_workout_selection', next: 'contact'},
    {id: 'contact', next: 'finish'},
    {id: 'finish', next: null, prev: 'contact'},
  ];
  private __onboardingFlow: Array<QuestionFlow>;
  public completed = new EventEmitter<boolean>();
  private nextStep = 'walkthru';

  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  highestCompletedStep = 0;
  activeQuestion: AssessmentQuestion;

  constructor(
    private bottomMenuService: BottomMenuService,
    private onboardingService: OnboardingService,
    protected toastSvc: ToastService,
    public errorService: ErrorsService,
    private nav: NavController,
  ) {
    this.currentState = 'info';
    this.bottomMenuService.hide();
  }

  get onboardingFlow() {
    return this.__onboardingFlow || this._onboardingFlow;
  }

  get totalSteps() {
    // Shave off 1 for the "finish".
    return this.onboardingFlow.length - 1;
  }

  public getActiveQuestion(questionId: number): AssessmentQuestion {
    const question = {
      ...this.questions
        .find(i => i.id === this.onboardingFlow[questionId].id)
    };

    if (!question.id) {
      return null;
    }

    question.options = question.options.map<QuestionOption>(i => <QuestionOption>{
      ...i, is_selected: i.value === (this.answers[question.id] || null)
    });

    return question;
  }

  public get currentStep() {
    return this._activeQuestion + 1;
  }

  public get currentState() {
    return this._currentState;
  }

  public set currentState(value: string) {
    this._currentState = value;
    this._activeQuestion = this.onboardingFlow
      .findIndex(i => i.id === value);
    this.activeQuestion = this.getActiveQuestion(this._activeQuestion);
  }


  private get currentQuestion(): QuestionFlow {
    return this.onboardingFlow[this._activeQuestion];
  }

  private static likelyToDoNext(value: NutritionPlan): string {
    switch (value) {
      case NutritionPlan.PortionControl:
        return 'gym_workout_selection';
      case NutritionPlan.MacroMealPlan:
        return 'meals_per_day';
      case NutritionPlan.CalorieMacroCounting:
        return 'preference_macro_counting';
    }
  }

  ngOnInit() {
    this.__onboardingFlow = this._onboardingFlow.filter(i => i.prev !== 'likely_to_do');
  }

  public next(selectedOption?: QuestionOption) {
    let value;

    if (selectedOption) {
      value = selectedOption.value;
      this.answers[this.currentQuestion.id] = value;
    }

    this.goToNextStep();
  }

  private setStep(id: number) {
    const nextState = this.getStateForStep(id);

    if (nextState.prev) {
      const previousState = this.onboardingFlow
        .find(i => i.id === nextState.prev);
      const nextReasonableState = this.getNextStepForState(previousState);
      if (nextReasonableState !== nextState.id) {
        this.setStep(id - 1);
        return;
      }
    }

    if (this.highestCompletedStep < id) {
      this.highestCompletedStep = id;
    }

    this.currentState = nextState.id;
  }

  private getStateForStep(id: number) {
    return this.onboardingFlow.slice(id, id + 1)[0];
  }

  private getNextStepForState(state: QuestionFlow) {
    if (typeof state.next === 'string') {
      return state.next;
    } else {
      return state.next(this.answers[state.id]);
    }
  }

  startCompletion() {
    this.saveOnboardingData();
    this.onboardingService.finishOnboarding()
      .then(() => {
        // Determine what we need to do next.
        this.completed.emit(true);
        if (this.shouldGoPremium()) {
          this.nextStep = 'subscribe?showExtra=true';
        }
      })
      .catch((e) => {
        this.goToStep(1);
        this.toastSvc.flash(this.errorService.firstError(e));
      });
  }

  complete() {
    this.nav.navigateRoot(this.nextStep).then();
  }

  private saveOnboardingData() {
    const {
      training_level, gym_workout_selection, likely_to_do,
      activity_level, meals_per_day, preference_macro_counting
    } = this.answers;
    const answers: BaseInfo = {
      training_level,
      gym_workout_selection,
      home_workout_selection: this.answers.gym_or_home === 'gym' ? null : 2,
      likely_to_do,
      activity_level,
      meals_per_day,
      preference_macro_counting,
      access_to_gym: this.answers.gym_or_home === 'gym' ? '1' : '0'
    };
    this.onboardingService.addBaseInfo(answers);
  }

  savePersonalInfo(info: PersonalInfo) {
    this.personalInfo = info;
    this.onboardingService.addPersonalInfo(info);
    this.goToNextStep();
  }

  saveContactInfo(info: ContactInfo) {
    this.contactInfo = info;
    this.onboardingService.addContactInfo(info);
    this.goToNextStep();
  }

  private goToNextStep() {
    if (this.currentQuestion.id === 'likely_to_do') {
      const nextStep = OnboardingPage.likelyToDoNext(this.answers[this.currentQuestion.id]);
      this.__onboardingFlow = this._onboardingFlow.filter(i => i.prev !== 'likely_to_do' || i.id === nextStep);
    }

    const nextStateName = this.getNextStepForState(this.currentQuestion);
    const nextStepId = this.onboardingFlow.findIndex(s => s.id === nextStateName);

    this.setStep(nextStepId);
  }

  private shouldGoPremium() {
    // Are they wanting to do Macro Counting?
    if (this.answers.likely_to_do === NutritionPlan.CalorieMacroCounting) {
      return true;
    }

    // Do they want to do a home-based workout?
    if (this.answers.gym_or_home === 'home') {
      return true;
    }

    // What about a non-standard Gym workout?
    return this.answers.gym_workout_selection !== 2;
  }

  goToStep(step: number) {
    this.setStep(step - 1);
  }
}
