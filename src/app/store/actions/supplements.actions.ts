import { MealItem } from '../../interfaces/simple-nutrition';

export class LoadSupplementConfiguration {
  static readonly type = '[Supplements] LoadConfig';
  constructor() {}
}

export class ApplySupplementConfiguration {
  static readonly type = '[Supplements] ApplyConfig';
  constructor(public supplements: MealItem[]) {}
}
