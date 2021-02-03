import { Injectable, Inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { ErrorsService } from '../errors/errors.service';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { ToastService } from '../toast-service/toast-service.service';
import { CameraPhotos, WorkoutSession } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

export interface DashboardWorkoutSessionInfo extends WorkoutSession {
  total_days: number;
  last_two_month_updates: CameraPhotos[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    private toastSvc: ToastService,
    private errorService: ErrorsService,
    @Inject(RollbarService) public rollbar: Rollbar,
  ) {
    super(http, platform, userService, rollbar);
    DashboardService.SET_PLATFORM(platform);
    DashboardService.SET_ROLLBAR(rollbar);
  }

  public dashboard(): Promise<DashboardWorkoutSessionInfo | ErrorFormat> {
    return this.http.get<DashboardWorkoutSessionInfo>(DashboardService.Url('dashboard'),
      DashboardService.BaseOptions(true, true))
      .toPromise()
      .catch(DashboardService.HandleError)
      .catch((e) => {
        const error = this.errorService.firstError(e);

        if (error !== 'No workouts') {
          this.toastSvc.flash(error);
        }
        throw e;
      });
  }
}
