import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { ErrorsService } from '../errors/errors.service';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { ToastService } from '../toast-service/toast-service.service';
import { WorkoutSession, WorkoutSessionExerciseHistory } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';


@Injectable({
  providedIn: 'root'
})
export class WorkoutsService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    private toastSvc: ToastService,
    private errorService: ErrorsService,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);
    WorkoutsService.SET_PLATFORM(platform);
    WorkoutsService.SET_ROLLBAR(rollbar);
  }

  /**
   * Fetches workout data for the day
   *
   * @param date
   */
  public fetchWorkout(date: Date): Promise<WorkoutSession | ErrorFormat> {
    const workoutDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return this.http.get<WorkoutSession>(WorkoutsService.Url(`workouts/${workoutDate}`), WorkoutsService.BaseOptions())
      .toPromise()
      .catch(WorkoutsService.HandleError);
  }

  public fetchWorkoutSummary(_from: Date, _to: Date): Promise<WorkoutSession | ErrorFormat> {
    const from = `${_from.getFullYear()}-${_from.getMonth() + 1}-${_from.getDate()}`;
    const toDate = `${_to.getFullYear()}-${_to.getMonth() + 1}-${_to.getDate()}`;
    const opts = WorkoutsService.BaseOptions(true, true, 86400);
    opts.params = {from, 'to': toDate};
    return this.http.get<WorkoutSession>(WorkoutsService.Url(`workouts`), opts)
      .toPromise()
      .catch(WorkoutsService.HandleError)
      .catch((e: ErrorFormat) => {
        this.toastSvc.flash(this.errorService.firstError(e))
        return e;
      });
  }

  /**
   * Updates workout data
   *
   * @param workoutSession
   */
  public updateWorkoutExercise(workoutSession: WorkoutSession): Promise<WorkoutSession | ErrorFormat> {
    const {id, workout_data, completed} = workoutSession;
    const payload = {
      data: workout_data,
      completed: completed
    };
    return this.http.put<WorkoutSession>(WorkoutsService.Url(`workouts/${id}`), payload, WorkoutsService.BaseOptions())
      .toPromise()
      .catch(WorkoutsService.HandleError);
  }

  /**
   * Update workout notes content
   *
   *
   * @param workoutSessionId
   * @param notes
   */
  public updateWorkoutNote(workoutSessionId: number, notes: string): Promise<any | ErrorFormat> {
    const data = {
      notes: notes
    };

    return this.http.post(WorkoutsService.Url(`workouts/${workoutSessionId}/notes`), data, WorkoutsService.BaseOptions())
      .toPromise()
      .catch(WorkoutsService.HandleError);
  }

  /**
   * Returns list of exercise history logged by transphormer.
   *
   * @param exerciseId
   * @param exerciseGroupId
   */
  public exerciseHistory(exerciseId: number, exerciseGroupId: number): Promise<WorkoutSessionExerciseHistory[] | ErrorFormat> {
    const options = WorkoutsService.BaseOptions(true);
    options.params = {
      exercise_id: exerciseId,
      exercise_group_id: exerciseGroupId
    };

    return this.http.get<WorkoutSessionExerciseHistory[]>(WorkoutsService.Url('workouts/exercise/history'), options)
      .toPromise()
      .then(result => result.map(workoutSession => {
        workoutSession.workout_date = moment(workoutSession.workout_date);
        return workoutSession;
      }))
      .catch(WorkoutsService.HandleError);
  }

  /**
   * Switch to home exercise or revert to original gym workout access
   * @param workoutSession
   * @param switchToHome
   * @param homeWorkout
   */
  public switchToHomeWorkout(
    workoutSession: WorkoutSession,
    switchToHome = true,
  ): Promise<WorkoutSession | ErrorFormat> {
    return this.http.patch<WorkoutSession>(WorkoutsService.Url(`workouts/${workoutSession.id}/switch-to-home`), {
      switched_to_home: switchToHome,
    }, WorkoutsService.BaseOptions(true))
      .toPromise()
      .catch(WorkoutsService.HandleError);
  }
}
