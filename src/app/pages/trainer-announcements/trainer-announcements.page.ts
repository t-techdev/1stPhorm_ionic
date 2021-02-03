import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  Announcement,
  AnnouncementsService,
} from '../../services/announcements/announcements.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast-service/toast-service.service';

@Component({
  selector: 'app-trainer-announcements',
  templateUrl: './trainer-announcements.page.html',
  styleUrls: ['./trainer-announcements.page.scss'],
})
export class TrainerAnnouncementsPage implements OnInit {
  public spinner = false;
  constructor(
    public errorService: ErrorsService,
    private announceService: AnnouncementsService,
    private toastSvc: ToastService,
    private navCtrl: NavController
  ) {
  }

  public announcements: Announcement[] = [];

  ngOnInit() {
    this.getAnnouncements();
  }

  private async getAnnouncements() {
    this.spinner = true;

    try {
      this.announcements = <Announcement[]>(
        await this.announceService.trainerAnnouncements()
      );
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  public create() {
    this.navCtrl.navigateForward('/create-announcement');
  }
}
