import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { ExpandedMenuComponent } from '../expanded-menu/expanded-menu.component';
import { UserService } from '../../../../services/user/user.service';
import { UnreadActionsService } from '../../services/uread-actions/unread-actions.service';
import { menuEnterAnimation, menuExitAnimation } from '../../transition';
import { GoPremiumPage } from '../../../../pages/go-premium/go-premium.page';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent implements OnInit {

  private expandedMenu: HTMLIonPopoverElement | null = null;

  public moreActiveUrls: string[] = [
    'profile',
    'announcement',
    'trainer-request',
    'photo',
    'camera',
    'metrics',
    'weight',
    'subscription',
    'live',
    'settings',
    'help',
    'invite',
    'my-transphormers',
    'chat-messages',
    'trainer-registration',
    'assessment',
    'trainer-messages',
    'trainer-applications',
    'custom-food',
    'info-personal',
    'info-contact',
    'info-nutrition',
    'info-workout',
    'reminders',
    'notifications',
    'password-change'
  ];
  private navEnd$: Observable<NavigationEnd>;

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public user: UserService,
    public modalController: ModalController,
    public router: Router,
    public unreadActions: UnreadActionsService,
    public changeDetection: ChangeDetectorRef,
  ) {
    this.navEnd$ = router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
  }

  ngOnInit() {
    this.navEnd$.subscribe((next) => {
      this.changeDetection.detectChanges();
    });
  }

  /**
   * Navigate to url
   * @param url
   */
  public async navigateTo(url: string) {
    this.dismissExpandedMenu();
    this.navCtrl.navigateRoot(url);
  }

  /**
   * Open expanded menu
   */
  public async openMoreMenu() {
    // either close the menu if already open or show the menu if closed
    if (this.expandedMenu) {
      this.dismissExpandedMenu();
    } else {
      const popover = await this.popoverCtrl.create({
        component: ExpandedMenuComponent,
        animated: true,
        enterAnimation: menuEnterAnimation,
        leaveAnimation: menuExitAnimation,
        backdropDismiss: false,
        showBackdrop: false,
        cssClass: 'nav-menu-expanded',
        id: 'nav-menu-expanded'
      });

      popover.present();
      popover.onDidDismiss().then(() => {
        this.expandedMenu = null;
      });
      this.expandedMenu = popover;
    }
  }

  /**
   * Close the expanded menu if already open
   */
  private async dismissExpandedMenu(): Promise<boolean> {
    if (this.expandedMenu) {
      await this.expandedMenu.dismiss();
      this.expandedMenu = null;
      return true;
    }

    return true;
  }

  // show go premium modal page
  async presentModal() {
    const modal = await this.modalController.create({
      component: GoPremiumPage,
      componentProps: {
        'type': 'messages'
      },
      cssClass: 'go-premium-css',
    });
    await modal.present();
  }

  public goToMessages() {
    this.user.isPaidUser() ? this.navigateTo('messages') : this.presentModal();
  }
}
