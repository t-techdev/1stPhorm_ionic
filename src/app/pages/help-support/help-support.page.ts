import { Component, Inject, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as Rollbar from 'rollbar';
import { RollbarService } from '../../rollbar';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
import { InAppPurchaseService } from '../../services/in-app-purchase/in-app-purchase.service';
import { UserService } from '../../services/user/user.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.page.html',
  styleUrls: ['./help-support.page.scss'],
  providers: [AppVersion]
})
export class HelpSupportPage implements OnInit {
  private clicks = 0;

  constructor(public platform: Platform,
              private purchaseService: InAppPurchaseService,
              private iab: InAppBrowser,
              private userService: UserService,
              private cachingService: RequestCachingService,
              @Inject(RollbarService) private rollbar: Rollbar,
              private toastSvc: ToastService,
              public appVer: AppVersion,
              private analyticService: AnalyticsService,
              private storageService: StorageService
  ) {
  }

  public buildVersion = '';
  public appVersion = '';

  ngOnInit() {
    this.setupBundleInfo();
  }

  public async setupBundleInfo() {
    try {
      if (this.platform.is('cordova')) {
        const [versionCode, versionNumber] = await Promise.all([
          this.appVer.getVersionCode(),
          this.appVer.getVersionNumber(),
        ]);

        this.buildVersion = `${versionCode}`;
        this.appVersion = versionNumber;
      }

    } catch (e) {
      console.error(e);
    }
  }

  public async viewSupportPage() {
    this.iab
      .create('https://www.mytransphormationstartstoday.com/help', '_blank');
    this.analyticService.logEvent(AnalyticEvents.HelpView, {});
  }

  public get emailHref(): string {
    const platform = this.platform.is('cordova')
      ? (this.platform.is('android') ? 'Android' : 'iOS')
      : 'Web';
    return 'https://www.mytransphormationstartstoday.com/app-support'
      + '?version=' + (platform !== 'Web' ? `${this.appVersion}b${this.buildVersion}` : 'n/a')
      + `&first_name=${this.userService.user.first_name}`
      + `&last_name=${this.userService.user.last_name}`
      + `&email=${this.userService.user.email}`
      + '&platform=' + platform;
  }

  public async checkPremiumSubscription() {
    this.purchaseService.iap.refresh();
  }

  public clearCaches() {
    this.clicks++;
    this.cachingService.clearAll();

    if (this.clicks === 4) {
      this.toastSvc.flash('Tap once more to clear DBs.');
    }
    if (this.clicks > 1 && this.clicks < 5) {
      return;
    }
    if (this.clicks === 5) {
      this.clicks = 0;
      Promise.all([
        this.storageService.remove('assessments'),
        this.storageService.remove('messages')
      ])
        .then(_ => {
          this.toastSvc.flash('All storage cleared.');
        });
    } else {
      this.toastSvc.flash('Caches cleared.');
    }
  }

  manageSubscriptions() {
    if (!this.platform.is('cordova')) {
      this.toastSvc.flash('Not supported on this platform.');
    }
    this.purchaseService.iap.manageSubscriptions();
  }

  contactSupport() {
    this.iab.create(this.emailHref, '_system', {location: 'yes'});
  }
}
