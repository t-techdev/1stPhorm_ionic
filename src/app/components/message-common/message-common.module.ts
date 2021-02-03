import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageEntryComponent } from './message-entry/message-entry.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule } from 'ionic4-star-rating';
import { AutoresizeModule } from '../../directives/autoresize/autoresize.module';
import { HtmlComponent, ImageComponent, LinkComponent, ProductComponent, TextComponent, VideoComponent } from './parts';

@NgModule({
  declarations: [
    MessageComponent,
    MessageListComponent,
    MessageEntryComponent,
    // Parts
    TextComponent,
    ImageComponent,
    VideoComponent,
    LinkComponent,
    ProductComponent,
    HtmlComponent
  ],
  imports: [
    AutoresizeModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule
  ],
  exports: [
    MessageComponent,
    MessageListComponent,
    MessageEntryComponent
  ],
  entryComponents: [
    TextComponent,
    ImageComponent,
    VideoComponent,
    LinkComponent,
    ProductComponent,
    HtmlComponent
  ]
})
export class MessageCommonModule {
}
