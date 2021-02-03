import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput, } from '@ionic/angular';
import {
  TrainerTransphormerLinkService,
} from '../../../services/trainer-transphormer-link/trainer-transphormer-link.service';
import { UserService } from '../../../services/user/user.service';
import { EMPTY, fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { AdvisorSearchService } from '../../../pages/choose-advisor/advisor-search.service';
import { LinkApplication, Trainer, Transphormer } from '../../../interfaces';

@Component({
  selector: 'app-trainer-request',
  templateUrl: './trainer-request.component.html',
  styleUrls: ['./trainer-request.component.scss'],
})
export class TrainerRequestComponent implements OnInit, OnDestroy {
  @Input()
  public previousTrainerEmail: string;

  @Output()
  public advisorSelect: EventEmitter<LinkApplication> = new EventEmitter<LinkApplication>();

  public trainers: Transphormer[] = [];

  @ViewChild('search', {read: ElementRef}) public searchInput: ElementRef<IonInput>;
  public advisor: Trainer;
  public isDefault = false;
  public searching = false;
  public searchValue: string;
  private search$: Subscription;
  public invalid = false;

  constructor(
    private userService: UserService,
    private advisorSearch: AdvisorSearchService,
    private linkService: TrainerTransphormerLinkService
  ) {
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

  ngOnDestroy() {
    this.search$.unsubscribe();
  }

  getDefault() {
    this.advisorSearch.advisorSearch('')
      .subscribe(({advisor}) => {
        this.advisor = advisor;
        this.isDefault = true;
      });
  }

  public previousAdvisor() {
    this.advisorSearch.advisorSearch(this.previousTrainerEmail)
      .subscribe(({advisor}) => {
        this.advisor = advisor;
        this.isDefault = false;
      });
  }

  public get user(): Transphormer {
    return this.userService.user;
  }

  assign() {
    this.linkService.applyLinkingByTransphormer(this.advisor.id, this.user.id)
      .subscribe((next) => {
        this.advisorSelect.emit(next);
      });
  }
}
