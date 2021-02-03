import { Component, Input, OnInit } from '@angular/core';
import { Assessment } from '../../services/assessments/assessments.service';
import { MetricTypeName, MetricTypeNames } from '../../services/body-metric/metric-types.enum';
import { UserService } from '../../services/user/user.service';
import * as moment from 'moment';
import { UnitTypes } from '../../interfaces/unit-types.enum';
import { BodyMetric } from '../../services/body-metric/body-metric';

@Component({
  selector: 'app-assessment-view',
  templateUrl: './assessment-view.component.html',
  styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit {

  @Input() assessment: Assessment;
  public nutritionOpened = true;
  public workoutsOpened = true;
  public photosOpened = true;
  public questionsOpened = true;
  public bodyMetricInsOpened = true;
  public weighInsOpened = true;
  public Math = Math;
  public UnitTypes = UnitTypes;

  constructor(
    public user: UserService
  ) {
  }

  ngOnInit() {
  }

  public getMeasurementsByMetricType(metricType: number) {
    let ret: BodyMetric[] = [];
    this.assessment.measurements.forEach((item) => {
      if (item.body_metric_type === metricType) {
        ret.push(item);
      }
    });
    ret = ret.sort((a, b) => {
      return a.logged_on > b.logged_on ? -1 : 1;
    });
    return ret;
  }

  get bodyMetricTypes() {
    let metricTypes = [];
    this.assessment.measurements.forEach((item) => {
      if (metricTypes.indexOf(item.body_metric_type) < 0) {
        metricTypes.push(item.body_metric_type);
      }
    });
    metricTypes = metricTypes.sort((a, b) => {
      return a - b;
    });

    const ret: MetricTypeName[] = [];
    metricTypes.forEach((item) => {
      const t = MetricTypeNames.find(metricType => item === metricType.value);
      ret.push(t);
    });
    return ret;
  }

  /**
   * @param date
   */
  public getFromNowFormattedDate(date: string): string {
    return moment(date).format('M/D/YY');
  }

  get sortedWeights() {
    return this.assessment.body_metrics.sort((a, b) => {
      return a.logged_on > b.logged_on ? -1 : 1;
    });
  }

  /**
   * Calculates a weight difference
   * @param currentIndex the index
   */
  public diffInWeight(currentIndex): number {
    if (currentIndex === this.assessment.body_metrics.length - 1) {
      return 0;
    } else {
      return Math.round(100 * (-1) * (this.assessment.body_metrics[currentIndex + 1].weight - this.assessment.body_metrics[currentIndex].weight)) / 100;
    }
  }

  public diffInMetric(currentIndex, measurements: BodyMetric[]): number {
    if (currentIndex === measurements.length - 1) {
      return 0;
    } else {
      return Math.round(100 * (-1) * (measurements[currentIndex + 1].metric_value - measurements[currentIndex].metric_value)) / 100;
    }
  }

  get transphormerDoingMacroCalorieCounting(): boolean {
    return this.assessment.transphormer.likely_to_do === 'Calorie / Macro counting';
  }
}

