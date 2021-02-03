import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  NavController, Platform,
} from '@ionic/angular';
import {
  AuthenticationService,

} from '../../services/authentication/authentication.service';
import { OnboardingService } from '../../services/onboarding/onboarding.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { BottomMenuService } from '../../services/bottom-menu.service';
import { Transphormer } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, CanLeaveRoute {
  public spinner = false;
  public form: FormGroup;
  public canLeaveAndroidBack = true;

  constructor(
    public errorHandler: ErrorsService,
    public navCtrl: NavController,
    private authenticationService: AuthenticationService,
    private toastSvc: ToastService,
    private platform: Platform,
    protected onboardingService: OnboardingService,
    private firebase: FirebaseService,
    private statusBar: StatusBar,
    private bottomMenu: BottomMenuService,
  ) {
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.platform.ready()
        .then(() => {
          this.statusBar.styleDefault();
          this.statusBar.backgroundColorByHexString('#ffffff');
        });
    }
    this.bottomMenu.hide();
    this.setupForm();
  }

  /**
   * Setup form
   */
  private setupForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  public async login() {
    this.spinner = true;
    try {
      await this.authenticationService.login(
        this.form.get('email').value,
        this.form.get('password').value
      );
      this.firebase
        .saveTokenToServer(this.firebase.token())
        .subscribe(event => {
        });
      await this.getTransphormer(false);
      this.authenticationService.setupAuthenticationState();

      if (this.platform.is('cordova')) {
        this.statusBar.styleLightContent();
      }
      this.navCtrl.navigateRoot('dashboard');
    } catch (e) {
      this.toastSvc.flash(this.errorHandler.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  public goToRegister() {
    this.navCtrl.navigateForward('register');
  }

  public goToForgotPassword() {
    this.form.get('password').reset();
    this.navCtrl.navigateForward('forgot-password');
  }

  /**
   *
   * Finds the logged in user information
   *
   * @param handleCatch
   */
  private async getTransphormer(
    handleCatch: boolean
  ): Promise<Transphormer | ErrorFormat> {
    try {
      return await this.onboardingService.fetchOnBoard();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.canLeaveAndroidBack = false;
  }
}
