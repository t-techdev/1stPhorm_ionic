import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserPreferencesService } from '../services/user-preferences.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagGuard implements CanActivate {

  constructor(
    private prefs: UserPreferencesService,
    private navCtrl: NavController,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const flag = next.data.flag;
    const yesOrNo = next.data.value;
    const canLoad = this.prefs.get(`feature.${flag}`, false) === yesOrNo;

    if (!canLoad) {
      return this.navCtrl.navigateRoot(next.data.other);
    }

    return canLoad;
  }
}
