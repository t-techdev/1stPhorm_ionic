import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { MetricFilter } from '../body-metric/body-metric';
import { OnboardingService } from '../onboarding/onboarding.service';
import { ErrorFormat, UnitTypes, Weight } from '../../interfaces';
import { mapWeightUnit } from '../../helpers/map-unit-helper';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class WeightsService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar,
    public onBoardingService: OnboardingService,
  ) {
    super(http, platform, userService, rollbar);
    WeightsService.SET_PLATFORM(platform);
    WeightsService.SET_ROLLBAR(rollbar);
  }

  /**
   * Retrieves the latest weight of the transphormer
   */
  public latestWeight(): Promise<Weight | null | ErrorFormat> {
    return this.http.get<Weight>(WeightsService.Url('weigh-ins/latest'), WeightsService.BaseOptions(true, true))
      .toPromise()
      .then(weight => this.loggedDateConversion(this.checkWeightValue(weight)))
      .catch(WeightsService.HandleError);
  }

  /**
   * Stores weight log for the transphormer
   * @param weight
   * @param unitType
   */
  public saveWeight(weight: number, unitType: UnitTypes): Observable<Weight> {
    const data = { weight, unit_type: unitType };
    return this.http.post<Weight | null>(WeightsService.Url('weigh-ins'), data, WeightsService.BaseOptions(true, true))
      .pipe(tap(() => this.onBoardingService.fetchOnBoard()))
      .pipe(map(newWeight => this.loggedDateConversion(newWeight)));
  }

  /**
   * List all weights for the transphormer
   */
  public listWeights(): Promise<Weight[] | ErrorFormat> {
    return this.http.get<Weight[]>(WeightsService.Url('weigh-ins'), WeightsService.BaseOptions(true, true))
      .toPromise()
      .then(weights => weights.map(weight => this.loggedDateConversion(weight)))
      .catch(WeightsService.HandleError);
  }

  /**
   * Converts logged date string value to date value
   * @param weight
   */
  private loggedDateConversion(weight: Weight | null): Weight {
    if (weight !== null) {
      weight.logged_on = moment.utc(weight.logged_on, 'YYYY-MM-DD HH:mm:ss', true);
      weight = mapWeightUnit(weight);
    }

    return weight;
  }

  /**
   * Updates the weight
   * @param id
   * @param weight
   * @param unitType
   */
  public updateWeight(id: number, weight: number, unitType: UnitTypes): Observable<Weight> {
    const data = { weight, unit_type: unitType };

    return this.http.put<Weight>(WeightsService.Url(`weigh-ins/${id}`), data, WeightsService.BaseOptions())
      .pipe(tap(() => this.onBoardingService.fetchOnBoard()))
      .pipe(map(newWeight => this.loggedDateConversion(newWeight)));
  }

  /**
   * Deletes the weight
   * @param id
   */
  public deleteWeight(id: number): Observable<null> {
    return this.http.delete<null>(WeightsService.Url(`weigh-ins/${id}`), WeightsService.BaseOptions())
      .pipe(tap(() => this.onBoardingService.fetchOnBoard()))
      .pipe(switchMap(() => of(null)));
  }

  private checkWeightValue(weight: Weight | any): Weight | null {
    if (weight.hasOwnProperty('id')) {
      return weight;
    }

    return null;
  }

  /**
   * Get single weight instance
   * @param id
   */
  public getWeight(id: number): Promise<Weight | ErrorFormat> {
    return this.http.get<Weight>(WeightsService.Url(`weigh-ins/${id}`), WeightsService.BaseOptions())
      .toPromise()
      .then(weight => this.loggedDateConversion(weight))
      .catch(WeightsService.HandleError);
  }

  /**
   * Returns listing of weights
   * @param filter
   */
  public weights(filter: MetricFilter = {}): Observable<Weight[]> {
    const options = WeightsService.BaseOptions();
    options.params = filter;

    return this.http.get<Weight[]>(WeightsService.Url('weigh-ins'), options)
      .pipe(map(weights => weights.map(weight => this.loggedDateConversion(weight))));
  }

  /**
   * Retrieves the latest weight of the transphormer
   */
  public latest(): Observable<Weight> {
    return this.http.get<Weight>(WeightsService.Url('weigh-ins/latest'), WeightsService.BaseOptions(true, true))
      .pipe(map(weight => this.loggedDateConversion(weight)));
  }
}
