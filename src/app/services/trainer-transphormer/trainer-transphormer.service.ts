import { Injectable, Inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { MacroCountingInfo } from '../nutrition/nutrition.service';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { mapGoalWeightUnit, mapWeightUnit } from '../../helpers/map-unit-helper';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { CameraPhotos, Transphormer, Weight, WorkoutSession } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

export interface ListingParams extends Object {
  activeDays: number | string;
  uploadDays: number | string;
  haveNotUploadDays: number | string;
  joinedDays: number | string;
  name: string;
  customer_for_life?: boolean | '';
  is_premium?: boolean | '';
  not_messaged_in?: number | string;
}

export interface PaginatedLinkedApplications {
  data: Transphormer[];
  total: number;
  from: number;
  to: number;
  last_page: number;
  current_page: number;
}

@Injectable({
  providedIn: 'root',
})
export class TrainerTransphormerService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar,
  ) {
    super(http, platform, userService, rollbar);
    TrainerTransphormerService.SET_PLATFORM(platform);
    TrainerTransphormerService.SET_ROLLBAR(rollbar);
  }

  public transphormers(
    params: ListingParams | null = null, page: number = 1, perPage: number = 100,
  ): Promise<PaginatedLinkedApplications | ErrorFormat> {

    const options = TrainerTransphormerService.BaseOptions() as any;
    options.params = params ? Object.assign({}, params) : {};
    options.params.perPage = perPage.toString();
    options.params.page = page.toString();

    return this.http
      .get<PaginatedLinkedApplications>(
        TrainerTransphormerService.Url('trainer/transphormer'),
        options as {}
      )
      .pipe(map(applications => {
        applications.data = applications.data.map(transphormer => {
          if (transphormer.latest_weight) {
            transphormer.latest_weight = mapWeightUnit(transphormer.latest_weight);
          }
          if (transphormer.starting_weight) {
            transphormer.starting_weight = mapWeightUnit(transphormer.starting_weight);
          }
          return transphormer;
        });
        return applications;
      }))
      .toPromise()
      .catch(TrainerTransphormerService.HandleError);
  }

  public transphormer(id: number): Promise<Transphormer | ErrorFormat> {
    return this.http
      .get<Transphormer>(
        TrainerTransphormerService.Url(`trainer/transphormer/${id}`),
        TrainerTransphormerService.BaseOptions(),
      )
      .toPromise()
      .then(transphormer => {
        if (transphormer.latest_weight) {
          transphormer.latest_weight = mapWeightUnit(transphormer.latest_weight);
        }
        if (transphormer.starting_weight) {
          transphormer.starting_weight = mapWeightUnit(transphormer.starting_weight);
        }
        transphormer = mapGoalWeightUnit(transphormer);
        return transphormer;
      })
      .catch(TrainerTransphormerService.HandleError);
  }

  public transphormerPhotos(transphormerId: number): Promise<CameraPhotos[] | ErrorFormat> {
    return this.http.get<CameraPhotos[]>(TrainerTransphormerService.Url(`trainer/transphormer/${transphormerId}/camera`),
      TrainerTransphormerService.BaseOptions())
      .toPromise()
      .catch(TrainerTransphormerService.HandleError);
  }

  public transphormerWorkouts(transphormerId: number, from?: string, to?: string): Promise<WorkoutSession[] | ErrorFormat> {
    let url = `trainer/transphormer/${transphormerId}/workouts`;
    const opts = [];
    if (from) {
      opts.push('from=' + escape(from));
    }
    if (to) {
      opts.push('to=' + escape(to));
    }
    if (opts.length > 0) {
      url += '?' + opts.join('&');
    }
    return this.http.get<WorkoutSession[]>(TrainerTransphormerService.Url(url),
      TrainerTransphormerService.BaseOptions())
      .toPromise()
      .then((result) => {
        return result;
      })
      .catch(TrainerTransphormerService.HandleError);
  }

  public transphormerWeights(transphormerId: number): Promise<Weight[] | ErrorFormat> {
    return this.http.get<Weight[]>(TrainerTransphormerService.Url(`trainer/transphormer/${transphormerId}/weigh-ins`),
      TrainerTransphormerService.BaseOptions())
      .toPromise()
      .then(weights => weights.map(weight => this.loggedDateConversion(weight)))
      .catch(TrainerTransphormerService.HandleError);
  }

  public trackedItems(transphormerId: number, from?: string, to?: string): Promise<MacroCountingInfo[] | ErrorFormat> {
    let url = `trainer/transphormer/${transphormerId}/tracked-items`;
    const opts = [];
    if (from) {
      opts.push('from=' + escape(from));
    }
    if (to) {
      opts.push('to=' + escape(to));
    }
    if (opts.length > 0) {
      url += '?' + opts.join('&');
    }
    return this.http.get<MacroCountingInfo[]>(TrainerTransphormerService.Url(url),
      TrainerTransphormerService.BaseOptions())
      .toPromise()
      .catch(TrainerTransphormerService.HandleError);
  }

  /**
   * Converts logged date string value to date value
   * @param weight
   */
  private loggedDateConversion(weight: Weight): Weight {
    weight.logged_on = moment(weight.logged_on, 'YYYY-MM-DD HH:mm:ss', true);
    weight = mapWeightUnit(weight);
    return weight;
  }
}
