import { IAPProduct } from '../../../third-party/in-app-purchase-2/ngx';

export class SubscriptionOwned {
  static readonly type = '[IAP] SubscriptionOwned';

  constructor(
    public product: IAPProduct
  ) {}
}

export class SubscriptionExpired {
  static readonly type = '[IAP] SubscriptionExpired';

  constructor(
    public product: IAPProduct
  ) {}
}

export class SubscriptionApplyProducts {
  static readonly type = '[IAP] Subscription Products Apply';

  constructor(
    public products: IAPProduct[]
  ) {}
}

export class SubscriptionStateLoad {
  static readonly type = '[IAP] LoadState';

  constructor() {}
}

export class SubscriptionStateSave {
  static readonly type = '[IAP] SaveState';

  constructor() {}
}

export class SubscriptionsLoaded {
  static readonly type = '[IAP] Loaded Subscription Old State';

  constructor() {}
}

export class SubscriptionActivated {
  static readonly type = '[IAP] Activated Subscription';

  constructor() {}
}

export class SubscriptionDeactivated {
  static readonly type = '[IAP] Deactivated Subscription';

  constructor() {}
}

