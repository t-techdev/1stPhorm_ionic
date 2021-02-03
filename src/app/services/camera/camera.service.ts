import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { CameraPhotos, ErrorFormat } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CameraService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar,
    ) {
    super(http, platform, userService, rollbar);
    CameraService.SET_PLATFORM(platform);
    CameraService.SET_ROLLBAR(rollbar);
  }

  public uploadImages(data: FormData): Promise<CameraPhotos | ErrorFormat> {
    const options = CameraService.BaseOptions();
    options.headers.set('enctype', 'multipart/form-data');

    return this.http.post<CameraPhotos>(CameraService.Url('camera'), data, options)
      .toPromise()
      .catch((errorResponse) => {
        this.rollbar.error('Error uploading photos.', errorResponse);
        const errorContent = {
          status: errorResponse.status,
          list: {global: ['Unable to upload photos. Please try again later.']}
        };
        return Promise.reject<ErrorFormat>(errorContent);
      });
  }

  public images(queryParams: {[key: string]: string} = {}): Promise<CameraPhotos[] | ErrorFormat> {
    const options = CameraService.BaseOptions(true, true);
    options.params = queryParams;
    return this.http.get<CameraPhotos[]>(CameraService.Url('camera'), options)
      .toPromise()
      .catch(CameraService.HandleError);
  }

  /**
   * Returns latest image instance
   */
  public latestImage(): Observable<CameraPhotos | null> {
    return this.http.get<CameraPhotos>(CameraService.Url('camera/latest'), CameraService.BaseOptions(true));
  }

}
