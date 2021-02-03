import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { UserService } from '../user/user.service';
import { ErrorFormat, FeedItem } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class LiveChatFeedService extends BaseService {

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);

    LiveChatFeedService.SET_PLATFORM(platform);
    LiveChatFeedService.SET_ROLLBAR(rollbar);
  }

  public getAllMessagesForStream(streamId: Number) {
    return this.http
      .get<FeedItem[]>(LiveChatFeedService.Url(`live-stream/events/${streamId}/items` ), LiveChatFeedService.BaseOptions())
      .toPromise()
      .catch(LiveChatFeedService.HandleError);
  }

  getNewItemsForStream(streamId: number, lastTimestamp: string): Promise<FeedItem[] | ErrorFormat> {
    const timestamp = escape(lastTimestamp);
    return this.http
      .get<FeedItem[]>(LiveChatFeedService.Url(`live-stream/events/${streamId}/items?since=${timestamp}`), LiveChatFeedService.BaseOptions())
      .toPromise()
      .catch(LiveChatFeedService.HandleError);
  }

  public sendMessage(streamId: number, message: string) {
    const data = {
      stream_id: streamId,
      text: message,
    };
    return this.http
      .post<FeedItem>(LiveChatFeedService.Url(`live-stream/events/${streamId}/items`), data, LiveChatFeedService.BaseOptions())
      .toPromise()
      .catch(LiveChatFeedService.HandleError);
  }
}
