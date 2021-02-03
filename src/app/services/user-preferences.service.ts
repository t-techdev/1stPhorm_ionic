import { Injectable } from '@angular/core';
import { UserService } from './user/user.service';
import { Actions, ofActionCompleted } from '@ngxs/store';
import { StorageService } from './storage.service';
import { LoggedIn, LoggedOut } from '../store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  private data = {};
  private loaded = false;

  private debugging = false;

  constructor(
    private user: UserService,
    private storageService: StorageService,
    private actions$: Actions
  ) {
    this.actions$.pipe(
      ofActionCompleted(LoggedIn)
    ).subscribe(() => {
      this.loadPrefs();
      this.debug('UserPrefs: logged in()');
    });

    this.actions$.pipe(
      ofActionCompleted(LoggedOut)
    ).subscribe(() => {
      this.data = [];
      this.debug('UserPrefs: logged out()');
    });
  }

  debug(...args: any[]) {
    if (this.debugging) {
      console.log(...args);
    }
  }

  getAsync<T>(key: string, defaultValue: any = null): Promise<T> {
    this.debug(`UserPrefs: getAsync(${key}, ${defaultValue}) -- STARTED`);
    return new Promise((resolve, reject) => {
      const i = setInterval(() => {
        if (this.loaded) {
          clearInterval(i);
          const val = this.data[key] || defaultValue;
          this.debug(`UserPrefs: getAsync(${key}, ${defaultValue}) = ${val}`);
          resolve(val);
        }
      }, 200);
    });
  }

  ready(): Promise<void> {
    return new Promise((resolve, reject) => {
      const i = setInterval(() => {
        if (this.loaded) {
          clearInterval(i);
          this.debug(`UserPrefs: ready()`);
          resolve();
        }
      }, 200);
    });
  }

  get(key: string, defaultValue: any = null) {
    const val = this.data[key] || defaultValue;
    this.debug(`UserPrefs: get(${key}, ${defaultValue}) = ${val}`);
    return val;
  }

  set(key: string, value: any) {
    this.debug(`UserPrefs: set(${key}, ${JSON.stringify(value)})`);
    this.data[key] = value;
    this.storageService.set(`prefs.${this.user.user.id}`, this.data);
  }

  private async loadPrefs() {
    this.debug(`UserPrefs: start loadPrefs(prefs.${this.user.user.id})`);
    this.data = await this.storageService.get(`prefs.${this.user.user.id}`) || {};
    this.loaded = true;
    this.debug(`UserPrefs: completed loadPrefs(prefs.${this.user.user.id})`, this.data);
  }
}
