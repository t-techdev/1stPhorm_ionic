import { Injectable, Inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';

export class UploadProfilePictureResult {
  profile_picture_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar,
  ) {
    super(http, platform, userService, rollbar);
    ProfileService.SET_PLATFORM(platform);
    ProfileService.SET_ROLLBAR(rollbar);
  }

  public changePassword(
    old_password: string,
    password: string,
    password_confirmation: string
  ): Observable<any> {
    const data = {
      password,
      old_password,
      password_confirmation
    };
    return this.http
      .post<any>(ProfileService.Url('change-password'), data, ProfileService.BaseOptions(true));
  }

  /**
   * Uploads a picture profile
   * @param profilePictureBase64Data the image on base64 format on image/jpeg format
   */
  public uploadProfilePicture(profilePictureBase64Data: string): Promise<UploadProfilePictureResult> {

    const data = {
      profile_picture: profilePictureBase64Data
    };
    return this.http
      .post<any>(ProfileService.Url('set-profile-picture'), data, ProfileService.BaseOptions(true))
      .toPromise()
      .catch(ProfileService.HandleError);
  }

}
