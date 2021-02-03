import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from '../../../../services/user/user.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private storageService: StorageService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  get user() {
    return this.userService.user;
  }

  continue() {

    this.storageService.set('takeAssessmentIntro', 'completed');
    this.navCtrl.navigateRoot('/take-assessment');
  }

  leave() {
    this.navCtrl.back();
  }
}
