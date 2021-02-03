import { Pipe, PipeTransform } from '@angular/core';
import { Transphormer } from '../../../../interfaces';

@Pipe({
  name: 'calorieCounting'
})
export class CalorieCountingPipe implements PipeTransform {

  transform(transphormer: Transphormer | null): boolean {
    return transphormer ? transphormer.likely_to_do === 'Calorie / Macro counting' : false;
  }

}
