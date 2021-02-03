import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InAppPurchaseService, UserPreferencesService, UserService } from '../../services';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-hidden-settings',
  templateUrl: './hidden-settings.component.html',
  styleUrls: ['./hidden-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiddenSettingsComponent implements OnInit {
  remaining = 3;
  public flags: { [key: string]: boolean } = {};

  constructor(
    private prefs: UserPreferencesService,
    private modal: ModalController,
    private store: Store,
    private userService: UserService,
    private purchaseService: InAppPurchaseService,
  ) {
  }

  ngOnInit() {
    ['feature.nutrition', 'feature.media_messaging'].forEach((key) => {
      this.prefs.getAsync<boolean>('feature.nutrition', false)
        .then((value) => this.flags[key] = value);
    });
  }

  toggleFlag(key: string) {
    this.prefs.getAsync<boolean>(key, false)
      .then((value) => {
        this.flags[key] = !value;
        this.prefs.set(key, !value);
      });
  }

  close() {
    this.modal.dismiss();
  }

  resetStore() {
    if (this.remaining > 0) {
      this.remaining = this.remaining - 1;
    } else {
      const snapshot = this.store.snapshot();
      console.log(snapshot);
      this.remaining = 3;
      this.store.reset({
        ...snapshot, iap: {
          isLoading: false,
          ownedProducts: [],
        }
      });
    }
  }

  goPremium() {
    this.purchaseService.enableAfterPremiumPopup();
    this.userService.goPremium();
  }

  expirePremium() {
    this.userService.goUnpremium();
  }
}
