import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { ToastController } from '@ionic/angular';
import {
  Announcement,
  AnnouncementsService,
} from '../../services/announcements/announcements.service';
import { GlobalEmitterService, GlobalEvents } from '../../services/global-emitter/global-emitter.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})

export class AnnouncementsPage implements OnInit {
  public spinner = false;
  public announcements: Announcement[] = [];

  constructor(
    public errorService: ErrorsService,
    private toastCtrl: ToastController,
    private announcementService: AnnouncementsService,
    public globalEmitter: GlobalEmitterService,
    private analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.getAnnouncements();
  }

  private async getAnnouncements() {
    this.spinner = true;

    try {
      this.announcements = <Announcement[]>await this.announcementService.transphormerAnnouncements();
      this.markAnnouncementsAsRead();
    } catch (e) {
      const toast = await this.toastCtrl.create({
        message: this.errorService.firstError(e),
        duration: 3000,
      });
      await toast.present();
    } finally {
      this.spinner = false;
    }
  }

  public async markAnnouncementsAsRead() {
    this.analyticService.logEvent(AnalyticEvents.ViewingAnnouncements, {});
    const unreadAnnouncementIds = this.announcements.filter(announcement => !announcement.transphormer_announcement.read_at)
      .map(announcement => announcement.id);

    if (unreadAnnouncementIds.length > 0) {
      this.announcements = <Announcement[]>await this.announcementService.markAnnouncementsAsRead(unreadAnnouncementIds);
      this.globalEmitter.emit(GlobalEvents.AnnouncementRead);
    }
  }
}
