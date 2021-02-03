import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BottomMenuService, LiveChatFeedService, PusherService, ToastService, VideosService } from '../../services';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Subscription } from 'rxjs';
import { ErrorFormat, TextMessagePayload, FeedItem, Video } from '../../interfaces';
import { MessageEntryComponent } from '../../components/message-common/message-entry/message-entry.component';

export enum LiveStreamError {
  NO_LIVE_STREAM = 'No live stream was available.',
  UNABLE_CONNECT = 'Unable to connect to server.',
  NO_MESSAGES = 'Unable to connect to message stream.',
  // PLAYBACK = 'Could not play back stream.'
}

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LiveStreamPage implements OnInit, OnDestroy {

  @ViewChild(MessageEntryComponent) private messageEntryComponent: MessageEntryComponent;

  // Variables for messaging and feed.
  feedItems: any[] = [];

  // State variables.
  public settingUpLiveStream = false;
  public liveStreamError?: LiveStreamError = null;
  public video: Video;
  private messageStream: { pusher: any; channel: any; close(): void };
  streamHasEnded = false;
  private generalStream: { pusher: any; channel: any; close(): void };
  private streamDisconnected = false;

  private keyboardShow$: Subscription = null;
  private keyboardHide$: Subscription = null;

  constructor(
    private liveChatFeed: LiveChatFeedService,
    private videoService: VideosService,
    private pusher: PusherService,
    private platform: Platform,
    private keyboard: Keyboard,
    private bottomMenu: BottomMenuService,
    private toastSvc: ToastService
  ) {
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public updateItems(items) {
    if (items.length < 1) {
      return;
    }
    items.forEach((i) => {
      const exists = this.feedItems.findIndex((item) => {
        return item.id === i.id;
      });
      if (exists !== -1) {
        if (!i.approved_at) {
          this.feedItems.splice(exists, 1);
        } else {
          this.feedItems.splice(exists, 1, i);
        }
        return;
      }
      this.feedItems.push(i);
    });
  }

  public get sortedItems() {
    return this.feedItems.sort((a, b) => {
      if (a.sticky === b.sticky) {
        return a.approved_at > b.approved_at ? -1 : 1;
      } else {
        return a.sticky ? -1 : 1;
      }
    });
  }

  ngOnInit() {
    this.setupLiveStreamVideo();
    if (this.platform.is('cordova')) {
      this.platform.ready()
        .then(() => {
          this.keyboardShow$ = this.keyboard.onKeyboardWillShow()
            .subscribe(() => {
              this.bottomMenu.hide();
            });
          this.keyboardHide$ = this.keyboard.onKeyboardWillHide()
            .subscribe(() => {
              this.bottomMenu.show();
            });
          this.keyboard.hideFormAccessoryBar(true);
        });
    }
  }

  public initializeFeedItems(items: FeedItem[]) {
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }
    this.feedItems = <FeedItem[]>(items);
  }

  public setupFeed(): Promise<void> {
    return this.liveChatFeed
      .getAllMessagesForStream(this.video.id)
      .then((items: FeedItem[]) => {
        this.subscribeToFeedUpdates();
        this.initializeFeedItems(items);
      })
      .catch((e) => {
        throw new Error(LiveStreamError.NO_MESSAGES);
      });
  }

  public ngOnDestroy() {
    if (this.keyboardHide$ !== null) {
      this.keyboardHide$.unsubscribe();
    }
    if (this.keyboardShow$ !== null) {
      this.keyboardShow$.unsubscribe();
    }
    if (this.platform.is('cordova')) {
      this.platform.ready()
        .then(() => {
          this.keyboard.hideFormAccessoryBar(false);
        });
    }

    if (this.messageStream) {
      this.messageStream.close();
    }
  }

  public subscribeToFeedUpdates() {
    this.messageStream = this.pusher
      .getChannelForLiveStream(this.video.id);
    this.generalStream = this.pusher.getGeneralStreamChannel();
    this.messageStream.channel.bind('App\\Events\\LiveStream\\FeedItemSaved', (fi) => {
      this.updateItems([fi.feedItem]);
    });
    this.messageStream.channel.bind('App\\Events\\LiveStream\\StreamEnded', () => {
      this.endStream();
    });
    this.generalStream.channel.bind('App\\Events\\Mux\\StreamDisconnected', () => {
      this.streamDisconnected = true;
    });
  }

  public playbackProblem() {
    if (this.streamDisconnected) {
      this.endStream();
    }
  }

  public endStream() {
    this.streamHasEnded = true;
    this.video = null;
  }

  public sendMessage({ message }: TextMessagePayload) {
    this.liveChatFeed
      .sendMessage(this.video.id, message)
      .then(() => {
        this.messageEntryComponent.reset();
        this.toastSvc.flash('Message sent to moderation queue.');
      })
      .catch(() => {
        this.toastSvc.flash('Could not send message. Try again in a moment.');
      });
  }

  public getCurrentLiveEvent(): Promise<Video | ErrorFormat> {
    return this.videoService
      .getLatestVideo()
      .then((video: Video) => {
        if (video.live_status === 'live') {
          this.video = video;
          return this.video;
        }
      });
  }

  public initializeStreamData(video: Video) {
    this.settingUpLiveStream = false;
    if (!video) {
      throw new Error(LiveStreamError.NO_LIVE_STREAM);
    }
  }

  public setupCurrentLiveEvent() {
    return this.getCurrentLiveEvent()
      .then((video: Video) => {
        this.initializeStreamData(video);
      });
  }

  public clearErrors() {
    this.liveStreamError = null;
  }

  public setupLiveStreamVideo() {
    this.settingUpLiveStream = true;
    this.clearErrors();
    this.setupCurrentLiveEvent()
      .then(() => {
        return this.setupFeed();
      })
      .catch((error) => {
        this.settingUpLiveStream = false;
        this.liveStreamError = error.message;
      });
  }

  public localTimestamp(ts) {
    return moment.utc(ts).local().format('LT');
  }

}
