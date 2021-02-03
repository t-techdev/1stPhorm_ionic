import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { LinkApplication } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

@Injectable({
  providedIn: 'root'
})
export class TrainerTransphormerLinkService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);
    TrainerTransphormerLinkService.SET_PLATFORM(platform);
    TrainerTransphormerLinkService.SET_ROLLBAR(rollbar);
  }

  public requestStatus(): Promise<LinkApplication | ErrorFormat> {
    const options = TrainerTransphormerLinkService.BaseOptions();
    options.params = {
      wants_link: true
    };
    return this.http.get<LinkApplication>(TrainerTransphormerLinkService.Url('trainer-transphormer')
      , options)
      .toPromise()
      .catch((error) => {
        // Basically, don't pass the error to the Handler if it's just a 404. We don't care if it is a 404.
        return error.status !== 404 ? TrainerTransphormerLinkService.HandleError(error) : error;
      });
  }


  public applyLinkingByTransphormer(advisorId: number, transphormerId: number): Observable<LinkApplication> {
    return this.http.post<LinkApplication>(TrainerTransphormerLinkService.Url('trainer-transphormer'),
      {
        trainer: advisorId,
        transphormer: transphormerId
      });
  }

  public destroyLink(id: number): Promise<any | ErrorFormat> {
    return this.http.delete(TrainerTransphormerLinkService.Url(`trainer-transphormer/${id}`),
      TrainerTransphormerLinkService.BaseOptions())
      .toPromise()
      .catch(TrainerTransphormerLinkService.HandleError);
  }

  public trainerApplications(): Promise<LinkApplication[] | ErrorFormat> {
    return this.http.get<LinkApplication[]>(TrainerTransphormerLinkService.Url('trainer-transphormer')
      , TrainerTransphormerLinkService.BaseOptions())
      .toPromise()
      .catch(TrainerTransphormerLinkService.HandleError);
  }

  public acceptStatus(id: number): Promise<LinkApplication | ErrorFormat> {
    return this.http.post<LinkApplication>(TrainerTransphormerLinkService.Url(`trainer-transphormer/${id}/accept`), {}
      , TrainerTransphormerLinkService.BaseOptions())
      .toPromise()
      .catch(TrainerTransphormerLinkService.HandleError);
  }

  public batchAcceptStatus(ids: number[]): Promise<any | ErrorFormat> {
    return this.http.post(TrainerTransphormerLinkService.Url('trainer-transphormer/bulk/accept'), {ids},
      TrainerTransphormerLinkService.BaseOptions())
      .toPromise()
      .catch(TrainerTransphormerLinkService.HandleError);
  }

  public batchDeleteStatus(ids: number[]): Promise<any | ErrorFormat> {
    return this.http.post(TrainerTransphormerLinkService.Url('trainer-transphormer/bulk'), {
        ids,
        _method: 'delete'
      },
      TrainerTransphormerLinkService.BaseOptions())
      .toPromise()
      .catch(TrainerTransphormerLinkService.HandleError);
  }
}
