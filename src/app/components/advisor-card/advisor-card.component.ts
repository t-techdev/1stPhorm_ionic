import { Component, Input, OnInit } from '@angular/core';
import { Advisor } from '../../interfaces';

@Component({
  selector: 'app-advisor-card',
  templateUrl: './advisor-card.component.html',
  styleUrls: ['./advisor-card.component.scss'],
})
export class AdvisorCardComponent implements OnInit {

  @Input() advisor: Advisor = null;

  constructor() { }

  ngOnInit() {}

}
