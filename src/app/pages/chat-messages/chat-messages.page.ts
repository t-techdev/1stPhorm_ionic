import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '@ionic-native/file/ngx';

import {
  AuthenticatedPusherService,
  ErrorsService,
  FeatureFlagService,
  GlobalEmitterService,
  GlobalEvents,
  MessageService,
  ToastService,
  UserService
} from '../../services';

import * as moment from 'moment';
import { Observable, Subscription, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { Message, TextMessagePayload, Transphormer, MediaMessagePayload, Upload } from '../../interfaces';
import { MessageEntryComponent } from '../../components/message-common/message-entry/message-entry.component';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.page.html',
  styleUrls: ['./chat-messages.page.scss'],
})
export class ChatMessagesPage implements OnInit, OnDestroy {

  @ViewChild(MessageEntryComponent) private messageEntryComponent: MessageEntryComponent;

  public spinner = false;
  public spinner_send_message = false;
  public messages: Message[] = [];

  protected toId: number;
  protected userId: number;
  public name: string;
  protected groupName: string | null = null;

  public messageForm: FormGroup;

  private messageStream: Subscription;
  private uploads: Upload[] = [];
  private destroy$: Subject<any> = new Subject<any>();

  @ViewChild('messageContent')
  public messageContent: IonContent;
  public feature: Observable<boolean>;
  public isUploading = false;
  public uploadProgress = 0;

  constructor(
    public errorService: ErrorsService,
    public navCtrl: NavController,
    private messageService: MessageService,
    private toastSvc: ToastService,
    private router: ActivatedRoute,
    private file: File,
    private globalEmitter: GlobalEmitterService,
    private toastService: ToastService,
    private userService: UserService,
    public messageChannel: AuthenticatedPusherService,
    public flags: FeatureFlagService,
  ) {
  }

  ngOnDestroy(): void {
    if (this.messageStream) {
      this.messageStream.unsubscribe();
    }

    this.messageChannel.closeChannel(`private-message-channel.${this.toId}.${this.userId}`);
    this.messageChannel.closeEvent('message.received');
  }

  ionViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.name = '?';
    this.toId = parseFloat(this.router.snapshot.paramMap.get('id'));
    this.groupName = this.router.snapshot.paramMap.get('groupName');

    this.feature = this.flags.get$('media_messaging');

