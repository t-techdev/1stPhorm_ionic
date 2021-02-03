import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { ModalController } from '@ionic/angular';
import { AccountService, AccountSetting } from '../../services/account/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
import { UserService } from '../../services/user/user.service';
import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import { delay, exhaustMap, finalize, takeUntil, tap } from 'rxjs/operators';
import { HiddenSettingsComponent } from '../../components/hidden-settings/hidden-settings.component';
import { LogEvent } from '../../decorators/log-event-decorator.service';
import { catchFormError } from '../../helpers/operators';
import { Transphormer } from '../../interfaces';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage implements OnInit, OnDestroy {
  public spinner = false;
  public form: FormGroup;

  @ViewChild('logo') public logo: ElementRef;

  public transphormer: Transphormer;
  private click$: Observable<any>;
  private meh: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public errorService: ErrorsService,
    private modalController: ModalController,
    private toastSvc: ToastService,
    private accountService: AccountService,
    private user: UserService,
    private analyticService: AnalyticsService
  ) {
  }

  ngOnDestroy() {
    this.meh.unsubscribe();
  }

  ngOnInit() {
    this.transphormer = this.user.user;
    this.form = this.formBuilder.group({
      photo_reminder: this.formBuilder.control('', [Validators.required]),
      weigh_reminder: this.formBuilder.control('', [Validators.required]),
      workout_reminder: this.formBuilder.control('', [Validators.required]),
      what_time: this.formBuilder.control('', [Validators.required]),
      receive_email: this.formBuilder.control('', [Validators.required]),
      receive_notification: this.formBuilder.control('', [Validators.required]),
      receive_livestream_notification: this.formBuilder.control({
        value: false,
        disabled: !this.transphormer.is_paid_user
      }, [Validators.required]),
    });

    this.getAccountSetting();

    this.click$ = fromEvent(this.logo.nativeElement, 'click');
    this.meh = this.click$
      .pipe(
        exhaustMap(() => this.click$.pipe(takeUntil(interval(200)))),
      ).subscribe((next) => {
        this.modalController.create({
          component: HiddenSettingsComponent,
          cssClass: 'go-premium-css',
        }).then((modal) => {
          modal.present();
        });
      });
  }

  private async getAccountSetting() {
    this.accountService.getAccountSetting()
      .pipe(
        tap(_ => this.spinner = true ),
        delay(2000),
        finalize(() => { this.spinner = false; }))
      .subscribe((data) => {
        this.updateFormData(data);
      }, (e) => {
        this.toastSvc.flash(this.errorService.firstError(e));
      });
  }

  @LogEvent(AnalyticEvents.ChangingConfiguration)
  public async updateAccountSetting() {
    const formData = this.form.getRawValue();
    this.accountService.updateAccountSetting(formData)
      .pipe(
        tap(_ => this.spinner = true ),
        catchFormError(),
        finalize(() => {
          this.spinner = false;
        })
      )
      .subscribe((data) => {
        this.updateFormData(data);
        this.accountService.syncAccountReminders(data);
        this.toastSvc.flash('Saved.');
      }, (e) => {
        this.toastSvc.flash(this.errorService.firstError(e));
      });
  }

  private updateFormData(data: AccountSetting) {
    const rawValue = <Object>this.form.getRawValue();
    for (const key in data) {
      if (rawValue.hasOwnProperty(key)) {
        this.form.get(key).setValue(data[key]);
      }
    }
  }
}
