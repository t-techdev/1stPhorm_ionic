import { Component, Input, OnInit } from '@angular/core';
import { WeightsService } from '../../services/weights/weights.service';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { Transphormer, Weight } from '../../interfaces';

@Component({
  selector: 'app-weight-widget',
  templateUrl: './weight-widget.component.html',
  styleUrls: ['./weight-widget.component.scss'],
})
export class WeightWidgetComponent implements OnInit {

  @Input() transphormer: Transphormer;

  public weights: Weight[] = [];

  constructor(
    private weightService: WeightsService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.weightService.listWeights()
      .then((weights: Weight[]) => {
        this.weights = weights;
      });
  }

  public get startWeight(): Weight | null {
    if (this.weights.length > 0) {
      return this.weights[this.weights.length - 1];
    }
    return null;
  }

  public get currentWeight(): Weight | null {
    if (this.weights.length > 0) {
      this.weights[0].nice_logged_date = moment(this.weights[0].logged_on).local().format('M/D');
      return this.weights[0];
    }
    return null;
  }

  public goToBodyMetrics() {
    this.navCtrl.navigateRoot('/body-metrics/list/weigh-ins');
  }
}
