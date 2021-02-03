import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController, } from '@ionic/angular';
import { WeightsService } from '../../services/weights/weights.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { of, zip } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { MetricTypeName, MetricTypeNames } from '../../services/body-metric/metric-types.enum';
import { BodyMetricService } from '../../services/body-metric/body-metric.service';
import { BodyMetric } from '../../services/body-metric/body-metric';
import { Configuration } from '../../services/body-metric/body-metric-configuration';
import { InfoBodyMetricComponent } from './popovers/info-body-metric/info-body-metric/info-body-metric.component';
import { CommonHelperService } from './services/common-helper/common-helper.service';
import { PickerSettings } from './services/common-helper/picker-settings';
import { RequestCachingService } from '../../services/interceptors/caching/request-caching.service';
import { CustomMacroService } from '../../services/custom-macro/custom-macro.service';
import { UnitTypes } from '../../interfaces/unit-types.enum';
import { ImperialPrecisionValues } from './services/common-helper/imperial-metric-values';
import { ConvertWeightPipe } from '../../pipes/convert-unit/pipes/convert-weight/convert-weight.pipe';
import { GoPremiumPage } from '../go-premium/go-premium.page';
import { Weight } from '../../interfaces';

interface MetricType extends MetricTypeName {
  metric: BodyMetric | null;
  configuration: Configuration;
}

export interface DisplayWeight extends Weight {
  diff: number;
  diffInDateAsReadable: string;
  momentDate: Moment;
}

@Component({
  selector: 'app-body-metrics',
  templateUrl: './body-metrics.page.html',
  styleUrls: ['./body-metrics.page.scss']
})
export class BodyMetricsPage implements OnInit {
  public spinner = false;

  public latestWeight: Weight;

  public today: Moment;

  public metricTypes: MetricType[] = [];

  public metrics: BodyMetric[] = [];

  public constructor(
    public weightService: WeightsService,
    public user: UserService,
    public bodyMetricService: BodyMetricService,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public commonHelper: CommonHelperService,
    public cachingService: RequestCachingService,
    public customMacroService: CustomMacroService,
    public modalController: ModalController
  ) {
    this.today = moment().set('millisecond', 0).set('second', 0).set('minute', 0).set('hour', 0);
    this.metricTypes = MetricTypeNames.map<MetricType>(metric => {
      const value: MetricType = metric as any;
      value.metric = null;
      value.configuration = {use: true, type: metric.value};
      return value as MetricType;
    });
  }

  public async ngOnInit() {
    this.spinner = true;

    zip(this.weightService.latest(), this.bodyMetricService.latestMetricsByType(), this.bodyMetricService.configurations())
      .pipe(finalize(() => this.spinner = false))
      .subscribe(results => {
        this.latestWeight = results[0];
        const metrics = results[1];
        const configuration = results[2];
        this.metricTypes = this.metricTypes.map(metricType => {
          metricType.metric = metrics.find(metric => metric && metric.body_metric_type === metricType.value);
          metricType.metric = metricType.metric ? metricType.metric : null;
          metricType.configuration = configuration ? configuration.configurations.find(m => m.type === metricType.value) : metricType.configuration;
          return metricType;
        });
      });
  }

  /**
   * Navigate to url
   * @param url
   */
  public navigateTo(url) {
    this.navCtrl.navigateRoot(url, {
      animated: true,
      animationDirection: 'forward'
    });
  }

  public openHelpPopover($event) {
    this.popoverCtrl.create({
      component: InfoBodyMetricComponent,
      cssClass: 'body-metric-customize-info',
      event: $event
    }).then(popover => popover.present());
  }

  public navigateToMetric(url) {
    if (this.user.isPaidUser()) {
      this.navigateTo(url);
    } else {
      this.upgradePremiumDialog();
    }
  }

  public async openAddRecordForWeight($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    $event.stopImmediatePropagation();

    this.commonHelper.metricPicker({unit_type: this.user.user.unit_type, measurementType: 'weight'})
      .pipe(switchMap(value => {
        this.spinner = true;
        return of(this.user.user).pipe(
          switchMap(transphormer => this.weightService.saveWeight(value, transphormer.unit_type))
        );
      }))
      .pipe(finalize(() => this.spinner = false))
      .pipe(tap(() => this.cachingService.clearAll()))
      .pipe(tap((weight) => {
        const weightConversion = new ConvertWeightPipe(this.user);
        this.customMacroService.notifyToUpdateMacro(parseFloat(weightConversion.transform(weight)));
      }))
      .subscribe((weight) => this.latestWeight = weight);
  }

  public async openAddRecordForMetric($event: Event, metricType: MetricType) {
    $event.preventDefault();
    $event.stopPropagation();
    $event.stopImmediatePropagation();

    const settings: PickerSettings = {
      start: this.user.unitType() === UnitTypes.Imperial ? 8 : 10,
      end: this.user.unitType() === UnitTypes.Imperial ? 60 : 200,
      measurementType: 'length',
      unit_type: this.user.unitType(),
    };

    if (this.user.unitType() === UnitTypes.Imperial) {
      settings.precisionValues = ImperialPrecisionValues;
    }

    this.commonHelper.metricPicker(settings)
      .pipe(switchMap(value => {
        this.spinner = true;

        const metric = metricType.metric;
        metric.metric_value = value;

        metric.unit_type = this.user.unitType();
        return this.bodyMetricService.store(metric);
      }))
      .pipe(finalize(() => this.spinner = false))
      .subscribe((metric) => {
        metricType.metric = metric;
      });
  }

  public momentInstance(value: Moment | string | null): Moment {
    return value as Moment;
  }

  /**
   * Opens upgrade to premium dialog for free users.
   */
  public async upgradePremiumDialog() {
    const modal = await this.modalController.create({
      component: GoPremiumPage,
      componentProps: {
        'type': 'body-metrics'
      },
      cssClass: 'go-premium-css',
    });
    await modal.present();
  }
}
