import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sex, Transphormer } from '../../../../interfaces';

@Component({
  selector: 'app-subscription-advisor-info',
  templateUrl: './subscription-advisor-info.component.html',
  styleUrls: ['./subscription-advisor-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionAdvisorInfoComponent implements OnInit {
  @Input() advisorTransphormer: Transphormer;
  @Output() next = new EventEmitter<any>();
  @Output() sendMessage = new EventEmitter<string>();

  public messageOneSent = false;
  public messageTwoSent = false;

  public Sex = Sex;

  constructor() {}

  ngOnInit() {}

  click() {
    this.next.emit();
  }

  sendMessageOne() {
    this.sendMessage.emit('Hi, ' + this.advisorTransphormer.first_name + '!');
    this.messageOneSent = true;
  }

  sendMessageTwo() {
    this.sendMessage.emit('Let\'s do this!');
    this.messageTwoSent = true;
  }
}
