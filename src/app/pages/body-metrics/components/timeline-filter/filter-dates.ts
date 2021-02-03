export interface FilterDate {
  name: string;
  active: boolean;
  subtract: {
    type: string;
    amount: number;
    skip?: boolean;
  };
}


export const Filters: FilterDate[] = [
  {
    name: '6 Month',
    active: true,
    subtract: {
      type: 'months',
      amount: 6
    }
  },
  {
    name: 'Year',
    active: false,
    subtract: {
      type: 'year',
      amount: 1,
    }
  },
  {
    name: 'Lifetime',
    active: false,
    subtract: {
      type: 'month',
      amount: 0,
      skip: true
    }
  }
];
