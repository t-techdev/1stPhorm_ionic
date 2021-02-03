import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../../services/user/user.service';
import { Transphormer } from '../../../interfaces';

@Component({
  selector: 'app-help-popup',
  templateUrl: './help-popup.component.html',
  styleUrls: ['./help-popup.component.scss'],
})
export class HelpPopupComponent implements OnInit {
  @Input()
  public popupType = '';
  public headerTitle = '';

  constructor(
    public modalCtrl: ModalController,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  public get transphormer(): Transphormer {
    return this.userService.user;
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.close();
  }
}
