import { AfterContentInit, Component, ComponentFactory, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { Message, MessagePartComponent } from '../../../interfaces/messages';
import { HtmlComponent, ImageComponent, LinkComponent, ProductComponent, TextComponent, VideoComponent } from '../parts';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements AfterContentInit {
  @Input() message: Message;
  @Input() senderId: number;

  @ViewChild('messageRef', {read: ViewContainerRef}) messageRef: ViewContainerRef;

  private mapping = {
    'text': TextComponent,
    'image': ImageComponent,
    'url': ProductComponent,
    'link': LinkComponent,
    'html': HtmlComponent,
    'video': VideoComponent,
  };
  private factories: { [key: string]: ComponentFactory<MessagePartComponent> } = {};

  constructor(
    private resolver: ComponentFactoryResolver,
  ) {
  }

  ngAfterContentInit() {
    this.message.parts.forEach((part, index) => {
      const componentFactory = this.getComponentFactory(part.type);
      const component = this.messageRef.createComponent(componentFactory, index);
      component.instance.part = part;
    });
  }

  private getComponentFactory(type: string): ComponentFactory<MessagePartComponent> {
    if (!this.mapping[type]) {
      type = 'text';
    }

    if (!this.factories[type]) {
      this.factories[type] = this.resolver.resolveComponentFactory(this.mapping[type]);
    }

    return this.factories[type];
  }

  public get sentAt(): string {
    return moment
      .utc(this.message.created_at)
      .local()
      .format('h:mm a');
  }
}
