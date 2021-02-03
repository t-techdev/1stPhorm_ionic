import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MessageService,
} from '../../services/message/message.service';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  NavController,
} from '@ionic/angular';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { GlobalEmitterService, GlobalEvents } from '../../services/global-emitter/global-emitter.service';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { AnalyticEvents } from './../../services/analytics/analytic-events.enum';
import { Conversation, SmallConversation } from '../../interfaces/messages';

@Component({
  selector: 'app-trainer-messages',
  templateUrl: './trainer-messages.page.html',
  styleUrls: ['./trainer-messages.page.scss'],
})
export class TrainerMessagesPage implements OnInit, OnDestroy {
  public spinner = false;
  public _conversations: SmallConversation[] = [];
  public conversations: SmallConversation[] = [];
  private _amr: Subscription;
  public unreadOnly = false;
  private updates$: Subscription;
  private end = 50;
  private conversationsLoaded = false;

  constructor(
    public errorService: ErrorsService,
    private toastSvc: ToastService,
    private messageService: MessageService,
    private globalEmitter: GlobalEmitterService,
    private navCtrl: NavController,
    private analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.loadConversations();
    this._amr = this.globalEmitter.listen(GlobalEvents.AdvisorMessageRead).subscribe((next) => {
      this.markConvoRead(next.data.transphormerId);
    });
  }

  public toggleUnread() {
    this.unreadOnly = !this.unreadOnly;
    this.end = 50;
    this.recalculateConversations();
  }

  public recalculateConversations() {
    let unsorted;
    if (this.unreadOnly) {
      unsorted = this._conversations.filter((item) => {
        return item.unread_count !== 0;
      });
    } else {
      unsorted = this._conversations;
    }

    if (unsorted.length > 0 && unsorted[0].last_message_timestamp) {
      unsorted.sort((a, b) => {
        if (a.last_message_timestamp === b.last_message_timestamp) {
          return 0;
        }
        return a.last_message_timestamp > b.last_message_timestamp ? -1 : 1;
      });
    }

    this.conversations = unsorted;
  }

  get visibleConversation(): SmallConversation[] {
    return this.conversations.slice(0, this.end || 20);
  }

  public markConvoRead(transphormerId: number) {
    const convoIndex = this._conversations
      .findIndex(conversation => conversation.transphormerId === transphormerId);
    const convo = this._conversations[convoIndex];
    convo.unread_count = 0;
    this._conversations.splice(convoIndex, 1, convo);
  }

  ngOnDestroy() {
    this._amr.unsubscribe();
    this.updates$.unsubscribe();
  }

  private async loadConversations() {
    this.spinner = true;

    try {
      this.messageService.advisorConversations()
        .then((conversations) => {
          this.spinner = false;
          this._conversations = conversations;
          this.updates$ = this.messageService.advisorConversationsUpdates().subscribe(
            (update) => {
              const updateable = this._conversations.findIndex((sc) => {
                return sc.transphormerId === update.transphormerId;
              });
              if (updateable !== -1) {
                this._conversations.splice(updateable, 1, update);
              } else {
                this._conversations.splice(0, 0, update);
              }
              this.recalculateConversations();
            });
          this.recalculateConversations();
          this.conversationsLoaded = true;
        });
      this.analyticService.logEvent(AnalyticEvents.MessagingWithTrainer, {});
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
      this.spinner = false;
    }
  }

  public goToMessages(id: number) {
    this.navCtrl.navigateForward(`chat-messages/${id}`);
  }

  get noMoreMessages(): boolean {
    return this.end >= this.conversations.length;
  }

  public trackById(index, smallconvo: SmallConversation) {
    return smallconvo.transphormerId;
  }

  public loadMoreMessages(event) {
    if (this.conversationsLoaded && (this.end + 50) > this.conversations.length) {
      this.end = this.conversations.length;
    } else {
      this.end += 50;
    }
    event.target.complete();
  }
}
