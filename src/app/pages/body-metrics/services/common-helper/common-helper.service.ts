import { Injectable } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerColumnOption } from '@ionic/core';
import { from, Observable } from 'rxjs';
import { PickerSettings } from './picker-settings';
import { main } from '@angular/compiler-cli/src/main';
import { UnitTypes } from '../../../../interfaces/unit-types.enum';
import { UnitLabels } from '../../../../interfaces/unit-type';

@Injectable()
export class CommonHelperService {

  constructor(
    public pickerCtrl: PickerController,
  ) {
  }

  /**
   * Opens picker and returns observable of value selected
   */
  public metricPicker(settings?: PickerSettings): Observable<number> {
    settings = settings || {
      unit_type: UnitTypes.Imperial,
      measurementType: 'weight',
    };

    const promise = new Promise<number>((resolve) => {
      const mainValues = this.mainValues(settings);
      const precisionValues = this.precisionValues(settings);
      const unit_type = settings.unit_type || UnitTypes.Imperial;

      // opening the picker and resolving the weight selected
      this.pickerCtrl.create({
        backdropDismiss: true,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: settings.saveLabel || 'Add',
            role: 'selected',
            handler: value => {
              resolve(value.main.value + value.precision.value);
            }
          }
        ],
        columns: [
          {
            name: 'main',
            options: mainValues,
            selectedIndex: this.selectedIndex(mainValues, settings.mainValue || -1)
          },
          {
            name: 'precision',
            options: precisionValues,
            selectedIndex: this.selectedIndex(precisionValues, settings.precisionValue || -1)
          },
          {
            name: 'unit_type',
            options: [{
              text: UnitLabels[settings.measurementType][unit_type],
            }]
          }
        ],
        cssClass: 'picker-unit'
      }).then(picker => picker.present());
    });


    return from(promise);
  }

  private mainValues(settings: PickerSettings): PickerColumnOption[] {
    const defaultSettings = settings.unit_type === UnitTypes.Imperial
      ? { start: 75, end: 600 }
      : { start: 40, end: 275 };

    const start = settings.start || defaultSettings.start;
    const end = settings.end || defaultSettings.end;

    // creating main value selection list
    const mainValue: PickerColumnOption[] = [];

    for (let i = start; i <= end; i++) {
      mainValue.push({
        text: i.toString(),
        value: i,
      });
    }

    return mainValue;
  }

  private precisionValues(settings: PickerSettings): PickerColumnOption[] {

    const defaultSettings = { precisionStart: 0, precisionEnd: 9 };
    defaultSettings.precisionStart = settings.precisionStart || defaultSettings.precisionStart;
    defaultSettings.precisionEnd = settings.precisionEnd || defaultSettings.precisionEnd;

    // creating precision selection list
    const precision: PickerColumnOption[] = [];


    for (let i = defaultSettings.precisionStart; i <= defaultSettings.precisionEnd; i++) {
      precision.push({
        text: `.${i}`,
        value: i / 10,
      });
    }

    return precision;
  }

  /**
   * Returns numeric value broken down by main value and decimal value
   * @param value
   * @param precision
   */
  public breakValueInDecimal(value: number, precision = 3): PickerSettings {
    const mainValue = Math.floor(value);
    const precisionValue = parseFloat((value - mainValue).toPrecision(3));
    return { mainValue, precisionValue };
  }

  /**
   * Default selected index
   * @param values
   * @param matchAgainst
   */
  private selectedIndex(values: PickerColumnOption[], matchAgainst: number): number {
    return values.findIndex(v => v.value === matchAgainst);
  }
}
