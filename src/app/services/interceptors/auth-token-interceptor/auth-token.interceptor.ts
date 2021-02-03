import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenInterceptor implements HttpInterceptor {
  public deviceType: string;

  public constructor(public platform: Platform) {
    this.deviceType = this.getDeviceType();
  }

  getDeviceType(): string {
    if (!this.platform.is('cordova')) {
      return 'web';
    }

    return this.platform.is('android') ? 'android' : 'ios';
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    const headers = {
      'Accept': 'application/json',
      'X-TZ-Offset': ((new Date()).getTimezoneOffset() * -1).toString(),
      'Device-Type': this.deviceType,
    };
    const accessToken = window.localStorage.getItem('access_token');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${window.localStorage.getItem('access_token')}`;
    }
    const clonedRequest = req.clone({
      setHeaders: headers
    });

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}
