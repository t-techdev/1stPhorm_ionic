import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
  AnalyticsService,
  ErrorsService,
  FeatureFlagService,
  OnboardingService,
  ToastService,
} from '../../services';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';

import {
  AtHomeWorkoutTypes,
  ProgramTypes,
  TrainingLevels,
  TrainingProgramTypes,
  Transphormer
} from '../../interfaces';
import { pick } from 'lodash';

@Component({
  selector: 'app-info-workout',
  templateUrl: './info-workout.page.html',
  styleUrls: ['./info-workout.page.scss'],
})
export class InfoWorkoutPage implements OnInit {
  public spinner = false;
  @Output()
  public complete: EventEmitter<undefined> = new EventEmitter();

  public transphormer: Transphormer;
  public form: FormGroup;
  public trainingLevels = TrainingLevels;
  public is_free_user = false;
  public atHomeWorkoutsAreFree: boolean;
  private workout_selection: { '0': ProgramTypes; '1': ProgramTypes };

  constructor(
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
    private analyticService: AnalyticsService,
    private features: FeatureFlagService,
    private navCtrl: NavController
  ) {
    this.features.get$('free-at-home', false)
      .subscribe((value) => {
        this.atHomeWorkoutsAreFree = value;
      });

    this.workout_selection = {
      0: null,
      1: null,
    };
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      access_to_gym: this.formBuilder.control('', [Validators.required]),
      gym_workout_selection: this.formBuilder.control(''),
      rest_day_config: this.formBuilder.control(''),
      training_level: this.formBuilder.control('', [Validators.required])
    });

    this.form.valueChanges.subscribe(() => {
      if (!this.transphormer) {
        return;
      }
      // Update values in case items in the form want these for value calculations.
      const values = this.form.getRawValue();
      this.updateTransphormerLocalData(values);
    });

    this.fetchProfile();
  }

  get programTypes() {
    return (+this.form.get('access_to_gym').value === 1) ? TrainingProgramTypes : AtHomeWorkoutTypes;
  }

  private updateTransphormerLocalData(values) {
    delete values.unit_type;
    delete values.height;
    this.transphormer = Object.assign({}, this.transphormer, values);
  }

  public goPremium() {
    this.navCtrl.navigateRoot('subscribe');
  }

  private applyTransphormerProfile(transphormer: Transphormer) {
    this.transphormer = transphormer;
    this.form.patchValue(pick(transphormer, Object.keys(this.form.getRawValue())));
    // The Transphormer's "access_to_gym" will always be 1 because we base the workout selection on the
    // actual value of the workout here. So we "fix it" in a way that makes sense to the user for now.
    const accessToGym = AtHomeWorkoutTypes.map(t => t.value).includes(transphormer.gym_workout_selection) ? '0' : '1';
    this.form.get('access_to_gym').setValue(accessToGym);
    this.workout_selection[this.form.get('access_to_gym').value] = +this.form.get('gym_workout_selection').value;
    this.is_free_user = !transphormer.is_paid_user;
  }

  protected async fetchProfile() {
    this.spinner = true;

    try {
      const transphormer = <Transphormer>await this.onboardingService.fetchOnBoard();
      this.applyTransphormerProfile(transphormer);
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  public async updateProfile() {
    try {
      const data = <Transphormer>this.form.getRawValue();
      if (data.likely_to_do !== 'Macro meal plan') {
        data.meals_per_day = 3;
      }
      data.goal_weight_unit = data.unit_type;
      data.access_to_gym = '1';

      const updatedInfo = <Transphormer>await this.onboardingService.updateOnBoardInformation(data);
      this.applyTransphormerProfile(updatedInfo);
      this.toastSvc.flash('Workout information saved.');
      this.analyticService.logEvent(AnalyticEvents.UpdatingProfile, {});
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  public getProgramType(value) {
    const allPrograms = [ ...AtHomeWorkoutTypes, ...TrainingProgramTypes ];
    return allPrograms.find(programType => programType.value === value);
  }

  public get hasCustomMacros() {
    if (!this.transphormer) {
      return false;
    }

    return this.transphormer.custom_macros && !this.transphormer.custom_macros.reset_to_original;
  }

  gymChanged($event: CustomEvent) {
    // Set the previous value so that we know what to go back to.
    const existingValue = this.form.get('access_to_gym').value;
    const access_to_gym = $event.detail.value;

    this.workout_selection[existingValue] = +this.form.get('gym_workout_selection').value;
    const gym_workout_selection = this.workout_selection[access_to_gym] ||
      (access_to_gym === '1'
        ? TrainingProgramTypes[0].value
        : AtHomeWorkoutTypes[0].value);

    this.form.patchValue({
      access_to_gym,
      gym_workout_selection
    });
  }
}
