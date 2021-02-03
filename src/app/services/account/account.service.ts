import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FirebaseService } from '../firebase/firebase.service';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { AppState, AppStateModel } from '../../store/states/app.state';
import { Observable } from 'rxjs';
import { SubscriptionState } from '../../store/states/subscription.state';
import { LoggedIn } from '../../store/actions/auth.actions';
import { SubscriptionActivated } from '../../store/actions/subscription.actions';
import { ErrorFormat } from '../../interfaces/errors';

export enum NotificationValues {
  WORKOUT_REMINDER = 1,
  WEIGHT_REMINDER = 2,
  PHOTO_REMINDER = 3
}

export interface AccountSetting {
  transphormer_id: number;
  receive_notification: boolean;
  receive_email: boolean;
  photo_reminder: number | null;
  weigh_reminder: number | null;
  workout_reminder: boolean;
  what_time: string;
  receive_livestream_notification: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService extends BaseService {

  @Select(AppState) app$: Observable<AppStateModel>;

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    private localNotification: LocalNotifications,
    private firebase: FirebaseService,
    private store: Store,
    private actions$: Actions,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);
    AccountService.SET_PLATFORM(platform);
    AccountService.SET_ROLLBAR(rollbar);

    if (this.platform.is('cordova')) {
      this.app$.subscribe((state: AppStateModel) => {
        if (!state.loggingOut) {
          this.localNotification.cancelAll();
        }
      });

      this.actions$.pipe(ofActionCompleted(LoggedIn)).subscribe(_ => this.createAccountReminders());
    }

    // Upon activation of an account, always go ahead and turn on the live stream notifications.
    this.actions$.pipe(ofActionCompleted(SubscriptionActivated)).subscribe(() => {
      this.getAccountSetting()
        .subscribe((settings) => {
          settings.receive_livestream_notification = true;
          this.updateAccountSetting(settings);
          this.subscribeToLiveStream(true);
        });
    });
  }

  public getAccountSetting(): Observable<AccountSetting> {
    return this.http.get<any>(AccountService.Url('account/show'));
  }

  public updateAccountSetting(data): Observable<AccountSetting> {
    return this.http.post<any>(AccountService.Url('account/update'), data);
  }

  private createReminder(id, title, text, every: {}, count: number = 10) {
    if (!this.platform.is('cordova')) {
      return;
    }

    return this.localNotification.schedule({
      id, title, text,
      foreground: true,
      trigger: {
        every,
        count
      }
    });
  }

  private clearReminder(id) {
    if (!this.platform.is('cordova')) {
      return Promise.resolve();
    }
    return this.localNotification.clear(id);
  }

  public async setWorkoutReminder(create: boolean, hour?: number | string, minute: number = null) {
    if (typeof hour === 'string') {
      const time = hour.split(':');
      hour = time.length > 1 ? parseFloat(time[0]) : 0;
      minute = time.length > 1 ? parseFloat(time[1]) : 0;
    }

    console.log('[Reminder]: WorkoutReminder Cleared');
    await this.clearReminder(NotificationValues.WORKOUT_REMINDER);

    if (!create) {
      return;
    }

    console.log('[Reminder]: WorkoutReminder Created');
    this.createReminder(
      NotificationValues.WORKOUT_REMINDER,
      'Workout Reminder',
      'Time to do some work! #DuesPaid',
      {minute, hour}
    );
  }

  public async setPhotoReminder(weeksBetween: number | null) {
    const id = NotificationValues.PHOTO_REMINDER;
    console.log('[Reminder]: PhotoReminder Cleared');
    await this.localNotification.clear(id);

    if (weeksBetween === null || weeksBetween === 0) {
      return;
    }

    const every = {
      hour: 7,
      minute: 0,
      weekday: 5 /* Friday */
    };

    console.log('[Reminder]: PhotoReminder Created');
    this.createReminder(id, 'Picture Reminder', 'Don’t forget to take this week’s progress pictures!', every);
  }

  public async setWeighInReminder(weeksBetween: number | null) {
    const id = NotificationValues.WEIGHT_REMINDER;

    console.log('[Reminder]: WeighIn Cleared');
    await this.localNotification.clear(id);

    if (weeksBetween === null || weeksBetween === 0) {
      return;
    }

    console.log('[Reminder]: WeighIn Created');
    this.createReminder(id, 'Weigh In Reminder', 'Hop on the scale and then enter your progress in the app!', {
      hour: 7,
      minute: 0,
      weekday: 3 /* Wednesday */
    });
  }

  public async subscribeToLiveStream(subscribe: boolean) {
    if (this.userService.isPaidUser() && subscribe) {
      console.log('[Notification]: Livestream Subscribed');
      await this.firebase.subscribeToLivestreamNotification();
    } else {
      console.log('[Notification]: Livestream Unsubscribed');
      await this.firebase.unsubscribeToLivestreamNotification();
    }
  }

  public async syncAccountReminders(settings: AccountSetting) {
    try {
      await this.setWorkoutReminder(settings.workout_reminder, settings.what_time);
      await this.setPhotoReminder(settings.photo_reminder);
      await this.setWeighInReminder(settings.weigh_reminder);
      await this.subscribeToLiveStream(settings.receive_livestream_notification);
    } catch (e) {
      this.rollbar.error(e);
    }
  }

  public async createAccountReminders() {
    const settings = await this.getAccountSetting().toPromise();
    return this.syncAccountReminders(settings);
  }
}
