import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { NutritionPlan, Transphormer, UnitLabel, UnitTypes } from '../../interfaces';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Store } from '@ngxs/store';
import { ToastService } from '../toast-service/toast-service.service';
import { SubscriptionActivated, SubscriptionDeactivated } from '../../store/actions/subscription.actions';
import { fixupTransphormer } from '../../helpers/transphormer';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _transphormer: Transphormer = null;
  public user$ = new ReplaySubject<Transphormer>(1);
  private loading = true;

  constructor(
    private storageService: Storage,
    private store: Store,
    private toast: ToastService,
    private events: Events
  ) {
    this.setup().then();
  }

  set user(newUser: Transphormer | null) {
    if (this._transphormer !== null && newUser !== null) {
      this.takeSubscriptionAction(newUser);
    }

    this._transphormer = newUser;
    this.user$.next(newUser);

    this.writeUserToStorage(newUser);
  }

  private writeUserToStorage(newUser) {
    if (!newUser) {
      this.storageService.remove('transphormer');
    } else {
      this.storageService.set('transphormer', JSON.stringify(newUser));
    }
  }

  ready() {
    return new Promise((resolve, reject) => {
      const i = setInterval(() => {
        if (!this.loading) {
          clearInterval(i);
          resolve(this.user !== null);
        }
      }, 200);
    });
  }

  get user(): Transphormer | null {
    return this._transphormer;
  }

  public removeActiveTransphormer() {
    this.user = null;
  }

  /**
   Returns true if current user is paid user, else return false
   */
  public isPaidUser() {
    if (this.user) {
      return this.user.is_paid_user;
    }
    return false;
  }

  /**
   Returns true if current user has active trainer, else return false
   */
  public isTrainer() {
    return this.isPaidUser() && this.user.is_trainer;
  }

  /**
   * Returns correct label based on type of unit based on transphormer settings
   * @param type
   * @param singular
   */
  public unitTypeLabel(type: 'length' | 'weight', singular = false): UnitLabel {
    if (!this.user) {
      return type === 'length' ? UnitLabel.ImperialLength : UnitLabel.ImperialWeight;
    }

    let value;
    if (type === 'length') {
      value = this.user.unit_type === UnitTypes.Metric ? UnitLabel.MetricLength : UnitLabel.ImperialLength;
    } else {
      value = this.user.unit_type === UnitTypes.Metric ? UnitLabel.MetricWeight : (singular ? UnitLabel.ImperialWeightSingular : UnitLabel.ImperialWeight);
    }

    return value;
  }

  /**
   * Returns unit type based on transphormer settings
   */
  public unitType(): UnitTypes {
    return this.user ? this.user.unit_type : UnitTypes.Imperial;
  }

  hasTrainer() {
    if (!this.user) {
      return false;
    }

    // We don't know. Err on the side of caution.
    if (this.user && this.user.linked_trainer === undefined) {
      return true;
    }

    // Once the cache updates, this is the correct logic.
    return this.user && this.user.linked_trainer && this.user.linked_trainer.status === 'accepted';
  }

  doingCMC() {
    return this.user.likely_to_do === 'Calorie / Macro counting' &&
      this.user.is_paid_user;
  }

  public activeNutrition(): NutritionPlan {
    if (this.user.is_paid_user) {
      return this.user.likely_to_do;
    }
    if (this.user.likely_to_do === NutritionPlan.CalorieMacroCounting) {
      return NutritionPlan.PortionControl;
    }
    return this.user.likely_to_do;
  }

  public goPremium() {
    this.user = {...this.user, is_paid_user: true};
  }

  public goUnpremium() {
    this.user = {...this.user, is_paid_user: false};
  }

  private setup() {
    return this.storageService.get('transphormer').then((value) => {
      const user = <Transphormer>JSON.parse(value);
      fixupTransphormer(user);
      this.user = user;
      this.loading = false;
    });

  }

  private takeSubscriptionAction(newUser: Transphormer) {
    if (this._transphormer.is_paid_user === newUser.is_paid_user) {
      return;
    }

    if (newUser.is_paid_user) {
      this.store.dispatch(new SubscriptionActivated);
      this.events.publish('post-premium');
    } else {
      this.store.dispatch(new SubscriptionDeactivated);
      console.log('Premium lost.');
      this.toast.flash('Premium has expired!');
    }
  }
}
