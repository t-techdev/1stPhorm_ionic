import { environment } from '../environments/environment';
import { ErrorHandler, Inject, Injectable, InjectionToken } from '@angular/core';
import * as Rollbar from 'rollbar';
import { Configuration } from 'rollbar';

const rollbarConfig = <Configuration>{
  accessToken: '6045bb3d740d4fe083099e576f62d77f',
  itemsPerMinute: 5,
  environment: environment.production ? 'production' : 'dev',
  captureUncaught: true,
  logLevel: environment.production ? 'warning' : 'debug',
  enabled: true,
  verbose: false,
  ignoredMessages: [
    'The user credentials were incorrect.',
  ],
  filterTelemetry: function(e: any) {
    return e.type === 'network'
      && (e.body.subtype === 'xhr' || e.body.subtype === 'fetch')
      && e.body.url.indexOf('.svg') !== -1;
  },
  captureUnhandledRejections: true,
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err: any): void {
    this.rollbar.error(err.message, err);
    if (err.originalError) {
      this.rollbar.error(err.message || 'Unknown unknown error message', err.originalError);
    }
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}
