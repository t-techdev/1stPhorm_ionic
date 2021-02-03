import { Component, Inject } from '@angular/core';
import { Platform, Events, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseService } from './services/firebase/firebase.service';
import { BranchioService } from './services/branchio/branchio.service';
import { RollbarService } from './rollbar';
import * as Rollbar from 'rollbar';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import {
  AnalyticsService,
  AppInfoService,
  BottomMenuService,
  InAppPurchaseService,
  UserPreferencesService,
  UserService
} from './services';
import 'hammerjs';
import { LogEventDecoratorService } from './decorators/log-event-decorator.service';
import { FormErrorDecoratorService } from './decorators/form-error-decorator.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  bottomMenuVisible = false;

  constructor(
    private platform: Platform,
    private firebase: FirebaseService,
    private appInfo: AppInfoService,
    private branchIoService: BranchioService,
    @Inject(RollbarService) private rollbar: Rollbar,
    public auth: AuthenticationService,
    private purchaseService: InAppPurchaseService,
    public appVer: AppVersion,
    private userService: UserService,
    private decoratorService: LogEventDecoratorService,
    private dsTwo: FormErrorDecoratorService,
    public analyticsService: AnalyticsService,
    private prefs: UserPreferencesService,
    public bottomMenu: BottomMenuService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    private modal: ModalController
  ) {
    this.userService.user$
      .subscribe((user) => {
        const person = user !== null ? {
          id: user.id,
          email: user.email,
          paid: user.is_paid_user
        } : {};
        this.rollbar.configure({
          payload: {person}
        });
      });
    this.bottomMenu.visible$.subscribe(val => this.bottomMenuVisible = val);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        this.setupAppVersionInfoInRollbar();
        this.statusBar.styleBlackOpaque();
        this.branchIoService.start();
        this.firebase.start();
        this.setupAndroidKeyboardHandlers();
        this.analyticsService.init();
        this.splashScreen.hide();
      }
      this.auth.setupAuthenticationState();
    });
  }

  private setupAndroidKeyboardHandlers() {
    if (this.platform.is('android')) {
      window.addEventListener('keyboardDidShow', e => {
        (<any>document.body).style.height = 'inherit';
        (<any>document.body).style.height = (document.body.clientHeight - (<any>e).keyboardHeight - 7) + 'px';
        window.setTimeout(() => {
          document.activeElement.scrollIntoView();
        }, 100);
      });

      window.addEventListener('keyboardDidHide', e => {
        (<any>document.body).style.height = 'inherit';
      });

    }
  }

  public setupAppVersionInfoInRollbar() {
    this.appVer.getVersionNumber()
      .then(value => {
        this.rollbar.configure({
          payload: {
            code_version: value
          }
        });
      });
  }
}
