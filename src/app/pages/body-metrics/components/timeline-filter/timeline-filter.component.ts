import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { FilterDate, Filters } from './filter-dates';

@Component({
  selector: 'app-timeline-filter',
  templateUrl: './timeline-filter.component.html',
  styleUrls: ['./timeline-filter.component.scss'],
})
export class TimelineFilterComponent implements OnInit {

  public today: Moment = moment();

  public dates: FilterDate[] = Filters;

  @Output()
  public afterDate: EventEmitter<Moment | undefined> = new EventEmitter<Moment>();

  constructor() {
  }

  ngOnInit() {
  }

  public updateActiveDate(filterDate: FilterDate) {
    this.dates = this.dates.map(date => {
      date.active = date.name === filterDate.name;
      return date;
    });

    if (filterDate.subtract.skip) {
      this.afterDate.emit(undefined);
    } else {
      this.afterDate.emit(this.today.clone().subtract(filterDate.subtract.amount, filterDate.subtract.type as any));
    }
  }

}
