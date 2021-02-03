import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Events, ModalController, Platform } from '@ionic/angular';
import { IAPProduct, IAPProductOptions, InAppPurchase2 } from 'third-party/in-app-purchase-2/ngx';
import { Observable, ReplaySubject } from 'rxjs';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { Device } from '@ionic-native/device/ngx';
import {
  ActiveAppleProducts, ActiveGoogleProducts,
  AppleProducts,
  GoogleProducts,
  testingProducts
} from './products';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import {
  SubscriptionApplyProducts,
  SubscriptionExpired,
  SubscriptionOwned,
  SubscriptionStateLoad
} from '../../store/actions/subscription.actions';
import { environment } from '../../../environments/environment';
import { Transphormer } from '../../interfaces';
import { PostSubscriptionPopupComponent } from '../../components/post-subscription-popup/post-subscription-popup.component';

export interface DiscountSignature {
  signature_encoded: string;
  nonce: string;
  timestamp: number;
  key_id: string;
}

export interface PurchaseDiscount {
  id: string;
  key: string;
  nonce: string;
  timestamp: number;
  signature: string;
}

@Injectable({
  providedIn: 'root'
})
export class InAppPurchaseService {

  protected ready = new ReplaySubject<IAPProduct[]>(1);
  private popupEnabled = false;

  constructor(
    public http: HttpClient,
    public platform: Platform,
    public iap: InAppPurchase2,
    private userService: UserService,
    private events: Events,
    private modal: ModalController,
    public device: Device,
    private store: Store,
    private actions$: Actions,
    private onboardingService: OnboardingService,
    @Inject(RollbarService) public rollbar: Rollbar,

  ) {
    this.actions$.pipe(ofActionCompleted(SubscriptionStateLoad))
      .subscribe((next) => {
        if (!environment.production || this.platform.is('android')) {
          this.setDebugLevel('DEBUG');
        }
        this.setupStore();
      });

    this.actions$.pipe(ofActionCompleted(
      SubscriptionOwned,
      SubscriptionExpired
    )).subscribe(_ => {
      this.notifyAndUpdate();
    });

    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.store.dispatch(new SubscriptionStateLoad());
      });
    } else {
      this.ready.next(testingProducts);
    }
  }

  public enableAfterPremiumPopup() {
    // We only need to set this up once.
    if (this.popupEnabled) {
      return;
    }
    this.events.subscribe('post-premium', async () => {
      const user = this.transphormer();
      const modal = await this.modal.create({
        component: PostSubscriptionPopupComponent,
        componentProps: {
          user
        }
      });
      return await modal.present();
    });

    this.popupEnabled = true;
  }

  private notifyAndUpdate() {
    this.rollbar.info('IAPS.notifyAndUpdate()');
    this.http.get(`${environment.apiUrl}subscription/notify`)
      .subscribe((next) => {
        this.onboardingService.fetchOnBoard().then();
      });
  }

  public setDebugLevel(debugLevel: 'QUIET' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG') {
    this.iap.verbosity = this.iap[debugLevel];
  }

  public setupStore() {
    this.rollbar.info('IAPS.setupStore()');

    this.iap.register(this.iapProducts());

    this.iap.validator = 'https://validator.fovea.cc/v1/validate?appName=com.firstphorm.app&apiKey=24a5b155-6d3a-4607-a6cb-6099f9de7941';

    this.iap.applicationUsername = () => {
      if (this.transphormer()) {
        return `${this.transphormer().id}`;
      }
      return null;
    };

    this.iap.ready(() => {
      const products = [
        this.iap.get(this.platformProducts()['monthly']),
        this.iap.get(this.platformProducts()['quarterly']),
        this.iap.get(this.platformProducts()['yearly']),
      ];
      this.store.dispatch(new SubscriptionApplyProducts(products));
      this.ready.next(products);
      this.iap.error((err) => {
        this.rollbar.error(err.message, err);
      });
    });

    this.handlePaymentCompletion();

    this.iap.refresh();
  }

  public storeReady(): Observable<IAPProduct[]> {
    return this.ready;
  }

  public purchase(subscription: string | IAPProduct) {
    return this.iap.order(subscription, {
      transphormer_id: this.transphormer().id
    });
  }

  public purchaseWithDiscountId(subscription: string, discountId: string) {
    if (!this.supportsPromotionalSubscriptions()) {
      return Promise.reject('Promotions are not supported on this device.');
    }

    return this.getSignedDiscountRequest(subscription, discountId)
      .then((signature) => {
        return this.iap.order(subscription, {
          transphormer_id: this.transphormer().id,
          discount: <PurchaseDiscount>{
            id: discountId,
            key: signature.key_id,
            nonce: signature.nonce,
            timestamp: signature.timestamp,
            signature: signature.signature_encoded
          }
        });
      });
  }

  private handlePaymentCompletion() {
    this.iap.when('subscription').approved((p: IAPProduct) => {
      this.rollbar.info('IAP.approved()', p);
      p.verify();
    });
    this.iap.when('subscription').verified((p: IAPProduct) => {
      this.rollbar.info('IAP.verified()', p);
      p.finish();
    });
    this.iap.when('subscription').owned((p: IAPProduct) => {
      this.rollbar.info('IAP.owned()', p);
      this.store.dispatch(new SubscriptionOwned(p));
    });
    this.iap.when('subscription').error((err) => {
      this.rollbar.error(err);
    });
    this.iap.when('subscription').expired((p: IAPProduct) => {
      this.rollbar.info('IAP.expired()', p);
      this.store.dispatch(new SubscriptionExpired(p));
    });
  }

  public platformProducts(): any {
    if (!environment.production) {
      return {
        monthly: 'com.firstphorm.apps.premium_monthly',
        quarterly: 'com.firstphorm.apps.premium_quarterly',
        yearly: 'com.firstphorm.apps.premium_yearly',
      };
    } else if (this.platform.is('android')) {
      return ActiveGoogleProducts;
    } else if (this.platform.is('ios')) {
      return ActiveAppleProducts;
    }
  }

  public allPlatformProducts(): any {
    if (this.platform.is('android')) {
      return GoogleProducts;
    } else if (this.platform.is('ios')) {
      return AppleProducts;
    }
  }

  private iapProducts(): IAPProductOptions[] {
    const productIds = Object.values(this.allPlatformProducts()) as string[];

    return productIds.map(product => {
      return <IAPProductOptions>{id: product, type: this.iap.PAID_SUBSCRIPTION};
    });
  }

  public transphormer(): Transphormer {
    return this.userService.user;
  }

  private getSignedDiscountRequest(productId: string, offerId: string): Promise<DiscountSignature> {
    return this.http.post(`${environment.apiUrl}app-store-promotion`, {
      offerId,
      productId,
    }).toPromise()
      .then((result) => {
        return (result as DiscountSignature);
      });
  }

  public supportsPromotionalSubscriptions() {
    return this.platform.is('ios') && this.device.version >= '12.2';
  }
}
