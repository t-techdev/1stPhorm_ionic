import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input()
  public list: any[];

  @ViewChild('canvas')
  public canvas: ElementRef;

  @Input()
  public labelTransform: (item: any, configs?: any) => string | null = null;

  @Input()
  public dataTransform: (item: any, configs?: any) => number | null = null;

  @Input()
  public labelKey = '';

  @Input()
  public dataKey = '';

  @Input()
  public chartLabel;

  @Input()
  public reverseList = false;

  @Input()
  public configs = null;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.setupChart();
  }

  private setupChart() {
    const labels = this.createLabels();
    const chart = new Chart(this.canvas.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: this.chartLabel,
          backgroundColor: 'rgba(48, 145, 194, .15)',
          borderColor: 'rgba(48, 145, 194, .9)',
          data: this.createData()
        }]
      }
    });
  }

  /**
   * Create labels
   */
  private createLabels(): string[] {
    const labels = this.list.map(item => {
      if (this.labelTransform) {
        return this.labelTransform(item, this.configs);
      }

      return item[this.labelKey];
    });

    if (this.reverseList) {
      labels.reverse();
    }

    return labels;
  }

  /**
   * Create data entry for labels
   */
  private createData(): number[] {
    const data = this.list.map(item => {
      if (this.dataTransform) {
        return this.dataTransform(item, this.configs);
      }

      return item[this.dataKey];
    });

    if (this.reverseList) {
      data.reverse();
    }

    return data;
  }

}
