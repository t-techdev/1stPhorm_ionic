import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BodyMetric } from '../../../../services/body-metric/body-metric';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Weight } from '../../../../interfaces';

interface Record extends Weight, BodyMetric {
}

@Component({
  selector: 'app-metric-record',
  templateUrl: './metric-record.component.html',
  styleUrls: ['./metric-record.component.scss'],
})
export class MetricRecordComponent implements OnInit {

  @Input()
  public borderBottom = false;

  @Input()
  public record: Record;

  @Input()
  public previousRecord: Record | null = null;

  @Input()
  public unit = '';

  @Output()
  public action: EventEmitter<Event> = new EventEmitter<Event>();

  public today: Moment;

  constructor() {
    this.today = moment().set('millisecond', 0).set('second', 0).set('minute', 0).set('hour', 0);
  }

  ngOnInit() {
  }

  public get diffIsMore(): boolean {

    if (!this.previousRecord) {
      return true;
    }

    const recordValue = ((this.record as Weight)).weight || ((this.record as BodyMetric)).metric_value;
    const previousRecordValue = ((this.previousRecord as Weight)).weight || ((this.previousRecord as BodyMetric)).metric_value;

    return (recordValue - previousRecordValue) > 0;
  }

  public momentInstance(value: Moment | string | null): Moment {
    return value as Moment;
  }
}
