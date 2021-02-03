
import { Transphormer, Units, UnitTypes, Weight } from '../interfaces';
import { BodyMetric } from '../services/body-metric/body-metric';

/**
 * Converts weight primary entry log to imperial and sets imperial and metric property
 * @param weight
 */
export const mapWeightUnit = (weight: Weight): Weight => {
  if (weight === null) {
    return weight;
  }
  if (weight.unit_type === UnitTypes.Imperial) {
    weight.imperial = {
      value: weight.weight,
      unit: UnitTypes.Imperial
    };
    weight.metric = {
      value: convertPoundToKilo(weight.weight),
      unit: UnitTypes.Metric
    };
  } else {
    weight.imperial = {
      value: convertKiloToPound(weight.weight),
      unit: UnitTypes.Imperial
    };
    weight.metric = {
      value: weight.weight,
      unit: UnitTypes.Metric
    };
    weight.weight = weight.imperial.value;
    weight.unit_type = UnitTypes.Imperial;
  }

  return weight;
};

/**
 * Converts metric primary entry log to imperial and sets imperial and metric property
 * @param metric
 */
export const mapBodyMetricUnit = (metric: BodyMetric): BodyMetric => {
  if (metric.unit_type === UnitTypes.Imperial) {
    metric.imperial = {
      value: metric.metric_value,
      unit: UnitTypes.Imperial
    };
    metric.metric = {
      value: convertInchToCentiMeters(metric.metric_value),
      unit: UnitTypes.Metric
    };
  } else {
    metric.imperial = {
      value: convertCentiMetersToInch(metric.metric_value),
      unit: UnitTypes.Imperial
    };
    metric.metric = {
      value: metric.metric_value,
      unit: UnitTypes.Metric
    };
    metric.metric_value = convertCentiMetersToInch(metric.metric_value);
    metric.unit_type = UnitTypes.Imperial;
  }

  return metric;
};

/**
 * Converts metric primary entry log to imperial and sets imperial and metric property
 * @param transphormer
 */
export const mapGoalWeightUnit = (transphormer: Transphormer): Transphormer => {

  transphormer.goal_weight_units = <Units>{};

  if (transphormer.goal_weight_unit === UnitTypes.Imperial) {
    transphormer.goal_weight_units.imperial = {
      value: transphormer.goal_weight,
      unit: UnitTypes.Imperial
    };
    transphormer.goal_weight_units.metric = {
      value: convertPoundToKilo(transphormer.goal_weight),
      unit: UnitTypes.Metric
    };
  } else {
    transphormer.goal_weight_units.imperial = {
      value: convertKiloToPound(transphormer.goal_weight),
      unit: UnitTypes.Imperial
    };
    transphormer.goal_weight_units.metric = {
      value: transphormer.goal_weight,
      unit: UnitTypes.Metric
    };
  }

  return transphormer;
};


export const convertKiloToPound = (value: number): number => {
  return value * 2.204623;
};

export const convertPoundToKilo = (value: number): number => {
  return value * 0.4535924;
};

export const convertInchToCentiMeters = (value: number): number => {
  return value * 2.54;
};

export const convertCentiMetersToInch = (value: number): number => {
  return value * 0.393;
};

export const scrubExtraZeroes = (value: string): string => {
  if (value.indexOf('.') === -1) {
    return value;
  }
  if (value.substr(-3) === '.00') {
    value = value.slice(0, -3);
  } else if (value.substr(-1) === '0') {
    value = value.slice(0, -1);
  }
  return value;
};
