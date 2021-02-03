import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { Observable, timer } from 'rxjs';
import { flatMap, map, mergeMap, tap, filter } from 'rxjs/operators';
import { fromArray } from 'rxjs/internal/observable/fromArray';
import { UserService } from '../user/user.service';
import { StorageService } from '../storage.service';
import { Storage } from '@ionic/storage';
import { ErrorFormat } from '../../interfaces/errors';
import { apiUrl } from '../../helpers';
import { Conversation, Message, MessageCount, SmallConversation } from '../../interfaces/messages';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends BaseService {

  private storage: Storage;
  private _lastUpdate: any = null;

  constructor(
    protected http: HttpClient,
    @Inject(RollbarService) public rollbar: Rollbar,
    protected userService: UserService,
    private storageService: StorageService,
    protected platform: Platform
  ) {
    super(http, platform, userService, rollbar);
    MessageService.SET_PLATFORM(platform);
    MessageService.SET_ROLLBAR(rollbar);
    this.init();
  }

  public async init() {
    this.storage = new Storage({ name: 'messages' });
    this.lastUpdate = await this.storageService.get('messages:last-update');
  }

  public messages(to_id: number): Promise<Message[] | ErrorFormat> {
    return this.http.get<Message[]>(apiUrl(`messages/${to_id}/rich`), MessageService.BaseOptions())
      .pipe(
      map((response: Message[]) => {
        return response.map((value) => {
          if (Array.isArray(value.parts)) {
            value.parts.map(val => val.messageId = value.id);
          }
          return value;
        });
      })
      )
      .toPromise()
      .catch(MessageService.HandleError);
  }

  public sendMessage(to_id: number, message: string): Promise<Message | ErrorFormat> {
    return this.http.post<Message>(apiUrl('messages'), { to_id, message }, MessageService.BaseOptions())
      .pipe(
      map((response: Message) => {
        if (Array.isArray(response.parts)) {
          response.parts.map(val => val.messageId = response.id);
        }
        return response;
      })
      )
      .toPromise()
      .catch(MessageService.HandleError);
  }

  public sendAttachment(to_id: number, media: Blob, callback, uploadId): Observable<Message> {
    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
    });
    const form = new FormData();
    form.append('media', media);
    form.append('to_id', `${to_id}`);

    return this.http.post<Message>(apiUrl('messages'), form, { headers, reportProgress: true, observe: 'events' })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              callback(uploadId, Math.round(event.loaded * 100 / event.total));
              return null;
            case HttpEventType.Response:
              const message: Message = event.body;
              if (Array.isArray(message.parts)) {
                message.parts.map(val => val.messageId = message.id);
              }
              return message;
            default:
              return null;
          }
        }),
        filter(response => response !== null),
      );
  }

  get lastUpdate() {
    return this._lastUpdate;
  }

  set lastUpdate(value) {
    this._lastUpdate = value;
    this.storageService.set('messages:last-update', value);
  }

  private conversationToSmallConversation(value: Conversation): SmallConversation {
    const { unread_count, last_message_timestamp, i_sent_last_message } = value;
    const transphormerId = value.transphormer.id;
    return {
      unread_count,
      last_message_timestamp,
      transphormerId,
      ts: new Date(value.last_message_timestamp),
      display_name: value.transphormer.display_name,
      message: <string>(value.last_message_received as any).message.substr(0, 50),
      i_sent_last_message
    };
  }

  public async advisorConversations(): Promise<SmallConversation[]> {
    const conversations: SmallConversation[] = [];
    return this.storage.length()
      .then((length) => {
        if (length === 0) {
          const options = MessageService.BaseOptions();
          return this.http.get<Conversation[]>(apiUrl('advisor/conversations'), options)
            .pipe(
            flatMap(listing => fromArray<Conversation>(listing)),
            // Add the responses to the main DB.
            tap(conversation => this.storage.set(`transphormer-${conversation.transphormer.id}`, conversation)),
          )
            .toPromise();
        }
      })
      .then(() => {
        return this.storage.forEach((value: Conversation) => {
          conversations.push(this.conversationToSmallConversation(value));
        }).then(_ => {
          if (conversations.length === 0) {
            return;
          }
          conversations.sort(this.messageSort);
          this.lastUpdate = conversations[conversations.length - 1].last_message_timestamp;
          return conversations;
        });
      });
  }

  public advisorConversationsUpdates(): Observable<SmallConversation> {
    const options = MessageService.BaseOptions();

    return timer(0, 30000)
      .pipe(
      // Load all of the latest updates.
      mergeMap(() => {
        if (this.lastUpdate) {
          options.params = { since: this.lastUpdate };
        }
        return this.http.get<Conversation[]>(apiUrl('advisor/conversations'), options).pipe(
          tap(conversations => {
            if (conversations.length === 0) {
              return;
            }
            conversations.sort(this.messageSort);
            this.lastUpdate = conversations[conversations.length - 1].last_message_timestamp;
          })
        );
      }),
      // Turn the listing into a separate responses.
      flatMap(listing => fromArray<Conversation>(listing)),
      // Add the responses to the main DB.
      tap(conversation => this.storage.set(`transphormer-${conversation.transphormer.id}`, conversation)),
      // Turn them into SmallConversations.
      map(conversation => this.conversationToSmallConversation(conversation)),
    );
  }

  public messageSort(a, b) {
    if (a.last_message_timestamp === b.last_message_timestamp) {
      return 0;
    }
    return a.last_message_timestamp > b.last_message_timestamp ? 1 : -1;
  }

  public markMessagesAsRead(messageIds: number[]): Promise<any> {
    const data = {
      message_ids: messageIds
    };

    return this.http.post(apiUrl('messages/mark-read'), data, MessageService.BaseOptions())
      .toPromise()
      .catch(MessageService.HandleError);
  }

  public unreadMessageCount(): Observable<MessageCount> {
    return this.http.get<MessageCount>(apiUrl('messages/unread-messages'), MessageService.BaseOptions());
  }
}
