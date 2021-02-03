import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, filter, flatMap, map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { AppState, LoggedInState } from '../../store/states/app.state';
import { Storage } from '@ionic/storage';
import { AppInfoResponse, ChallengeInfo, OfferInfo, PromoInfo, Transphormer } from '../../interfaces';

export class Promo {
  public id: string = null;
  public validFrom: string = null;
  public validUntil: string = null;
  public offers: OfferInfo[] = [];
  public validFor = null;
  public description: string = null;
  public extendedDetails: string = null;

  public static fromJson(json: any) {
  }

  constructor(data: PromoInfo) {
    for (const p in data) {
      if (this.hasOwnProperty(p)) {
        this[p] = data[p];
      }
    }
  }

  public get start() {
    if (this.validFrom) {
      return moment(this.validFrom);
    }
  }

  public get end() {
    if (this.validUntil) {
      return moment(this.validUntil);
    }
  }

  public get isActive() {
    if (this.start && this.start.isAfter()) {
      return false;
    }
    return !(this.end && this.end.isBefore());
  }

  public isValidFor(transphormer: Transphormer) {
    // if (transphormer.iphone_subscription)
  }
}

function challengeFixer(challenge): ChallengeInfo {
  challenge.end = moment(challenge.end);
  challenge.start = moment(challenge.start);
  challenge.gracePeriodEnds = moment(challenge.gracePeriodEnds);
  challenge.registrationBegins = moment(challenge.registrationBegins);
  return challenge;
}

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  @Select(AppState.isLoggedIn) loggedIn$: Observable<LoggedInState>;

  public featureFlags$ = new ReplaySubject<any>(1);

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private store: Store,
    private storage: Storage
  ) {
    this.loggedIn$.subscribe((state) => {
      if (state === LoggedInState.No) {
        this.storage.clear();
      }
    });
    this.storage.get('feature-flags').then((value) => {
      this.featureFlags$.next(value || {});
    });
    this.featureFlags$.subscribe((value) => {
      if (!value) { return; }
      this.storage.set('feature-flags', value);
    });
  }

  public getChallenges(): Promise<ChallengeInfo[]> {
    return this.storage.ready()
      .then(() => {
        return this.storage.get('challenge-info:expires')
          .then((value: string | null) => {
            if (value === null || (new Date(value) < new Date())) {
              return this.grabFreshChallengeData()
                .toPromise()
                .then((challengeData) => {
                  return this.setChallengeInfo(challengeData)
                    .then(_ => challengeData);
                });
            }
            return <Promise<ChallengeInfo[]>>this.storage.get('challenge-info');
          })
          .then(dates => {
            return dates.map(challengeFixer);
          });
      });
  }

  private setChallengeInfo(challengeDates: ChallengeInfo[]) {
    return Promise.all([
      this.storage.set('challenge-info', challengeDates),
      this.storage.set('challenge-info:expires', moment().add(30, 'minute').toISOString()),
    ]);
  }

  public getCurrentChallenge(): Promise<ChallengeInfo> {
    return this.getChallenges()
      .then((challenges: ChallengeInfo[]) => {
        return challenges.find((challengeInfo: ChallengeInfo) => challengeInfo.registrationBegins.isBefore() && challengeInfo.end.isAfter());
      });
  }

  public getPromo(id: string) {
    return this.getApplicablePromos()
      .pipe(
        flatMap((result: [Promo]) => {
          return from(result);
        }),
        filter(i => i.id === id)
      );
  }

  public getApplicablePromos(): Observable<Promo[]> {
    if (!this.platform.is('ios')) {
      return of([]);
    }

    return this.http.get(environment.apiUrl + 'app-info')
      .pipe(
        catchError((error) => {
          return of({ promo_info: [] } );
        }),
        map((response: AppInfoResponse) => {
          if (!response.promo_info || !Array.isArray(response.promo_info)) {
            return [];
          }
          return response.promo_info.map((info) => {
            return new Promo(info);
          });
        }),
      );
  }

  private grabFreshChallengeData(): Observable<ChallengeInfo[]> {
    return this.http.get(environment.apiUrl + 'app-info')
      .pipe(
        catchError((error) => {
          return of({ challenge_dates: [] } );
        }),
        map((response: AppInfoResponse) => {
          if (response.feature_flags) {
            this.featureFlags$.next(response.feature_flags);
          }
          return response.challenge_dates;
        }),
      );
  }
}
