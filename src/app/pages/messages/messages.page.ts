import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonContent, NavController, } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

import { Observable, Subscription, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';

import {
  AuthenticatedPusherService,
  ErrorsService,
  FeatureFlagService,
  GlobalEmitterService,
  GlobalEvents,
  MessageService,
  ToastService,
  TrainerTransphormerLinkService,
  UserService
} from '../../services';
import * as moment from 'moment';
import { LinkApplication, MediaMessagePayload, Message, Transphormer, Upload } from '../../interfaces';
import { MessageEntryComponent } from '../../components/message-common/message-entry/message-entry.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {

  @ViewChild(MessageEntryComponent) private messageEntryComponent: MessageEntryComponent;

  public spinner = false;
  public spinner_send_message = false;
  public application: LinkApplication | null = null;

  protected userId: number;
  public hasTrainer = false;
  public checkComplete = false;
  public canMessage = false;

  public messages: Message[] = [];

  private messageStream: Subscription;
  private uploads: Upload[] = [];
  private destroy$: Subject<any> = new Subject<any>();

  @ViewChild('messageContent')
  public messageContent: IonContent;
  public feature: Observable<boolean>;
  public isUploading = false;
  public uploadProgress = 0;

  constructor(
    private linkService: TrainerTransphormerLinkService,
    public errorService: ErrorsService,
    private messageService: MessageService,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private file: File,
    private toastService: ToastService,
    private globalEmitter: GlobalEmitterService,
    private userService: UserService,
    public messageChannel: AuthenticatedPusherService,
    private flags: FeatureFlagService,
  ) {
  }

  ngOnDestroy() {
    if (this.messageStream) {
      this.messageStream.unsubscribe();
      this.messageChannel.closeChannel(`private-message-channel.${this.application.trainer.transphormer_id}.${this.userId}`);
      this.messageChannel.closeEvent('message.received');
    }
  }

  ionViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.checkApplicationStatus();
    this.feature = this.flags.get$('media_messaging');
  }

  public get uploadCount() {
    return this.uploads.length;
  }

  private async checkApplicationStatus() {
    this.spinner = true;

    try {
      this.application = <LinkApplication>(
        await this.linkService.requestStatus()
      );
      this.hasTrainer = true;

      if (this.application.status === 'accepted') {
        this.canMessage = true;
        await this.setupMessages();
      } else {
        this.navCtrl.navigateRoot('trainer-requests');
      }
    } catch (e) {
      if (e.status === 404) {
        this.navCtrl.navigateRoot('trainer-requests');
      }
      if (e.status !== 404) {
        this.toastService.flash(this.errorService.firstError(e));
      }
    } finally {
      this.spinner = false;
      this.checkComplete = true;
    }
  }

  private async setupMessages(showLoader = false) {
    if (!this.application) {
      this.hasTrainer = false;
    } else {
      if (showLoader) {
        this.spinner = true;
      }

      try {
        this.messages = <Message[]>(
          (<any>(
            await this.messageService.messages(
              this.application.trainer.transphormer.id
            )
          ))
        );
        this.messages = this.sortMessages();
        this.setupMessageStream();
        this.markMessagesAsRead();

        this.scrollBottom();
      } catch (e) {
        this.toastService.flash(this.errorService.firstError(e));
      } finally {
        if (showLoader) {
          this.spinner = false;
        }
      }
    }
  }

  public get user(): Transphormer {
    return this.userService.user;
  }

  public async sendMessage(data) {
    this.spinner_send_message = true;

    try {
      const message = <Message>(
        (<any>(
          await this.messageService.sendMessage(
            this.application.trainer.transphormer.id,
            data.message
          )
        ))
      );
      this.messages.push(message);
      this.messageEntryComponent.reset();
      this.scrollBottom();
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner_send_message = false;
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

    this.messageService.sendAttachment(this.application.trainer.transphormer.id, blob, progressCallback, uploadId)
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
        }),
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

  private setupMessageStream() {
    this.userId = this.user.id;
    this.messageChannel.openChannel(`private-message-channel.${this.application.trainer.transphormer_id}.${this.userId}`);
    this.messageStream = this.messageChannel.openEvent<{ message: Message }>('message.received')
      .pipe(
        map((response: { message: Message }) => {
          const message = response.message;
          if (Array.isArray(message.parts)) {
            message.parts.map(val => val.messageId = message.id);
          }
          return response;
        })
      )
      .subscribe((data) => {
        this.setupLatestMessages([data.message]);
      });
  }

  private setupLatestMessages(messages: Message[]) {
    let hasNewMessage = false;
    for (const message of messages) {
      if (
        !this.messages.find(
          existingMessage => existingMessage.id === message.id
        )
      ) {
        this.messages.push(message);
        hasNewMessage = true;
      }
    }

    if (hasNewMessage) {
      this.messages = this.sortMessages();
      this.scrollBottom();
      this.markMessagesAsRead();
    }
  }

  public time(created_at: string): string {
    return moment
      .utc(created_at)
      .local()
      .format('h:mm a');
  }

  public async trainerActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'View Advisor details',
          icon: 'eye',
          handler: () => {
            this.navCtrl.navigateForward(
              '/trainer-requests'
            );
          },
        },
        {
          text: 'Cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  public scrollBottom() {
    window.setTimeout(() => this.messageContent.scrollToBottom(), 100);
  }

  private sortMessages() {
    return this.messages.sort((a, b) => moment(a.created_at).isBefore(moment(b.created_at)) ? -1 : 1);
  }

  public async markMessagesAsRead() {

    const unreadMessages = this.messages.filter(message => message.from_id !== this.user.id && !message.read_at);

    try {
      if (unreadMessages.length > 0) {
        const result = await this.messageService.markMessagesAsRead(unreadMessages.map(message => message.id));
        unreadMessages.forEach(message => {
          message.read_at = result.read_at;
        });
      }

      this.globalEmitter.emit(GlobalEvents.TransphormerMessageRead);
    } catch (e) {
      this.toastService.flash('Unable to mark messages as read');
    }
  }

}
