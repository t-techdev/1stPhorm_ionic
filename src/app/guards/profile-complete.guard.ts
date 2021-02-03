import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ToastService } from '../services/toast-service/toast-service.service';
import { BottomMenuService } from '../services/bottom-menu.service';
import { UserService } from '../services/user/user.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileCompleteGuard implements CanActivate {

  constructor(
    private navCtrl: NavController,
    private toastSvc: ToastService,
    private user: UserService,
    private bottomMenu: BottomMenuService
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
        if (user && user.profile_complete) {
          this.bottomMenu.show();
          return of(true);
        }
        this.toastSvc.flash('Please finish filling out your profile before using the application.');
        this.navCtrl.navigateRoot('onboarding');
        return of(false);
      }),
    );
  }
}
