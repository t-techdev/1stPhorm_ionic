import { Injectable, Inject } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedPusherService extends BaseService {

  private pusher: Pusher;

  constructor(
    public http: HttpClient,
    public platform: Platform,
    protected userService: UserService,
    private storageService: StorageService,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);

    AuthenticatedPusherService.SET_PLATFORM(platform);
    AuthenticatedPusherService.SET_ROLLBAR(rollbar);

    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      host: environment.pusher.host,
      encrypted: true,
      authEndpoint: AuthenticatedPusherService.Url('broadcasting/auth'),
      auth: {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`
        }
      }
    });
  }

  public openChannel(channelName: string) {
    this.pusher.subscribe(channelName);
  }

  public closeChannel(channelName: string) {
    this.pusher.unsubscribe(channelName);
  }

  public openEvent<T>(eventName: string): Observable<T> {
    const subject = new Subject<T>();

    this.pusher.bind(eventName, (data) => {
      subject.next(data as T);
    });

    return subject.asObservable();
  }

  public closeEvent(eventName, callback?: Function) {
    this.pusher.unbind(eventName, callback);
  }
}
