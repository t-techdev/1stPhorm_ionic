import { Component, EventEmitter, Inject, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';

import { RollbarService } from '../../../rollbar';
import * as Rollbar from 'rollbar';
import { MediaMessagePayload, TextMessagePayload } from '../../../interfaces';
import { MediaAdderService } from '../../../services/media-adder/media-adder.service';

@Component({
  selector: 'app-message-entry',
  templateUrl: './message-entry.component.html',
  styleUrls: ['./message-entry.component.scss'],
})
export class MessageEntryComponent implements OnInit, OnChanges {
  @Input() allowMedia = false;
  @Input() uploadProgress = 0;
  @Input() isUploading = false;
  @Input() uploadCount = 0;
  @Output() sendMessage: EventEmitter<TextMessagePayload> = new EventEmitter();
  @Output() sendAttachment: EventEmitter<MediaMessagePayload> = new EventEmitter();
  @Output() scrollBottom: EventEmitter<any> = new EventEmitter();
  public messageForm: FormGroup;
  public displayUploadCount = false;

  constructor(
    @Inject(RollbarService) private rollbar: Rollbar,
    public mediaAdder: MediaAdderService,
    public platform: Platform,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uploadCount && !changes.uploadCount.firstChange) {
      if (changes.uploadCount.currentValue > 1) {
        this.displayUploadCount = true;
      } else if (!changes.uploadCount.currentValue) {
        this.displayUploadCount = false;
      }
    }
  }

  ngOnInit() {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  get allowAttachments(): boolean {
    return this.allowMedia && this.platform.is('cordova');
  }

  public submit() {
    this.sendMessage.emit(this.messageForm.getRawValue());
  }

  public scrollBottomEvent() {
    this.scrollBottom.emit();
  }

  public reset() {
    this.messageForm.reset();
  }

  async upload(fileUrl: string) {
    if (fileUrl) {
      this.sendAttachment.emit({fileUrl});
    }
  }

  // TODO: Added permission on XCode, see about adding it on code
  async addAttachment() {
    const sheet = await this.mediaAdder.showActionSheet((value) => {
      this.upload(value);
    });
    await sheet.present();
  }
}
