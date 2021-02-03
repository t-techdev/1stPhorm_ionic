import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { UnitTypes } from '../../../../interfaces/unit-types.enum';
import { Units } from '../../../../interfaces/unit-type';
import { scrubExtraZeroes } from '../../../../helpers/map-unit-helper';

@Pipe({
  name: 'convertLength'
})
export class ConvertLengthPipe implements PipeTransform {

  public constructor(public user: UserService) {
  }

  transform(value: Units, precision: number = 2): string {
    const unitType: UnitTypes = this.user.unitType();
    const returnValue = unitType === UnitTypes.Imperial ? value.imperial.value.toFixed(precision) : value.metric.value.toFixed(precision);
    return scrubExtraZeroes(returnValue);
  }

}
