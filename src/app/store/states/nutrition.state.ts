import { Action, Selector, State, StateContext, StateToken, Store } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EMPTY, merge, of } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  SetActiveDay,
  StoreNutritionFoodData,
  SupplementConfigurationUpdated,
  ToggleExpandMeal,
  ToggleExpandSupplements,
  ToggleSupplementUsed
} from '../actions/nutrition.actions';

import { Meal, SimpleNutritionResponse } from '../../interfaces';
import { SimpleNutritionService, StorageService, UserService } from '../../services';

import { SupplementsState } from './supplements.state';
import { apiUrl, mySQLFormattedDate } from '../../helpers';

export const NUTRITION_STATE_TOKEN = new StateToken<NutritionStateModel>('nutrition');

export interface NutritionStateModel {
  data: { [date: string]: SimpleNutritionResponse };
  activeDate: string | null;
}

@State<NutritionStateModel>({
  name: NUTRITION_STATE_TOKEN,
  defaults: {
    data: {},
    activeDate: mySQLFormattedDate(),
  }
})
@Injectable({
  providedIn: 'root'
})
export class NutritionState {

  @Selector()
  static activeNutritionData(state: NutritionStateModel) {
    return (state.data[state.activeDate].data.nutrition || []);
  }

  @Selector()
  static activeDate(state: NutritionStateModel) {
    return state.activeDate;
  }

  @Selector()
  static activeSupplementData(state: NutritionStateModel) {
    return state.data[state.activeDate].data.supplements || [];
  }

  private saveData(ctx: StateContext<NutritionStateModel>) {
    const {activeDate, data} = ctx.getState();
    const {nutrition, supplements} = data[activeDate].data;
    this.http.put(apiUrl('simple-nutrition/' + activeDate), {
      nutrition,
      supplements,
      configuration: {}
    }).subscribe((response) => {
    });
  }

  constructor(
    private store: Store,
    private storageService: StorageService,
    private http: HttpClient,
    private userService: UserService,
    private nutrition: SimpleNutritionService,
  ) {
  }

  @Action(StoreNutritionFoodData)
  storeNutritionFoodData(ctx: StateContext<NutritionStateModel>, {meal, mealItem, nutritionItem}: StoreNutritionFoodData) {
    const state = ctx.getState();

    const data = {...state.data};

    const currentNutritionData = JSON.parse(JSON.stringify(state.data[state.activeDate]));
    const activeNutritionData = currentNutritionData.data.nutrition;

    const mealIndex = activeNutritionData.findIndex(m => m.name === meal.name);
    activeNutritionData[mealIndex] = {...activeNutritionData[mealIndex]};

    const foodIndex = activeNutritionData[mealIndex].items.findIndex(f => f.type === mealItem.type);
    activeNutritionData[mealIndex].items[foodIndex].selectedNutrition = nutritionItem;

    data[state.activeDate] = currentNutritionData;

    ctx.patchState({data});
    this.saveData(ctx);
  }

  @Action(ToggleExpandSupplements)
  expandSupplements(ctx: StateContext<NutritionStateModel>) {
    const state = ctx.getState();
    const activeDate = state.activeDate;

    const data = {...state.data};
    data[activeDate] = {...state.data[activeDate]};
    data[activeDate].data = {...state.data[activeDate].data};
    data[activeDate].data.supplements = {...data[activeDate].data.supplements};
    data[activeDate].data.supplements.expanded = !data[activeDate].data.supplements.expanded;

    ctx.patchState({data});
    this.saveData(ctx);
  }

  @Action(ToggleExpandMeal)
  expandMeal(ctx: StateContext<NutritionStateModel>, {activeDate, mealIndex}: ToggleExpandMeal) {
    const state = ctx.getState();

    const data = {...state.data};
    data[activeDate] = {...state.data[activeDate]};
    data[activeDate].data = {...state.data[activeDate].data};
    data[activeDate].data.nutrition = [...data[activeDate].data.nutrition];
    data[activeDate].data.nutrition[mealIndex] = {...data[activeDate].data.nutrition[mealIndex]};
    data[activeDate].data.nutrition[mealIndex].expanded = !data[activeDate].data.nutrition[mealIndex].expanded;

    ctx.patchState({data});
    this.saveData(ctx);
  }

  @Action(ToggleSupplementUsed)
  toggleSupplementUsed(ctx: StateContext<NutritionStateModel>, {supplementIndex}: ToggleSupplementUsed) {
    const state = ctx.getState();
    const activeDate = state.activeDate;

    const data = {...state.data};
    data[activeDate] = {...state.data[activeDate]};
    data[activeDate].data = {...state.data[activeDate].data};
    data[activeDate].data.supplements = {...data[activeDate].data.supplements};
    data[activeDate].data.supplements.items = [...data[activeDate].data.supplements.items];
    data[activeDate].data.supplements.items[supplementIndex] = {...data[activeDate].data.supplements.items[supplementIndex]};
    data[activeDate].data.supplements.items[supplementIndex].selectedNutrition = !data[activeDate].data.supplements.items[supplementIndex].selectedNutrition as any;

    ctx.patchState({data});
    this.saveData(ctx);
  }

  @Action(SetActiveDay)
  setActiveDay(ctx: StateContext<NutritionStateModel>, {activeDate}: SetActiveDay) {
    const state = ctx.getState();

    const existingData$ = of(state.data[activeDate] !== null)
      .pipe(
        switchMap(val => val ? of(state.data[activeDate]) : EMPTY)
      );

    const remoteData$ = this.http.get<SimpleNutritionResponse>(apiUrl('simple-nutrition/' + activeDate))
      .pipe(
        catchError((error) => {
          return of<SimpleNutritionResponse>({
            track_date: activeDate,
            transphormer_id: null,
            id: null,
            data: null
          });
        }),
        map((response: SimpleNutritionResponse) => {
          if (!response.data) {
            const nutrition = this.nutrition.generateDayFor(this.userService.activeNutrition());
            const supplements = {
              name: 'Supplements',
              type: 'supplements',
              expanded: true,
              items: [...this.store.selectSnapshot(SupplementsState.supplements)],
            } as Meal;
            response.data = {
              nutrition, supplements, configuration: {}
            };
          }
          return response;
        })
      );

    return merge(
      existingData$,
      remoteData$
    )
      .subscribe((dayData) => {
        if (!dayData) {
          return;
        }
        const data = {...ctx.getState().data};
        data[activeDate] = dayData;
        ctx.patchState({activeDate, data});
      });
  }


  @Action(SupplementConfigurationUpdated)
  applySupplementConfiguration(ctx: StateContext<NutritionStateModel>, {supplements}: SupplementConfigurationUpdated) {
    let noSupplements = true;
    const newItems = [];

    supplements.forEach((item, index) => {
      newItems[index] = Object.assign({}, item, {use: true});
      if (supplements && supplements.length > 0) {
        const elem = supplements.find(o => o.name === item.name);
        newItems[index].use = newItems[index].selectedNutrition || elem.use;
        if (elem.use) {
          noSupplements = false;
        }
      } else {
        noSupplements = false;
      }
    });

    const state = ctx.getState();
    const activeDate = state.activeDate;

    const data = {...state.data};
    data[activeDate] = {...state.data[activeDate]};
    data[activeDate].data = {...state.data[activeDate].data};
    data[activeDate].data.supplements.items = newItems;
    data[activeDate].data.supplements.noSupplements = noSupplements;
    ctx.patchState({data});
  }
}
