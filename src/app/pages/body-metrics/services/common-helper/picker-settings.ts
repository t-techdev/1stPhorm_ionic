import { PickerColumnOption } from '@ionic/core';
import { UnitTypes } from '../../../../interfaces/unit-types.enum';

export interface PickerSettings {
  start?: number;
  end?: number;
  precisionStart?: number;
  precisionEnd?: number;
  mainValue?: number;
  precisionValue?: number;
  unit_type?: UnitTypes;
  measurementType?: 'length' | 'weight';
  saveLabel?: string;
  mainValues?: PickerColumnOption[];
  precisionValues?: PickerColumnOption[];
}
