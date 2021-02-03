import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { AuthenticationService} from '../../../../services/authentication/authentication.service';
import { UserService } from '../../../../services/user/user.service';
import { UnreadActionsService } from '../../services/uread-actions/unread-actions.service';
import { GoPremiumPage } from '../../../../pages/go-premium/go-premium.page';
import { Transphormer } from '../../../../interfaces';

@Component({
  selector: 'app-expanded-menu',
  templateUrl: './expanded-menu.component.html',
  styleUrls: ['./expanded-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandedMenuComponent implements OnInit {

  public transphormersMatchingRoutes: string[] = [
    'my-transphormers',
    '^/detail',
  ];

  transphormer: Transphormer;
  public isCollapsed = false;

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public auth: AuthenticationService,
    public platform: Platform,
    public user: UserService,
    public modalController: ModalController,
    public unreadActions: UnreadActionsService,
    public changeDetection: ChangeDetectorRef,
  ) {
    this.user.user$.subscribe((next) => {
      this.transphormer = next;
      this.changeDetection.markForCheck();
    });
  }

  ngOnInit() {
  }

  /**
   * Navigates to new url as root page
   * @param $event
   * @param url
   */
  public async navigateTo($event: Event, url: string) {
    $event.preventDefault();
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    this.closePopover();

    this.navCtrl.navigateRoot(url);
  }

  /**
   * Log user out of system and redirect to login screen
   */
  public async logout() {
    try {
      this.closePopover();
      this.auth.logout()
        .then(() => this.navCtrl.navigateRoot('/'));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Close expanded menu if open
   */
  private async closePopover() {
    const popover = await this.popoverCtrl.getTop();
    if (popover.id === 'nav-menu-expanded') {
      popover.dismiss();
    }
  }

  // show go premium modal page
  async presentModal($event) {
    const modal = await this.modalController.create({
      component: GoPremiumPage,
      componentProps: {
        'type': 'live-streaming'
      },
      cssClass: 'go-premium-css',
    });
    await modal.present();
    await modal.onWillDismiss();
    this.closePopover();
  }

  /**
   * Checks if user is paid and if true then navigates else opens dialog to buy subscription.
   * @param $event
   */
  public goToStreaming($event) {
    this.transphormer.is_paid_user ? this.navigateTo($event, 'live-streaming') : this.presentModal($event);
  }

  /**
   * Go to subscription page
   * @param $event
   */
  public goToSubscription($event) {
    this.navigateTo($event, 'subscribe');
  }

  public collapeSettingsItem() {
    this.isCollapsed = !this.isCollapsed;
  }
}
