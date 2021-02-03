import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import {
  SubscriptionActivated,
  SubscriptionApplyProducts,
  SubscriptionExpired,
  SubscriptionOwned,
  SubscriptionStateLoad,
  SubscriptionStateSave
} from '../subscription.actions';
import { IAPProduct } from 'third-party/in-app-purchase-2';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Storage } from '@ionic/storage';
import * as Rollbar from 'rollbar';
import { RollbarService } from '../../rollbar';
import { Inject, Injectable } from '@angular/core';

export const SUBSCRIPTION_STATE_TOKEN = new StateToken<SubscriptionStateModel>('iap');

export interface SubscriptionStateModel {
  ownedProducts: IAPProduct[];
  userId: number | null;
  expirationDate: Date | null;
  isLoading: boolean;
}

@State<SubscriptionStateModel>({
  name: SUBSCRIPTION_STATE_TOKEN,
  defaults: {
    ownedProducts: [],
    isLoading: true,
    expirationDate: null,
    userId: null,
  }
})
@Injectable({
  providedIn: 'root'
})
export class SubscriptionState {

  constructor(
    private store: Store,
    private storage: Storage,
    @Inject(RollbarService) private rollbar: Rollbar,
  ) {
  }

  @Action(SubscriptionOwned)
  owned(ctx: StateContext<SubscriptionStateModel>, payload: SubscriptionOwned) {
    // const notCurrentlySubscribed = ctx.getState().ownedProducts.length === 0;
    ctx.setState(
      patch({
        ownedProducts: append([payload.product])
      })
    );
    // if (notCurrentlySubscribed) {
    //   ctx.dispatch(new SubscriptionActivated());
    // }
    ctx.dispatch(new SubscriptionStateSave());
  }

  @Action(SubscriptionExpired)
  expired(ctx: StateContext<SubscriptionStateModel>, payload: SubscriptionExpired) {
    // const hadSubscription = ctx.getState().ownedProducts.length !== 0;
    ctx.setState(
      patch({
        ownedProducts: removeItem<IAPProduct>(item => item.id === payload.product.id)
      })
    );
    // const notCurrentlySubscribed = ctx.getState().ownedProducts.length === 0;
    // if (hadSubscription && notCurrentlySubscribed) {
    //   ctx.dispatch(new SubscriptionDeactivated());
    // }
    ctx.dispatch(new SubscriptionStateSave());
  }

  @Action(SubscriptionStateSave)
  save(ctx: StateContext<SubscriptionStateModel>) {
    this.storage.set('subscriptionState', ctx.getState());
  }

  @Action(SubscriptionStateLoad)
  async load(ctx: StateContext<SubscriptionStateModel>) {
    const subState = await this.storage.get('subscriptionState');
    if (subState !== null) {
      ctx.setState({...subState});
    }
    ctx.patchState({isLoading: false});
  }

  @Action(SubscriptionApplyProducts)
  async applyProducts(ctx: StateContext<SubscriptionStateModel>, payload: SubscriptionApplyProducts) {
    const currentProducts = ctx.getState().ownedProducts;

    // Add any products which are not currently listed in the given products but which are owned.
    const ownedProducts = payload.products.filter(p => p.type === 'paid subscription' && p.owned);
    ownedProducts.forEach((product) => {
      const existingProduct = currentProducts.find(i => i.id === product.id);
      if (!existingProduct) {
        // We have a new purchase, append it.
        ctx.dispatch(new SubscriptionOwned(product));
      } else {
        // If we have an existing, we can update it here.
        ctx.setState(
          patch({
            ownedProducts: updateItem((i => i.id === product.id), product)
          })
        );
      }
    });

    // Now, process the products which the payload says are not currently owned but are in the owned items.
    payload.products.filter(p => p.type === 'paid subscription' && !p.owned)
      .forEach((product: IAPProduct) => {
        const existingProduct = currentProducts.find(i => i.id === product.id);
        if (existingProduct) {
          ctx.dispatch(new SubscriptionExpired(product));
        }
      });
  }
}
