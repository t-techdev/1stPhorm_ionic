import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AnalyticEvents } from './analytic-events.enum';
import { UserService } from '../user/user.service';
import { AppState, LoggedInState } from '../../store/states/app.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Sex, Transphormer } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  @Select(AppState.isLoggedIn) loggedIn$: Observable<LoggedInState>;

  constructor(
    public firebaseAnalytics: FirebaseX,
    public router: Router,
    public platform: Platform,
    public user: UserService,
    private store: Store,
  ) {
  }

  /**
   * Sets relative user/transphormer information to be used for identifying
   * @param transphormer
   */
  public setUserInformation(transphormer: Transphormer) {
    if (!this.platform.is('cordova')) {
      return;
    }

    this.firebaseAnalytics.setUserId(transphormer.id.toString())
      .then(() => {
        return Promise.all([
          this.firebaseAnalytics.setUserProperty('age', transphormer.age.toString()),
          this.firebaseAnalytics.setUserProperty('gender', transphormer.sex === Sex.Male ? 'male' : 'female'),
        ]);
      }).catch((err) => {
      console.error('properties not set', err);
    });
  }

  /**
   * Initialize the service
   */
  public init() {

    if (!this.platform.is('cordova')) {
      return;
    }

    // tracking page views
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.updateCurrentRoute(event.url));

    // Setting session information on session initialized events
    this.loggedIn$.subscribe((state) => {
      if (state === LoggedInState.Yes) {
        this.setUserInformation(this.user.user);
      }
    });
  }

  /**
   * Sets the current page to the firebase for analytics like user engagement and screnn view
   * @param routeUrl
   */
  public updateCurrentRoute(routeUrl: string) {
    this.firebaseAnalytics.setScreenName(routeUrl.replace(/(\d+)/g, ':id'));
  }

  /**
   * Logs custom Event
   * @param eventName
   * @param extraData
   */
  public logEvent(eventName: AnalyticEvents | string, extraData?: any) {
    if (!this.platform.is('cordova')) {
      return;
    }

    this.firebaseAnalytics.logEvent(eventName, extraData || {});
  }
}
