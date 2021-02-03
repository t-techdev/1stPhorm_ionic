import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-walkthru-item',
  templateUrl: './walkthru-item.component.html',
  styleUrls: ['./walkthru-item.component.scss'],
})
export class WalkthruItemComponent implements OnInit {

  @Input() public image: string;
  @Input() public title: string;

  constructor() { }

  ngOnInit() {}

}