    if (!this.groupName) {
      this.groupName = null;
    }

    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    this.getMessages();
  }

  public get uploadCount() {
    return this.uploads.length;
  }

  private async getMessages() {
    this.spinner = true;

    try {
      if (this.groupName === null) {
        this.messages = <Message[]>(
          (<any>await this.messageService.messages(this.toId))
        ).sort((a, b) => moment(a.created_at).isBefore(moment(b.created_at)) ? -1 : 1);
        this.setupMessageStream();
      }

      if (this.messages.length > 0) {
        const message = this.messages[0];
        if (message.from_id === this.toId) {
          this.name = message.message_from.display_name;
        } else {
          this.name = message.message_to.display_name;
        }
      }

      this.markMessagesAsRead();
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
      this.scrollBottom();
    }
  }

  public async sendMessage(data: TextMessagePayload) {
    this.spinner_send_message = true;

    try {
      const message = <Message>(
        (<any>(
          await this.messageService.sendMessage(
            this.toId,
            data.message
          )
        ))
      );
      this.messages.push(message);
      this.messageEntryComponent.reset();

      this.scrollBottom();
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      this.spinner_send_message = false;
    }
  }

  public get user(): Transphormer {
    return this.userService.user;
  }

  private setupMessageStream() {
    this.userId = this.user.id;
    this.messageChannel.openChannel(`private-message-channel.${this.toId}.${this.userId}`);
    this.messageStream = this.messageChannel.openEvent<{ message: Message }>('message.received')
      .subscribe((data) => {
        this.setupLatestMessages([data.message]);
      });
  }

  private setupLatestMessages(messages: Message[]) {
    let hasLatestMessage = false;
    for (const message of messages) {
      if (
        !this.messages.find(
          existingMessage => existingMessage.id === message.id
        )
      ) {
        this.messages.push(message);
        hasLatestMessage = true;
      }
    }

    if (hasLatestMessage) {
      this.messages = this.sortMessages();
      this.scrollBottom();
      this.markMessagesAsRead();
    }
  }

  public scrollBottom() {
    window.setTimeout(() => {
      this.messageContent.scrollToBottom();
    }, 300);
  }

  public viewTransphormer() {
    this.navCtrl.navigateForward(`details/${this.toId}`);
  }

  public time(created_at: string): string {
    return moment
      .utc(created_at)
      .local()
      .format('M/D/YYYY @ h:mm a');
  }

  private sortMessages() {
    return this.messages.sort((a, b) => moment(a.created_at).isBefore(moment(b.created_at)) ? -1 : 1);
  }

  public async markMessagesAsRead() {

    const unreadMessages = this.messages.filter(message => message.from_id !== this.user.id && !message.read_at);
    unreadMessages.forEach(message => {
      message.read_at = message.read_at || new Date().toISOString();
    });

    try {
      if (unreadMessages.length > 0) {
        this.globalEmitter.emit(GlobalEvents.AdvisorMessageRead, {messages: unreadMessages, transphormerId: unreadMessages[0].from_id});
        const result = await this.messageService.markMessagesAsRead(unreadMessages.map(message => message.id));
      }
    } catch (e) {
      this.toastService.flash('Unable to mark messages as read.');
    }
  }

  public async sendAttachment({fileUrl}: MediaMessagePayload) {
    try {
      if (!/^file:\/\//.test(fileUrl)) {
        fileUrl = `file://${fileUrl}`;
      }

      const lastPos = fileUrl.lastIndexOf('/');
      const directory = fileUrl.substring(0, lastPos);
      const fileName = fileUrl.substring(lastPos + 1);
      const data = await this.file.readAsArrayBuffer(directory, fileName);
      console.log('data loaded');
      const blob = new Blob([new Uint8Array(data)], {type: 'application/octet-stream'});
      console.log('blob created.');
      this.uploadAttachment(blob);
    } catch (e) {
      console.log(e);
    }
  }

  private uploadAttachment(blob) {
    const uploadId = Date.now();
    console.log('sendAttachment()/media');

    this.uploads.push({
      id: uploadId,
      value: 0,
    });
    this.isUploading = true;


    const progressCallback = (id: number, val: number) => {
      // console.log('%cUpload progress: ', 'color: cyan', id, val);
      const currentUpload = this.uploads.find(upload => upload.id === id);
      if (currentUpload) {
        currentUpload.value = val / 100;
      }

      this.uploadProgress = this.uploads.length
        ? this.uploads.reduce((prev , curr) => prev + curr.value, 0) / this.uploads.length
        : 0;
    };

    this.messageService.sendAttachment(this.toId, blob, progressCallback, uploadId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.uploads = this.uploads.filter(upload => upload.id !== uploadId);
          if (!this.uploads.length) {
            this.uploadProgress = 0;
            this.isUploading = false;
            // console.log('%cNo more uploadas...last: ', 'color: white', uploadId, this.uploads);
          }
          // console.log('%cUpload ended: ', 'color: yellow', uploadId, this.uploads);
        })
      )
      .subscribe((message) => {
        this.messages.push(message);
        this.scrollBottom();
      }, (error) => {
        this.uploads = this.uploads.filter(upload => upload.id !== uploadId);
        if (!this.uploads.length) {
          this.uploadProgress = 0;
          this.isUploading = false;
          // console.log('%cNo more uploads (Error)... last: ', 'color: white', uploadId, this.uploads);
        }

        console.error(error);
        this.toastService.flash('Unable to upload attachment.');
      });
  }
}
