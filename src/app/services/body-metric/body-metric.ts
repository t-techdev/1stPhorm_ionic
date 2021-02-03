import { MetricTypes } from './metric-types.enum';
import { Moment } from 'moment';
import { UnitTypes } from '../../interfaces/unit-types.enum';
import { Units } from '../../interfaces/unit-type';

export interface BodyMetric extends Units {
  id: number;
  body_metric_type: MetricTypes;
  metric_value: number;
  logged_on: Moment | string;
  unit_type: UnitTypes;
}


export interface MetricFilter {
  type?: MetricTypes;
  after?: string;
}
