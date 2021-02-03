import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar-mini',
  templateUrl: './calendar-mini.component.html',
  styleUrls: ['./calendar-mini.component.scss'],
})
export class CalendarMiniComponent implements OnInit {

  @Output()
  public dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @Input()
  public date = moment();

  @Input()
  public currentDate = moment();

  public weekdays = ['Mon', 'Tue', 'Wed', 'Thi', 'Fri', 'Sat', 'Sun'];
  public days = [];
  public idx = 0;
  public start = moment();
  public end = moment();

  constructor(
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.resetDate();
  }

  resetDate() {
    this.days = [];
    for (var i = this.idx; i < this.idx + 7; i++) {
      const day = moment().startOf('isoWeek').add(i, 'day');
      this.days.push({
        weekday: i % 7,
        day: day
      })
    }
    this.start = moment().startOf('isoWeek').add(this.idx, 'day');
    this.end = moment().startOf('isoWeek').add(this.idx + 6, 'day');
    if (this.equalDate(this.date)) {
      this.date.add(1, 'day');
    }
  }

  subWeek() {
    if (this.idx > 0) {
      this.idx = this.idx - 7;
      this.resetDate();
    }
  }

  addWeek() {
    if (this.idx === 0) {
      this.idx = this.idx + 7;
      this.resetDate();
    }
  }

  public get startDate() {
    return this.start.format('MMM') + " " + this.start.format('D');
  }

  public get endDate() {
    return this.end.format('MMM') + " " + this.end.format('D');
  }

  public get seletedDate() {
    return this.date.format('MMM') + " " + this.date.format('D');
  }

  async selectDate(day, weekday) {
    if (this.equalDate(day)) {
      const alert = await this.alertController.create({
        subHeader: 'Existing food on that day will not be overwritten.',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
      return;
    }
    this.date = day;
    this.dateChange.emit(this.date.toDate());
  }
  
  public equalDate(date) {
    const x = moment(date).format("YYYY-MM-DD");
    const y = moment(this.currentDate).format("YYYY-MM-DD");
    return x === y;
  }

}
