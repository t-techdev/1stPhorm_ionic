import { Injectable, Inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { AssessmentQuestion } from '../../interfaces/assessments';
import { Observable } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BodyMetric } from '../body-metric/body-metric';
import { MacroCountingInfo } from '../nutrition/nutrition.service';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { CameraPhotos, Transphormer, Weight, WorkoutSession } from '../../interfaces';

export interface Assessment {
  body_metrics: Weight[];
  responses: AssessmentResponses;
  photos: AssessmentPhotos;
  nutrition: MacroCountingInfo[];
  workouts: WorkoutSession[];
  transphormer: Transphormer;
  measurements: BodyMetric[];
}

export interface AssessmentResponses {
  version: number;
  report: AssessmentReport[];
}

export interface AssessmentReport {
  title: string;
  description: string;
  options: AssessmentReportOption[];
}

export interface AssessmentReportOption {
  title: string;
  value: number;
  icon: string;
  order: number;
}

export interface AssessmentPhotos {
  oldest: CameraPhotos;
  latest: CameraPhotos;
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    public localNotification: LocalNotifications,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);
    AssessmentsService.SET_PLATFORM(platform);
    AssessmentsService.SET_ROLLBAR(rollbar);
  }

  /**
   * Returns list of questions against assessments
   */
  public assessmentQuestions(): Observable<{ version: number; questions: AssessmentQuestion[] }> {
    return this.http
      .get<{ version: number; questions: AssessmentQuestion[] }>(
      AssessmentsService.Url('assessment-questions'),
      AssessmentsService.BaseOptions(true, true));
  }

  /**
   * Save assessment in the backend
   *
   * @param assessmentQuestions
   * @param questionVersion
   * @param cameraPhoto
   */
  public saveAssessment(assessmentQuestions: AssessmentQuestion[], questionVersion: number, cameraPhoto: CameraPhotos): Observable<any> {

    const data = {
      response_data: {
        version: questionVersion,
        responses: assessmentQuestions.map(q => {
          return {
            id: q.id,
            value: q.options.find(o => o.is_selected).value
          };
        }),
      },
      update_id: cameraPhoto.id
    };

    return this.http.post(AssessmentsService.Url('assessment'), data, AssessmentsService.BaseOptions());
  }

  /**
   * Set local reminder to take notification in future date.
   * @param date
   */
  public reminderToTakeAssessment(date: Date) {
    if (this.platform.is('cordova')) {
      this.localNotification.schedule({
        id: 89,
        data: { page: '/take-assessment' },
        title: 'Reminder: Take your assessment',
        trigger: {
          at: date
        }
      });
    }
  }
}
