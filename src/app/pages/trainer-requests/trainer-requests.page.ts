import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AlertController,
} from '@ionic/angular';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  TrainerTransphormerLinkService,
} from '../../services/trainer-transphormer-link/trainer-transphormer-link.service';
import { TrainerService } from '../../services/trainer/trainer.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { UserService } from '../../services/user/user.service';
import { StorageService } from '../../services/storage.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { LinkApplication, Trainer, Transphormer } from '../../interfaces';

@Component({
  selector: 'app-trainer-requests',
  templateUrl: './trainer-requests.page.html',
  styleUrls: ['./trainer-requests.page.scss'],
})
export class TrainerRequestsPage implements OnInit {
  public spinner = false;
  public application: LinkApplication | null = null;
  public previousTrainer$ = new BehaviorSubject(null);
  public trainer: Trainer = null;

  constructor(
    private linkService: TrainerTransphormerLinkService,
    private trainerService: TrainerService,
    private alertCtrl: AlertController,
    public errorService: ErrorsService,
    private toastSvc: ToastService,
    private userService: UserService,
    private analyticService: AnalyticsService,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {
    this.checkApplicationStatus();
    this.loadPreviousTrainerEmail();
    this.analyticService.logEvent(AnalyticEvents.SearchingAdvisor, {});
  }

  protected async setupTrainer() {
    try {
      this.trainer = <Trainer>(
        await this.trainerService.getTrainerByTransphormerId(this.application.trainer.transphormer_id)
      );
    } catch (e) {
      await this.toastSvc.flash(this.errorService.firstError(e));
    }
  }

  public async dropTrainer() {
    this.analyticService.logEvent(AnalyticEvents.DroppingAdvisor, {});
    const alert = await this.alertCtrl.create({
      header: 'Drop advisor?',
      message: 'Do you really want to leave this advisor?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeTrainer();
          },
        },
      ],
    });
    return await alert.present();
  }

  private async removeTrainer() {
    this.spinner = true;

    try {
      await this.linkService.destroyLink(this.application.id);
      await this.savePreviousTrainer();
      this.trainer = null;
    } catch (e) {
      await this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  async savePreviousTrainer() {
    this.previousTrainer$.next(this.trainer.transphormer.email);
    const trainers = await this.storageService.get('trainers') || {};
    trainers[this.user.email] = this.trainer.transphormer.email;
    return this.storageService.set('trainers', trainers);
  }

  public async loadPreviousTrainerEmail() {
    const trainers = await this.storageService.get('trainers') || {};
    this.previousTrainer$.next(trainers[this.user.email] || null);
  }

  private async checkApplicationStatus() {
    try {
      this.application = <LinkApplication>await this.linkService.requestStatus();

      if (this.application.status === 'accepted') {
        this.setupTrainer();
      }
    } catch (e) {
      if (e.status !== 404) {
        await this.toastSvc.flash(this.errorService.firstError(e));
      }
    } finally {
      this.spinner = false;
    }
  }

  public async advisorSelected(application: LinkApplication) {
    this.application = application;
    this.trainer = application.trainer;
  }

  public get user(): Transphormer {
    return this.userService.user;
  }
}
