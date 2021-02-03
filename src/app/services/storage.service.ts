import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * This service is a temporary service to funnel all (except auth-related) existing LocalStorage calls through a proper service.
 * User service should be remade using NGXS store and observables, a lot of information is tied tightly to userService.user.
 * Calls to this service should likely be moved to an NGXS store and managed via NGXS.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage
  ) {
  }

  public clear() {
    return this.storage.clear();
  }

  public get(key: string): Promise<any> {
    return this.storage.get(key);
  }

  public set(key: string, value: any) {
    return this.storage.set(key, value);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }
}
