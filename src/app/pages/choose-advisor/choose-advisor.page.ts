import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';
import { EMPTY, fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { AdvisorSearchService } from './advisor-search.service';
import { Trainer } from '../../interfaces';

@Component({
  selector: 'app-choose-advisor',
  templateUrl: './choose-advisor.page.html',
  styleUrls: ['./choose-advisor.page.scss'],
})
export class ChooseAdvisorPage implements OnInit, OnDestroy {

  @ViewChild('search', {read: ElementRef}) public searchInput: ElementRef<IonInput>;
  public advisor: Trainer;
  public isDefault = false;
  public searching = false;
  public searchValue: string;
  private search$: Subscription;
  public invalid = false;

  constructor(
    private advisorSearch: AdvisorSearchService,
    private nav: NavController,
  ) { }

  ngOnDestroy() {
    this.search$.unsubscribe();
  }

  ngOnInit() {
    const regex = /[^A-Za-z0-9_+@\-.]/;
    // @ts-ignore
    this.search$ = fromEvent(this.searchInput.nativeElement, 'ionChange')
      .pipe(
        map((e: Event): string => {
          return (e.target as any).value;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.advisor = null),
        filter((i: string) => i.length > 2),
        mergeMap((value: string) => {
          if (value.match(regex) !== null) {
            this.invalid = true;
            return EMPTY;
          }
          this.invalid = false;
          this.searching = true;
          return this.advisorSearch.advisorSearch(value);
        }),
      )
      .subscribe(({advisor}) => {
        this.advisor = advisor;
        this.isDefault = false;
        this.searching = false;
      });
  }


  getDefault() {
    this.advisorSearch.advisorSearch('')
      .subscribe(({advisor}) => {
        this.advisor = advisor;
        this.isDefault = true;
      });
  }

  continue() {
    const {advisor, isDefault} = this;
    // If we are going with the default, then we don't need to do anything because
    // the default has already been chosen when they registered.
    if (isDefault) {
      this.nav.navigateForward('onboarding');
      return;
    }

    // However, if we do
    this.advisorSearch.chooseAdvisor(advisor)
      .subscribe((next) => {
        this.nav.navigateForward('onboarding');
      });
  }
}
