import { UnitLabel, UnitTypes, UnitTypes as Unit } from './unit-types.enum';

export interface UnitType {
  unit: Unit;
  value: number;
}

export interface Units {
  metric: UnitType;
  imperial: UnitType;
}

export const UnitLabels = {weight: {}, length: {}};
UnitLabels.weight[UnitTypes.Imperial] = UnitLabel.ImperialWeight;
UnitLabels.weight[UnitTypes.Metric] = UnitLabel.MetricWeight;
UnitLabels.length[UnitTypes.Imperial] = UnitLabel.ImperialLength;
UnitLabels.length[UnitTypes.Metric] = UnitLabel.ImperialWeight;
