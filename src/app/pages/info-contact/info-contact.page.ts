import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnalyticsService, ToastService, ErrorsService, OnboardingService } from '../../services';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';
import {
  Transphormer
} from '../../interfaces';
import { pick } from 'lodash';

@Component({
  selector: 'app-info-contact',
  templateUrl: './info-contact.page.html',
  styleUrls: ['./info-contact.page.scss'],
})
export class InfoContactPage implements OnInit {
  public form: FormGroup;
  public spinner = false;
  public transphormer: Transphormer;

  constructor(
    private formBuilder: FormBuilder,
    private analyticService: AnalyticsService,
    private toastSvc: ToastService,
    public errorService: ErrorsService,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      address: this.formBuilder.control(''),
      city: this.formBuilder.control(''),
      state: this.formBuilder.control(''),
      postal_code: this.formBuilder.control(''),
      country: this.formBuilder.control(''),
      phone: this.formBuilder.control(''),
      instagram: this.formBuilder.control(''),
      twitter: this.formBuilder.control('')
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

  private updateTransphormerLocalData(values) {
    this.transphormer = Object.assign({}, this.transphormer, values);
  }

  private applyTransphormerProfile(transphormer: Transphormer) {
    this.transphormer = transphormer;
    this.form.patchValue(pick(transphormer, Object.keys(this.form.getRawValue())));
  }

  protected async fetchProfile() {
    this.spinner = true;
    try {
      const transphormer = <Transphormer>await this.onboardingService.fetchOnBoard();
      console.log(transphormer)
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
      const updatedInfo = <Transphormer>await this.onboardingService.updateOnBoardInformation(data);
      this.applyTransphormerProfile(updatedInfo);
      this.toastSvc.flash('Contact information saved.');
      this.analyticService.logEvent(AnalyticEvents.UpdatingProfile, {});
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    }
  }
}
