import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { from, Observable, of, Subscription } from 'rxjs';
import { concatAll, count, delay, filter, mapTo, scan, share, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-onboarding-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, OnDestroy {

  @Input() nextButtonText = 'Continue';
  @Output() next = new EventEmitter();
  @Input() imageSrc;
  @Input() header: string;
  @Input() start = false;
  @Input() done = false;

  @Input() complete: Observable<boolean>;

  @Output() started = new EventEmitter<boolean>();

  progressColor = 'primary';
  progressValue = 0;
  message = 'Give us just a minute…';
  private updater$: Subscription;
  private value$: Subscription;

  constructor() {
  }

  ngOnDestroy() {
    if (this.updater$) {
      this.updater$.unsubscribe();
    }
    if (this.value$) {
      this.value$.unsubscribe();
    }
  }

  updateProgress(progressRatio) {
    this.progressValue = progressRatio;
    if (progressRatio === 1) {
      this.done = true;
      this.progressColor = 'success';
    } else {
      this.progressColor = 'primary';
    }
  }

  ngOnInit() {
    const requestOne = of('Assessing your answers and goals.').pipe(
      tap(_ => this.started.emit(true)),
      delay(1500)
    );
    const meh = of('Assessing your answers and goals.').pipe(delay(500));
    const requestTwo = of('Calculating your custom nutrition plan.').pipe(delay(1800));
    const twoAndAHalf = of('Calculating your custom nutrition plan.').pipe(delay(500));
    const requestThree = of('Building your custom training program.').pipe(delay(2100));
    const four = of('Done!').pipe(delay(2100));
    const completion = of(true).pipe(delay(100), mapTo('Done!'));

    const observables: Array<Observable<string>> = [
      requestOne,
      meh,
      requestTwo,
      twoAndAHalf,
      requestThree,
      four,
      completion,
    ];

    const array$ = from(observables);
    const requests$ = array$.pipe(concatAll());
    const clicks$ = of(true).pipe(delay(1000));

    const progress$ = clicks$.pipe(
      switchMapTo(requests$),
      filter(i => i !== null),
      share()
    );

    const count$ = array$.pipe(count());

    const ratio$ = progress$.pipe(
      scan(current => current + 1, 0),
      withLatestFrom(count$, (current, count) => current / count)
    );

    this.value$ = clicks$.pipe(switchMapTo(ratio$)).subscribe((value) => this.updateProgress(value));

    this.updater$ = progress$.subscribe(value => this.message = value);
  }

}
