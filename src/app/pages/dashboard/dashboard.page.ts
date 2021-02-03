import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { GoPremiumPage } from '../go-premium/go-premium.page';
import { AppInfoService, BottomMenuService, UserPreferencesService, UserService } from '../../services';
import { ChallengeInfo, Transphormer } from '../../interfaces';

export interface WorkoutSummary {
  completed?: boolean;
  day: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, CanLeaveRoute {
  public canLeaveAndroidBack = true;

  challengeDates: ChallengeInfo[];
  private internalShow: boolean = null;

  constructor(
    protected navCtrl: NavController,
    private iab: InAppBrowser,
    private statusBar: StatusBar,
    private bottomMenu: BottomMenuService,
    public appInfoService: AppInfoService,
    private platform: Platform,
    public user: UserService,
    public modalController: ModalController,
    public prefs: UserPreferencesService,
    @Inject(RollbarService) private rollbar: Rollbar,
  ) {
    this.appInfoService.getChallenges()
      .then(value => {
        this.challengeDates = value;
      });
  }

  /**
   * Transphormer object
   */
  public get transphormer(): Transphormer {
    return this.user.user;
  }

  get shouldShowMessage() {
    return this.internalShow || this.prefs.get('show-free-at-home-widget', false);
  }

  set shouldShowMessage(value: boolean) {
    this.prefs.set('show-free-at-home-widget', value);
    this.internalShow = value;
  }

  public updateWorkout() {
    this.shouldShowMessage = true;
    this.navCtrl.navigateRoot('profile-page');
  }

  ngOnInit() {
    this.bottomMenu.show();
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleBlackOpaque();
        this.statusBar.backgroundColorByHexString('#000');
      }
    });
  }

  public get transphormerDoingCalorieMacroCounting() {
    return this.user.doingCMC();
  }

  public goToTrainingProgram() {
    this.navCtrl.navigateRoot('workouts', {
      animated: true,
      animationDirection: 'forward'
    });
  }

  public goToFacebook() {
    this.iab.create('https://www.facebook.com/groups/MyTransPHORMation/', '_system', {location: 'yes'});
  }

  public goToNutrition() {
    const user = this.user.user;

    if (user.is_paid_user && user.likely_to_do === 'Calorie / Macro counting') {
      this.navCtrl.navigateRoot('macro');
    } else {
      this.navCtrl.navigateRoot('nutrition');
    }
  }

  // show go premium modal page
  async presentModal() {
    const modal = await this.modalController.create({
      component: GoPremiumPage,
      componentProps: {
        'type': 'live-streaming'
      },
      cssClass: 'go-premium-css',
    });
    await modal.present();
  }

  public async videoClick() {
    if (!this.transphormer.is_paid_user) {
      this.presentModal();
    } else {
      this.navCtrl.navigateForward('live-streaming');
    }
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.canLeaveAndroidBack = false;
  }

}
