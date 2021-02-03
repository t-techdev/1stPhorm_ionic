export enum MetricTypes {
  Neck = 1,
  Bicep,
  Chest,
  Waist,
  Hips,
  Thigh,
  Calves,
}

export interface MetricTypeName {
  name: string;
  value: MetricTypes;
  icon: string;
}

export const MetricTypeNames: MetricTypeName[] = [
  {name: 'Neck', value: MetricTypes.Neck, icon: '/assets/icon/neck.svg'},
  {name: 'Bicep', value: MetricTypes.Bicep, icon: '/assets/icon/bicep.svg'},
  {name: 'Chest', value: MetricTypes.Chest, icon: '/assets/icon/chest.svg'},
  {name: 'Waist', value: MetricTypes.Waist, icon: '/assets/icon/waist.svg'},
  {name: 'Hips', value: MetricTypes.Hips, icon: '/assets/icon/hips.svg'},
  {name: 'Thigh', value: MetricTypes.Thigh, icon: '/assets/icon/thigh.svg'},
  {name: 'Calves', value: MetricTypes.Calves, icon: '/assets/icon/calves.svg'},
];
