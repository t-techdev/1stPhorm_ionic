import { Injectable } from '@angular/core';
import { AnalyticsService } from '../services/analytics/analytics.service';

@Injectable({
  providedIn: 'root'
})
export class LogEventDecoratorService {
  private static service: AnalyticsService | undefined = undefined;

  public constructor(service: AnalyticsService) {
    LogEventDecoratorService.service = service;
  }

  public static getService(): AnalyticsService {
    if (!LogEventDecoratorService.service) {
      throw new Error('DecoratorService not initialized');
    }
    return LogEventDecoratorService.service;
  }
}

export function LogEvent(eventType: string, extraData: any = {}) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const service = LogEventDecoratorService.getService();
      if (service) {
        service.logEvent(eventType, extraData || {});
      }
      return original.apply(this, args);
    };
  };
}
