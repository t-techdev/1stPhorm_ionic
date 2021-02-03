import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AnalyticsService,
  ErrorsService,
  OnboardingService,
  ToastService,
} from '../../services';
import { pick } from 'lodash';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';
import {
  Sex,
  Transphormer,
  UnitTypes
} from '../../interfaces';
import { convertCentiMetersToInch, convertInchToCentiMeters, scrubExtraZeroes } from '../../helpers/map-unit-helper';
@Component({
  selector: 'app-info-personal',
  templateUrl: './info-personal.page.html',
  styleUrls: ['./info-personal.page.scss'],
})
export class InfoPersonalPage implements OnInit {
  public spinner = false;
  @Output()
  public complete: EventEmitter<undefined> = new EventEmitter();

  public transphormer: Transphormer;
  public form: FormGroup;
  public email = '';
  public SexValues = Sex;
  public UnitTypes = UnitTypes;
  public profilePictureUrl: string;
  public unitType: any;

  constructor(
    private formBuilder: FormBuilder,
    private onboardingService: OnboardingService,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
    private analyticService: AnalyticsService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      first_name: this.formBuilder.control('', [Validators.required]),
      last_name: this.formBuilder.control('', [Validators.required]),
      height: this.formBuilder.control('', [Validators.required]),
      goal_weight: this.formBuilder.control('', [Validators.required]),
      date_of_birth: this.formBuilder.control('', [Validators.required]),
      sex: this.formBuilder.control('', [Validators.required]),
      unit_type: this.formBuilder.control('')
    });

    this.form.valueChanges.subscribe(() => {
      if (!this.transphormer) {
        return;
      }
      // Update values in case items in the form want these for value calculations.
      const values = this.form.getRawValue();
      this.updateTransphormerLocalData(values);
    });

    this.form.get('unit_type').valueChanges.subscribe((value) => {
      if (!this.transphormer) {
        return;
      }
      const newValue = value === UnitTypes.Imperial ? this.transphormer.goal_weight_units.imperial.value : this.transphormer.goal_weight_units.metric.value;
      this.form.get('goal_weight').setValue(scrubExtraZeroes(newValue.toFixed(2)));
      if (this.transphormer.unit_type !== value) {
        this.form.get('height').setValue(
          value === UnitTypes.Imperial ? Math.round(convertCentiMetersToInch(this.transphormer.height))
            : Math.round(convertInchToCentiMeters(this.transphormer.height))
        );
      } else {
        this.form.get('height').setValue(this.transphormer.height);
      }
    });
    this.fetchProfile();
  }

  private updateTransphormerLocalData(values) {
    delete values.unit_type;
    delete values.height;
    this.transphormer = Object.assign({}, this.transphormer, values);
  }

  private applyTransphormerProfile(transphormer: Transphormer) {
    this.transphormer = transphormer;
    this.form.patchValue(pick(transphormer, Object.keys(this.form.getRawValue())));

    this.profilePictureUrl = transphormer.profile_picture_url;
    this.form.get('date_of_birth').setValue(transphormer.dob);
    this.email = transphormer.email;
    this.unitType = transphormer.unit_type || UnitTypes.Imperial;
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
    return this.transphormer.is_paid_user && (this.transphormer.likely_to_do === 'Calorie / Macro counting');
  }

  public async updateProfile() {
    try {
      const data = <Transphormer>this.form.getRawValue();
      data.goal_weight_unit = data.unit_type;

      const updatedInfo = <Transphormer>await this.onboardingService.updateOnBoardInformation(data);
      this.applyTransphormerProfile(updatedInfo);
      this.toastSvc.flash('Profile saved.');
      this.analyticService.logEvent(AnalyticEvents.UpdatingProfile, {});
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  sexChanged($event: CustomEvent) {
    this.form.get('sex').setValue($event.detail.value);
  }

  unitChanged($event: CustomEvent) {
    this.unitType = +$event.detail.value;
    this.form.get('unit_type').setValue(+$event.detail.value);
  }
}
