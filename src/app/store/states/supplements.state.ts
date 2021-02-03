import { Action, Selector, State, StateContext, StateToken, Store } from '@ngxs/store';
import { ApplySupplementConfiguration, LoadSupplementConfiguration } from '../actions/supplements.actions';
import { Injectable } from '@angular/core';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { MealItem } from '../../interfaces/simple-nutrition';

export const SUPPLEMENTS_STATE_TOKEN = new StateToken<SupplementsStateModel>('supplements');

export interface SupplementsStateModel {
  allSupplements: MealItem[];
  supplements: MealItem[];
}

@State<SupplementsStateModel>({
  name: SUPPLEMENTS_STATE_TOKEN,
  defaults: {
    allSupplements: [
      {
        name: 'Ignition',
        type: 'supplement',
        selectedNutrition: null,
        use: true
      },
      {
        name: 'Phormula-1',
        type: 'supplement',
        selectedNutrition: null,
        use: true
      },
      {
        name: 'Full Mega',
        type: 'supplement',
        selectedNutrition: null,
        use: true
      },
      {
        name: 'Opti-reds',
        type: 'supplement',
        selectedNutrition: null,
        use: true
      },
      {
        name: 'Opti-greens',
        type: 'supplement',
        selectedNutrition: null,
        use: true
      },
      {
        name: 'Micro-factor',
        type: 'supplement',
        selectedNutrition: null,
        use: true
      }
    ],
    supplements: null,
  }
})
@Injectable()
export class SupplementsState {

  constructor(
    private prefs: UserPreferencesService,
    private store: Store,
  ) {
  }

  @Selector()
  static allSupplements(state: SupplementsStateModel) {
    return state.allSupplements;
  }

  @Selector()
  static supplements(state: SupplementsStateModel) {
    return state.supplements || state.allSupplements;
  }

  @Action(LoadSupplementConfiguration)
  loadSupplementConfig(ctx: StateContext<SupplementsStateModel>) {
    return this.prefs.getAsync<MealItem[]>('supplements', ctx.getState().allSupplements)
      .then((supplements) => {
        console.log('got Supplements', supplements);
        ctx.patchState({supplements});
      });
  }

  @Action(ApplySupplementConfiguration)
  applySupplementConfig(ctx: StateContext<SupplementsStateModel>, {supplements}: ApplySupplementConfiguration) {
    ctx.patchState({supplements});
    this.prefs.set('supplements', supplements);
  }
}
