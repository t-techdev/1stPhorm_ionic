import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AnalyticsService,
  ErrorsService,
  FeatureFlagService, NutritionCalculatorService,
  OnboardingService,
  ToastService,
} from '../../services';
import { ModalController, NavController, } from '@ionic/angular';
import { pick } from 'lodash';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';
import {
  ActiveLevels,
  NutritionPlan,
  TransphormationGoal,
  Transphormer
} from '../../interfaces';
import { CustomMacrosComponent } from '../../components/nutrition/custom-macros/custom-macros.component';

@Component({
  selector: 'app-info-nutrition',
  templateUrl: './info-nutrition.page.html',
  styleUrls: ['./info-nutrition.page.scss'],
})
export class InfoNutritionPage implements OnInit {
  public spinner = false;
  @Output()
  public complete: EventEmitter<undefined> = new EventEmitter();

  public transphormer: Transphormer;
  public form: FormGroup;
  public transphormationGoals = TransphormationGoal;
  public activeLevels = ActiveLevels;
  public is_free_user = false;
  public NutritionPlan = NutritionPlan;
  public atHomeWorkoutsAreFree: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
    private nutritionCalculatorService: NutritionCalculatorService,
    private navCtrl: NavController,
    private modal: ModalController,
    private analyticService: AnalyticsService,
    private features: FeatureFlagService,
  ) {
    this.features.get$('free-at-home', false)
      .subscribe((value) => {
        this.atHomeWorkoutsAreFree = value;
      });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      likely_to_do: this.formBuilder.control('', [Validators.required]),
      preference_macro_counting: this.formBuilder.control(''),
      meals_per_day: this.formBuilder.control(''),
      transphormation_goal: this.formBuilder.control('', [Validators.required]),
      activity_level: this.formBuilder.control('', [Validators.required])
    });

    this.form.valueChanges.subscribe(() => {
      if (!this.transphormer) {
        return;
      }
      // Update values in case items in the form want these for value calculations.
      const values = this.form.getRawValue();
      this.updateTransphormerLocalData(values);
    });

    this.form.get('likely_to_do').valueChanges.subscribe((value: NutritionPlan) => {
      const values = this.form.getRawValue();
      if (value === NutritionPlan.CalorieMacroCounting) {
        if (this.is_free_user) {
          values.likely_to_do = 'Portion control';
        } else {
          if (!this.transphormer.preference_macro_counting) {
            values.preference_macro_counting = 'Carbs';
            this.form.get('preference_macro_counting').setValue('Carbs');
          }
        }
      }
      this.updateTransphormerLocalData(values);
    });

    this.fetchProfile();
  }

  private updateTransphormerLocalData(values) {
    this.transphormer = Object.assign({}, this.transphormer, values);
  }

  public goPremium() {
    this.navCtrl.navigateRoot('subscribe');
  }

  private applyTransphormerProfile(transphormer: Transphormer) {
    this.transphormer = transphormer;
    this.form.patchValue(pick(transphormer, Object.keys(this.form.getRawValue())));

    this.is_free_user = !transphormer.is_paid_user;
    this.form.get('meals_per_day').setValue(!transphormer.meals_per_day ? 3 : transphormer.meals_per_day);
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

  public get isMacroCalorieCounting() {
    if (!this.transphormer) {
      return false;
    }
    return this.transphormer.is_paid_user && (this.form.get('likely_to_do').value === 'Calorie / Macro counting');
  }

  public async updateProfile() {
    try {
      const data = <Transphormer>this.form.getRawValue();
      if (data.likely_to_do !== 'Macro meal plan') {
        data.meals_per_day = 3;
      }

      const updatedInfo = <Transphormer>await this.onboardingService.updateOnBoardInformation(data);
      this.applyTransphormerProfile(updatedInfo);
      this.toastSvc.flash('Nutrition information saved.');
      this.analyticService.logEvent(AnalyticEvents.UpdatingProfile, {});
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  public get hasCustomMacros() {
    if (!this.transphormer) {
      return false;
    }

    return this.transphormer.custom_macros && !this.transphormer.custom_macros.reset_to_original;
  }

  /**
   * Open modal for editing/creating custom macro
   */
  public async openCustomMacro() {
    const bmrValues = this.nutritionCalculatorService.calculateAdvancedMacros(
      +this.transphormer.latest_weight.imperial.value, +this.transphormer.goal_weight_units.imperial.value, this.transphormer.activity_level,
      this.transphormer.transphormation_goal, this.transphormer.sex, this.transphormer.preference_macro_counting
    );

    const macroModal = await this.modal.create({
      component: CustomMacrosComponent,
      componentProps: {
        originalMacro: bmrValues,
      }
    });

    await macroModal.present();

    const result = await macroModal.onDidDismiss();

    if (result.data) {
      const custom_macros = result.data;
      this.transphormer = Object.assign({}, this.transphormer, { custom_macros });
    }
  }
}
