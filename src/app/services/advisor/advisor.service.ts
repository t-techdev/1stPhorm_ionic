import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Inject, Injectable } from '@angular/core';
import { Moment } from 'moment';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { fromArray } from 'rxjs/internal/observable/fromArray';
import { Observable, timer } from 'rxjs';
import { UserService } from '../user/user.service';
import { mapWeightUnit, mapBodyMetricUnit } from '../../helpers/map-unit-helper';
import { StorageService } from '../storage.service';
import { Storage } from '@ionic/storage';
import { Transphormer } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

export interface AssessmentResponse {
  current_page: number;
  data: AssessmentData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface AssessmentData {
  id: number;
  transphormer_id: number;
  week_start: string;
  week_end: string;
  response_data: any[];
  update_id: number;
  reviewed: number;
  created_at: string;
  created?: Date;
  updated_at: string;
  updated?: Date;
  transphormer: Transphormer;
}

@Injectable({
  providedIn: 'root'
})
export class AdvisorService extends BaseService {
  private _lastUpdate: any = null;
  private storage: Storage;

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    private storageService: StorageService,
    @Inject(RollbarService) public rollbar: Rollbar,
  ) {
    super(http, platform, userService, rollbar);
    AdvisorService.SET_PLATFORM(platform);
    AdvisorService.SET_ROLLBAR(rollbar);
    this.init();
  }

  public async init() {
    this.storage = new Storage({ name: 'assessments' });
    this.lastUpdate = await this.storageService.get('assessments:last-update');
  }

  get lastUpdate() {
    return this._lastUpdate;
  }

  set lastUpdate(value) {
    this._lastUpdate = value;
    this.storageService.set('assessments:last-update', value);
  }

  public async transphormerAssessments(): Promise<AssessmentData[]> {
    const assessments: AssessmentData[] = [];
    return this.storage.length()
      .then(async (length) => {
        let numPages = 1,
          page = 1;
        do {
          await this.getAdvisorAssessments(page, this.lastUpdate)
            .then(async (assessmentsResponse: AssessmentResponse) => {
              numPages = assessmentsResponse.last_page;
              assessmentsResponse.data.map(
                assessment => this.storage.set(`assessment-${assessment.id}`, assessment)
              );
            });
          page++;
        } while (page < numPages);
      })
      .then(() => {
        return this.storage.forEach((value: AssessmentData) => {
          assessments.push(value);
        }).then(_ => {
          if (assessments.length === 0) {
            return assessments;
          }
          assessments.sort(this.assessmentSort);
          this.lastUpdate = assessments[assessments.length - 1].updated_at;
          return assessments;
        });
      });
  }

  public advisorAssessmentUpdates() {
    return timer(0, 30000)
      .pipe(
      mergeMap(() => {
        return this._getAdvisorAssessments(1, this.lastUpdate)
          .pipe(
            map(assessmentResponse => assessmentResponse.data)
          );
      }),
      // Turn the listing into a separate responses.
      flatMap(listing => fromArray<AssessmentData>(listing)),
      // Add the responses to the main DB.
      tap(assessment => this.storage.set(`assessment-${assessment.id}`, assessment)),
    );
  }

  public assessmentSort(a, b) {
    if (a.updated_at === b.updated_at) {
      return 0;
    }
    return a.updated_at > b.updated_at ? 1 : -1;
  }

  public getTransphormerAssessments(transphormerId: number): Promise<AssessmentData[] | ErrorFormat> {
    return this.http.get<AssessmentData[]>(AdvisorService.Url(`trainer/transphormer/${transphormerId}/assessments`), AdvisorService.BaseOptions())
      .toPromise()
      .then((response) => {
        response.map((item) => {
          item.created = new Date(item.created_at);
          item.updated = new Date(item.updated_at);
          return item;
        });
        return response;
      })
      .catch(AdvisorService.HandleError);

  }

  protected _getAdvisorAssessments(pPage?: number, since?: Moment): Observable<AssessmentResponse> {
    const page = pPage || 1;
    const url = `trainer/assessments?page=${page}` + (since ? `&since=${since}` : '');
    return this.http.get<AssessmentResponse>(AdvisorService.Url(url), AdvisorService.BaseOptions())
      .pipe(map((response) => {
        response.data.map((item) => {
          item.created = new Date(item.created_at);
          item.updated = new Date(item.updated_at);
          return item;
        });
        return response;
      }));
  }

  /**
   *
   */
  private async getAdvisorAssessments(pPage?: number, since?: Moment): Promise<AssessmentResponse> {
    try {
      const res = await this._getAdvisorAssessments(pPage, since).toPromise();
      return res;
    } catch (e) {
      AdvisorService.HandleError(e);
    }
  }

  /**
   *
   * @param id
   */
  public getAdvisorAssessment(id: string): Promise<any> {

    return this.http.get<any>(
      AdvisorService.Url('trainer/assessment/' + id), AdvisorService.BaseOptions())
      .toPromise()
      .then((response) => {
        response.body_metrics.map((item) => {
          item = mapWeightUnit(item);
          return item;
        });
        response.measurements.map((item) => {
          item = mapBodyMetricUnit(item);
          return item;
        });
        return response;
      })
      .catch(AdvisorService.HandleError);

  }

  /**
   *
   * @param id
   */
  public markAssessmentAsReviewed(id: string): Promise<any> {

    return this.http.post<any>(
      AdvisorService.Url('trainer/assessment/' + id + '/review'),
      null,
      AdvisorService.BaseOptions())
      .toPromise()
      .catch(AdvisorService.HandleError);

  }

}
