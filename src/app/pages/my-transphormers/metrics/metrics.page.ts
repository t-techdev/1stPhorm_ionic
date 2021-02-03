import { Component, OnInit } from '@angular/core';
import { DisplayWeight } from '../../body-metrics/body-metrics.page';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ErrorsService } from '../../../services/errors/errors.service';
import { ToastController } from '@ionic/angular';
import { TrainerTransphormerService } from '../../../services/trainer-transphormer/trainer-transphormer.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { ConvertWeightPipe } from '../../../pipes/convert-unit/pipes/convert-weight/convert-weight.pipe';
import { Weight } from '../../../interfaces';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
})
export class MetricsPage implements OnInit {
  public spinner = false;
  public weights: DisplayWeight[] = [];
  public Math = Math;

  constructor(public errorService: ErrorsService,
              private toastCtrl: ToastController,
              private trainerTransphormerService: TrainerTransphormerService,
              private router: ActivatedRoute,
              public user: UserService
  ) {
  }

  ngOnInit() {
    this.setupWeights();
  }

  private async setupWeights() {
    this.spinner = true;

    try {
      const weights = <Weight[]>await this.trainerTransphormerService
        .transphormerWeights(parseFloat(this.router.snapshot.paramMap.get('id')));
      const now = moment();

      this.weights = weights.reduce((carry: DisplayWeight[], weight): DisplayWeight[] => {
        const displayWeight = <DisplayWeight>weight;

        if (now.diff(<Moment>displayWeight.logged_on, 'days') === 0) {
          displayWeight.diffInDateAsReadable = 'Today';
        } else if (now.diff(<Moment>displayWeight.logged_on, 'weeks') !== 0) {
          displayWeight.diffInDateAsReadable = `${now.diff(
            <Moment>displayWeight.logged_on,
            'weeks',
          )} weeks ago`;
        } else {
          displayWeight.diffInDateAsReadable = `${now.diff(
            <Moment>displayWeight.logged_on,
            'days',
          )} days ago`;
        }

        carry.push(displayWeight);

        return carry;
      }, []);
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

  public diffInWeight(currentIndex): number {
    if (currentIndex === this.weights.length - 1) {
      return 0;
    } else {
      const convertWeight = new ConvertWeightPipe(this.user);
      const nextWeight = parseFloat(convertWeight.transform(this.weights[currentIndex + 1]));
      const currentWeight = parseFloat(convertWeight.transform(this.weights[currentIndex]));
      return (-1) * (nextWeight - currentWeight);
    }
  }

}
