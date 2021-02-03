import { mapGoalWeightUnit } from './map-unit-helper';
import { Transphormer } from '../interfaces';

export function fixupTransphormer(transphormer: Transphormer) {
  if (transphormer === null) {
    return;
  }
  if (transphormer.unit_type === undefined
    || (transphormer.starting_weight && !transphormer.starting_weight.imperial)
    || (transphormer.latest_weight && !transphormer.latest_weight.imperial)
  ) {
    // We have outdated local information. By returning null, we'll trigger a logout.
    transphormer = null;
    return;
  }
  if (transphormer.goal_weight_units === undefined) {
    mapGoalWeightUnit(transphormer);
  }
}
