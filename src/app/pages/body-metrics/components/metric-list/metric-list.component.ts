import { Component, OnInit, ViewChild } from '@angular/core';
import { MetricTypeName, MetricTypeNames } from '../../../../services/body-metric/metric-types.enum';
import { ActivatedRoute } from '@angular/router';
import { BodyMetric, MetricFilter } from '../../../../services/body-metric/body-metric';
import { CommonHelperService } from '../../services/common-helper/common-helper.service';
import { BodyMetricService } from '../../../../services/body-metric/body-metric.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { finalize, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Moment } from 'moment';
import { LineChartComponent } from '../../../../components/chart/components/line-chart/line-chart.component';
import { timer } from 'rxjs';
import { UserService } from '../../../../services/user/user.service';
import { ConvertLengthPipe } from '../../../../pipes/convert-unit/pipes/convert-length/convert-length.pipe';
import { UnitTypes } from '../../../../interfaces/unit-types.enum';
import { ImperialPrecisionValues } from '../../services/common-helper/imperial-metric-values';
import { PickerSettings } from '../../services/common-helper/picker-settings';

@Component({
  selector: 'app-metric-list',
  templateUrl: './metric-list.component.html',
  styleUrls: ['./metric-list.component.scss'],
})
export class MetricListComponent implements OnInit {
  public spinner = false;

  public metricType: MetricTypeName;

  public metrics: BodyMetric[] = [];

  public latestMetric: BodyMetric | null = null;

  public today: Moment;

  @ViewChild('lineChart')
  public lineChart: LineChartComponent;

  constructor(
    public activeRoute: ActivatedRoute,
    public commonHelper: CommonHelperService,
    public bodyMetricService: BodyMetricService,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public user: UserService
  ) {
    this.metricType = MetricTypeNames.find(metricType => metricType.value === parseFloat(activeRoute.snapshot.params.metricType));
    this.today = moment().set('millisecond', 0).set('second', 0).set('minute', 0).set('hour', 0);
  }

  async ngOnInit() {
    this.fetchMetrics(moment().subtract(6, 'month'));
    this.bodyMetricService.latestMetric({type: this.metricType.value})
      .subscribe((metric) => this.latestMetric = metric);
  }

  /**
   * Fetch metrics listing based after date
   * @param afterDate
   */
  public async fetchMetrics(afterDate?: Moment) {
    this.spinner = true;

    const filter: MetricFilter = {
      after: afterDate ? afterDate.format('YYYY-MM-DD') : '',
      type: this.metricType.value
    };

    this.bodyMetricService.list(filter)
      .pipe(finalize(() => this.spinner = false))
      .subscribe((metrics) => this.metrics = metrics);
  }

  /**
   * Add new body metric record
   */
  public async addRecord() {
    const settings: PickerSettings = this.latestMetric ? this.commonHelper.breakValueInDecimal(this.latestMetric.metric_value) : {};
    settings.start = this.user.unitType() === UnitTypes.Imperial ? 8 : 10;
    settings.end = this.user.unitType() === UnitTypes.Imperial ? 60 : 200;
    settings.unit_type = this.user.unitType();
    settings.measurementType = 'length';

    if (this.user.unitType() === UnitTypes.Imperial) {
      settings.precisionValues = ImperialPrecisionValues;
    }

    this.commonHelper.metricPicker(settings)
      .pipe(switchMap(metricValue => {
        this.spinner = true;
        const metric: BodyMetric | any = {
          body_metric_type: this.metricType.value,
          metric_value: metricValue,
          unit_type: this.user.unitType()
        };
        return this.bodyMetricService.store(metric);
      }))
      .pipe(tap(newMetric => this.latestMetric = newMetric))
      .pipe(finalize(() => this.spinner = false))
      .subscribe(bodyMetric => {
        this.metrics.unshift(bodyMetric);
        timer(500).subscribe(() => this.lineChart.ngOnChanges());
      });
  }

  /**
   * Action handling on clicking action button on record
   * @param metric
   */
  public async actions(metric: BodyMetric) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            const settings = this.commonHelper.breakValueInDecimal(metric.metric_value);
            settings.start = metric.unit_type === UnitTypes.Imperial ? 8 : 10;
            settings.end = metric.unit_type === UnitTypes.Imperial ? 60 : 200;
            settings.unit_type = metric.unit_type;
            settings.measurementType = 'length';
            settings.saveLabel = 'Update';

            if (this.user.unitType() === UnitTypes.Imperial) {
              settings.precisionValues = ImperialPrecisionValues;
            }
            this.commonHelper.metricPicker(settings)
              .subscribe(v => this.updateMetric(metric, v));
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.removeMetric(metric);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ],
    });

    await actionSheet.present();
  }

  /**
   * Remove metric record
   * @param metric
   */
  public async removeMetric(metric: BodyMetric) {
    this.spinner = true;

    this.bodyMetricService.remove(metric)
      .pipe(tap(newMetric => {
        if (this.latestMetric && this.latestMetric.id === metric.id) {
          const index = this.metrics.findIndex(m => m.id === metric.id);
          this.latestMetric = this.metrics[index + 1] ? this.metrics[index + 1] : null;
        }
      }))
      .pipe(finalize(() => this.spinner = false))
      .subscribe(() => {
        const index = this.metrics.findIndex(m => m.id === metric.id);
        this.metrics.splice(index, 1);
        timer(500).subscribe(() => this.lineChart.ngOnChanges());
      });
  }

  /**
   * Update metric record with new value
   * @param metric
   * @param newValue
   */
  public async updateMetric(metric: BodyMetric, newValue: number) {
    this.spinner = true;

    this.bodyMetricService.update(metric.id, {metric_value: newValue, unit_type: this.user.unitType()} as any)
      .pipe(tap(newMetric => {
        if (this.latestMetric) {
          this.latestMetric = this.latestMetric.id === newMetric.id ? newMetric : this.latestMetric;
        }
        timer(500).subscribe(() => this.lineChart.ngOnChanges());
      }))
      .pipe(finalize(() => this.spinner = false))
      .subscribe((newMetric) => {
        this.metrics = this.metrics.map((m => m.id === newMetric.id ? newMetric : m));
      });
  }

  /**
   * Navigate back
   */
  public backToMetrics() {

    this.navCtrl.navigateRoot('/body-metrics', {animated: true, animationDirection: 'back'});
  }

  /**
   * Mapping label string to map
   * @param metric
   */
  public chartLabelMap(metric: BodyMetric): string {
    return (metric.logged_on as Moment).format('M/D/YY');
  }

  /**
   * Mapping label string to map
   * @param metric
   * @param configs
   */
  public dataLabelMap(metric: BodyMetric, configs: { user: UserService }): number {
    const convertMap = new ConvertLengthPipe(configs.user);
    return parseFloat(convertMap.transform(metric));
  }

  get canLogNewMetric() {
    return !this.latestMetric || !moment(this.latestMetric.logged_on).local().isSameOrAfter(this.today);
  }
}
