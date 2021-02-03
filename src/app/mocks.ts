import { ErrorFormat } from './interfaces/errors';
import { MessageCount } from './interfaces/messages';

export class ModalMock {
  public create(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }
}

export class RollbarMock {

}

export class StorageMock {
  public values = {};

  set(k, v) {
    this.values[k] = v;
    return Promise.resolve(true);
  }

  get(k) {
    return Promise.resolve(this.values[k] || null);
  }
}


export class NavMock {
  public navigateForward(): any {
    return true;
  }

  public navigateRoot(): any {
    return true;
  }
}

export class ErrorServiceMock {

}

export class RouteMock {

}

export class LoadingControllerMock {

}

export class ToastMock {
  public flash() {
    return true;
  }
}

export class MessageMock {
  public unreadMessageCount(): Promise<MessageCount | ErrorFormat> {
    return new Promise(function (resolve: Function): void {
      resolve(<MessageCount>{
        unread_transphormer_messages: 5,
        unread_advisor_messages: 0,
      });
    });
  }
}

export class IABMock {

}

export class IAPMock {

}

// class PlatformMock {

// }
