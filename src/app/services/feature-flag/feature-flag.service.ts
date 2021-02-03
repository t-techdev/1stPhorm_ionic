import { Injectable } from '@angular/core';
import { AppInfoService } from '../app-info/app-info.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserPreferencesService } from '../user-preferences.service';

export type KnownFlags = 'free_home_workouts' | 'media_message' | 'nutrition';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {

  private flags$ = new BehaviorSubject({});

  constructor(
    private info: AppInfoService,
    private prefs: UserPreferencesService,
  ) {
    this.info.featureFlags$.subscribe((flags) => {
      this.flags$.next(flags);
    });
  }

  get$(flagName: string | KnownFlags, def = false): Observable<boolean> {
    return this.flags$.pipe(
      map((value) => {
        return this.prefs.get('feature.' + flagName, value[flagName] || def);
      })
    );
  }
}
