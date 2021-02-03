import { MetricTypes } from './metric-types.enum';

export interface Configuration {
  type: MetricTypes;
  use: boolean;
}

export interface BodyMetricConfiguration {
  id: number;
  transphormer_id: number;
  configurations: Configuration[];
}
