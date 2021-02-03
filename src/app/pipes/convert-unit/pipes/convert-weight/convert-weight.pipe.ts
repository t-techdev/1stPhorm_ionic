import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../../../services';
import { Units, UnitTypes } from '../../../../interfaces';
import { scrubExtraZeroes } from '../../../../helpers/map-unit-helper';

@Pipe({
  name: 'convertWeight'
})
export class ConvertWeightPipe implements PipeTransform {

  public constructor(public user: UserService) {
  }

  transform(value: Units, precision: number = 2): string {
    if (! value.imperial) {
      return '?';
    }
    const unitType: UnitTypes = this.user.unitType();
    const returnValue = unitType === UnitTypes.Imperial ? value.imperial.value.toFixed(precision) : value.metric.value.toFixed(precision);
    return scrubExtraZeroes(returnValue);
  }

}
