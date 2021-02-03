import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentIntroGuard implements CanActivate {

  constructor(private storageService: StorageService, private navCtrl: NavController) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const value = await this.storageService.get('takeAssessmentIntro');
    if (value !== 'completed') {
      this.navCtrl.navigateRoot('/take-assessment/intro');
      return false;
    }
    return true;
  }
}
