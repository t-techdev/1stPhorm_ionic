import { Injectable, Inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { Exercise } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

export interface Tag {
  name: string;
  exercise_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar,
  ) {
    super(http, platform, userService, rollbar);
    ExerciseService.SET_PLATFORM(platform);
    ExerciseService.SET_ROLLBAR(rollbar);
  }

  public getExercise(exerciseId: number): Promise<Exercise | ErrorFormat> {
    return this.http.get<Exercise>(ExerciseService.Url(`exercises/${exerciseId}`), ExerciseService.BaseOptions())
      .toPromise()
      .catch(ExerciseService.HandleError);
  }
}
