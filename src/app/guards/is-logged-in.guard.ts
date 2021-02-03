import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NavController } from '@ionic/angular';
import { UserService } from '../services/user/user.service';
import { ToastService } from '../services/toast-service/toast-service.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor(
    private toastSvc: ToastService,
    private navCtrl: NavController,
    private user: UserService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.user.user$.pipe(
      mergeMap((user) => {
        if (user === null) {
          this.toastSvc.flash('Please log in.');
          this.navCtrl.navigateRoot('login');
          return of(false);
        }
        return of(true);
      }),
    );
  }
}
