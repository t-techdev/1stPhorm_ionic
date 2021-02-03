import { Component, OnInit, ViewChild } from '@angular/core';
import { WeightsService } from '../../../../services/weights/weights.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { CustomMacroService } from '../../../../services/custom-macro/custom-macro.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CommonHelperService } from '../../services/common-helper/common-helper.service';
import { ToastService } from '../../../../services/toast-service/toast-service.service';
import { RequestCachingService } from '../../../../services/interceptors/caching/request-caching.service';
import { LineChartComponent } from '../../../../components/chart/components/line-chart/line-chart.component';
import { of, timer } from 'rxjs';
import { UserService } from '../../../../services/user/user.service';
import { ConvertWeightPipe } from '../../../../pipes/convert-unit/pipes/convert-weight/convert-weight.pipe';
import { PickerSettings } from '../../services/common-helper/picker-settings';
import { Weight } from '../../../../interfaces';

@Component({
  selector: 'app-weigh-in-list',
  templateUrl: './weigh-in-list.component.html',
  styleUrls: ['./weigh-in-list.component.scss'],
})
export class WeighInListComponent implements OnInit {
  public spinner = false;

  public weights: Weight[] = [];

  public latestWeight: Weight;

  public today: Moment;

  @ViewChild('lineChart')
  public lineChart: LineChartComponent;

  constructor(
    public weightService: WeightsService,
    public actionSheetCtrl: ActionSheetController,
    public commonHelper: CommonHelperService,
    public customMacroService: CustomMacroService,
    public navCtrl: NavController,
    public toastService: ToastService,
    public cacheService: RequestCachingService,
    public user: UserService
  ) {
    this.today = moment().set('millisecond', 0).set('second', 0).set('minute', 0).set('hour', 0);
  }

  /**
   * Initialize listing
   */
  public ngOnInit() {
    this.fetchWeighIns(moment().subtract(6, 'month'));
    this.weightService.latest().subscribe(weight => this.latestWeight = weight);
  }

  /**
   * Fetch weigh-in list based on after date
   * @param afterDate
   */
  public async fetchWeighIns(afterDate?: Moment) {
    this.spinner = true;

    const filter = {after: afterDate ? afterDate.format('YYYY-MM-DD') : ''};

    this.weightService.weights(filter)
      .pipe(finalize(() => this.spinner = false))
      .subscribe(weights => this.weights = weights);
  }

  /**
   * Action handling on clicking actions on record
   * @param weight
   */
  public async actions(weight: Weight) {
    const settings: PickerSettings = this.commonHelper.breakValueInDecimal(weight.weight);
    settings.unit_type = weight.unit_type;
    settings.measurementType = 'weight';
    settings.saveLabel = 'Update';

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.commonHelper.metricPicker(settings)
              .subscribe(v => this.updateWeight(weight, v));
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.removeWeight(weight);
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
   * Update weight record
   *
   * @param weight
   * @param value
   */
  public async updateWeight(weight: Weight, value: number) {
    this.spinner = true;

    of(this.user.user)
      .pipe(switchMap(transphormer => this.weightService.updateWeight(weight.id, value, transphormer.unit_type)))
      .pipe(finalize(() => this.spinner = false))
      .pipe(tap<Weight>(newWeight => {

        if (this.latestWeight.id === newWeight.id) {
          this.latestWeight = newWeight;
          const convertWeight = new ConvertWeightPipe(this.user);
          this.customMacroService.notifyToUpdateMacro(parseFloat(convertWeight.transform(newWeight)));
        }
        this.cacheService.clearAll();
      }))
      .subscribe(newWeight => {
        this.weights = this.weights.map(w => {
          return w.id === newWeight.id ? newWeight : w;
        });
      });
  }

  /**
   * Remove weight entry
   * @param weight
   */
  public async removeWeight(weight: Weight) {
    this.spinner = true;

    this.weightService.deleteWeight(weight.id)
      .pipe(finalize(() => this.spinner = false))
      .pipe(tap(() => {
        if (weight.id === this.latestWeight.id) {
          const index = this.weights.findIndex(w => w.id === weight.id);
          this.latestWeight = this.weights[index + 1];
        }
      }))
      .pipe(tap(() => this.cacheService.clearAll()))
      .subscribe(() => {
        const index = this.weights.findIndex(w => w.id === weight.id);
        this.weights.splice(index, 1);
        timer(500).subscribe(() => this.lineChart.ngOnChanges());
      });
  }


  /**
   * Add new weight record
   */
  public async addWeight() {
    const settings: PickerSettings = this.commonHelper.breakValueInDecimal(this.user.unitType() === 2
      ? this.latestWeight.metric.value : this.latestWeight.imperial.value);
    settings.unit_type = this.user.unitType();
    settings.measurementType = 'weight';

    this.commonHelper.metricPicker(settings)
      .pipe(switchMap(value => {
        this.spinner = true;
        return of(this.user.user)
          .pipe(switchMap(transphormer => this.weightService.saveWeight(value, transphormer.unit_type)));
      }))
      .pipe(finalize(() => this.spinner = false))
      .pipe(tap(() => {
        this.cacheService.clearAll();
        timer(500).subscribe(() => this.lineChart.ngOnChanges());
      }))
      .subscribe(weight => {
        this.latestWeight = weight;
        this.weights.unshift(weight);
        const convertWeight = new ConvertWeightPipe(this.user);
        this.customMacroService.notifyToUpdateMacro(parseFloat(convertWeight.transform(weight)));
      }, () => this.toastService.flash('Something went wrong'));
  }

  public navigateToMetrics() {
    this.navCtrl.navigateRoot('/body-metrics', {
      animated: true,
      animationDirection: 'back'
    });
  }

  /**
   * Mapping label string to map
   * @param weight
   */
  public chartLabelMap(weight: Weight): string {
    return (weight.logged_on as Moment).format('M/D/YY');
  }

  get canAddWeighIn() {
    if (!this.latestWeight) {
      return false;
    }
    return !moment(this.latestWeight.logged_on).local().isSameOrAfter(this.today);
  }

  /**
   * Mapping data to map
   * @param weight
   * @param configs
   */
  public dataLabelMap(weight: Weight, configs: {user: UserService}): number {
    const convertWeight = new ConvertWeightPipe(configs.user);
    return parseFloat(convertWeight.transform(weight));
  }

  public momentInstance(value: Moment | string | null): Moment {
    return value as Moment;
  }
}
