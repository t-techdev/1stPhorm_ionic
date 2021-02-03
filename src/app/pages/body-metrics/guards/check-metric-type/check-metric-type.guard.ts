import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MetricTypes } from '../../../../services/body-metric/metric-types.enum';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CheckMetricTypeGuard implements CanActivate {

  public constructor(public navCtrl: NavController) {
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!Object.values(MetricTypes).includes(parseFloat(next.params.metricType))) {
      return this.navCtrl.navigateRoot('/body-metrics');
    }

    return true;
  }

}
