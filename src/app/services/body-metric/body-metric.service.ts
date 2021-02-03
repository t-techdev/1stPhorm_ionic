import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { BodyMetric, MetricFilter } from './body-metric';
import { map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { BodyMetricConfiguration, Configuration } from './body-metric-configuration';
import { RollbarService } from '../../rollbar';
import { mapBodyMetricUnit } from '../../helpers/map-unit-helper';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class BodyMetricService extends BaseService {

  constructor(
    public http: HttpClient,
    public platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar
) {
    super(http, platform, userService, rollbar);
    BodyMetricService.SET_PLATFORM(platform);
  }

  /**
   * Returns list of metrics
   * @param filters
   */
  public list(filters: MetricFilter = {}): Observable<BodyMetric[]> {
    const options = BodyMetricService.BaseOptions();
    options.params = filters;

    return this.http.get<BodyMetric[]>(BodyMetricService.Url('body-metrics'), options)
      .pipe(map(metrics => metrics.map(metric => this.loggedDateConversion(metric))));
  }

  /**
   * Converts logged date string value to date value
   * @param metric
   */
  private loggedDateConversion(metric: BodyMetric): BodyMetric {
    metric.logged_on = moment.utc(metric.logged_on, 'YYYY-MM-DD HH:mm:ss', true);
    metric = mapBodyMetricUnit(metric);
    return metric;
  }

  /**
   * Updates existing metric record
   *
   * @param id
   * @param metric
   */
  public update(id: number, metric: BodyMetric): Observable<BodyMetric> {
    return this.http.put<BodyMetric>(BodyMetricService.Url(`body-metrics/${id}`), metric, BodyMetricService.BaseOptions())
      .pipe(map(newMetric => this.loggedDateConversion(newMetric)));
  }

  /**
   * Stores new metric record
   * @param metric
   */
  public store(metric: BodyMetric): Observable<BodyMetric> {
    return this.http.post<BodyMetric>(BodyMetricService.Url('body-metrics'), metric, BodyMetricService.BaseOptions())
      .pipe(map(newMetric => this.loggedDateConversion(newMetric)));
  }

  /**
   * Removes body metric record
   * @param metric
   */
  public remove(metric: BodyMetric): Observable<null> {
    return this.http.delete<null>(BodyMetricService.Url(`body-metrics/${metric.id}`), BodyMetricService.BaseOptions())
      .pipe(switchMap(() => of(null)));
  }

  /**
   * Returns latest metric
   * @param filters
   */
  public latestMetric(filters: MetricFilter): Observable<BodyMetric | null> {
    const options = BodyMetricService.BaseOptions();
    options.params = filters;

    return this.http.get<BodyMetric | null>(BodyMetricService.Url('body-metrics/latest'), options)
      .pipe(map(metric => {
        if (metric !== null && metric.id) {
          return this.loggedDateConversion(metric);
        }

        return null;
      }));
  }

  /**
   * Latest metrics by type
   */
  public latestMetricsByType(): Observable<BodyMetric[]> {
    return this.http.get<BodyMetric[]>(BodyMetricService.Url('body-metrics/latest/by-type'), BodyMetricService.BaseOptions())
      .pipe(map(metrics => metrics.map(m => m ? this.loggedDateConversion(m) : null)));
  }

  /**
   * Returns body metric type configuration
   */
  public configurations(): Observable<BodyMetricConfiguration | null> {
    return this.http.get<BodyMetricConfiguration | null>(
      BodyMetricService.Url('body-metric-configurations'), BodyMetricService.BaseOptions()
    ).pipe(map(config => {
      if (config === null || !config.id) {
        return null;
      }

      return config;
    }));
  }

  /**
   * Update configuration with new settings
   * @param configs
   */
  public updateConfiguration(configs: Configuration[]): Observable<BodyMetricConfiguration> {
    return this.http.put<BodyMetricConfiguration>(
      BodyMetricService.Url('body-metric-configurations'),
      {configurations: configs},
      BodyMetricService.BaseOptions()
    );
  }
}
