import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../../interfaces/messages';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {

  @Input() senderId: number;
  @Input() messages: Message[] = [];

  constructor() { }

  ngOnInit() { }

}
