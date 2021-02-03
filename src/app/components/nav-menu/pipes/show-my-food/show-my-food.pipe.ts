import { Pipe, PipeTransform } from '@angular/core';
import { Transphormer } from '../../../../interfaces';

@Pipe({
  name: 'showMyFood'
})
export class ShowMyFoodPipe implements PipeTransform {

  transform(transphormer: Transphormer | null): boolean {
    return transphormer ? transphormer.is_paid_user && transphormer.likely_to_do === 'Calorie / Macro counting' : false;
  }

}
