import { Component, Input } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CameraPhotos } from '../../interfaces';
import { ChallengeInfo } from '../../interfaces/app-info';

@Component({
  selector: 'app-contest-widget',
  templateUrl: './contest-widget.component.html',
  styleUrls: ['./contest-widget.component.scss'],
})
export class ContestWidgetComponent {

  private _today?: Moment;
  private _challengeDates?: ChallengeInfo[];
  private _currentChallenge?: ChallengeInfo;

  @Input()
  public updates: CameraPhotos[] = [];

  @Input()
  set challengeDates(d: ChallengeInfo[]) {
    this._challengeDates = d;
  }

  get challengeDates(): ChallengeInfo[] {
    return this._challengeDates;
  }

  @Input()
  set today(today: Moment) {
    this._currentChallenge = null;
    if (moment.isMoment(today)) {
      this._today = today;
      return;
    }
  }

  get today(): Moment {
    return this._today || moment();
  }

  constructor() {
    this.today = moment();
  }

  public get currentChallengeCompleted(): boolean {
    if (!this.currentChallenge || !this.transphormerChallengeStart) {
      return false;
    }
    return this.currentChallenge.end.isSameOrBefore(this.today);
  }

  /**
   * Determines if a given date falls into the grace period of a challenge
   * @param dateToEval  the date to evaluate
   */
  get isOnValidGracePeriod(): boolean {
    return this.today.isBetween(this.currentChallenge.registrationBegins, this.currentChallenge.gracePeriodEnds);
  }

  /**
   * Determines if a sprint has already started
   */
  get sprintStarted(): boolean {
    return this.today.isBetween(this.currentChallenge.start, this._currentChallenge.end);
  }

  get sprintCompleted(): boolean {
    return this.currentChallenge.end.isBefore(this.today);
  }

  /**
   * Gets the information of a current challenge
   */
  public get currentChallenge(): ChallengeInfo {

    if (!this._currentChallenge) {
      for (const challenge of this.challengeDates) {
        if (
          challenge.registrationBegins.isSameOrBefore(this.today) &&
          challenge.end.clone().add(3, 'day').isSameOrAfter(this.today)
        ) {
          challenge.length = challenge.end.diff(challenge.start, 'days') + 1;
          this._currentChallenge = challenge;
          break;
        }
      }
    }
    return this._currentChallenge;
  }

  get sprintHasNotStartedYet(): boolean {
    return this.currentChallenge.start.isAfter(this.today);
  }

  public get signupsAllowed(): boolean {
    return (this.currentChallenge.registrationBegins.isSameOrBefore(this.today)
      && this.currentChallenge.start.isAfter(this.today)) || this.isOnValidGracePeriod;
  }

  public get challengeIsActive(): boolean {
    return this.currentChallenge.start.isSameOrBefore(this.today)
      && this.currentChallenge.end.isSameOrAfter(this.today);
  }

  /**
   * Gets the challenge start date.
   */
  public get transphormerChallengeStart(): Moment {
    if (!this.updates) {
      return null;
    }

    const two_weeks_before_date = this.currentChallenge.registrationBegins;
    const photos_two_weeks_before = this.updates.filter((item) => {
      return moment(new Date(item.created_at)).
        isBetween(two_weeks_before_date, this.currentChallenge.start, null, '[)');
    })
      .sort((a: CameraPhotos, b: CameraPhotos) => {
        return (a.created_at < b.created_at) ? -1 : 1;
      });
    if (photos_two_weeks_before.length > 0) {
      return moment(new Date(photos_two_weeks_before[0].created_at));
    }
    return null;
  }

  public get userIsSignedUpForCurrentChallenge(): boolean {
    if (!this.updates || !this.currentChallenge) {
      return false;
    }
    return !!this.transphormerChallengeStart;
  }

  public get currentChallengeDay(): string {
    return (this.today.clone().set('hour', 23).diff(this.currentChallenge.start, 'days') + 1).toString();
  }

  public get currentChallengeWeek(): string {
    return (this.today.clone().set('hour', 23).diff(this.currentChallenge.start, 'weeks') + 1).toString();
  }
}
