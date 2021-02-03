import { Component, OnInit } from '@angular/core';
import { LogEvent } from '../../decorators/log-event-decorator.service';
import { NavController, Platform } from '@ionic/angular';
import { AppInfoService, Promo } from '../../services/app-info/app-info.service';
import { UserService } from '../../services/user/user.service';
import { Device } from '@ionic-native/device/ngx';
import { AnalyticsService } from '../../services/analytics/analytics.service';

@Component({
  selector: 'app-free-trial-cta',
  templateUrl: './free-trial-cta.component.html',
  styleUrls: ['./free-trial-cta.component.scss'],
})
export class FreeTrialCtaComponent implements OnInit {
  public promo: Promo = null;

  constructor(
    private nav: NavController,
    private userService: UserService,
    private platform: Platform,
    private device: Device,
    private appInfo: AppInfoService,
    private analytics: AnalyticsService,
  ) { }

  ngOnInit() {
    if (this.userService.isPaidUser()
      || !this.platform.is('ios')
      || this.device.version < '12.2') {
      return;
    }

    this.appInfo.getApplicablePromos().subscribe((promos) => {
      const activePromos = promos.filter(p => p.isActive);
      if (activePromos.length > 0) {
        this.promo = activePromos[0];
        this.analytics.logEvent('trial_cta_shown', {
          promo: this.promo.id
        });
      }
    });
  }

  @LogEvent('subscribe_promo')
  subscribe() {
    this.nav.navigateRoot('subscribe?promo=' + this.promo.id);
  }
}
