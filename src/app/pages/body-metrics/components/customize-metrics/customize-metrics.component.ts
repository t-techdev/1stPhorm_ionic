import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { InfoCustomizeComponent } from '../../popovers/info-customize/info-customize.component';
import { MetricTypeName, MetricTypeNames } from '../../../../services/body-metric/metric-types.enum';
import { Configuration } from '../../../../services/body-metric/body-metric-configuration';
import { BodyMetricService } from '../../../../services/body-metric/body-metric.service';
import { filter, finalize } from 'rxjs/operators';
import { UserService } from '../../../../services/user/user.service';
import { ToastService } from '../../../../services/toast-service/toast-service.service';

interface MetricType extends MetricTypeName {
  configuration: Configuration;
}

@Component({
  selector: 'app-customize-metrics',
  templateUrl: './customize-metrics.component.html',
  styleUrls: ['./customize-metrics.component.scss'],
})
export class CustomizeMetricsComponent implements OnInit {
  public spinner = false;

  public metricTypes: MetricType[];

  constructor(
    public popoverCtrl: PopoverController,
    public bodyMetricService: BodyMetricService,
    public user: UserService,
    public toast: ToastService,
    public navCtrl: NavController
  ) {
    this.metricTypes = MetricTypeNames.map<MetricType>(metricType => {
      const type = metricType as MetricType;
      type.configuration = {use: true, type: metricType.value};
      return type;
    });
  }

  async ngOnInit() {
    this.spinner = true;
    this.bodyMetricService.configurations()
      .pipe(finalize(() => this.spinner = false))
      .pipe(filter(value => !!value))
      .subscribe(configuration => {
        this.metricTypes = this.metricTypes.map(metricType => {
          metricType.configuration = configuration.configurations.find(c => c.type === metricType.value);
          return metricType;
        });
      });
  }

  /**
   * Open info popover
   */
  public async openInfo($event) {
    const popover = await this.popoverCtrl.create({
      component: InfoCustomizeComponent,
      event: $event,
      cssClass: 'body-metric-customize-info'
    });

    popover.present();
  }

  /**
   * Update configuration
   */
  public async updateConfig() {
    this.spinner = true;
    const configurations = this.metricTypes.map(metricType => metricType.configuration);

    this.bodyMetricService.updateConfiguration(configurations)
      .pipe(finalize(() => this.spinner = false))
      .subscribe(() => this.navCtrl.navigateRoot('/body-metrics', {
        animated: true,
        animationDirection: 'back'
      }));
  }
}
