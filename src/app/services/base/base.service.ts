import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Platform } from '@ionic/angular';
import * as Rollbar from 'rollbar';
import { UserService } from '../internal';
import { ErrorFormat, Transphormer } from '../../interfaces';
import { LOCAL_CACHING_HEADER_NAME } from '../interceptors/caching/headers';

let PLATFORM: Platform;
let ROLLBAR: Rollbar;

export interface Token {
  token_type: string;
  access_token: string;
  refresh_token: string;
}

export abstract class BaseService {

  public static PLATFORM: Platform;
  public static ROLLBAR: Rollbar;

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    public rollbar: Rollbar) {
  }

  /**
   * Returns api url path
   *
   * @param url
   * @constructor
   * @return string
   */
  public static Url(url: string): string {
    return environment.apiUrl + url;
  }

  /**
   * Returns headers
   *
   * @param authenticated
   * @param cache
   * @param cacheDuration
   * @constructor
   * @return HttpHeaders
   */
  public static Headers(authenticated = true, cache = false, cacheDuration = 21600): HttpHeaders {
    let header = new HttpHeaders();
    header = header.set('Accept', 'application/json');
    header = header.set('X-TZ-Offset', ((new Date()).getTimezoneOffset() * -1).toString());

    header = header.set('Device-Type', BaseService.GET_DEVICE_TYPE());

    if (authenticated) {
      header = header.set('Authorization', `Bearer ${window.localStorage.getItem('access_token')}`);
    }

    if (cache) {
      header = header.set(LOCAL_CACHING_HEADER_NAME, BaseService.CREATE_CACHED_TIME(cacheDuration).toString());
    }

    return header;
  }

  public static BaseOptions(authenticated = true, cache = false, cacheDuration = 21600) {
    return {
      headers: BaseService.Headers(authenticated, cache, cacheDuration),
      params: {} as any
    };
  }

  public static ClientId(): string {
    return environment.clientId;
  }

  public static ClientSecret(): string {
    return environment.clientSecret;
  }

  public static HandleError(errorResponse): Promise<ErrorFormat> {
    const errorBody = errorResponse.error;
    let errorContent = <ErrorFormat>{};
    errorContent.status = errorResponse.status;

    if (errorResponse.status === 401 && errorResponse.error.error === 'invalid_credentials') {
      errorContent = {
        status: errorResponse.status,
        list: {message: errorResponse.message, }
      };
      errorContent.list = errorBody.errors;
      return Promise.reject<ErrorFormat>(errorContent);
    } else if (errorResponse.status === 422) {
      // For a 422 error, don't worry about reporting them. They are not actually errors.
      errorContent = {
        status: errorResponse.status,
        list: { message: errorResponse.message, }
      };
    } else if (errorResponse.status === 404 || errorResponse.status === 401) {
      errorContent.list = errorBody.errors || {
        not_found: ['Action not found']
      };
      ROLLBAR.error(errorResponse.message, errorResponse);
    } else {
      errorContent = {
        status: errorResponse.status,
        list: { message: errorResponse.message, }
      };
      ROLLBAR.error(errorResponse.message, errorResponse);
    }
    return Promise.reject<ErrorFormat>(errorContent);
  }

  public static GET_DEVICE_TYPE(): string {
    if (PLATFORM.is('cordova')) {
      if (PLATFORM.is('android')) {
        return 'android';
      }

      return 'ios';
    } else {
      return 'web';
    }
  }

  public static SET_PLATFORM(platform) {
    PLATFORM = platform;
  }

  public static SET_ROLLBAR(rollbar) {
    ROLLBAR = rollbar;
  }

  /**
   * Creates cached timing
   * @param time [Number in seconds]
   */
  public static CREATE_CACHED_TIME(time: number): number {
    const milliseconds = time * 1000;

    return Date.now() + milliseconds;
  }

  /**
   * Saves token information to the system
   * @param token
   */
  public saveToken(token: Token) {
    window.localStorage.setItem('access_token', token.access_token);
    window.localStorage.setItem('refresh_token', token.refresh_token);
  }

  /**
   * Saves the transphormer to the local storage
   *
   * @param transphormer
   */
  public saveTransphormer(transphormer: Transphormer) {
    this.userService.user = transphormer;
  }

  public removeTokens() {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');
  }

  public removeTransphormer() {
    this.userService.removeActiveTransphormer();
  }

}
