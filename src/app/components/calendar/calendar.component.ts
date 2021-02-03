import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public today = moment();
  @ViewChild('dtInput')
  public dtInput: ElementRef;

  @Output()
  public dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @Input()
  public dateTime = moment();

  @Input()
  public maxDate;

  @Input()
  public format = 'YYYY/MM/DD';

  @Input()
  public minDate = null;

  @Input()
  public feature = false;

  // Holds the defaults.
  public min;
  public max;

  public ion_datetime = '';

  constructor() {
  }

  ngOnInit() {
    this.today = (this.today || moment()).set('seconds', 0).set('hours', 0).set('minutes', 0);
    this.dateTime = (this.dateTime || moment()).set('seconds', 0).set('hours', 0).set('minutes', 0);
    this.ion_datetime = this.dateTime.format('YYYY-MM-DD');
    if (this.maxDate) {
      this.max = this.maxDate.clone().set('seconds', 0).set('hours', 0).set('minutes', 0).toISOString();
    }
    if (this.minDate) {
      this.min = this.minDate.clone().set('seconds', 0).set('hours', 0).set('minutes', 0).toISOString();
    }
  }

  public openCalendar() {
    this.dtInput.nativeElement.click();
  }

  public dateChanged() {
    if (this.feature) {
      this.dateTime = moment(this.ion_datetime);
    }
    this.dateChange.emit(this.dateTime.toDate());
  }

  public subDay() {
    this.dateTime.subtract(1, 'day');
    this.ion_datetime = this.dateTime.format('YYYY-MM-DD');
    if (!this.feature) {
      this.dateChanged();
    }
  }

  public addDay() {
    this.dateTime.add(1, 'day');
    this.ion_datetime = this.dateTime.format('YYYY-MM-DD');
    if (!this.feature) {
      this.dateChanged();
    }
  }

  public get currentDay(): boolean {
    const todayTime = moment(this.today).format('YYYY-MM-DD');
    const dateTimeValue = moment(this.dateTime).format('YYYY-MM-DD');
    return moment(todayTime).isSame(dateTimeValue);
  }

  public get isMaxDate(): boolean {
    if (!this.maxDate) {
      return false;
    }
    const maxDate = moment(this.maxDate).format('YYYY-MM-DD');
    const dateTimeValue = moment(this.dateTime).format('YYYY-MM-DD');
    return moment(maxDate).isSame(dateTimeValue);
  }

  public get isMinDate(): boolean {
    if (!this.minDate) {
      return false;
    }
    const minDate = moment(this.minDate).format('YYYY-MM-DD');
    const dateTimeValue = moment(this.dateTime).format('YYYY-MM-DD');
    return moment(minDate).isSame(dateTimeValue);
  }

}
