import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { BottomMenuService, InAppPurchaseService, ToastService, UserService } from '../../services';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IAPProduct } from 'third-party/in-app-purchase-2/ngx';
import { AppInfoService, Promo } from '../../services/app-info/app-info.service';
import { Product } from '../../services/in-app-purchase/products';
import { environment } from '../../../environments/environment';
import { OfferInfo } from '../../interfaces';
import { Subscription } from 'rxjs';

type SubscriptionOption = 'monthly' | 'quarterly' | 'yearly';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.page.html',
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit, OnDestroy {
  public selected: SubscriptionOption = 'yearly';
  public productFetched = false;
  public showExtra = false;
  public _isPurchasing = false;

  private promoId: string;
  public promo: Promo;
  private products: IAPProduct[] = [];

  public quarterlyProduct: Product;
  public monthlyProduct: Product;
  public yearlyProduct: Product;
  private userSubscription$: Subscription;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private purchaseService: InAppPurchaseService,
    private platform: Platform,
    private toastSvc: ToastService,
    private bottomMenu: BottomMenuService,
    private userService: UserService,
    private appInfo: AppInfoService,
    @Inject(RollbarService) private rollbar: Rollbar,
    private iab: InAppBrowser,
  ) {
    // handling subscription owned state
    this.userSubscription$ = this.userService.user$.subscribe((user) => {
      if (!user.is_paid_user) {
        return;
      }

      if (this.showExtra) {
        this.navCtrl.navigateRoot('walkthru').then();
        return;
      }

      this.navCtrl.navigateRoot('/dashboard').then();
    });

  }

  ngOnDestroy() {
    this.userSubscription$.unsubscribe();
  }

  ngOnInit() {
    this.showExtra = this.route.snapshot.queryParamMap.get('showExtra') === 'true';
    this.promoId = this.route.snapshot.queryParamMap.get('promo');
    if (this.showExtra) {
      this.bottomMenu.hide();
    } else {
      this.purchaseService.enableAfterPremiumPopup();
    }
    this.fetchProducts();
    if (this.promoId) {
      this.appInfo.getPromo(this.promoId)
        .subscribe((promo) => {
          this.promo = promo;
        });
    }
  }

  public get selectedPromo(): OfferInfo | null {
    if (!this.promo) {
      return null;
    }
    return this.promo.offers
      .find(i => i.plan === this.selected);
  }

  private fetchProducts() {
    if (environment.production && !this.isMobile) {
      return;
    }

    this.purchaseService.storeReady()
      .subscribe((products) => {
        if (!Array.isArray(products)) {
          return;
        }
        this.products = products;
        const platformProducts = this.purchaseService.platformProducts();
        const monthlyId = platformProducts.monthly;
        this.monthlyProduct = new Product(this.products.find(p => p.id === monthlyId));
        const quarterlyId = platformProducts.quarterly;
        this.quarterlyProduct = new Product(this.products.find(p => p.id === quarterlyId));
        const yearlyId = platformProducts.yearly;
        this.yearlyProduct = new Product(this.products.find(p => p.id === yearlyId));
        this.productFetched = true;
      }, (error) => {
        this.rollbar.error(error);
        this.toastSvc.flash('Could not connect to store.');
      });
  }

  public handleSubscription(productId: SubscriptionOption) {
    if (!this.isMobile) {
      this.toastSvc.flash('Not supported on this platform.');
      return;
    }

    if (this._isPurchasing) {
      return;
    }

    this._isPurchasing = true;

    const product = this.purchaseService.platformProducts()[productId];

    if (this.promo) {
      const matchingDiscountId = this.promo.offers
        .filter(o => o.plan === productId)[0].promoCode;
      this.purchaseService.purchaseWithDiscountId(product, matchingDiscountId)
        .then((result) => {
          result.error((e) => {
            this.rollbar.error(e);
            this.toastSvc.flash('Unable to process payment: ' + e.toString());
            this._isPurchasing = false;
          });
        });
    } else {
      this.purchaseService
        .purchase(product)
        .error((e) => {
          console.log(e);
          this.rollbar.error(e);
          this.toastSvc.flash('Unable to process payment: ' + e.toString());
          this._isPurchasing = false;
        });
    }
  }

  public close() {
    this.navCtrl.navigateRoot('walkthru');
  }

  public get isIos() {
    return this.platform.is('ios');
  }

  public get isAndroid() {
    return this.platform.is('android');
  }

  public get isMobile(): boolean {
    return this.platform.is('cordova');
  }

  public openUrl(url: string, e: Event) {
    e.preventDefault();
    this.iab.create(url, '_system', {location: 'yes'});
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView();
  }

  upgrade() {
    if (!environment.production && !this.isMobile) {
      this.userService.goPremium();
    }

    if (!this.isMobile) {
      this.toastSvc.flash('Not supported on this platform.');
      return;
    }

    this.handleSubscription(this.selected);
  }
}
