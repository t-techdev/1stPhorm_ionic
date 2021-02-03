import { Moment } from 'moment';

export interface ChallengeInfo {
  start: Moment;
  end: Moment;
  name: string;
  elapsed?: number;
  length?: number;
  week?: number;
  gracePeriodEnds: Moment;
  gracePeriod: number;
  registrationBegins: Moment;
}

export type PlanType = 'monthly' | 'quarterly' | 'yearly';
export type SubscriptionLength = 'Month' | 'Quarter' | 'Yearly';

export interface OfferInfo {
  plan: PlanType;
  promoCode: string;
  promoPrice: string;
  promoPer: SubscriptionLength;
}

export interface PromoInfo {
  id: string;
  validFrom: string;
  validUntil: string;
  start?: Moment;
  end?: Moment;
  offers: OfferInfo[];
  validFor?: {
    createdBefore?: string;
    createdAfter?: string;
  };
  description: string;
}

export interface AppInfoResponse {
  challenge_dates: ChallengeInfo[];
  promo_info?: PromoInfo[];
  feature_flags?: { [key: string]: boolean };
}
