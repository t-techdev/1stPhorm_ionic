import { Inject, Injectable } from '@angular/core';
import { BranchIo, BranchIoPromise } from '@ionic-native/branch-io/ngx';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class BranchioService {
  private aId: string = null;
  private data: any = null;

  constructor(
    private branch: BranchIo,
    private platform: Platform,
    private storageService: StorageService,
    @Inject(RollbarService) private rollbar: Rollbar,
  ) {
  }

  public async start() {
    if (!this.platform.is('cordova')) {
      return;
    }

    this.branch.initSession()
      .then((data: BranchIoPromise) => {
        this.data = data;
        this.storageService.set('campaignId', data.a_id);
      })
      .catch((error) => {
        this.rollbar.error(error);
      });
  }

  get advisorId() {
    if (!this.data || !this.data.a_id) {
      return null;
    }

    return this.data.a_id;
  }
}
