import { Inject, Injectable } from '@angular/core';
import { BaseService, Token } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, of, Subscription, throwError } from 'rxjs';
import { OnboardingService } from '../onboarding/onboarding.service';
import { Platform } from '@ionic/angular';
import { switchMap, tap } from 'rxjs/operators';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { BottomMenuService } from '../bottom-menu.service';
import { UserService } from '../user/user.service';
import { StorageService } from '../storage.service';
import { Actions, ofAction, ofActionCompleted, Store } from '@ngxs/store';
import { LoggedIn, LoggedOut, LoggingIn, LoggingOut } from '../../store/app.actions';
import { RegisterResponse, Transphormer } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';
import { AppState, AppStateModel, LoggedInState } from '../../store/states/app.state';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseService {
  private autoUpdate$: Subscription;

  constructor(protected http: HttpClient,
              protected platform: Platform,
              private store: Store,
              protected userService: UserService,
              private onboardingService: OnboardingService,
              public bottomMenu: BottomMenuService,
              private storageService: StorageService,
              private action$: Actions,
              @Inject(RollbarService) public rollbar: Rollbar) {
    super(http, platform, userService, rollbar);
    AuthenticationService.SET_PLATFORM(platform);
    AuthenticationService.SET_ROLLBAR(rollbar);
    this.action$.pipe(ofActionCompleted(LoggedIn)).subscribe(_ => this.startAutoUpdatingUser());
    this.action$.pipe(ofAction(LoggingOut)).subscribe(_ => this.stopAutoUpdatingUser());
  }

  private startAutoUpdatingUser() {
    // Automatically update the user every 15 minutes.
    const autoUpdateInterval$ = interval(15 * 60 * 1000);
    this.autoUpdate$ = autoUpdateInterval$.subscribe(() => {
        this.onboardingService.fetchOnBoard().then();
      }
    );
  }

  private stopAutoUpdatingUser() {
    if (!this.autoUpdate$) {
      return;
    }
    this.autoUpdate$.unsubscribe();
  }

  public static LoginError(e): Promise<ErrorFormat> {
    e.error.errors = {
      credential: [e.error.message]
    };

    return AuthenticationService.HandleError(e);
  }

  /**
   * Service to register user in the system
   *
   * @param email
   * @param password
   * @param first_name
   * @param last_name
   * @param campaignId
   */
  public async register(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    campaignId: string = null,
  ): Promise<Transphormer | ErrorFormat> {
    const data: any = {
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
      client_id: AuthenticationService.ClientId(),
      client_secret: AuthenticationService.ClientSecret(),
    };

    if (campaignId !== null) {
      data.campaignId = await this.storageService.get('campaignId');
    }

    return this.http.post(
      AuthenticationService.Url('auth/register'),
      data,
    )
      .toPromise()
      .then((result: RegisterResponse) => {
        this.saveToken(result.token);
        this.saveTransphormer(result.transphormer);
        return result.transphormer;
      })
      .catch(BaseService.HandleError);
  }

  /**
   * Authenticates user and logs the user in
   *
   * @param email
   * @param password
   */
  public login(email: string, password: string): Promise<any> {
    const data: any = {
      username: email,
      password: password,
      client_id: AuthenticationService.ClientId(),
      client_secret: AuthenticationService.ClientSecret(),
      grant_type: 'password',
    };

    return this.http.post(AuthenticationService.Url('auth/login'), data)
      .toPromise()
      .then((result: Token) => {
        this.store.dispatch(new LoggingIn());
        this.saveToken(result);
        return result;
      })
      .catch(AuthenticationService.LoginError);
  }

  // noinspection JSMethodCanBeStatic
  public forgotPassword(email: string): Promise<any> {
    const data = {
      email: email,
      client_id: BaseService.ClientId(),
      client_secret: BaseService.ClientSecret(),
    };

    return this.http
      .post(BaseService.Url('auth/forgot-password'), data, BaseService.BaseOptions(false))
      .toPromise()
      .catch(BaseService.HandleError);
  }

  // noinspection JSMethodCanBeStatic
  public resetPassword(
    token: string,
    email: string,
    password: string,
    password_confirmation: string,
  ): Promise<any> {
    const data = {
      token: token,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
      client_id: BaseService.ClientId(),
      client_secret: BaseService.ClientSecret(),
    };

    return this.http
      .post(BaseService.Url('auth/reset-password'), data, BaseService.BaseOptions(false))
      .toPromise()
      .catch(BaseService.HandleError);
  }

  /**
   * Logs the user out of the system
   */
  public logout(force = false): Promise<any> {
    // If we are logging out or already logged out, ignore the request.
    const appState = this.store.selectSnapshot<AppStateModel>(AppState);
    if (appState.loggingOut || appState.loggedIn === LoggedInState.No) {
      return Promise.resolve(false);
    }

    this.store.dispatch(new LoggingOut());

    const logout$ = force ? of(true) : this.http
      .post(AuthenticationService.Url('auth/logout'), {}, AuthenticationService.BaseOptions());

    return logout$
      .pipe(
        tap(() => {
          this.removeTokens();
          this.removeTransphormer();
          this.storageService.clear();
          this.store.dispatch(new LoggedOut());
        })
      )
      .toPromise()
      .catch(AuthenticationService.HandleError);
  }

  public setupAuthenticationState() {
    this.userService.ready()
      .then((result) => {
        if (result) {
          this.store.dispatch(new LoggedIn());
        } else {
          this.store.dispatch(new LoggedOut());
          this.bottomMenu.hide();
        }
      });
  }

  public refreshToken(): Observable<Token> {
    const refreshToken = window.localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError('Unable to refresh token: no refresh token found.');
    }
    return this.http.post<Token>(AuthenticationService.Url('auth/login'), {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: AuthenticationService.ClientId(),
      client_secret: AuthenticationService.ClientSecret()
    }, AuthenticationService.BaseOptions(false))
      .pipe(switchMap(token => {
        this.saveToken(token);
        return of(token);
      }));
  }
}
