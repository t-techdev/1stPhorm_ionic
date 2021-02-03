import { Injectable } from '@angular/core';
import { AnnouncementsService } from '../../../../services/announcements/announcements.service';
import { GlobalEmitterService, GlobalEvents } from '../../../../services/global-emitter/global-emitter.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from '../../../../services/message/message.service';
import { Select, Store } from '@ngxs/store';
import { AppState, LoggedInState } from '../../../../store/app.store';

@Injectable({
  providedIn: 'root'
})
export class UnreadActionsService {

  @Select(AppState.isLoggedIn) loggedIn$: Observable<LoggedInState>;

  public announcementCounts: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public messagesCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public transphormerMessagesCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    public announcementService: AnnouncementsService,
    public messageService: MessageService,
    private store: Store,
    public emitterService: GlobalEmitterService
  ) {
    this.init();
  }

  public init() {
    this.loggedIn$.subscribe((state) => {
      if (state === LoggedInState.Yes) {
        this.refreshAnnouncements();
        this.refreshMessages();
      }
    });
    this.emitterService.listen(GlobalEvents.NewTransphormerMessages).subscribe(() => this.refreshMessages());
    this.emitterService.listen(GlobalEvents.TransphormerMessageRead).subscribe(() => this.messagesCount.next(0));
    this.emitterService.listen(GlobalEvents.AdvisorMessageRead).subscribe(() => this.refreshMessages());
    this.emitterService.listen(GlobalEvents.NewAdvisorMessages).subscribe(() => this.refreshMessages());
    this.emitterService.listen(GlobalEvents.AnnouncementRead).subscribe(() => this.announcementCounts.next(0));
    this.emitterService.listen(GlobalEvents.NewAnnouncement).subscribe(() => this.refreshAnnouncements());
  }

  /**
   * Refresh count of unread messages from transphormer and messages from advisor
   */
  public refreshMessages() {
    this.announcementService.unreadAnnouncements()
      .subscribe(result => this.announcementCounts.next(result.count));
  }

  /**
   * Refresh count of unread announcements from advisor
   */
  public refreshAnnouncements() {
    this.messageService.unreadMessageCount()
      .subscribe(unreadMessages => {
        this.messagesCount.next(unreadMessages.unread_transphormer_messages);
        this.transphormerMessagesCount.next(unreadMessages.unread_advisor_messages);
      });
  }

}
