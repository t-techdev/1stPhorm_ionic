import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChatMessagesPage } from './chat-messages.page';
import { MessageCommonModule } from '../../components/message-common/message-common.module';

const routes: Routes = [
  {
    path: '',
    component: ChatMessagesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MessageCommonModule
  ],
  declarations: [ChatMessagesPage],
})
export class ChatMessagesPageModule {
}
