import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { Trainer, Transphormer } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';


@Injectable({
  providedIn: 'root'
})
export class TrainerService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);
    TrainerService.SET_PLATFORM(platform);
    TrainerService.SET_ROLLBAR(rollbar);
  }

  public updateTrainer(trainerId: number, data): Promise<any | ErrorFormat> {
    return this.http
      .put<any>(
        TrainerService.Url(`trainer/${trainerId}`),
        data,
        TrainerService.BaseOptions(true)
      )
      .toPromise()
      .catch(TrainerService.HandleError);
  }

  public listTrainers(name): Promise<Transphormer[] | ErrorFormat> {
    const options = TrainerService.BaseOptions();
    options.params = {exact_match: encodeURIComponent(name)};


    return this.http.get<Transphormer[]>(TrainerService.Url('trainer'), options)
      .toPromise()
      .catch(TrainerService.HandleError);
  }

  public showTrainer(id: number): Promise<Transphormer | ErrorFormat> {
    return this.http.get<Transphormer>(TrainerService.Url(`trainer/${id}`), TrainerService.BaseOptions())
      .toPromise()
      .catch(TrainerService.HandleError);
  }

  public getTrainerByTransphormerId(id: number): Promise<Trainer | ErrorFormat> {
    return this.http.get<Trainer>(TrainerService.Url(`trainer-for-transphormer/${id}`), TrainerService.BaseOptions())
      .toPromise()
      .catch(TrainerService.HandleError);
  }
}
